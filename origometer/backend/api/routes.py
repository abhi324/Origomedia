from datetime import datetime
from fastapi import APIRouter, HTTPException, Query, BackgroundTasks
from pydantic import BaseModel
from typing import Optional, Literal

from scrapers.instagram import InstagramScraper
from services.analytics import build_analytics, CreatorAnalytics
from db import repository
import logging

logger = logging.getLogger(__name__)
router = APIRouter(tags=["creators"])

Platform = Literal["instagram"]

SCRAPERS = {
    "instagram": InstagramScraper,
}

# Cached creator rows scraped before this datetime are treated as stale and
# re-scraped on next lookup. Bump this whenever you change the engagement-
# rate / avg-likes math so users see fresh numbers without manually flushing.
CALC_VERSION_BOUNDARY = datetime(2026, 4, 26, 2, 0, 0)


def _scrape_is_stale(last_scraped_iso: Optional[str]) -> bool:
    if not last_scraped_iso:
        return True
    try:
        # Normalize "...Z", "...+00:00", and microsecond/no-microsecond variants.
        s = last_scraped_iso.replace("Z", "").split("+")[0].split(".")[0]
        return datetime.fromisoformat(s) < CALC_VERSION_BOUNDARY
    except Exception:
        return True


class LookupRequest(BaseModel):
    username: str
    platform: Platform
    force_refresh: bool = False


class VerificationRequest(BaseModel):
    creator_id: str
    submitted_by: str
    notes: Optional[str] = None
    screenshot_urls: Optional[list[str]] = None


@router.post("/lookup", response_model=dict)
async def lookup_creator(req: LookupRequest, background_tasks: BackgroundTasks):
    """
    Primary endpoint: scrape a creator profile and return analytics.
    Checks DB cache first; scrapes fresh data if not found or force_refresh=True.
    """
    username = req.username.lstrip("@").lower()
    platform = req.platform

    if not req.force_refresh:
        cached = await repository.get_creator(platform, username)
        # Treat cache as stale if it doesn't have the new bhrisa-breakdown fields
        # OR if it was scraped before the calculation-logic boundary above.
        breakdown_ok = cached and (
            cached.get("image_avg_likes") is not None
            or cached.get("reel_avg_likes") is not None
            or (cached.get("total_posts") == 0)
        )
        if breakdown_ok and not _scrape_is_stale(cached.get("last_scraped_at")):
            return {"source": "cache", "data": cached}

    scraper_cls = SCRAPERS.get(platform)
    if not scraper_cls:
        raise HTTPException(status_code=400, detail=f"Unsupported platform: {platform}")

    try:
        async with scraper_cls() as scraper:
            raw = await scraper.scrape(username)
    except Exception as e:
        logger.error(f"Scrape failed for {platform}/{username}: {e}")
        raise HTTPException(status_code=503, detail=f"Scraping failed: {str(e)[:150]}")

    analytics = build_analytics(raw)

    # If confidence is too low, all scraping methods failed — tell the user clearly
    if analytics.confidence_score < 0.15:
        suggestion = "Try again in 30s — Instagram may be rate-limiting, or the handle doesn't exist"

        raise HTTPException(
            status_code=404,
            detail={
                "error": f"Could not retrieve public data for @{username} on {platform}",
                "reason": suggestion,
                "partial_data": _analytics_to_dict(analytics),
            },
        )

    # Persist to DB in background (don't block response)
    background_tasks.add_task(repository.upsert_creator, analytics)

    return {"source": "live", "data": _analytics_to_dict(analytics)}


@router.get("/creators", response_model=dict)
async def list_creators(
    platform: Optional[Platform] = None,
    niche: Optional[str] = None,
    min_followers: Optional[int] = None,
    min_engagement: Optional[float] = None,
    verified_only: bool = False,
    limit: int = Query(default=20, le=100),
    offset: int = 0,
):
    """Browse and filter discovered creators."""
    results = await repository.list_creators(
        platform=platform,
        niche=niche,
        min_followers=min_followers,
        min_engagement=min_engagement,
        verified_only=verified_only,
        limit=limit,
        offset=offset,
    )
    return {"creators": results, "count": len(results)}


@router.get("/creators/{platform}/{username}", response_model=dict)
async def get_creator(platform: Platform, username: str):
    username = username.lstrip("@").lower()
    data = await repository.get_creator(platform, username)
    if not data:
        raise HTTPException(status_code=404, detail="Creator not found. Use /lookup to discover them.")
    return data


@router.post("/verify/request", response_model=dict)
async def submit_verification(req: VerificationRequest):
    """Creator or brand submits a verification request."""
    result = await repository.create_verification_request(
        creator_id=req.creator_id,
        submitted_by=req.submitted_by,
        notes=req.notes,
        screenshot_urls=req.screenshot_urls,
    )
    return {"message": "Verification request submitted", "request": result}


def _analytics_to_dict(a: CreatorAnalytics) -> dict:
    return {
        "platform": a.platform,
        "username": a.username,
        "profile_name": a.profile_name,
        "bio": a.bio,
        "profile_url": a.profile_url,
        "profile_image_url": a.profile_image_url,
        "is_platform_verified": a.is_platform_verified,
        "followers": a.followers,
        "followers_formatted": a.followers_formatted,
        "following": a.following,
        "total_posts": a.total_posts,
        "avg_likes": a.avg_likes,
        "avg_comments": a.avg_comments,
        "estimated_engagement_rate": a.estimated_engagement_rate,
        "image_avg_likes": a.image_avg_likes,
        "image_avg_comments": a.image_avg_comments,
        "image_engagement_rate": a.image_engagement_rate,
        "image_estimated_reach": a.image_estimated_reach,
        "reel_avg_likes": a.reel_avg_likes,
        "reel_avg_comments": a.reel_avg_comments,
        "reel_avg_views": a.reel_avg_views,
        "reel_engagement_rate": a.reel_engagement_rate,
        "reel_estimated_reach": a.reel_estimated_reach,
        "image_sample_size": a.image_sample_size,
        "reel_sample_size": a.reel_sample_size,
        "is_benchmark_estimated": a.is_benchmark_estimated,
        "primary_niche": a.primary_niche,
        "niches": a.niches,
        "data_source": a.data_source,
        "confidence_score": a.confidence_score,
        "is_verified": a.is_verified,
        "creator_score": a.creator_score,
    }
