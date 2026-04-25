"""
Instagram public profile scraper — production-grade.

Waterfall strategy:
  1. SerpAPI / Google snippet          → zero-risk, low confidence
  2. Instagram web_profile_info API    → if we can get past the login wall
  3. Playwright + GraphQL interception → captures the real user JSON by sniffing
                                         the network response Instagram's own JS makes
  4. Playwright + OG meta tags         → fallback for large SSR'd creators
  5. ScrapingBee premium proxy         → last resort for blocked profiles

The GraphQL interception method is the key upgrade: Instagram's browser client
fetches `/api/graphql` with the full profile payload (followers, posts, likes,
comments). By listening for that response we get the same data Instagram's UI uses.
"""
import asyncio
import json
import re
import statistics
from typing import Optional
from playwright.async_api import async_playwright, TimeoutError as PWTimeout, Response
from bs4 import BeautifulSoup

from scrapers.base import BaseScraper, RawCreatorData
from scrapers.search_discovery import discover_via_serpapi, discover_via_scrapingbee
from utils.normalizer import parse_metric
from utils.rate_limiter import throttle, is_cached, set_cache
from utils.user_agents import random_desktop
import logging

logger = logging.getLogger(__name__)
BASE_URL = "https://www.instagram.com"
IG_APP_ID = "936619743392459"


