"""Admin overview endpoint (T11.2b, FR-070) — 2FA-gated KPI bundle."""

from __future__ import annotations

from collections.abc import Iterator

import pytest
from app.api.admin import get_overview_service
from app.api.auth import get_otp_service
from app.api.deps import get_session_service, get_user_repo
from app.core.analytics.finance import FinanceService
from app.core.analytics.metrics import MetricsService
from app.core.analytics.overview import OverviewService
from app.core.auth.service import OtpService
from app.core.auth.session import SessionService
from app.core.auth.totp import generate_totp
from app.main import create_app
from fastapi import FastAPI
from fastapi.testclient import TestClient

from tests.fakes import (
    FakeClock,
    FakeFinanceRepo,
    FakeMetricsRecorder,
    FakeOtpStore,
    FakeSessionStore,
    FakeUserRepository,
    FakeUsersStatsRepo,
    RecordingSms,
)

CODE = "123456"
SECRET = "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ"  # public RFC 6238 vector


@pytest.fixture
def ctx() -> Iterator[tuple[FastAPI, FakeUserRepository]]:
    app = create_app()
    otp = OtpService(FakeOtpStore(FakeClock()), RecordingSms(), "s", code_factory=lambda: CODE)
    sessions = SessionService(FakeSessionStore())
    users = FakeUserRepository()
    overview = OverviewService(
        MetricsService(FakeMetricsRecorder()),
        FinanceService(FakeFinanceRepo(totals={"hold": 5000}, deals={"paid_held": 1})),
        FakeUsersStatsRepo(total=7, by_city={"msk": 7}),
    )
    app.dependency_overrides[get_otp_service] = lambda: otp
    app.dependency_overrides[get_session_service] = lambda: sessions
    app.dependency_overrides[get_user_repo] = lambda: users
    app.dependency_overrides[get_overview_service] = lambda: overview
    yield app, users


def _admin(app: FastAPI, users: FakeUserRepository) -> TestClient:
    client = TestClient(app)
    client.post("/api/auth/otp/request", json={"phone": "+79990001122"})
    client.post("/api/auth/otp/verify", json={"phone": "+79990001122", "code": CODE})
    uid = client.get("/api/me").json()["data"]["user"]["id"]
    users.make_admin(uid, SECRET)
    client.post("/api/admin/2fa/verify", json={"code": generate_totp(SECRET)})
    return client


def test_overview_requires_2fa(ctx: tuple[FastAPI, FakeUserRepository]) -> None:
    app, users = ctx
    client = TestClient(app)
    client.post("/api/auth/otp/request", json={"phone": "+79990001122"})
    client.post("/api/auth/otp/verify", json={"phone": "+79990001122", "code": CODE})
    uid = client.get("/api/me").json()["data"]["user"]["id"]
    users.make_admin(uid, SECRET)  # admin but not 2FA-verified
    assert client.get("/api/admin/overview").status_code == 403


def test_overview_shape(ctx: tuple[FastAPI, FakeUserRepository]) -> None:
    app, users = ctx
    resp = _admin(app, users).get("/api/admin/overview")
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert data["users_total"] == 7
    assert data["users_by_city"] == {"msk": 7}
    assert data["gmv_kopecks"] == 5000
    assert data["held_kopecks"] == 5000  # nothing released yet
    assert set(data["users_by_platform"]) == {"web", "ios", "android"}
    assert "dau" in data and "mau" in data and "online" in data
