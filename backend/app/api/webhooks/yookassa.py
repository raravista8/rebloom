"""ЮKassa webhook (SECURITY T-02): IP allowlist + HMAC signature + re-fetch +
idempotent. The frontend never calls this — it polls GET /api/deals/{id}."""

from __future__ import annotations

import json
import logging
from dataclasses import dataclass
from typing import Annotated, Any

from fastapi import APIRouter, Depends, Request
from fastapi.responses import JSONResponse

from app.api.deals import DealServiceDep
from app.api.envelope import fail, ok, request_id
from app.config import get_settings
from app.core.payments.webhook import verify_signature

logger = logging.getLogger("rebloom.webhooks")
router = APIRouter(tags=["webhooks"])

SIGNATURE_HEADER = "X-Webhook-Signature"


@dataclass(frozen=True, slots=True)
class WebhookConfig:
    secret: str
    ip_allowlist: tuple[str, ...]


def get_webhook_config() -> WebhookConfig:
    settings = get_settings()
    allow = tuple(x.strip() for x in settings.yookassa_webhook_ip_allowlist.split(",") if x.strip())
    return WebhookConfig(secret=settings.yookassa_webhook_secret, ip_allowlist=allow)


WebhookConfigDep = Annotated[WebhookConfig, Depends(get_webhook_config)]


@router.post("/api/webhooks/yookassa", response_model=None)
async def yookassa_webhook(
    request: Request, service: DealServiceDep, config: WebhookConfigDep
) -> dict[str, Any] | JSONResponse:
    rid = request_id(request)
    client_ip = request.client.host if request.client else ""
    if config.ip_allowlist and client_ip not in config.ip_allowlist:
        logger.warning("webhook rejected: IP %s not allowlisted", client_ip)
        return JSONResponse(status_code=403, content=fail("forbidden", req_id=rid))

    raw = await request.body()
    if config.secret:
        signature = request.headers.get(SIGNATURE_HEADER, "")
        if not verify_signature(raw, signature, config.secret):
            logger.warning("webhook rejected: signature mismatch")
            return JSONResponse(status_code=401, content=fail("unauthorized", req_id=rid))

    try:
        payload = json.loads(raw)
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JSONResponse(status_code=400, content=fail("validation_error", req_id=rid))

    if payload.get("event") == "payment.succeeded":
        obj = payload.get("object") or {}
        yk_payment_id = obj.get("id")
        if yk_payment_id:
            # Re-fetches the authoritative status, then marks paid idempotently.
            service.process_payment_notification(str(yk_payment_id))

    return ok({"received": True})  # always 200; idempotent, no event echoed