class InstagramScraper(BaseScraper):
    PLATFORM = "instagram"

    async def scrape(self, username: str) -> RawCreatorData:
        username = username.lstrip("@").lower()
        cache_key = f"ig:profile:{username}"
        cached = await is_cached(cache_key)
        if cached:
            return RawCreatorData(**json.loads(cached))

        result = RawCreatorData(platform="instagram", username=username)
        result.profile_url = f"{BASE_URL}/{username}/"

        # ── 1. SerpAPI snippet (cheap, low confidence) ──────────────────────
        search_data = await discover_via_serpapi(username, "instagram")
        if search_data:
            result.profile_name = search_data.get("profile_name")
            result.profile_image_url = search_data.get("profile_image_url")
            result.data_source = "serpapi"
            if "followers_raw" in search_data:
                result.followers = parse_metric(search_data["followers_raw"])
            result.confidence = search_data.get("confidence_boost", 0.3)

        # ── 2. Playwright with GraphQL response interception ────────────────
        pw_data = await self._playwright_with_interception(username)
        if pw_data and pw_data.followers is not None:
            self._merge(result, pw_data)
            result.data_source = "playwright+graphql"

        # ── 3. ScrapingBee fallback ─────────────────────────────────────────
        if result.confidence < 0.5:
            html = await discover_via_scrapingbee(result.profile_url)
            if html:
                bee_data = self._parse_html(html, username)
                self._merge(result, bee_data)
                result.data_source = "scrapingbee"

        self._calculate_confidence(result)
        await set_cache(cache_key, json.dumps(result.__dict__))
        return result

    # ==========================================================================
    # Playwright with GraphQL interception  — the main engine
    # ==========================================================================
    async def _playwright_with_interception(self, username: str) -> Optional[RawCreatorData]:
        url = f"{BASE_URL}/{username}/"
        # Multi-source post collection: posts will be deduplicated by id later
        captured: dict = {"user": None, "graphql_posts": [], "feed_posts": []}

        async def handle_response(response: Response):
            try:
                # Profile endpoint
                if "web_profile_info" in response.url:
                    if response.status != 200:
                        return
                    try:
                        data = await response.json()
                    except Exception:
                        return
                    user = data.get("data", {}).get("user") if isinstance(data, dict) else None
                    if user and user.get("username", "").lower() == username:
                        captured["user"] = user
                    return

                # Pagination GraphQL — captures additional posts as user scrolls
                if "/api/graphql" in response.url or "/graphql/query" in response.url:
                    if response.status != 200:
                        return
                    try:
                        data = await response.json()
                    except Exception:
                        return
                    # Bury through nested structures looking for posts
                    self._collect_posts_from_graphql(data, captured)
                    user = data.get("data", {}).get("user") if isinstance(data, dict) else None
                    if user and user.get("username", "").lower() == username:
                        captured["user"] = user
            except Exception:
                pass

        try:
            async with async_playwright() as p:
                browser = await p.chromium.launch(
                    headless=True,
                    args=[
                        "--no-sandbox",
                        "--disable-blink-features=AutomationControlled",
                        "--disable-dev-shm-usage",
                    ],
                )
                ctx = await browser.new_context(
                    user_agent=random_desktop(),
                    viewport={"width": 1280, "height": 900},
                    locale="en-US",
                    timezone_id="America/New_York",
                    extra_http_headers={
                        "Accept-Language": "en-US,en;q=0.9",
                        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                    },
                )
                # Mask automation fingerprint
                await ctx.add_init_script(
                    "Object.defineProperty(navigator, 'webdriver', {get: () => undefined});"
                    "window.chrome = { runtime: {} };"
                )
                page = await ctx.new_page()
                page.on("response", handle_response)

                # Block heavy resources
                await page.route(
                    "**/*.{woff,woff2,ttf,mp4,webm}",
                    lambda route: route.abort(),
                )

                await throttle("instagram.com", min_delay=1.0, max_delay=3.0)
                try:
                    await page.goto(url, wait_until="domcontentloaded", timeout=25_000)
                except PWTimeout:
                    pass

                # Let initial GraphQL fire
                await asyncio.sleep(2.5)

                # Scroll the page in chunks to trigger lazy-loaded post batches.
                # Each scroll fires a graphql query that our handler captures.
                for _ in range(4):
                    try:
                        await page.evaluate("window.scrollBy(0, document.body.scrollHeight);")
                    except Exception:
                        break
                    await asyncio.sleep(1.5)

                # ── Always run the official web API from within the page context ───
                # Even if we already captured something, this gives us the canonical
                # full-fat user object with the largest possible posts batch.
                try:
                    api_data = await page.evaluate(
                        """
                        async (username) => {
                          const r = await fetch(
                            `/api/v1/users/web_profile_info/?username=${username}`,
                            {
                              headers: {
                                'X-IG-App-ID': '936619743392459',
                                'X-ASBD-ID': '198387',
                                'X-Requested-With': 'XMLHttpRequest',
                              },
                              credentials: 'include',
                            });
                          if (!r.ok) return null;
                          return await r.json();
                        }
                        """,
                        username,
                    )
                    if api_data:
                        user = api_data.get("data", {}).get("user")
                        if user and user.get("username"):
                            captured["user"] = user
                except Exception:
                    pass

                # ── Fetch more posts via /feed/user/{id}/username for wider sample ──
                user_obj = captured.get("user")
                if user_obj and user_obj.get("id") and user_obj.get("username"):
                    try:
                        more_posts = await page.evaluate(
                            """
                            async (userId, username) => {
                              const r = await fetch(
                                `/api/v1/feed/user/${username}/username/?count=50`,
                                {
                                  headers: {
                                    'X-IG-App-ID': '936619743392459',
                                    'X-ASBD-ID': '198387',
                                  },
                                  credentials: 'include',
                                });
                              if (!r.ok) return null;
                              return await r.json();
                            }
                            """,
                            user_obj["id"],
                            user_obj["username"],
                        )
                        if more_posts and isinstance(more_posts, dict):
                            captured["extra_posts"] = more_posts.get("items") or []
                    except Exception:
                        pass

                html = await page.content()
                await browser.close()

        except Exception as e:
            logger.warning(f"Playwright IG/{username} error: {e}")
            return None

        # ── Build RawCreatorData from captured user blob ────────────────────
        if captured["user"]:
            # Combine all captured posts (initial + scroll-paginated + feed-API)
            all_posts = []
            all_posts.extend(captured.get("graphql_posts", []))
            all_posts.extend(captured.get("feed_posts", []))
            return self._from_user_json(captured["user"], username, all_posts)

        # ── Fallback to OG meta parse ───────────────────────────────────────
        return self._parse_html(html, username) if html else None

    # ==========================================================================
    # Traverse nested GraphQL response and collect every post node we find.
    # Different IG endpoints nest differently (timeline_media.edges, items[],
    # xdt_api__v1__media__shortcode__web_info, etc.) — we just hunt for
    # anything that looks like a post.
    # ==========================================================================
    def _collect_posts_from_graphql(self, obj, captured: dict, depth: int = 0):
        if depth > 12:
            return
        if isinstance(obj, dict):
            # Schema A: GraphQL "edges" with a "node" each
            if "edges" in obj and isinstance(obj["edges"], list):
                for edge in obj["edges"]:
                    node = edge.get("node") if isinstance(edge, dict) else None
                    if isinstance(node, dict) and self._looks_like_post(node):
                        captured["graphql_posts"].append(node)
            # Schema B: feed/user response with "items"
            if "items" in obj and isinstance(obj["items"], list):
                for item in obj["items"]:
                    if isinstance(item, dict) and self._looks_like_post(item):
                        captured["feed_posts"].append(item)
            # Recurse
            for v in obj.values():
                self._collect_posts_from_graphql(v, captured, depth + 1)
        elif isinstance(obj, list):
            for v in obj:
                self._collect_posts_from_graphql(v, captured, depth + 1)

    @staticmethod
    def _looks_like_post(node: dict) -> bool:
        # GraphQL post markers
        if "edge_liked_by" in node or "edge_media_to_comment" in node:
            return True
        # Feed-API post markers
        if ("like_count" in node and "media_type" in node):
            return True
        return False

    # ==========================================================================
    # Convert Instagram user JSON → our dataclass
    # ==========================================================================
    def _from_user_json(self, u: dict, username: str, extra_posts: list = None) -> RawCreatorData:
        data = RawCreatorData(platform="instagram", username=username)
        data.profile_name = u.get("full_name") or None
        data.bio = u.get("biography") or None
        data.is_verified = u.get("is_verified", False)
        data.profile_image_url = u.get("profile_pic_url_hd") or u.get("profile_pic_url")

        data.followers = self._nested_count(u, "edge_followed_by")
        data.following = self._nested_count(u, "edge_follow")
        data.total_posts = self._nested_count(u, "edge_owner_to_timeline_media")

        # ── Gather every post we've seen, dedupe by id ──────────────────────
        all_nodes: list[dict] = []
        seen_ids: set[str] = set()

        # 1. The 12 posts embedded in web_profile_info
        for edge in (u.get("edge_owner_to_timeline_media", {}) or {}).get("edges", []):
            node = edge.get("node", {})
            pid = node.get("id") or node.get("shortcode") or node.get("pk")
            if pid and pid not in seen_ids:
                seen_ids.add(pid)
                all_nodes.append(node)

        # 2. Any additional posts we collected from scroll-paginated GraphQL or feed API
        for node in (extra_posts or []):
            if not isinstance(node, dict):
                continue
            pid = node.get("id") or node.get("shortcode") or node.get("pk")
            if pid and pid not in seen_ids:
                seen_ids.add(pid)
                all_nodes.append(node)

        # ── Classify each post: image vs reel — handle BOTH schemas ─────────
        img_likes, img_comments = [], []
        reel_likes, reel_comments, reel_views = [], [], []

        for node in all_nodes:
            likes, comments, views, is_reel = self._extract_post_metrics(node)
            if likes is None:
                continue
            if is_reel:
                reel_likes.append(likes)
                if comments is not None:
                    reel_comments.append(comments)
                if views is not None:
                    reel_views.append(views)
            else:
                img_likes.append(likes)
                if comments is not None:
                    img_comments.append(comments)

        all_likes = img_likes + reel_likes
        all_comments = img_comments + reel_comments

        # Track sample sizes so the frontend can flag estimated data
        data.image_sample_size = len(img_likes)
        data.reel_sample_size = len(reel_likes)

        followers = data.followers or 0

        if all_likes:
            data.avg_likes = int(statistics.median(all_likes))
        if all_comments:
            data.avg_comments = int(statistics.median(all_comments))

        # ── Image breakdown ─────────────────────────────────────────────────
        if img_likes:
            data.image_avg_likes = int(statistics.median(img_likes))
            data.image_avg_comments = int(statistics.median(img_comments)) if img_comments else None
            if followers:
                data.image_engagement_rate = round(
                    ((data.image_avg_likes + (data.image_avg_comments or 0)) / followers) * 100, 2
                )
            data.image_estimated_reach = int(data.image_avg_likes * 1.1) if data.image_avg_likes else None

        # ── Reel breakdown ──────────────────────────────────────────────────
        if reel_likes:
            data.reel_avg_likes = int(statistics.median(reel_likes))
            data.reel_avg_comments = int(statistics.median(reel_comments)) if reel_comments else None
            data.reel_avg_views = int(statistics.median(reel_views)) if reel_views else None
            if followers:
                data.reel_engagement_rate = round(
                    ((data.reel_avg_likes + (data.reel_avg_comments or 0)) / followers) * 100, 2
                )
            data.reel_estimated_reach = data.reel_avg_views

        # ── Bhrisa-style fallback: estimate the missing type from the other ──
        # If creator only posts reels → estimate image stats as ~80% of reel
        # (industry benchmark: image posts get ~70-90% of reel like volume).
        if data.reel_avg_likes and not data.image_avg_likes:
            data.image_avg_likes = int(data.reel_avg_likes * 0.80)
            data.image_avg_comments = (
                int(data.reel_avg_comments * 0.85) if data.reel_avg_comments else None
            )
            if followers:
                data.image_engagement_rate = round(
                    ((data.image_avg_likes + (data.image_avg_comments or 0)) / followers) * 100, 2
                )
            data.image_estimated_reach = int(data.image_avg_likes * 1.1)

        # Conversely, if creator only posts images → estimate reel stats
        if data.image_avg_likes and not data.reel_avg_likes:
            data.reel_avg_likes = int(data.image_avg_likes * 1.25)
            data.reel_avg_comments = (
                int(data.image_avg_comments * 1.20) if data.image_avg_comments else None
            )
            data.reel_avg_views = int(data.reel_avg_likes * 12)  # views ≈ 10-15× likes
            if followers:
                data.reel_engagement_rate = round(
                    ((data.reel_avg_likes + (data.reel_avg_comments or 0)) / followers) * 100, 2
                )
            data.reel_estimated_reach = data.reel_avg_views

        return data

    @staticmethod
    def _nested_count(obj: dict, key: str) -> Optional[int]:
        v = obj.get(key) if isinstance(obj, dict) else None
        if isinstance(v, dict):
            return v.get("count")
        return None

    @staticmethod
    def _extract_post_metrics(node: dict) -> tuple[Optional[int], Optional[int], Optional[int], bool]:
        """
        Returns (likes, comments, views, is_reel) for a single post node.
        Handles BOTH GraphQL (web_profile_info) and Feed-API schemas.
        """
        # ── GraphQL schema ──
        if "edge_liked_by" in node or "edge_media_to_comment" in node:
            likes = (node.get("edge_liked_by", {}) or {}).get("count")
            if likes is None:
                likes = (node.get("edge_media_preview_like", {}) or {}).get("count")
            comments = (node.get("edge_media_to_comment", {}) or {}).get("count")
            views = node.get("video_view_count") or node.get("play_count")
            is_video = node.get("is_video", False) or node.get("__typename") == "GraphVideo"
            product_type = node.get("product_type", "")
            is_reel = is_video or product_type == "clips"
            return likes, comments, views, is_reel

        # ── Feed-API schema ──
        likes = node.get("like_count")
        comments = node.get("comment_count")
        views = node.get("play_count") or node.get("view_count") or node.get("video_view_count")
        media_type = node.get("media_type")  # 1=image, 2=video, 8=carousel, 18=reel
        product_type = node.get("product_type", "")
        is_reel = media_type in (2, 18) or product_type in ("clips", "reels")
        return likes, comments, views, is_reel

    # ==========================================================================
    # HTML fallback parsing (for OG-tagged brand accounts)
    # ==========================================================================
    def _parse_html(self, html: str, username: str) -> RawCreatorData:
        soup = BeautifulSoup(html, "lxml")
        data = RawCreatorData(platform="instagram", username=username)

        og_title = soup.find("meta", property="og:title")
        if og_title:
            raw_title = og_title.get("content", "")
            name_match = re.match(r"^([^(@|]+)", raw_title)
            if name_match:
                data.profile_name = name_match.group(1).strip()

        og_desc = soup.find("meta", property="og:description")
        desc_text = og_desc.get("content", "") if og_desc else ""

        combined = f"{og_title.get('content', '') if og_title else ''} {desc_text}"
        followers_m = re.search(r"([\d,.]+[KMBkmb]?)\s*Followers", combined, re.I)
        following_m = re.search(r"([\d,.]+[KMBkmb]?)\s*Following", combined, re.I)
        posts_m = re.search(r"([\d,.]+[KMBkmb]?)\s*Posts", combined, re.I)
        if followers_m:
            data.followers = parse_metric(followers_m.group(1))
        if following_m:
            data.following = parse_metric(following_m.group(1))
        if posts_m:
            data.total_posts = parse_metric(posts_m.group(1))

        if desc_text:
            bio_match = re.search(r"from\s+[^(]+\(@[^)]+\)\s*(.*)", desc_text)
            if bio_match and bio_match.group(1).strip():
                data.bio = bio_match.group(1).strip()[:500]

        og_image = soup.find("meta", property="og:image")
        if og_image:
            data.profile_image_url = og_image.get("content", "")

        return data

    # ==========================================================================
    @staticmethod
    def _merge(base: RawCreatorData, patch: RawCreatorData):
        for f in base.__dataclass_fields__:
            pv = getattr(patch, f)
            bv = getattr(base, f)
            if pv is not None and bv is None:
                setattr(base, f, pv)
            elif pv is not None and isinstance(pv, int) and isinstance(bv, int):
                # Prefer the larger (more recent/accurate) count
                if pv > bv:
                    setattr(base, f, pv)
        if patch.confidence > base.confidence:
            base.confidence = patch.confidence

    @staticmethod
    def _calculate_confidence(data: RawCreatorData):
        score = 0.0
        if data.profile_name:      score += 0.20
        if data.followers:         score += 0.30
        if data.bio:               score += 0.15
        if data.profile_image_url: score += 0.10
        if data.total_posts:       score += 0.10
        if data.following is not None: score += 0.05
        if data.avg_likes:         score += 0.05
        if data.is_verified:       score += 0.05
        data.confidence = max(data.confidence, round(score, 2))
