"""Admin endpoints — TOTP 2FA gate (OPERATIONS §6, SECURITY §5)."""

from __future__ import annotations

from typing import Annotated, Any, Literal

from fastapi import APIRouter, Depends, Query, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ConfigDict, Field

from app.api.deals import DealServiceDep
from app.api.deps import (
    SESSION_COOKIE,
    RequireAdmin2FADep,
    RequireAdminDep,
    SessionServiceDep,
    UserRepoDep,
)
from app.api.envelope import domain_error_response, fail, ok, request_id
from app.core.admin.moderation import ModerationQueueService
from app.core.auth.totp import verify_totp
from app.core.result import Ok
from app.infrastructure.postgres.audit_repo import PostgresAuditLog
from app.infrastructure.postgres.moderation_repo import PostgresModerationQueueRepo

router = APIRouter(tags=["admin"])


def get_moderation_service() -> ModerationQueueService:
    return ModerationQueueService(PostgresModerationQueueRepo(), PostgresAuditLog())


ModerationServiceDep = Annotated[ModerationQueueService, Depends(get_moderation_service)]


class Admin2FAIn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    code: str = Field(min_length=6, max_length=8)


class DisputeResolveIn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    action: Literal["release", "refund", "partial"]
    reason: str = Field(min_length=1, max_length=2000)
    refund_kopecks: int = Field(default=0, ge=0)


class ModerationDecisionIn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    type: Literal["listing", "review"]
    action: Literal["approve", "reject"]
    reason: str = Field(min_length=1, max_length=2000)


@router.post("/api/admin/2fa/verify", response_model=None)
def admin_2fa_verify(
    payload: Admin2FAIn,
    request: Request,
    user: RequireAdminDep,
    user_repo: UserRepoDep,
    session_service: SessionServiceDep,
) -> dict[str, Any] | JSONResponse:
    secret = user_repo.get_totp_secret(user.id)
    if secret is None or not verify_totp(secret, payload.code):
        return JSONResponse(
            status_code=401, content=fail("unauthorized", req_id=request_id(request))
        )
    token = request.cookies.get(SESSION_COOKIE)
    if token:
        session_service.mark_2fa(token)
    return ok({"verified_2fa": True})


@router.get("/api/admin/whoami", response_model=None)
def admin_whoami(user: RequireAdmin2FADep) -> dict[str, Any]:
    return ok({"user": user.to_public(), "admin": True})


@router.post("/api/admin/deals/{deal_id}/resolve", response_model=None)
def resolve_dispute(
    deal_id: str,
    payload: DisputeResolveIn,
    request: Request,
    admin: RequireAdmin2FADep,
    service: DealServiceDep,
) -> dict[str, Any] | JSONResponse:
    """Support/admin resolves a dispute (FLOW-1 step 4) — release / refund /
    partial. Money settles in the ledger; the action is audit-logged."""
    result = service.resolve_dispute(
        admin.id,
        deal_id,
        action=payload.action,
        reason=payload.reason,
        refund_kopecks=payload.refund_kopecks,
        request_id=request_id(request),
    )
    if isinstance(result, Ok):
        return ok({"deal": result.value.to_api(role="seller")})
    return domain_error_response(request, result.error)


@router.get("/api/admin/moderation/queue", response_model=None)
def moderation_queue(
    _admin: RequireAdmin2FADep,
    service: ModerationServiceDep,
    type: Literal["listing", "review"] = Query("listing"),
) -> dict[str, Any]:
    """Pending listings or held reviews awaiting a moderator (FR-060)."""
    items = service.queue(type)
    # MVP: a single capped page — end-of-list signalled by next_cursor=null.
    return ok({"items": [i.to_api() for i in items], "next_cursor": None})


@router.post("/api/admin/moderation/{item_id}", response_model=None)
def moderation_decide(
    item_id: str,
    payload: ModerationDecisionIn,
    request: Request,
    admin: RequireAdmin2FADep,
    service: ModerationServiceDep,
) -> dict[str, Any] | JSONResponse:
    """Approve/reject a queued item with a mandatory reason (FR-061, audit-logged)."""
    result = service.decide(
        actor_id=admin.id,
        item_type=payload.type,
        item_id=item_id,
        action=payload.action,
        reason=payload.reason,
        request_id=request_id(request),
    )
    if isinstance(result, Ok):
        return ok({"status": result.value})
    return domain_error_response(request, result.error)
