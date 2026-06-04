"""Report endpoints (T11.5, FR-064): user files a report; admin sees the queue."""

from __future__ import annotations

from collections.abc import Iterator

import pytest
from app.api.auth import get_otp_service
from app.api.deps import get_session_service, get_user_repo
from app.api.reports import get_report_service
from app.core.auth.service import OtpService
from app.core.auth.session import SessionService
from app.core.auth.totp import generate_totp
from app.core.moderation.reports import ReportService
from app.main import create_app
from fastapi import FastAPI
from fastapi.testclient import TestClient

from tests.fakes import (
    FakeClock,
    FakeOtpStore,
    FakeReportRepo,
    FakeSessionStore,
    FakeUserRepository,
    RecordingSms,
)

CODE = "123456"
SECRET = "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ"  # public RFC 6238 vector


@pytest.fixture
def ctx() -> Iterator[tuple[FastAPI, FakeUserRepository, FakeReportRepo]]:
    app = create_app()
    otp = OtpService(FakeOtpStore(FakeClock()), RecordingSms(), "s", code_factory=lambda: CODE)
    sessions = SessionService(FakeSessionStore())
    users = FakeUserRepository()
    repo = FakeReportRepo()
    svc = ReportService(repo)
    app.dependency_overrides[get_otp_service] = lambda: otp
    app.dependency_overrides[get_session_service] = lambda: sessions
    app.dependency_overrides[get_user_repo] = lambda: users
    app.dependency_overrides[get_report_service] = lambda: svc
    yield app, users, repo


def _login(app: FastAPI, phone: str) -> TestClient:
    client = TestClient(app)
    client.post("/api/auth/otp/request", json={"phone": phone})
    client.post("/api/auth/otp/verify", json={"phone": phone, "code": CODE})
    return client


def test_user_files_report(ctx: tuple[FastAPI, FakeUserRepository, FakeReportRepo]) -> None:
    app, _users, _repo = ctx
    client = _login(app, "+79161112233")
    resp = client.post(
        "/api/reports", json={"target_type": "listing", "target_id": "L1", "reason": "чужие фото"}
    )
    assert resp.status_code == 200
    assert resp.json()["data"]["report_id"]


def test_report_requires_auth(ctx: tuple[FastAPI, FakeUserRepository, FakeReportRepo]) -> None:
    app, _users, _repo = ctx
    resp = TestClient(app).post(
        "/api/reports", json={"target_type": "user", "target_id": "x", "reason": "y"}
    )
    assert resp.status_code == 401


def test_admin_sees_queue(ctx: tuple[FastAPI, FakeUserRepository, FakeReportRepo]) -> None:
    app, users, repo = ctx
    repo.create("u1", "user", "u2", "груб")

    admin = _login(app, "+79990001122")
    uid = admin.get("/api/me").json()["data"]["user"]["id"]
    users.make_admin(uid, SECRET)
    admin.post("/api/admin/2fa/verify", json={"code": generate_totp(SECRET)})

    resp = admin.get("/api/admin/reports")
    assert resp.status_code == 200
    assert len(resp.json()["data"]["items"]) == 1
