"""
Admin-only routes (protected by API key).
"""
from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from typing import Optional
from config import get_settings
from db import repository

router = APIRouter(tags=["admin"])
settings = get_settings()


def require_admin(x_admin_key: str = Header(...)):
    if x_admin_key != settings.admin_api_key:
        raise HTTPException(status_code=403, detail="Invalid admin key")


class VerificationDecision(BaseModel):
    request_id: str
    approved: bool
    admin_id: str = "admin"


@router.get("/verification/requests", dependencies=[Depends(require_admin)])
async def get_verification_requests(status: Optional[str] = None):
    """List all pending/approved/rejected verification requests."""
    requests = await repository.list_verification_requests(status=status)
    return {"requests": requests}


@router.post("/verification/decide", dependencies=[Depends(require_admin)])
async def decide_verification(decision: VerificationDecision):
    """Approve or reject a creator verification request."""
    result = await repository.approve_verification(
        request_id=decision.request_id,
        admin_id=decision.admin_id,
        approved=decision.approved,
    )
    return {"message": "Decision recorded", "result": result}


@router.delete(
    "/creators/{platform}/{username}",
    dependencies=[Depends(require_admin)],
)
async def delete_creator(platform: str, username: str):
    """Remove a creator profile from the database."""
    from db.supabase_client import get_supabase
    sb = get_supabase()
    sb.table("creators").delete().eq("platform", platform).eq("username", username).execute()
    return {"message": f"{platform}/{username} deleted"}
