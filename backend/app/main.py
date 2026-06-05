"""FastAPI application factory and ASGI entrypoint.

Run locally: ``uvicorn app.main:app --reload`` (or via Docker Compose, T0.4).
"""

from __future__ import annotations

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

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
    support,
    ws,
)
from app.api.analytics_middleware import AnalyticsMiddleware
from app.api.envelope import (
    http_exception_handler,
    unhandled_exception_handler,
    validation_exception_handler,
)

# No-escrow launch (ADR-0013): the ЮKassa payment webhook is NOT registered. The
# adapter/handler stay dormant in-repo for the future monetization ADR.
from app.config import get_settings
from app.infrastructure.logging import configure_logging

# Sync `def` route handlers run in Starlette's threadpool (default 40 tokens). At high
# concurrency that queued requests while CPU/Postgres sat idle (load test: ~315 rps,
# p95 5s, CPU 23%). Raise it to match the DB pool (engine.py: 64 conns/worker) so the
# box's spare capacity is actually used. Set in the lifespan (needs the running loop).
_THREADPOOL_TOKENS = 64


@asynccontextmanager
async def _lifespan(_app: FastAPI) -> AsyncIterator[None]:
    import anyio

    anyio.to_thread.current_default_thread_limiter().total_tokens = _THREADPOOL_TOKENS
    yield


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title="Передарим (rebloom) API",
        version="0.1.0",
        # Hide interactive docs outside local/staging (SECURITY A02).
        docs_url=None if settings.is_prod else "/docs",
        redoc_url=None,
        lifespan=_lifespan,
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
    app.include_router(support.router)
    app.include_router(admin.router)
    app.include_router(ws.router)

    return app


_settings = get_settings()
configure_logging(_settings.log_level)
app = create_app()
