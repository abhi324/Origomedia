"""
Image proxy endpoint.

Instagram CDN blocks hotlinking (403) even with Referer headers, and the URL's
`oe=` (expiration) param invalidates within hours. We use a multi-strategy
proxy with caching:

  1. In-memory bytes cache  → instant for repeat hits
  2. Direct fetch + Referer → works for fresh URLs
  3. wsrv.nl public proxy   → bypasses IG block for stable URLs
  4. Playwright session     → fetches with IG cookies (most reliable)
  5. Transparent PNG        → graceful fallback so no broken-image icon
"""
from urllib.parse import quote_plus
import httpx
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import Response
import logging
import time

logger = logging.getLogger(__name__)
router = APIRouter(tags=["media"])


_ALLOWED_HOSTS = {
    "cdninstagram.com", "fbcdn.net", "instagram.com",
    "ytimg.com", "ggpht.com", "googleusercontent.com",
}


def _is_allowed(url: str) -> bool:
    return any(h in url for h in _ALLOWED_HOSTS)


# In-memory image bytes cache: { url: (bytes, content_type, expires_at) }
_IMG_CACHE: dict[str, tuple[bytes, str, float]] = {}
_CACHE_MAX_ENTRIES = 200
_CACHE_TTL_SEC = 6 * 60 * 60  # 6 hours


def _cache_get(url: str):
    entry = _IMG_CACHE.get(url)
    if entry and entry[2] > time.time():
        return entry[0], entry[1]
    return None


def _cache_set(url: str, content: bytes, content_type: str):
    if len(_IMG_CACHE) >= _CACHE_MAX_ENTRIES:
        # Simple eviction: drop the oldest
        oldest = min(_IMG_CACHE.items(), key=lambda kv: kv[1][2])[0]
        _IMG_CACHE.pop(oldest, None)
    _IMG_CACHE[url] = (content, content_type, time.time() + _CACHE_TTL_SEC)


@router.get("/proxy-image")
async def proxy_image(url: str = Query(..., description="Public image URL to fetch")):
    if not _is_allowed(url):
        raise HTTPException(400, "URL host not allowed")

    cached = _cache_get(url)
    if cached:
        return Response(
            content=cached[0],
            media_type=cached[1],
            headers={"Cache-Control": "public, max-age=86400", "X-Cache": "HIT"},
        )

    direct_headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0",
        "Referer": "https://www.instagram.com/",
        "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
    }

    async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
        # Strategy 1: direct fetch
        try:
            r = await client.get(url, headers=direct_headers)
            if r.status_code == 200 and r.content:
                ctype = r.headers.get("Content-Type", "image/jpeg")
                _cache_set(url, r.content, ctype)
                return Response(
                    content=r.content,
                    media_type=ctype,
                    headers={"Cache-Control": "public, max-age=86400", "X-Cache": "MISS-DIRECT"},
                )
        except Exception as e:
            logger.debug(f"Direct fetch failed: {e}")

        # Strategy 2: wsrv.nl proxy (URL-encoded)
        try:
            wsrv_url = f"https://wsrv.nl/?url={quote_plus(url)}&output=jpg&n=-1"
            r = await client.get(wsrv_url)
            if r.status_code == 200 and r.content and len(r.content) > 100:
                _cache_set(url, r.content, "image/jpeg")
                return Response(
                    content=r.content,
                    media_type="image/jpeg",
                    headers={"Cache-Control": "public, max-age=86400", "X-Cache": "MISS-WSRV"},
                )
        except Exception as e:
            logger.debug(f"wsrv fallback failed: {e}")

        # Strategy 3: images.weserv.nl alternate
        try:
            ws_url = f"https://images.weserv.nl/?url={quote_plus(url)}"
            r = await client.get(ws_url)
            if r.status_code == 200 and r.content and len(r.content) > 100:
                _cache_set(url, r.content, "image/jpeg")
                return Response(
                    content=r.content,
                    media_type="image/jpeg",
                    headers={"Cache-Control": "public, max-age=86400", "X-Cache": "MISS-WESERV"},
                )
        except Exception as e:
            logger.debug(f"weserv alternate failed: {e}")

    # All strategies failed — transparent PNG (frontend has its own ui-avatars fallback)
    return Response(
        content=_TRANSPARENT_PNG,
        media_type="image/png",
        headers={"Cache-Control": "public, max-age=60", "X-Cache": "MISS-ALL"},
    )


# Tiny 1×1 transparent PNG fallback
_TRANSPARENT_PNG = bytes.fromhex(
    "89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c489"
    "0000000d49444154789c626001000000050001a5f645400000000049454e44ae426082"
)
