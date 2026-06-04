"""Activity-capture middleware (FR-065). For each authenticated API request,
record an online heartbeat + a daily-active mark (platform from ``X-Platform``).
Best-effort and PII-light: it never blocks or fails a request, and stores only
the user id + platform bucket (the request IP is not persisted here — that's the
fraud IP_LOG, a separate, access-logged store)."""

from __future__ import annotations

import logging
from datetime import UTC, datetime

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from starlette.types import ASGIApp

from app.api.deps import SESSION_COOKIE, get_metrics_service, get_session_service
from app.core.analytics.metrics import day_key

logger = logging.getLogger("rebloom.analytics")


class AnalyticsMiddleware(BaseHTTPMiddleware):
    def __init__(self, app: ASGIApp) -> None:
        super().__init__(app)

    async def dispatch(self, request: Request, call_next):  # type: ignore[no-untyped-def]
        response: Response = await call_next(request)
        try:
            if request.url.path.startswith("/api/"):
                token = request.cookies.get(SESSION_COOKIE)
                user_id = get_session_service().resolve(token) if token else None
                if user_id is not None:
                    now = datetime.now(UTC)
                    get_metrics_service().record_activity(
                        user_id,
                        request.headers.get("X-Platform", "web"),
                        now.timestamp(),
                        day_key(now),
                    )
        except Exception:  # analytics must never break a request
            logger.debug("activity capture failed", exc_info=True)
        return response
