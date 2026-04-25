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
