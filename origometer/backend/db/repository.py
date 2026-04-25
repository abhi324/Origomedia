"""
All database operations. Falls back to in-memory store if Supabase not configured.
"""
from typing import Optional
from datetime import datetime, timezone
from uuid import uuid4
import json
import logging
from config import get_settings
from services.analytics import CreatorAnalytics

logger = logging.getLogger(__name__)
settings = get_settings()

# ─────────────────────────────────────────────────────────────────────
# In-memory fallback stores (used when Supabase is not configured)
# ─────────────────────────────────────────────────────────────────────
_mem_creators: dict[str, dict] = {}
_mem_verification_requests: dict[str, dict] = {}


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _creator_key(platform: str, username: str) -> str:
    return f"{platform}:{username.lower()}"


def _analytics_to_row(a: CreatorAnalytics) -> dict:
    return {
        "id": str(uuid4()),
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
        "primary_niche": a.primary_niche,
        "niches": a.niches,
        "data_source": a.data_source,
        "confidence_score": a.confidence_score,
        "creator_score": a.creator_score,
        "is_verified": a.is_verified,
        "is_origo_verified": a.is_verified,
        "is_benchmark_estimated": a.is_benchmark_estimated,
        "last_scraped_at": _now(),
        "created_at": _now(),
    }


# ─────────────────────────────────────────────────────────────────────
# Public API
# ─────────────────────────────────────────────────────────────────────
async def upsert_creator(analytics: CreatorAnalytics) -> dict:
    row = _analytics_to_row(analytics)
    key = _creator_key(analytics.platform, analytics.username)

    if settings.demo_mode:
        existing = _mem_creators.get(key)
        if existing:
            row["id"] = existing["id"]
            row["created_at"] = existing["created_at"]
        _mem_creators[key] = row
        return row

    try:
        from db.supabase_client import get_supabase
        sb = get_supabase()
        row_for_sb = dict(row)
        row_for_sb.pop("id", None)
        row_for_sb.pop("created_at", None)
        row_for_sb.pop("followers_formatted", None)
        row_for_sb.pop("is_verified", None)
        row_for_sb["niches"] = json.dumps(analytics.niches)
        try:
            result = sb.table("creators").upsert(
                row_for_sb, on_conflict="platform,username"
            ).execute()
            return result.data[0] if result.data else row
        except Exception as schema_err:
            # Schema mismatch — missing bhrisa columns. Strip and retry.
            if "column" in str(schema_err).lower() or "schema cache" in str(schema_err).lower():
                logger.warning(f"Supabase schema is missing bhrisa columns, retrying with core fields only. Run migration_bhrisa_fields.sql.")
                extra = [
                    "image_avg_likes", "image_avg_comments", "image_engagement_rate", "image_estimated_reach",
                    "reel_avg_likes", "reel_avg_comments", "reel_avg_views", "reel_engagement_rate", "reel_estimated_reach",
                    "is_benchmark_estimated",
                ]
                for k in extra:
                    row_for_sb.pop(k, None)
                result = sb.table("creators").upsert(
                    row_for_sb, on_conflict="platform,username"
                ).execute()
                # Keep the stored row but include the runtime breakdown so API returns full data
                stored = result.data[0] if result.data else row_for_sb
                stored.update({k: row.get(k) for k in extra})
                return stored
            raise
    except Exception as e:
        logger.error(f"Supabase upsert failed, falling back to memory: {e}")
        _mem_creators[key] = row
        return row


async def get_creator(platform: str, username: str) -> Optional[dict]:
    key = _creator_key(platform, username)

    if settings.demo_mode:
        return _mem_creators.get(key)

    try:
        from db.supabase_client import get_supabase
        sb = get_supabase()
        result = (
            sb.table("creators").select("*")
            .eq("platform", platform).eq("username", username.lower())
            .maybe_single().execute()
        )
        return result.data
    except Exception as e:
        logger.error(f"Supabase get failed: {e}")
        return _mem_creators.get(key)


