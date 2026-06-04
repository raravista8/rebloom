"""Admin endpoints — TOTP 2FA gate (OPERATIONS §6, SECURITY §5)."""

from __future__ import annotations

from typing import Any, Literal

from fastapi import APIRouter, Request
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
from app.core.auth.totp import verify_totp
from app.core.result import Ok

router = APIRouter(tags=["admin"])


class Admin2FAIn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    code: str = Field(min_length=6, max_length=8)


class DisputeResolveIn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    action: Literal["release", "refund", "partial"]
    reason: str = Field(min_length=1, max_length=2000)
    refund_kopecks: int = Field(default=0, ge=0)


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
