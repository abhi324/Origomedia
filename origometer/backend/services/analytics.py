"""
Assembles the final CreatorAnalytics payload from raw scraper data.
"""
from dataclasses import dataclass
from typing import Optional
from scrapers.base import RawCreatorData
from services.niche_detector import detect_niche
from utils.normalizer import calculate_engagement_rate, format_metric


@dataclass
class CreatorAnalytics:
    # Identity
    platform: str
    username: str
    profile_name: Optional[str]
    bio: Optional[str]
    profile_url: str
    profile_image_url: Optional[str]
    is_platform_verified: bool

    # Overall metrics
    followers: Optional[int]
    followers_formatted: str
    following: Optional[int]
    total_posts: Optional[int]
    avg_likes: Optional[int]
    avg_comments: Optional[int]
    estimated_engagement_rate: Optional[float]

    # Image-only breakdown
    image_avg_likes: Optional[int]
    image_avg_comments: Optional[int]
    image_engagement_rate: Optional[float]
    image_estimated_reach: Optional[int]

    # Reel-only breakdown
    reel_avg_likes: Optional[int]
    reel_avg_comments: Optional[int]
    reel_avg_views: Optional[int]
    reel_engagement_rate: Optional[float]
    reel_estimated_reach: Optional[int]

    # Sample sizes (0 means values are estimated)
    image_sample_size: int
    reel_sample_size: int

    # Niche
    primary_niche: str
    niches: list[dict]

    # Data quality
    data_source: str
    confidence_score: float
    is_verified: bool
    creator_score: Optional[float]


def build_analytics(raw: RawCreatorData) -> CreatorAnalytics:
    eng = calculate_engagement_rate(raw.avg_likes, raw.avg_comments, raw.followers)

    niches = detect_niche(
        bio=raw.bio,
        profile_name=raw.profile_name,
        username=raw.username,
    )
    top_niche = niches[0]["niche"] if niches else "general"

    return CreatorAnalytics(
        platform=raw.platform,
        username=raw.username,
        profile_name=raw.profile_name,
        bio=raw.bio,
        profile_url=raw.profile_url or f"https://www.{raw.platform}.com/{raw.username}",
        profile_image_url=raw.profile_image_url,
        is_platform_verified=raw.is_verified,
        followers=raw.followers,
        followers_formatted=format_metric(raw.followers),
        following=raw.following,
        total_posts=raw.total_posts,
        avg_likes=raw.avg_likes,
        avg_comments=raw.avg_comments,
        estimated_engagement_rate=eng,
        # Image breakdown
        image_avg_likes=raw.image_avg_likes,
        image_avg_comments=raw.image_avg_comments,
        image_engagement_rate=raw.image_engagement_rate,
        image_estimated_reach=raw.image_estimated_reach,
        # Reel breakdown
        reel_avg_likes=raw.reel_avg_likes,
        reel_avg_comments=raw.reel_avg_comments,
        reel_avg_views=raw.reel_avg_views,
        reel_engagement_rate=raw.reel_engagement_rate,
        reel_estimated_reach=raw.reel_estimated_reach,
        image_sample_size=raw.image_sample_size,
        reel_sample_size=raw.reel_sample_size,
        primary_niche=top_niche,
        niches=niches,
        data_source=raw.data_source,
        confidence_score=raw.confidence,
        is_verified=False,
        creator_score=_compute_creator_score(raw, eng),
    )


def _compute_creator_score(raw: RawCreatorData, eng: Optional[float]) -> float:
    """
    0–100 brand-trust score based on:
    - Followers size tier (20 pts)
    - Engagement rate (40 pts)
    - Bio completeness (15 pts)
    - Profile image present (10 pts)
    - Data confidence (15 pts)
    """
    score = 0.0

    # Followers tier
    f = raw.followers or 0
    if f >= 1_000_000:
        score += 20
    elif f >= 100_000:
        score += 15
    elif f >= 10_000:
        score += 10
    elif f >= 1_000:
        score += 5

    # Engagement rate (sweet spot 2–6%)
    if eng is not None:
        if 2 <= eng <= 6:
            score += 40
        elif 1 <= eng < 2:
            score += 25
        elif 6 < eng <= 15:
            score += 30
        elif eng > 15:
            score += 15  # could be micro-creator or fake

    # Bio completeness
    if raw.bio and len(raw.bio) > 30:
        score += 15
    elif raw.bio:
        score += 7

    # Profile image
    if raw.profile_image_url:
        score += 10

    # Data confidence
    score += raw.confidence * 15

    return round(min(score, 100), 1)
