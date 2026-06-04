"""Integration-test fixtures — wait out DB cold-start and warm the app pool.

`docker compose up --wait db` returns as soon as the healthcheck passes, but the
app's writer_engine pool is still cold; the first connection can race. Ping with
retries once per session so integration tests don't flake on startup.
"""

from __future__ import annotations

import time
from collections.abc import Iterator

import pytest
from sqlalchemy import text

from app.infrastructure.postgres.engine import writer_engine


@pytest.fixture(scope="session", autouse=True)
def _warm_database() -> Iterator[None]:
    last_error: Exception | None = None
    for _ in range(30):
        try:
            with writer_engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            break
        except Exception as exc:  # retry any connect error during cold-start
            last_error = exc
            time.sleep(0.5)
    else:
        raise RuntimeError(f"database not reachable for integration tests: {last_error}")
    yield
