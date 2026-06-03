"""Consent capture (FR-004, ФЗ-152) — auth-gated, versioned, channel-tagged."""

from __future__ import annotations

import pytest
from app.api.auth import get_otp_service
from app.api.consent import get_consent_repo
from app.api.deps import get_session_service, get_user_repo
from app.core.auth.service import OtpService
from app.core.auth.session import SessionService
from app.main import create_app
from fastapi import FastAPI
from fastapi.testclient import TestClient

from tests.fakes import (
    FakeClock,
    FakeConsentRepository,
    FakeOtpStore,
    FakeSessionStore,
    FakeUserRepository,
    RecordingSms,
)

PHONE = "+79161234567"
CODE = "123456"


@pytest.fixture
def app_and_consents() -> tuple[FastAPI, FakeConsentRepository]:
    app = create_app()
    otp = OtpService(FakeOtpStore(FakeClock()), RecordingSms(), "s", code_factory=lambda: CODE)
    # Shared singletons: the session created during verify must be visible to the
    # later /api/consent request (same store + same user repo instance).
    sessions = SessionService(FakeSessionStore())
    users = FakeUserRepository()
    consents = FakeConsentRepository()
    app.dependency_overrides[get_otp_service] = lambda: otp
    app.dependency_overrides[get_session_service] = lambda: sessions
    app.dependency_overrides[get_user_repo] = lambda: users
    app.dependency_overrides[get_consent_repo] = lambda: consents
    return app, consents


def _login(app: FastAPI) -> TestClient:
    client = TestClient(app)
    client.post("/api/auth/otp/request", json={"phone": PHONE})
    client.post("/api/auth/otp/verify", json={"phone": PHONE, "code": CODE})
    return client


def test_consent_requires_auth(app_and_consents: tuple[FastAPI, FakeConsentRepository]) -> None:
    app, _consents = app_and_consents
    resp = TestClient(app).post("/api/consent", json={"policy_version": "v1"})
    assert resp.status_code == 401
    assert resp.json()["error"] == "unauthorized"


def test_consent_recorded(app_and_consents: tuple[FastAPI, FakeConsentRepository]) -> None:
    app, consents = app_and_consents
    client = _login(app)
    resp = client.post("/api/consent", json={"policy_version": "2026-06-03"})
    assert resp.status_code == 200
    assert resp.json()["data"]["accepted_at"]
    assert len(consents.calls) == 1
    _user_id, version, channel = consents.calls[0]
    assert version == "2026-06-03"
    assert channel == "web"  # default when no X-Platform header


def test_consent_uses_platform_header(
    app_and_consents: tuple[FastAPI, FakeConsentRepository],
) -> None:
    app, consents = app_and_consents
    client = _login(app)
    client.post("/api/consent", json={"policy_version": "v1"}, headers={"X-Platform": "ios"})
    assert consents.calls[-1][2] == "ios"


def test_consent_rejects_unknown_channel(
    app_and_consents: tuple[FastAPI, FakeConsentRepository],
) -> None:
    app, _consents = app_and_consents
    client = _login(app)
    resp = client.post(
        "/api/consent", json={"policy_version": "v1"}, headers={"X-Platform": "mars"}
    )
    assert resp.status_code == 422
    assert resp.json()["error"] == "validation_error"
