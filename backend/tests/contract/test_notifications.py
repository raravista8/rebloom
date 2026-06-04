"""Notifications read endpoint (T12.1a, API_CONTRACT §6, FR-050)."""

from __future__ import annotations

from collections.abc import Iterator

import pytest
from app.api.auth import get_otp_service
from app.api.deps import get_session_service, get_user_repo
from app.api.notifications import get_notification_service
from app.core.auth.service import OtpService
from app.core.auth.session import SessionService
from app.core.notifications.schemas import NotificationDraft
from app.core.notifications.service import NotificationService
from app.main import create_app
from fastapi import FastAPI
from fastapi.testclient import TestClient

from tests.fakes import (
    FakeClock,
    FakeNotificationOutbox,
    FakeOtpStore,
    FakeSessionStore,
    FakeUserRepository,
    RecordingSms,
)

CODE = "123456"
PHONE = "+79161234567"


@pytest.fixture
def ctx() -> Iterator[tuple[FastAPI, FakeNotificationOutbox]]:
    app = create_app()
    otp = OtpService(FakeOtpStore(FakeClock()), RecordingSms(), "s", code_factory=lambda: CODE)
    sessions = SessionService(FakeSessionStore())
    users = FakeUserRepository()
    outbox = FakeNotificationOutbox()
    app.dependency_overrides[get_otp_service] = lambda: otp
    app.dependency_overrides[get_session_service] = lambda: sessions
    app.dependency_overrides[get_user_repo] = lambda: users
    app.dependency_overrides[get_notification_service] = lambda: NotificationService(outbox)
    yield app, outbox


def _login(app: FastAPI) -> tuple[TestClient, str]:
    client = TestClient(app)
    client.post("/api/auth/otp/request", json={"phone": PHONE})
    client.post("/api/auth/otp/verify", json={"phone": PHONE, "code": CODE})
    return client, client.get("/api/me").json()["data"]["user"]["id"]


def test_list_shows_inapp_notifications(ctx: tuple[FastAPI, FakeNotificationOutbox]) -> None:
    app, outbox = ctx
    client, uid = _login(app)
    outbox.enqueue(
        NotificationDraft(
            event_id="e1",
            user_id=uid,
            kind="deal_status",
            title="Сделка оплачена",
            body="Деньги в эскроу",
            channels=("inapp", "push"),
        )
    )
    resp = client.get("/api/notifications")
    assert resp.status_code == 200
    items = resp.json()["data"]["items"]
    assert len(items) == 1  # push row is not shown in the in-app inbox
    assert items[0]["title"] == "Сделка оплачена"


def test_empty_inbox(ctx: tuple[FastAPI, FakeNotificationOutbox]) -> None:
    app, _outbox = ctx
    client, _uid = _login(app)
    resp = client.get("/api/notifications")
    assert resp.status_code == 200
    assert resp.json()["data"]["items"] == []


def test_requires_session(ctx: tuple[FastAPI, FakeNotificationOutbox]) -> None:
    app, _outbox = ctx
    assert TestClient(app).get("/api/notifications").status_code == 401
