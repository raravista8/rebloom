"""Auth endpoints (API_CONTRACT §2): phone OTP, session, identity."""

from __future__ import annotations

from typing import Annotated, Any

from fastapi import APIRouter, Depends, Request, Response
from fastapi.responses import JSONResponse

from app.api.deps import (
    SESSION_COOKIE,
    RequireUserDep,
    SessionServiceDep,
    UserRepoDep,
)
from app.api.envelope import domain_error_response, ok
from app.config import get_settings
from app.core.auth.schemas import OtpRequestIn, OtpVerifyIn
from app.core.auth.service import OtpService
from app.core.auth.session import SESSION_TTL_SECONDS
from app.core.result import Ok
from app.infrastructure.auth.otp_store import RedisOtpStore
from app.infrastructure.redis import client as redis_client
from app.infrastructure.sms import ConsoleSmsSender

router = APIRouter(tags=["auth"])


def get_otp_service() -> OtpService:
    settings = get_settings()
    store = RedisOtpStore(redis_client)
    sms = ConsoleSmsSender(reveal_code=settings.app_env == "local")
    return OtpService(store, sms, settings.app_secret_key)


OtpServiceDep = Annotated[OtpService, Depends(get_otp_service)]


@router.post("/api/auth/otp/request", response_model=None)
def request_otp(
    payload: OtpRequestIn, request: Request, service: OtpServiceDep
) -> dict[str, Any] | JSONResponse:
    result = service.request_otp(payload.phone)
    if isinstance(result, Ok):
        return ok({"sent": True, "retry_after_sec": result.value.retry_after_sec})
    return domain_error_response(request, result.error)


@router.post("/api/auth/otp/verify", response_model=None)
def verify_otp(
    payload: OtpVerifyIn,
    request: Request,
    response: Response,
    service: OtpServiceDep,
    session_service: SessionServiceDep,
    user_repo: UserRepoDep,
) -> dict[str, Any] | JSONResponse:
    result = service.verify_otp(payload.phone, payload.code)
    if not isinstance(result, Ok):
        return domain_error_response(request, result.error)

    user = user_repo.get_or_create_by_phone(result.value.phone)
    token = session_service.create(user.id)
    response.set_cookie(
        key=SESSION_COOKIE,
        value=token,
        httponly=True,
        secure=get_settings().app_env != "local",
        samesite="lax",
        max_age=SESSION_TTL_SECONDS,
        path="/",
    )
    return ok({"user": user.to_public()})


@router.get("/api/me", response_model=None)
def me(user: RequireUserDep) -> dict[str, Any]:
    return ok({"user": user.to_public()})


@router.post("/api/auth/logout", response_model=None)
def logout(
    request: Request, response: Response, session_service: SessionServiceDep
) -> dict[str, Any]:
    token = request.cookies.get(SESSION_COOKIE)
    if token:
        session_service.revoke(token)
    response.delete_cookie(SESSION_COOKIE, path="/")
    return ok({"ok": True})
