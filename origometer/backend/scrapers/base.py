"""Base scraper class — shared logic for all platform scrapers."""
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Optional
import httpx
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
from utils.user_agents import random_desktop
import logging

logger = logging.getLogger(__name__)


@dataclass
class RawCreatorData:
    platform: str
    username: str
    profile_name: Optional[str] = None
    bio: Optional[str] = None
    followers: Optional[int] = None
    following: Optional[int] = None
    total_posts: Optional[int] = None
    avg_likes: Optional[int] = None
    avg_comments: Optional[int] = None

    # bhrisa-style breakdown by content type
    image_avg_likes: Optional[int] = None
    image_avg_comments: Optional[int] = None
    image_engagement_rate: Optional[float] = None
    image_estimated_reach: Optional[int] = None

    reel_avg_likes: Optional[int] = None
    reel_avg_comments: Optional[int] = None
    reel_avg_views: Optional[int] = None
    reel_engagement_rate: Optional[float] = None
    reel_estimated_reach: Optional[int] = None

    # Sample sizes — let the frontend show "estimated" when 0
    image_sample_size: int = 0
    reel_sample_size: int = 0

    profile_image_url: Optional[str] = None
    profile_url: Optional[str] = None
    is_verified: bool = False
    niche_keywords: list[str] = field(default_factory=list)
    raw_html: Optional[str] = None
    data_source: str = "unknown"
    confidence: float = 0.0


class BaseScraper(ABC):
    PLATFORM: str = ""

    def __init__(self):
        self.client = httpx.AsyncClient(
            headers={"User-Agent": random_desktop()},
            follow_redirects=True,
            timeout=15.0,
        )

    async def __aenter__(self):
        return self

    async def __aexit__(self, *args):
        await self.client.aclose()

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        retry=retry_if_exception_type((httpx.TimeoutException, httpx.ConnectError)),
        reraise=True,
    )
    async def _get(self, url: str, **kwargs) -> httpx.Response:
        self.client.headers.update({"User-Agent": random_desktop()})
        resp = await self.client.get(url, **kwargs)
        resp.raise_for_status()
        return resp

    @abstractmethod
    async def scrape(self, username: str) -> RawCreatorData:
        ...
