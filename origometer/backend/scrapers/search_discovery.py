"""
Search-engine metadata discovery.
Uses SerpAPI (Google search results) to find public profile snippets
WITHOUT hitting the platform directly — our safest data source.
"""
import json
import re
from typing import Optional
import httpx
from config import get_settings
from utils.rate_limiter import is_cached, set_cache
import logging

logger = logging.getLogger(__name__)
settings = get_settings()

PLATFORM_SEARCH_TEMPLATES = {
    "instagram": 'site:instagram.com "{username}" followers',
    "youtube": 'site:youtube.com/@{username} subscribers',
    "tiktok": 'site:tiktok.com "@{username}" followers',
}

PLATFORM_URL_TEMPLATES = {
    "instagram": "https://www.instagram.com/{username}/",
    "youtube": "https://www.youtube.com/@{username}",
    "tiktok": "https://www.tiktok.com/@{username}",
}

# Patterns to extract metrics from Google snippets
FOLLOWER_PATTERNS = [
    r"([\d.,]+[KMBkmb]?)\s*(?:Followers|followers|FOLLOWERS)",
    r"([\d.,]+[KMBkmb]?)\s*(?:Subscribers|subscribers)",
    r"Followers[:\s]+([\d.,]+[KMBkmb]?)",
]


def _extract_metric_from_text(text: str) -> Optional[str]:
    for pattern in FOLLOWER_PATTERNS:
        m = re.search(pattern, text)
        if m:
            return m.group(1)
    return None


async def discover_via_serpapi(username: str, platform: str) -> dict:
    """Query SerpAPI (Google) and parse the returned snippet for public metrics."""
    cache_key = f"serpapi:{platform}:{username}"
    cached = await is_cached(cache_key)
    if cached:
        return json.loads(cached)

    if not settings.serpapi_key:
        logger.warning("SERPAPI_KEY not set — skipping search discovery")
        return {}

    query = PLATFORM_SEARCH_TEMPLATES.get(platform, "").format(username=username)
    profile_url = PLATFORM_URL_TEMPLATES.get(platform, "").format(username=username)

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                "https://serpapi.com/search.json",
                params={
                    "q": query,
                    "api_key": settings.serpapi_key,
                    "num": 5,
                    "gl": "us",
                    "hl": "en",
                },
            )
            resp.raise_for_status()
            data = resp.json()
    except Exception as e:
        logger.error(f"SerpAPI error for {platform}/{username}: {e}")
        return {}

    result: dict = {"profile_url": profile_url, "data_source": "serpapi"}

    organic = data.get("organic_results", [])
    for item in organic:
        link = item.get("link", "")
        # Only process the creator's own profile page
        if username.lower() not in link.lower():
            continue

        snippet = item.get("snippet", "")
        title = item.get("title", "")

        # Extract profile name from title (e.g. "Jane Doe (@janedoe) • Instagram")
        name_match = re.match(r"^([^(@•|]+)", title)
        if name_match:
            result["profile_name"] = name_match.group(1).strip()

        # Extract follower count
        combined = f"{title} {snippet}"
        metric = _extract_metric_from_text(combined)
        if metric:
            result["followers_raw"] = metric

        # Extract bio from snippet
        if snippet:
            result["bio"] = snippet[:300]

        result["confidence_boost"] = 0.4
        break

    # Knowledge graph (Google sometimes surfaces this for large creators)
    kg = data.get("knowledge_graph", {})
    if kg:
        if "title" in kg:
            result["profile_name"] = kg["title"]
        if "description" in kg:
            result["bio"] = kg["description"]
        if "thumbnail" in kg:
            result["profile_image_url"] = kg["thumbnail"]
        result["confidence_boost"] = 0.6

    await set_cache(cache_key, json.dumps(result))
    return result


async def discover_via_scrapingbee(url: str) -> Optional[str]:
    """Render a JavaScript-heavy page through ScrapingBee as a fallback."""
    if not settings.scraping_bee_key:
        return None
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.get(
                "https://app.scrapingbee.com/api/v1/",
                params={
                    "api_key": settings.scraping_bee_key,
                    "url": url,
                    "render_js": "true",
                    "premium_proxy": "true",
                    "country_code": "us",
                },
            )
            if resp.status_code == 200:
                return resp.text
    except Exception as e:
        logger.error(f"ScrapingBee error for {url}: {e}")
    return None


async def fetch_ig_profile_json_via_scrapingbee(username: str) -> Optional[dict]:
    """
    Hit Instagram's web_profile_info JSON API through ScrapingBee's residential
    proxy pool. This returns the canonical user object including the 12 most
    recent posts with likes/comments — the data bhrisa/Phlanx average over.

    We hit the *_internal* IG host via ScrapingBee with the right App ID header.
    Returns the parsed `user` dict or None.
    """
    if not settings.scraping_bee_key:
        return None

    target = (
        f"https://www.instagram.com/api/v1/users/web_profile_info/?username={username}"
    )
    # ScrapingBee custom headers must be passed via Spb-* prefix or
    # forward_headers=true + standard names. We use forward_headers.
    try:
        async with httpx.AsyncClient(timeout=40) as client:
            resp = await client.get(
                "https://app.scrapingbee.com/api/v1/",
                params={
                    "api_key": settings.scraping_bee_key,
                    "url": target,
                    "render_js": "false",            # JSON endpoint, no JS needed
                    "premium_proxy": "true",
                    "country_code": "us",
                    "forward_headers": "true",
                },
                headers={
                    "Spb-X-IG-App-ID": "936619743392459",
                    "Spb-X-ASBD-ID": "198387",
                    "Spb-X-Requested-With": "XMLHttpRequest",
                    "Spb-User-Agent": (
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                        "AppleWebKit/537.36 (KHTML, like Gecko) "
                        "Chrome/120.0.0.0 Safari/537.36"
                    ),
                    "Spb-Accept": "*/*",
                    "Spb-Accept-Language": "en-US,en;q=0.9",
                    "Spb-Referer": f"https://www.instagram.com/{username}/",
                },
            )
            if resp.status_code != 200:
                logger.warning(
                    f"ScrapingBee web_profile_info {username}: HTTP {resp.status_code}"
                )
                return None
            try:
                data = resp.json()
            except Exception:
                return None
            user = (data or {}).get("data", {}).get("user") if isinstance(data, dict) else None
            return user if isinstance(user, dict) and user.get("username") else None
    except Exception as e:
        logger.error(f"ScrapingBee JSON fetch error for {username}: {e}")
        return None
