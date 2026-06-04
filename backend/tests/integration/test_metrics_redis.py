"""T11.1 — Redis metrics + capture middleware against real Redis."""

from __future__ import annotations

import secrets

import pytest
from app.core.analytics.metrics import recent_days
from app.infrastructure.analytics import RedisMetrics
from app.infrastructure.auth.session_store import RedisSessionStore
from app.infrastructure.redis import client
from app.main import create_app
from fastapi.testclient import TestClient

pytestmark = pytest.mark.integration


def test_online_window_prunes_stale() -> None:
    client.delete("metrics:online")
    rec = RedisMetrics()
    rec.heartbeat("u1", 1000.0)
    rec.heartbeat("u2", 1000.0)
    assert rec.online_count(1200.0, 300) == 2
    rec.heartbeat("u3", 2000.0)
    assert rec.online_count(2000.0, 300) == 1  # u1/u2 (@1000) pruned, only u3 (@2000)


def test_dau_mau_hll() -> None:
    rec = RedisMetrics()
    day = f"test-{secrets.token_hex(6)}"  # run-unique → no cross-run accumulation
    for user in ("a", "b", "c", "a"):  # 'a' twice → still 3 distinct
        rec.mark_active(user, day, "ios")
    assert rec.active_count([day]) == 3
    assert rec.active_count_by_platform([day], "ios") == 3
    assert rec.active_count_by_platform([day], "android") == 0


def test_middleware_records_heartbeat_for_session() -> None:
    client.delete("metrics:online")
    user_id = f"anon-{secrets.token_hex(6)}"
    RedisSessionStore(client).save("ana-token", user_id, 3600)

    http = TestClient(create_app())
    http.cookies.set("session", "ana-token")
    assert http.get("/api/cities").status_code == 200  # any authenticated /api/ hit

    # The middleware recorded an online heartbeat for the resolved user.
    assert client.zscore("metrics:online", user_id) is not None


def test_recent_days_length() -> None:
    from datetime import UTC, datetime

    assert len(recent_days(datetime.now(UTC), 30)) == 30
