"""Response envelope + exception handling (API_CONTRACT §0, §7).

Success: ``{"ok": true, "data": {...}}``
Failure: ``{"ok": false, "error": "code", "message": "...", "request_id": "..."}``

No stack traces ever reach the client (SECURITY A10).
"""

from __future__ import annotations

import uuid
from typing import Any

from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.core.errors import DomainError

REQUEST_ID_HEADER = "X-Request-ID"


def request_id(request: Request) -> str:
    """Correlation id — from the inbound header or freshly minted."""
    return request.headers.get(REQUEST_ID_HEADER) or uuid.uuid4().hex


def ok(data: Any) -> dict[str, Any]:
    """Wrap a successful payload."""
    return {"ok": True, "data": data}


def fail(error: str, *, message: str = "", req_id: str = "") -> dict[str, Any]:
    """Wrap a failure payload (no PII, no stack traces)."""
    return {"ok": False, "error": error, "message": message, "request_id": req_id}


# HTTP status for each stable error code (API_CONTRACT §7).
_STATUS: dict[str, int] = {
    "validation_error": 422,
    "unauthorized": 401,
    "forbidden": 403,
    "not_found": 404,
    "rate_limited": 429,
    "otp_locked": 429,
    "moderation_pending": 409,
    "content_blocked": 422,
    "listing_unavailable": 409,
    "payment_failed": 402,
    "conflict": 409,
    "internal": 500,
}


def status_for(error: str) -> int:
    return _STATUS.get(error, 400)


def domain_error_response(request: Request, err: DomainError) -> JSONResponse:
    rid = request_id(request)
    return JSONResponse(
        status_code=status_for(err.code),
        content=fail(err.code, message=err.message, req_id=rid),
        headers={REQUEST_ID_HEADER: rid},
    )


async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    rid = request_id(request)
    return JSONResponse(
        status_code=422,
        content=fail("validation_error", message="Invalid request", req_id=rid),
        headers={REQUEST_ID_HEADER: rid},
    )


async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Last-resort handler — never leak the exception detail to the client."""
    rid = request_id(request)
    return JSONResponse(
        status_code=500,
        content=fail("internal", message="Internal error", req_id=rid),
        headers={REQUEST_ID_HEADER: rid},
    )