async def list_creators(
    platform: Optional[str] = None,
    niche: Optional[str] = None,
    min_followers: Optional[int] = None,
    min_engagement: Optional[float] = None,
    verified_only: bool = False,
    limit: int = 20,
    offset: int = 0,
) -> list[dict]:
    if settings.demo_mode:
        items = list(_mem_creators.values())
        if platform:
            items = [c for c in items if c["platform"] == platform]
        if niche:
            items = [c for c in items if c.get("primary_niche") == niche]
        if min_followers:
            items = [c for c in items if (c.get("followers") or 0) >= min_followers]
        if min_engagement:
            items = [c for c in items if (c.get("estimated_engagement_rate") or 0) >= min_engagement]
        if verified_only:
            items = [c for c in items if c.get("is_verified") or c.get("is_origo_verified")]
        items.sort(key=lambda c: c.get("creator_score") or 0, reverse=True)
        return items[offset:offset + limit]

    try:
        from db.supabase_client import get_supabase
        sb = get_supabase()
        q = sb.table("creators").select("*")
        if platform:       q = q.eq("platform", platform)
        if niche:          q = q.eq("primary_niche", niche)
        if min_followers:  q = q.gte("followers", min_followers)
        if min_engagement: q = q.gte("estimated_engagement_rate", min_engagement)
        if verified_only:  q = q.eq("is_origo_verified", True)
        q = q.order("creator_score", desc=True).range(offset, offset + limit - 1)
        return q.execute().data or []
    except Exception as e:
        logger.error(f"Supabase list failed: {e}")
        return []


async def create_verification_request(
    creator_id: str, submitted_by: str,
    notes: Optional[str] = None, screenshot_urls: Optional[list[str]] = None,
) -> dict:
    req = {
        "id": str(uuid4()),
        "creator_id": creator_id,
        "submitted_by": submitted_by,
        "notes": notes,
        "screenshot_urls": screenshot_urls or [],
        "status": "pending",
        "created_at": _now(),
    }

    if settings.demo_mode:
        _mem_verification_requests[req["id"]] = req
        return req

    try:
        from db.supabase_client import get_supabase
        sb = get_supabase()
        payload = dict(req)
        payload.pop("id")
        payload["screenshot_urls"] = json.dumps(payload["screenshot_urls"])
        result = sb.table("verification_requests").insert(payload).execute()
        return result.data[0] if result.data else req
    except Exception as e:
        logger.error(f"Supabase insert verification failed: {e}")
        _mem_verification_requests[req["id"]] = req
        return req


async def list_verification_requests(
    status: Optional[str] = None, limit: int = 50,
) -> list[dict]:
    if settings.demo_mode:
        items = list(_mem_verification_requests.values())
        if status:
            items = [r for r in items if r["status"] == status]
        # Attach creator data
        for r in items:
            creator = next(
                (c for c in _mem_creators.values() if c["id"] == r["creator_id"]),
                None,
            )
            r["creators"] = creator
        items.sort(key=lambda r: r["created_at"], reverse=True)
        return items[:limit]

    try:
        from db.supabase_client import get_supabase
        sb = get_supabase()
        q = sb.table("verification_requests").select("*, creators(*)")
        if status:
            q = q.eq("status", status)
        return q.order("created_at", desc=True).limit(limit).execute().data or []
    except Exception as e:
        logger.error(f"Supabase list verification failed: {e}")
        return []


async def approve_verification(request_id: str, admin_id: str, approved: bool) -> dict:
    new_status = "approved" if approved else "rejected"

    if settings.demo_mode:
        req = _mem_verification_requests.get(request_id)
        if not req:
            return {}
        req["status"] = new_status
        req["reviewed_by"] = admin_id
        req["reviewed_at"] = _now()
        if approved:
            for c in _mem_creators.values():
                if c["id"] == req["creator_id"]:
                    c["is_verified"] = True
                    c["is_origo_verified"] = True
                    c["verified_at"] = _now()
                    break
        return {"status": new_status}

    try:
        from db.supabase_client import get_supabase
        sb = get_supabase()
        r = sb.table("verification_requests").select("creator_id").eq("id", request_id).single().execute()
        if not r.data:
            return {}
        sb.table("verification_requests").update({
            "status": new_status, "reviewed_by": admin_id, "reviewed_at": _now(),
        }).eq("id", request_id).execute()
        if approved:
            sb.table("creators").update({
                "is_origo_verified": True, "verified_at": _now(),
            }).eq("id", r.data["creator_id"]).execute()
        return {"status": new_status}
    except Exception as e:
        logger.error(f"Supabase approve failed: {e}")
        return {}
