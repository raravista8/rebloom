"""Support endpoints (T12.4, FR-092): user files a ticket; admin works the queue."""

from __future__ import annotations

from collections.abc import Iterator

import pytest
from app.api.auth import get_otp_service
from app.api.deps import get_session_service, get_user_repo
from app.api.support import get_support_service
from app.core.auth.service import OtpService
from app.core.auth.session import SessionService
from app.core.auth.totp import generate_totp
from app.core.support.service import SupportService
from app.main import create_app
from fastapi import FastAPI
from fastapi.testclient import TestClient

from tests.fakes import (
    FakeAuditLog,
    FakeClock,
    FakeOtpStore,
    FakeSessionStore,
    FakeSupportRepo,
    FakeUserRepository,
    RecordingSms,
)

CODE = "123456"
SECRET = "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ"  # public RFC 6238 vector


@pytest.fixture
def ctx() -> Iterator[tuple[FastAPI, FakeUserRepository, FakeSupportRepo]]:
    app = create_app()
    otp = OtpService(FakeOtpStore(FakeClock()), RecordingSms(), "s", code_factory=lambda: CODE)
    sessions = SessionService(FakeSessionStore())
    users = FakeUserRepository()
    repo = FakeSupportRepo()
    svc = SupportService(repo, FakeAuditLog())
    app.dependency_overrides[get_otp_service] = lambda: otp
    app.dependency_overrides[get_session_service] = lambda: sessions
    app.dependency_overrides[get_user_repo] = lambda: users
    app.dependency_overrides[get_support_service] = lambda: svc
    yield app, users, repo


def _login(app: FastAPI, phone: str) -> TestClient:
    client = TestClient(app)
    client.post("/api/auth/otp/request", json={"phone": phone})
    client.post("/api/auth/otp/verify", json={"phone": phone, "code": CODE})
    return client


def test_user_opens_ticket(ctx: tuple[FastAPI, FakeUserRepository, FakeSupportRepo]) -> None:
    app, _users, _repo = ctx
    client = _login(app, "+79161112233")
    resp = client.post("/api/support/tickets", json={"category": "payment", "body": "сбой"})
    assert resp.status_code == 200
    assert resp.json()["data"]["ticket_id"]


def test_bad_category(ctx: tuple[FastAPI, FakeUserRepository, FakeSupportRepo]) -> None:
    app, _users, _repo = ctx
    client = _login(app, "+79161112233")
    resp = client.post("/api/support/tickets", json={"category": "ufo", "body": "x"})
    assert resp.status_code == 422  # validation_error


def test_admin_queue_and_resolve(
    ctx: tuple[FastAPI, FakeUserRepository, FakeSupportRepo],
) -> None:
    app, users, repo = ctx
    repo.create("u9", "deal", "не получил букет")

    admin = _login(app, "+79990001122")
    uid = admin.get("/api/me").json()["data"]["user"]["id"]
    users.make_admin(uid, SECRET)
    admin.post("/api/admin/2fa/verify", json={"code": generate_totp(SECRET)})

    queue = admin.get("/api/admin/support/tickets")
    assert queue.status_code == 200
    items = queue.json()["data"]["items"]
    assert len(items) == 1 and "sla_overdue" in items[0]
    tid = items[0]["id"]

    resolved = admin.post(f"/api/admin/support/tickets/{tid}/resolve", json={"reason": "решено"})
    assert resolved.status_code == 200
    assert repo._tickets[tid]["status"] == "resolved"
