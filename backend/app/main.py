"""FastAPI application factory and ASGI entrypoint.

Run locally: ``uvicorn app.main:app --reload`` (or via Docker Compose, T0.4).
"""

from __future__ import annotations

from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.api import (
    admin,
    auth,
    chat,
    cities,
    consent,
    deals,
    feed,
    health,
    listing_chat,
    listings,
    me,
    notifications,
    reports,
    reviews,
    ws,
)
from app.api.analytics_middleware import AnalyticsMiddleware
from app.api.envelope import (
    http_exception_handler,
    unhandled_exception_handler,
    validation_exception_handler,
)
from app.api.webhooks import yookassa as yookassa_webhook
from app.config import get_settings
from app.infrastructure.logging import configure_logging


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title="Передарим (rebloom) API",
        version="0.1.0",
        # Hide interactive docs outside local/staging (SECURITY A02).
        docs_url=None if settings.is_prod else "/docs",
        redoc_url=None,
    )

    app.add_exception_handler(
        RequestValidationError,
        validation_exception_handler,  # type: ignore[arg-type]
    )
    app.add_exception_handler(
        StarletteHTTPException,
        http_exception_handler,  # type: ignore[arg-type]
    )
    app.add_exception_handler(Exception, unhandled_exception_handler)

    app.add_middleware(AnalyticsMiddleware)

    app.include_router(health.router)
    app.include_router(auth.router)
    app.include_router(consent.router)
    app.include_router(listings.router)
    app.include_router(cities.router)
    app.include_router(feed.router)
    app.include_router(deals.router)
    app.include_router(chat.router)
    app.include_router(listing_chat.router)
    app.include_router(reviews.router)
    app.include_router(me.router)
    app.include_router(notifications.router)
    app.include_router(reports.router)
    app.include_router(admin.router)
    app.include_router(ws.router)
    app.include_router(yookassa_webhook.router)

    return app


_settings = get_settings()
configure_logging(_settings.log_level)
app = create_app()
