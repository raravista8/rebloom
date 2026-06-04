"""Admin finance endpoint (T11.2a, FR-070, API_CONTRACT §6) — 2FA-gated."""

from __future__ import annotations

from collections.abc import Iterator

import pytest
from app.api.admin import get_finance_service
from app.api.auth import get_otp_service
from app.api.deps import get_session_service, get_user_repo
from app.core.analytics.finance import FinanceService
from app.core.auth.service import OtpService
from app.core.auth.session import SessionService
from app.core.auth.totp import generate_totp
from app.main import create_app
from fastapi import FastAPI
from fastapi.testclient import TestClient

from tests.fakes import (
    FakeClock,
    FakeFinanceRepo,
    FakeOtpStore,
    FakeSessionStore,
    FakeUserRepository,
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
    repo = FakeFinanceRepo(
        totals={"hold": 100_000, "commission": 10_000, "payout": 90_000},
        deals={"released": 1},
    )
    app.dependency_overrides[get_otp_service] = lambda: otp
    app.dependency_overrides[get_session_service] = lambda: sessions
    app.dependency_overrides[get_user_repo] = lambda: users
    app.dependency_overrides[get_finance_service] = lambda: FinanceService(repo)
    yield app, users


def _admin(app: FastAPI, users: FakeUserRepository) -> TestClient:
    client = TestClient(app)
    client.post("/api/auth/otp/request", json={"phone": "+79990001122"})
    client.post("/api/auth/otp/verify", json={"phone": "+79990001122", "code": CODE})
    uid = client.get("/api/me").json()["data"]["user"]["id"]
    users.make_admin(uid, SECRET)
    client.post("/api/admin/2fa/verify", json={"code": generate_totp(SECRET)})
    return client


def test_finance_requires_2fa(ctx: tuple[FastAPI, FakeUserRepository]) -> None:
    app, users = ctx
    client = TestClient(app)
    client.post("/api/auth/otp/request", json={"phone": "+79990001122"})
    client.post("/api/auth/otp/verify", json={"phone": "+79990001122", "code": CODE})
    uid = client.get("/api/me").json()["data"]["user"]["id"]
    users.make_admin(uid, SECRET)  # admin but no 2FA yet
    assert client.get("/api/admin/finance").status_code == 403


def test_finance_returns_summary(ctx: tuple[FastAPI, FakeUserRepository]) -> None:
    app, users = ctx
    admin = _admin(app, users)
    resp = admin.get("/api/admin/finance")
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert data["gmv_kopecks"] == 100_000
    assert data["commission_kopecks"] == 10_000
    assert data["held_kopecks"] == 0
    assert data["deals_by_status"] == {"released": 1}
