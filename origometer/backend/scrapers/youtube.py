"""
YouTube public channel scraper.

Strategy:
  1. SerpAPI snippet
  2. Direct channel page (/@handle) — YouTube embeds channel JSON in page
  3. ScrapingBee fallback
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
from utils.user_agents import random_desktop
import logging

logger = logging.getLogger(__name__)


class YouTubeScraper(BaseScraper):
    PLATFORM = "youtube"

    async def scrape(self, username: str) -> RawCreatorData:
        username = username.lstrip("@").lower()
        cache_key = f"yt:profile:{username}"
        cached = await is_cached(cache_key)
        if cached:
            return RawCreatorData(**json.loads(cached))

        result = RawCreatorData(
            platform="youtube",
            username=username,
            profile_url=f"https://www.youtube.com/@{username}",
        )

        # ── Step 1: SerpAPI ──────────────────────────────────────────────────
        search_data = await discover_via_serpapi(username, "youtube")
        if search_data:
            result.profile_name = search_data.get("profile_name")
            result.bio = search_data.get("bio")
            result.profile_image_url = search_data.get("profile_image_url")
            result.data_source = "serpapi"
            if "followers_raw" in search_data:
                result.followers = parse_metric(search_data["followers_raw"])
            result.confidence = search_data.get("confidence_boost", 0.3)

        # ── Step 2: Playwright ───────────────────────────────────────────────
        pw_data = await self._playwright_scrape(username)
        if pw_data:
            self._merge(result, pw_data)
            result.data_source = "playwright"

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
        url = f"https://www.youtube.com/@{username}"
        try:
            async with async_playwright() as p:
                browser = await p.chromium.launch(headless=True, args=["--no-sandbox"])
                ctx = await browser.new_context(
                    user_agent=random_desktop(),
                    viewport={"width": 1280, "height": 900},
                    locale="en-US",
                )
                page = await ctx.new_page()
                await page.route("**/*.{png,jpg,jpeg,gif,webp,woff,woff2}", lambda r: r.abort())

                await throttle("youtube.com")
                await page.goto(url, wait_until="domcontentloaded", timeout=25_000)

                try:
                    await page.wait_for_selector("#channel-name, yt-formatted-string#subscriber-count", timeout=10_000)
                except PWTimeout:
                    pass

                html = await page.content()
                await browser.close()
            return self._parse_html(html, username)
        except Exception as e:
            logger.warning(f"Playwright failed for YT/{username}: {e}")
            return None

    def _parse_html(self, html: str, username: str) -> RawCreatorData:
        soup = BeautifulSoup(html, "lxml")
        data = RawCreatorData(platform="youtube", username=username)

        # ── Meta tags ────────────────────────────────────────────────────────
        og_title = soup.find("meta", property="og:title")
        if og_title:
            data.profile_name = og_title.get("content", "").replace(" - YouTube", "").strip()

        og_desc = soup.find("meta", property="og:description")
        if og_desc:
            data.bio = og_desc.get("content", "")[:500]

        og_image = soup.find("meta", property="og:image")
        if og_image:
            data.profile_image_url = og_image.get("content", "")

        # ── ytInitialData JSON blob ──────────────────────────────────────────
        yt_data_match = re.search(r"var ytInitialData\s*=\s*(\{.+?\});\s*</script>", html, re.DOTALL)
        if yt_data_match:
            try:
                yt = json.loads(yt_data_match.group(1))
                header = (
                    yt.get("header", {})
                    .get("pageHeaderRenderer", {})
                    .get("content", {})
                    .get("pageHeaderViewModel", {})
                )
                if header:
                    metadata = header.get("metadata", {}).get("contentMetadataViewModel", {})
                    for part in metadata.get("metadataRows", []):
                        for meta in part.get("metadataParts", []):
                            text = meta.get("text", {}).get("content", "")
                            if re.search(r"subscriber", text, re.I):
                                data.followers = parse_metric(text.split()[0])
                            if re.search(r"video", text, re.I):
                                data.total_posts = parse_metric(text.split()[0])

                # Fallback: search for subscriber count in raw JSON
                sub_match = re.search(r'"subscriberCountText":\{"simpleText":"([^"]+)"', html)
                if sub_match and not data.followers:
                    data.followers = parse_metric(sub_match.group(1).replace(" subscribers", ""))

                videos_match = re.search(r'"videosCountText":\{"runs":\[.\{"text":"([\d,]+)"', html)
                if videos_match and not data.total_posts:
                    data.total_posts = parse_metric(videos_match.group(1))

            except (json.JSONDecodeError, KeyError):
                pass

        # Plain regex fallbacks on raw HTML
        if not data.followers:
            m = re.search(r'"(\d[\d,.]*[KMBkmb]?)\s*subscribers?"', html, re.I)
            if m:
                data.followers = parse_metric(m.group(1))

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
            score += 0.35
        if data.bio:
            score += 0.1
        if data.profile_image_url:
            score += 0.1
        if data.total_posts:
            score += 0.15
        data.confidence = max(data.confidence, round(score, 2))
