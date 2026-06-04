"""Notification settings endpoints (T12.2, FR-090): per-category toggles."""

from __future__ import annotations

from collections.abc import Iterator

import pytest
from app.api.auth import get_otp_service
from app.api.deps import get_session_service, get_user_repo
from app.api.me import get_notif_settings_service
from app.core.auth.service import OtpService
from app.core.auth.session import SessionService
from app.core.notifications.settings import NotifSettingsService
from app.main import create_app
from fastapi import FastAPI
from fastapi.testclient import TestClient

from tests.fakes import (
    FakeClock,
    FakeNotifSettingsRepo,
    FakeOtpStore,
    FakeSessionStore,
    FakeUserRepository,
    RecordingSms,
)

CODE = "123456"
PHONE = "+79161234567"


@pytest.fixture
def ctx() -> Iterator[tuple[FastAPI, FakeNotifSettingsRepo]]:
    app = create_app()
    otp = OtpService(FakeOtpStore(FakeClock()), RecordingSms(), "s", code_factory=lambda: CODE)
    sessions = SessionService(FakeSessionStore())
    users = FakeUserRepository()
    repo = FakeNotifSettingsRepo()
    app.dependency_overrides[get_otp_service] = lambda: otp
    app.dependency_overrides[get_session_service] = lambda: sessions
    app.dependency_overrides[get_user_repo] = lambda: users
    app.dependency_overrides[get_notif_settings_service] = lambda: NotifSettingsService(repo)
    yield app, repo


def _login(app: FastAPI, repo: FakeNotifSettingsRepo) -> TestClient:
    client = TestClient(app)
    client.post("/api/auth/otp/request", json={"phone": PHONE})
    client.post("/api/auth/otp/verify", json={"phone": PHONE, "code": CODE})
    repo.seed(client.get("/api/me").json()["data"]["user"]["id"])
    return client


def test_defaults(ctx: tuple[FastAPI, FakeNotifSettingsRepo]) -> None:
    app, repo = ctx
    client = _login(app, repo)
    s = client.get("/api/me/notifications").json()["data"]["settings"]
    assert s == {"deals": True, "messages": True, "marketing": False}


def test_opt_into_marketing_and_off_messages(ctx: tuple[FastAPI, FakeNotifSettingsRepo]) -> None:
    app, repo = ctx
    client = _login(app, repo)
    resp = client.patch("/api/me/notifications", json={"marketing": True, "messages": False})
    assert resp.status_code == 200
    s = resp.json()["data"]["settings"]
    assert s["marketing"] is True and s["messages"] is False
    assert s["deals"] is True  # critical category unaffected


def test_requires_auth(ctx: tuple[FastAPI, FakeNotifSettingsRepo]) -> None:
    app, _repo = ctx
    assert TestClient(app).get("/api/me/notifications").status_code == 401


def test_rejects_unknown_field(ctx: tuple[FastAPI, FakeNotifSettingsRepo]) -> None:
    app, repo = ctx
    client = _login(app, repo)
    # 'deals' is not a settable field (extra='forbid').
    assert client.patch("/api/me/notifications", json={"deals": False}).status_code == 422
