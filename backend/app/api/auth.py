"""Auth endpoints (API_CONTRACT §2): phone OTP request/verify.

Session issuance, user upsert and the ``{user}`` payload are wired in T1.2; for
now ``verify`` confirms the phone. Errors flow through the standard envelope.
"""

from __future__ import annotations

from typing import Annotated, Any

from fastapi import APIRouter, Depends, Request
from fastapi.responses import JSONResponse

from app.api.envelope import domain_error_response, ok
from app.config import get_settings
from app.core.auth.schemas import OtpRequestIn, OtpVerifyIn, mask_phone
from app.core.auth.service import OtpService
from app.core.result import Ok
from app.infrastructure.auth.otp_store import RedisOtpStore
from app.infrastructure.redis import client as redis_client
from app.infrastructure.sms import ConsoleSmsSender

router = APIRouter(prefix="/api/auth", tags=["auth"])


def get_otp_service() -> OtpService:
    settings = get_settings()
    store = RedisOtpStore(redis_client)
    sms = ConsoleSmsSender(reveal_code=settings.app_env == "local")
    return OtpService(store, sms, settings.app_secret_key)


OtpServiceDep = Annotated[OtpService, Depends(get_otp_service)]


@router.post("/otp/request", response_model=None)
def request_otp(
    payload: OtpRequestIn, request: Request, service: OtpServiceDep
) -> dict[str, Any] | JSONResponse:
    result = service.request_otp(payload.phone)
    if isinstance(result, Ok):
        return ok({"sent": True, "retry_after_sec": result.value.retry_after_sec})
    return domain_error_response(request, result.error)


@router.post("/otp/verify", response_model=None)
def verify_otp(
    payload: OtpVerifyIn, request: Request, service: OtpServiceDep
) -> dict[str, Any] | JSONResponse:
    result = service.verify_otp(payload.phone, payload.code)
    if isinstance(result, Ok):
        # T1.2: create/lookup user, open a session, set the cookie, return {user}.
        return ok({"verified": True, "phone_masked": mask_phone(result.value.phone)})
    return domain_error_response(request, result.error)
