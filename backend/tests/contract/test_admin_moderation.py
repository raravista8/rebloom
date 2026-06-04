"""Admin moderation queue endpoints (T10.1b, FR-060/061, API_CONTRACT §6).

2FA-gated: list pending listings / held reviews, approve/reject with a reason.
"""

from __future__ import annotations

from collections.abc import Iterator

import pytest
from app.api.admin import get_moderation_service
from app.api.auth import get_otp_service
from app.api.deps import get_session_service, get_user_repo
from app.core.admin.moderation import ModerationQueueService
from app.core.auth.service import OtpService
from app.core.auth.session import SessionService
from app.core.auth.totp import generate_totp
from app.main import create_app
from fastapi import FastAPI
from fastapi.testclient import TestClient

from tests.fakes import (
    FakeAuditLog,
    FakeClock,
    FakeModerationQueueRepo,
    FakeOtpStore,
    FakeSessionStore,
    FakeUserRepository,
    RecordingSms,
)

CODE = "123456"
SECRET = "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ"  # public RFC 6238 vector


@pytest.fixture
def ctx() -> Iterator[tuple[FastAPI, FakeModerationQueueRepo, FakeUserRepository, FakeAuditLog]]:
    app = create_app()
    otp = OtpService(FakeOtpStore(FakeClock()), RecordingSms(), "s", code_factory=lambda: CODE)
    sessions = SessionService(FakeSessionStore())
    users = FakeUserRepository()
    repo = FakeModerationQueueRepo()
    audit = FakeAuditLog()
    app.dependency_overrides[get_otp_service] = lambda: otp
    app.dependency_overrides[get_session_service] = lambda: sessions
    app.dependency_overrides[get_user_repo] = lambda: users
    app.dependency_overrides[get_moderation_service] = lambda: ModerationQueueService(repo, audit)
    yield app, repo, users, audit


def _admin(app: FastAPI, users: FakeUserRepository) -> TestClient:
    client = TestClient(app)
    client.post("/api/auth/otp/request", json={"phone": "+79990001122"})
    client.post("/api/auth/otp/verify", json={"phone": "+79990001122", "code": CODE})
    uid = client.get("/api/me").json()["data"]["user"]["id"]
    users.make_admin(uid, SECRET)
    client.post("/api/admin/2fa/verify", json={"code": generate_totp(SECRET)})
    return client


def test_queue_requires_2fa(ctx) -> None:  # type: ignore[no-untyped-def]
    app, repo, users, _audit = ctx
    repo.seed_listing("L1")
    # Logged-in admin but no 2FA yet.
    client = TestClient(app)
    client.post("/api/auth/otp/request", json={"phone": "+79990001122"})
    client.post("/api/auth/otp/verify", json={"phone": "+79990001122", "code": CODE})
    uid = client.get("/api/me").json()["data"]["user"]["id"]
    users.make_admin(uid, SECRET)
    assert client.get("/api/admin/moderation/queue?type=listing").status_code == 403


def test_queue_lists_pending(ctx) -> None:  # type: ignore[no-untyped-def]
    app, repo, users, _audit = ctx
    repo.seed_listing("L1")
    repo.seed_listing("L2")
    admin = _admin(app, users)
    resp = admin.get("/api/admin/moderation/queue?type=listing")
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert {i["id"] for i in data["items"]} == {"L1", "L2"}
    assert data["next_cursor"] is None


def test_queue_empty_is_distinct(ctx) -> None:  # type: ignore[no-untyped-def]
    app, _repo, users, _audit = ctx
    admin = _admin(app, users)
    resp = admin.get("/api/admin/moderation/queue?type=review")
    assert resp.status_code == 200
    assert resp.json()["data"]["items"] == []


def test_approve_listing(ctx) -> None:  # type: ignore[no-untyped-def]
    app, repo, users, audit = ctx
    repo.seed_listing("L1")
    admin = _admin(app, users)
    resp = admin.post(
        "/api/admin/moderation/L1", json={"type": "listing", "action": "approve", "reason": "ok"}
    )
    assert resp.status_code == 200
    assert resp.json()["data"]["status"] == "active"
    assert any(e["action"] == "moderation.listing.approve" for e in audit.entries)


def test_decide_requires_reason(ctx) -> None:  # type: ignore[no-untyped-def]
    app, repo, users, _audit = ctx
    repo.seed_listing("L1")
    admin = _admin(app, users)
    resp = admin.post(
        "/api/admin/moderation/L1", json={"type": "listing", "action": "approve", "reason": ""}
    )
    assert resp.status_code == 422


def test_decide_missing_item_conflicts(ctx) -> None:  # type: ignore[no-untyped-def]
    app, _repo, users, _audit = ctx
    admin = _admin(app, users)
    resp = admin.post(
        "/api/admin/moderation/ghost", json={"type": "review", "action": "reject", "reason": "x"}
    )
    assert resp.status_code == 409
