"""
TikTok public profile scraper.

TikTok is among the most aggressive anti-bot platforms.
Strategy:
  1. SerpAPI / Google snippet  → safe, no direct hit
  2. __NEXT_DATA__ parsing from public profile page
  3. ScrapingBee stealth proxy fallback
"""
import json
import re
from typing import Optional
from playwright.async_api import async_playwright, TimeoutError as PWTimeout
from bs4 import BeautifulSoup

from scrapers.base import BaseScraper, RawCreatorData
from scrapers.search_discovery import discover_via_serpapi, discover_via_scrapingbee
from utils.normalizer import parse_metric
from utils.rate_limiter import throttle, is_cached, set_cache
from utils.user_agents import random_mobile
import logging

logger = logging.getLogger(__name__)


class TikTokScraper(BaseScraper):
    PLATFORM = "tiktok"

    async def scrape(self, username: str) -> RawCreatorData:
        username = username.lstrip("@").lower()
        cache_key = f"tt:profile:{username}"
        cached = await is_cached(cache_key)
        if cached:
            return RawCreatorData(**json.loads(cached))

        result = RawCreatorData(
            platform="tiktok",
            username=username,
            profile_url=f"https://www.tiktok.com/@{username}",
        )

        # ── Step 1: SerpAPI (primary) ────────────────────────────────────────
        search_data = await discover_via_serpapi(username, "tiktok")
        if search_data:
            result.profile_name = search_data.get("profile_name")
            result.bio = search_data.get("bio")
            result.profile_image_url = search_data.get("profile_image_url")
            result.data_source = "serpapi"
            if "followers_raw" in search_data:
                result.followers = parse_metric(search_data["followers_raw"])
            result.confidence = search_data.get("confidence_boost", 0.3)

        # ── Step 2: Playwright (TikTok blocks most headless — attempt anyway) ─
        pw_data = await self._playwright_scrape(username)
        if pw_data:
            self._merge(result, pw_data)
            result.data_source = "playwright"

        # ── Step 3: ScrapingBee (premium proxy, better TikTok success rate) ──
        if result.confidence < 0.5:
            html = await discover_via_scrapingbee(result.profile_url)
            if html:
                bee_data = self._parse_html(html, username)
                self._merge(result, bee_data)
                result.data_source = "scrapingbee"

        self._calculate_confidence(result)
        await set_cache(cache_key, json.dumps(result.__dict__))
        return result

    async def _playwright_scrape(self, username: str) -> Optional[RawCreatorData]:
        url = f"https://www.tiktok.com/@{username}"
        try:
            async with async_playwright() as p:
                browser = await p.chromium.launch(
                    headless=True,
                    args=["--no-sandbox", "--disable-blink-features=AutomationControlled"],
                )
                ctx = await browser.new_context(
                    user_agent=random_mobile(),
                    viewport={"width": 390, "height": 844},
                    locale="en-US",
                    extra_http_headers={"Accept-Language": "en-US,en;q=0.9"},
                )
                # Mask automation fingerprint
                await ctx.add_init_script(
                    "Object.defineProperty(navigator, 'webdriver', {get: () => undefined})"
                )
                page = await ctx.new_page()
                await page.route("**/*.{png,jpg,jpeg,gif,webp,woff,woff2}", lambda r: r.abort())

                await throttle("tiktok.com", min_delay=3.0, max_delay=8.0)
                await page.goto(url, wait_until="domcontentloaded", timeout=25_000)

                try:
                    await page.wait_for_selector('[data-e2e="followers-count"]', timeout=10_000)
                except PWTimeout:
                    pass

                html = await page.content()
                await browser.close()
            return self._parse_html(html, username)
        except Exception as e:
            logger.warning(f"Playwright failed for TT/{username}: {e}")
            return None

    def _parse_html(self, html: str, username: str) -> RawCreatorData:
        soup = BeautifulSoup(html, "lxml")
        data = RawCreatorData(platform="tiktok", username=username)

        # ── Open Graph ───────────────────────────────────────────────────────
        og_title = soup.find("meta", property="og:title")
        if og_title:
            raw = og_title.get("content", "")
            # "Username (@handle) TikTok | …"
            name_m = re.match(r"^([^(@|]+)", raw)
            if name_m:
                data.profile_name = name_m.group(1).strip()

        og_desc = soup.find("meta", property="og:description")
        if og_desc:
            data.bio = og_desc.get("content", "")[:500]

        og_image = soup.find("meta", property="og:image")
        if og_image:
            data.profile_image_url = og_image.get("content", "")

        # ── __NEXT_DATA__ JSON ───────────────────────────────────────────────
        next_data = soup.find("script", id="__NEXT_DATA__")
        if next_data:
            try:
                nd = json.loads(next_data.string or "")
                user_info = (
                    nd.get("props", {})
                    .get("pageProps", {})
                    .get("userInfo", {})
                )
                if user_info:
                    u = user_info.get("user", {})
                    stats = user_info.get("stats", {})
                    data.profile_name = u.get("nickname") or data.profile_name
                    data.bio = u.get("signature") or data.bio
                    data.profile_image_url = u.get("avatarLarger") or data.profile_image_url
                    data.is_verified = u.get("verified", False)
                    data.followers = stats.get("followerCount") or data.followers
                    data.following = stats.get("followingCount") or data.following
                    data.total_posts = stats.get("videoCount") or data.total_posts
                    data.avg_likes = stats.get("heartCount") or data.avg_likes
            except (json.JSONDecodeError, KeyError):
                pass

        # ── data-e2e attribute fallbacks ─────────────────────────────────────
        for attr, field_name in [
            ("followers-count", "followers"),
            ("following-count", "following"),
            ("likes-count", "avg_likes"),
        ]:
            el = soup.find(attrs={"data-e2e": attr})
            if el and not getattr(data, field_name):
                setattr(data, field_name, parse_metric(el.get_text(strip=True)))

        return data

    @staticmethod
    def _merge(base: RawCreatorData, patch: RawCreatorData):
        for f in base.__dataclass_fields__:
            pv = getattr(patch, f)
            bv = getattr(base, f)
            if pv is not None and bv is None:
                setattr(base, f, pv)
        if patch.confidence > base.confidence:
            base.confidence = patch.confidence

    @staticmethod
    def _calculate_confidence(data: RawCreatorData):
        score = 0.0
        if data.profile_name:
            score += 0.2
        if data.followers:
            score += 0.3
        if data.bio:
            score += 0.1
        if data.profile_image_url:
            score += 0.1
        if data.total_posts:
            score += 0.1
        if data.avg_likes:
            score += 0.1
        data.confidence = max(data.confidence, round(score, 2))
