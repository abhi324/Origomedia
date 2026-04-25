"""
Redis-backed rate limiter + cache.
Gracefully degrades to an in-memory dict if Redis isn't running.
"""
import asyncio
import random
import time
from typing import Optional
from config import get_settings

settings = get_settings()

_redis = None
_redis_disabled = False

# In-memory fallbacks
_mem_cache: dict[str, tuple[str, float]] = {}   # key -> (value, expires_at)
_mem_last_hit: dict[str, float] = {}


async def _get_redis():
    """Lazy-load Redis, never crash if unavailable."""
    global _redis, _redis_disabled
    if _redis_disabled:
        return None
    if _redis is not None:
        return _redis
    try:
        import redis.asyncio as aioredis
        _redis = await aioredis.from_url(settings.redis_url, decode_responses=True)
        await _redis.ping()
        return _redis
    except Exception:
        _redis_disabled = True
        return None


async def throttle(domain: str, min_delay: float | None = None, max_delay: float | None = None):
    lo = min_delay or settings.request_delay_min
    hi = max_delay or settings.request_delay_max
    await asyncio.sleep(random.uniform(lo, hi))

    r = await _get_redis()
    if r:
        try:
            key = f"ratelimit:{domain}"
            last = await r.get(key)
            if last:
                elapsed = time.time() - float(last)
                if elapsed < lo:
                    await asyncio.sleep(lo - elapsed)
            await r.set(key, time.time(), ex=60)
            return
        except Exception:
            pass

    # In-memory fallback
    last = _mem_last_hit.get(domain)
    if last:
        elapsed = time.time() - last
        if elapsed < lo:
            await asyncio.sleep(lo - elapsed)
    _mem_last_hit[domain] = time.time()


async def is_cached(cache_key: str) -> Optional[str]:
    r = await _get_redis()
    if r:
        try:
            return await r.get(cache_key)
        except Exception:
            pass
    # In-memory
    entry = _mem_cache.get(cache_key)
    if entry and entry[1] > time.time():
        return entry[0]
    return None


async def set_cache(cache_key: str, value: str, ttl: int | None = None):
    ttl = ttl or settings.cache_ttl_seconds
    r = await _get_redis()
    if r:
        try:
            await r.set(cache_key, value, ex=ttl)
            return
        except Exception:
            pass
    _mem_cache[cache_key] = (value, time.time() + ttl)
