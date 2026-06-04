"""Admin fraud queue endpoint (T11.4, FR-073) — 2FA-gated."""

from __future__ import annotations

from collections.abc import Iterator

import pytest
from app.api.admin import get_fraud_service
from app.api.auth import get_otp_service
from app.api.deps import get_session_service, get_user_repo
from app.core.auth.service import OtpService
from app.core.auth.session import SessionService
from app.core.auth.totp import generate_totp
from app.core.fraud.service import FraudService
from app.main import create_app
from fastapi import FastAPI
from fastapi.testclient import TestClient

from tests.fakes import (
    FakeClock,
    FakeFraudRepo,
    FakeOtpStore,
    FakeSessionStore,
    FakeUserRepository,
    RecordingSms,
)

CODE = "123456"
SECRET = "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ"  # public RFC 6238 vector


@pytest.fixture
def ctx() -> Iterator[tuple[FastAPI, FakeUserRepository, FakeFraudRepo]]:
    app = create_app()
    otp = OtpService(FakeOtpStore(FakeClock()), RecordingSms(), "s", code_factory=lambda: CODE)
    sessions = SessionService(FakeSessionStore())
    users = FakeUserRepository()
    repo = FakeFraudRepo()
    app.dependency_overrides[get_otp_service] = lambda: otp
    app.dependency_overrides[get_session_service] = lambda: sessions
    app.dependency_overrides[get_user_repo] = lambda: users
    app.dependency_overrides[get_fraud_service] = lambda: FraudService(repo)
    yield app, users, repo


def test_fraud_requires_2fa(ctx: tuple[FastAPI, FakeUserRepository, FakeFraudRepo]) -> None:
    app, users, _repo = ctx
    client = TestClient(app)
    client.post("/api/auth/otp/request", json={"phone": "+79990001122"})
    client.post("/api/auth/otp/verify", json={"phone": "+79990001122", "code": CODE})
    uid = client.get("/api/me").json()["data"]["user"]["id"]
    users.make_admin(uid, SECRET)  # admin but no 2FA
    assert client.get("/api/admin/fraud").status_code == 403


def test_fraud_queue(ctx: tuple[FastAPI, FakeUserRepository, FakeFraudRepo]) -> None:
    app, users, repo = ctx
    repo.record("u9", "dispute_rate", 40, {"disputed": "3"})

    client = TestClient(app)
    client.post("/api/auth/otp/request", json={"phone": "+79990001122"})
    client.post("/api/auth/otp/verify", json={"phone": "+79990001122", "code": CODE})
    uid = client.get("/api/me").json()["data"]["user"]["id"]
    users.make_admin(uid, SECRET)
    client.post("/api/admin/2fa/verify", json={"code": generate_totp(SECRET)})

    resp = client.get("/api/admin/fraud")
    assert resp.status_code == 200
    items = resp.json()["data"]["items"]
    assert len(items) == 1 and items[0]["type"] == "dispute_rate" and items[0]["score"] == 40
