"""Likes are idempotent per user per listing (FR-015)."""

from __future__ import annotations

from collections.abc import Iterator

import pytest
from app.api.auth import get_otp_service
from app.api.deps import get_session_service, get_user_repo
from app.api.listings import get_like_service
from app.core.auth.service import OtpService
from app.core.auth.session import SessionService
from app.core.likes.service import LikeService
from app.main import create_app
from fastapi import FastAPI
from fastapi.testclient import TestClient

from tests.fakes import (
    FakeClock,
    FakeLikeRepository,
    FakeOtpStore,
    FakeSessionStore,
    FakeUserRepository,
    RecordingSms,
)

PHONE = "+79161234567"
CODE = "123456"
LISTING = "listing-1"


@pytest.fixture
def ctx() -> Iterator[tuple[FastAPI, FakeLikeRepository]]:
    app = create_app()
    otp = OtpService(FakeOtpStore(FakeClock()), RecordingSms(), "s", code_factory=lambda: CODE)
    likes = FakeLikeRepository()
    likes.seed_listing(LISTING)
    sessions = SessionService(FakeSessionStore())  # shared across requests
    users = FakeUserRepository()
    app.dependency_overrides[get_otp_service] = lambda: otp
    app.dependency_overrides[get_session_service] = lambda: sessions
    app.dependency_overrides[get_user_repo] = lambda: users
    app.dependency_overrides[get_like_service] = lambda: LikeService(likes)
    yield app, likes


def _login(app: FastAPI) -> TestClient:
    client = TestClient(app)
    client.post("/api/auth/otp/request", json={"phone": PHONE})
    client.post("/api/auth/otp/verify", json={"phone": PHONE, "code": CODE})
    return client


def test_like_is_idempotent(ctx: tuple[FastAPI, FakeLikeRepository]) -> None:
    app, _likes = ctx
    client = _login(app)
    first = client.post(f"/api/listings/{LISTING}/like")
    assert first.status_code == 200
    assert first.json()["data"] == {"like_count": 1, "liked": True}
    # liking again must not double-count
    again = client.post(f"/api/listings/{LISTING}/like")
    assert again.json()["data"] == {"like_count": 1, "liked": True}


def test_unlike_decrements(ctx: tuple[FastAPI, FakeLikeRepository]) -> None:
    app, _likes = ctx
    client = _login(app)
    client.post(f"/api/listings/{LISTING}/like")
    resp = client.delete(f"/api/listings/{LISTING}/like")
    assert resp.json()["data"] == {"like_count": 0, "liked": False}


def test_like_unknown_listing_404(ctx: tuple[FastAPI, FakeLikeRepository]) -> None:
    app, _likes = ctx
    client = _login(app)
    resp = client.post("/api/listings/listing-404/like")
    assert resp.status_code == 404


def test_like_requires_auth(ctx: tuple[FastAPI, FakeLikeRepository]) -> None:
    app, _likes = ctx
    resp = TestClient(app).post(f"/api/listings/{LISTING}/like")
    assert resp.status_code == 401
