"""
Celery background worker for async scraping jobs.
Allows queueing multiple creator lookups without blocking the API.
"""
from celery import Celery
from config import get_settings
import asyncio

settings = get_settings()

celery_app = Celery(
    "origo",
    broker=settings.redis_url,
    backend=settings.redis_url,
)

celery_app.conf.update(
    task_serializer="json",
    result_expires=3600,
    worker_max_tasks_per_child=50,  # Restart worker after 50 tasks (memory safety)
)


@celery_app.task(bind=True, max_retries=3, default_retry_delay=30)
def scrape_creator_task(self, username: str, platform: str):
    """Enqueue a creator scrape. Used for bulk discovery jobs."""
    from scrapers.instagram import InstagramScraper
    from scrapers.youtube import YouTubeScraper
    from scrapers.tiktok import TikTokScraper
    from services.analytics import build_analytics
    from db import repository

    scrapers = {
        "instagram": InstagramScraper,
        "youtube": YouTubeScraper,
        "tiktok": TikTokScraper,
    }
    scraper_cls = scrapers.get(platform)
    if not scraper_cls:
        return {"error": f"Unknown platform: {platform}"}

    async def _run():
        async with scraper_cls() as s:
            raw = await s.scrape(username)
        analytics = build_analytics(raw)
        await repository.upsert_creator(analytics)
        return {"status": "ok", "username": username, "platform": platform}

    try:
        return asyncio.run(_run())
    except Exception as exc:
        raise self.retry(exc=exc)
