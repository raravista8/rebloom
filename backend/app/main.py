"""FastAPI application factory and ASGI entrypoint.

Run locally: ``uvicorn app.main:app --reload`` (or via Docker Compose, T0.4).
"""

from __future__ import annotations

from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.api import auth, consent, health, listings
from app.api.envelope import (
    http_exception_handler,
    unhandled_exception_handler,
    validation_exception_handler,
)
from app.config import get_settings


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

    app.include_router(health.router)
    app.include_router(auth.router)
    app.include_router(consent.router)
    app.include_router(listings.router)

    return app


app = create_app()
