"""DSR endpoints (T12.3, API_CONTRACT §6): export / delete / correct + status gate."""

from __future__ import annotations

from collections.abc import Iterator

import pytest
from app.api.auth import get_otp_service
from app.api.deps import get_session_service, get_user_repo
from app.api.me import get_privacy_service
from app.core.auth.service import OtpService
from app.core.auth.session import SessionService
from app.core.privacy.service import PrivacyService
from app.main import create_app
from fastapi import FastAPI
from fastapi.testclient import TestClient

from tests.fakes import (
    FakeAuditLog,
    FakeClock,
    FakeOtpStore,
    FakePrivacyRepository,
    FakeSessionStore,
    FakeUserRepository,
    RecordingSms,
)

CODE = "123456"
PHONE = "+79161234567"


@pytest.fixture
def ctx() -> Iterator[tuple[FastAPI, FakeUserRepository, FakePrivacyRepository]]:
    app = create_app()
    otp = OtpService(FakeOtpStore(FakeClock()), RecordingSms(), "s", code_factory=lambda: CODE)
    sessions = SessionService(FakeSessionStore())
    users = FakeUserRepository()
    privacy = FakePrivacyRepository()
    app.dependency_overrides[get_otp_service] = lambda: otp
    app.dependency_overrides[get_session_service] = lambda: sessions
    app.dependency_overrides[get_user_repo] = lambda: users
    app.dependency_overrides[get_privacy_service] = lambda: PrivacyService(privacy, FakeAuditLog())
    yield app, users, privacy


def _login(app: FastAPI) -> tuple[TestClient, str]:
    client = TestClient(app)
    client.post("/api/auth/otp/request", json={"phone": PHONE})
    client.post("/api/auth/otp/verify", json={"phone": PHONE, "code": CODE})
    return client, client.get("/api/me").json()["data"]["user"]["id"]


def test_export_returns_bundle(
    ctx: tuple[FastAPI, FakeUserRepository, FakePrivacyRepository],
) -> None:
    app, _users, privacy = ctx
    client, uid = _login(app)
    privacy.seed(uid)
    resp = client.post("/api/me/export")
    assert resp.status_code == 200
    assert "profile" in resp.json()["data"]["export"]


def test_export_requires_session(
    ctx: tuple[FastAPI, FakeUserRepository, FakePrivacyRepository],
) -> None:
    app, _users, _privacy = ctx
    assert TestClient(app).post("/api/me/export").status_code == 401


def test_delete_without_confirm_422(
    ctx: tuple[FastAPI, FakeUserRepository, FakePrivacyRepository],
) -> None:
    app, _users, privacy = ctx
    client, uid = _login(app)
    privacy.seed(uid)
    resp = client.post("/api/me/delete", json={"confirm": False})
    assert resp.status_code == 422  # validation_error
    assert resp.json()["error"] == "validation_error"


def test_delete_schedules(ctx: tuple[FastAPI, FakeUserRepository, FakePrivacyRepository]) -> None:
    app, _users, privacy = ctx
    client, uid = _login(app)
    privacy.seed(uid)
    resp = client.post("/api/me/delete", json={"confirm": True})
    assert resp.status_code == 200
    assert resp.json()["data"]["scheduled_at"]


def test_correct_profile(ctx: tuple[FastAPI, FakeUserRepository, FakePrivacyRepository]) -> None:
    app, _users, privacy = ctx
    client, uid = _login(app)
    privacy.seed(uid)
    resp = client.patch("/api/me", json={"display_name": "Анна"})
    assert resp.status_code == 200
    assert resp.json()["data"]["user"]["display_name"] == "Анна"


def test_deleted_user_is_locked_out(
    ctx: tuple[FastAPI, FakeUserRepository, FakePrivacyRepository],
) -> None:
    app, users, _privacy = ctx
    client, uid = _login(app)
    users.set_status(uid, "deleted")  # soft-deleted account
    assert client.get("/api/me").status_code == 403  # FLOW-9 lockout


def test_blocked_user_is_locked_out(
    ctx: tuple[FastAPI, FakeUserRepository, FakePrivacyRepository],
) -> None:
    app, users, _privacy = ctx
    client, uid = _login(app)
    users.set_status(uid, "blocked")  # ban (FLOW-8)
    assert client.get("/api/me").status_code == 403
