"""Admin endpoints — TOTP 2FA gate (OPERATIONS §6, SECURITY §5)."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ConfigDict, Field

from app.api.deps import (
    SESSION_COOKIE,
    RequireAdmin2FADep,
    RequireAdminDep,
    SessionServiceDep,
    UserRepoDep,
)
from app.api.envelope import fail, ok, request_id
from app.core.auth.totp import verify_totp

router = APIRouter(tags=["admin"])


class Admin2FAIn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    code: str = Field(min_length=6, max_length=8)


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
