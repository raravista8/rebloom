"""Mutual reviews + profile (API_CONTRACT §5, FR-040/042)."""

from __future__ import annotations

from collections.abc import Iterator

import pytest
from app.api.auth import get_otp_service
from app.api.deps import get_session_service, get_user_repo
from app.api.reviews import get_review_service
from app.core.auth.service import OtpService
from app.core.auth.session import SessionService
from app.core.moderation.lexicon import build_lexicon
from app.core.moderation.service import ModerationService
from app.core.reviews.service import ReviewService
from app.main import create_app
from fastapi import FastAPI
from fastapi.testclient import TestClient

from tests.fakes import (
    FakeClock,
    FakeDealRepository,
    FakeOtpStore,
    FakeReviewRepository,
    FakeSessionStore,
    FakeUserRepository,
    RecordingSms,
)

CODE = "123456"


@pytest.fixture
def ctx() -> Iterator[tuple[FastAPI, FakeDealRepository]]:
    app = create_app()
    otp = OtpService(FakeOtpStore(FakeClock()), RecordingSms(), "s", code_factory=lambda: CODE)
    sessions = SessionService(FakeSessionStore())
    users = FakeUserRepository()
    deals = FakeDealRepository()
    lexicon = build_lexicon(
        profanity=[],
        hate_slurs=[],
        banned_terms=["барахолка"],
        contact_patterns=[r"@[a-zа-я0-9_]{3,}"],
    )
    moderation = ModerationService(lexicon)
    reviews = FakeReviewRepository()  # shared across requests
    app.dependency_overrides[get_otp_service] = lambda: otp
    app.dependency_overrides[get_session_service] = lambda: sessions
    app.dependency_overrides[get_user_repo] = lambda: users
    app.dependency_overrides[get_review_service] = lambda: ReviewService(reviews, deals, moderation)
    yield app, deals


def _login(app: FastAPI, phone: str) -> tuple[TestClient, str]:
    client = TestClient(app)
    client.post("/api/auth/otp/request", json={"phone": phone})
    client.post("/api/auth/otp/verify", json={"phone": phone, "code": CODE})
    uid: str = client.get("/api/me").json()["data"]["user"]["id"]
    return client, uid


def test_clean_review_is_visible(ctx: tuple[FastAPI, FakeDealRepository]) -> None:
    app, deals = ctx
    buyer, uid = _login(app, "+79161112233")
    deal_id = deals.seed_released(uid, "seller-x")
    resp = buyer.post(
        f"/api/deals/{deal_id}/review", json={"score": 5, "text": "Свежий букет, спасибо!"}
    )
    assert resp.status_code == 200
    assert resp.json()["data"]["moderation_status"] == "visible"


def test_contact_in_review_blocked(ctx: tuple[FastAPI, FakeDealRepository]) -> None:
    app, deals = ctx
    buyer, uid = _login(app, "+79161112233")
    deal_id = deals.seed_released(uid, "seller-x")
    resp = buyer.post(
        f"/api/deals/{deal_id}/review", json={"score": 5, "text": "пишите @ivan_petrov"}
    )
    assert resp.status_code == 422
    assert resp.json()["error"] == "content_blocked"


def test_banned_term_review_held(ctx: tuple[FastAPI, FakeDealRepository]) -> None:
    app, deals = ctx
    buyer, uid = _login(app, "+79161112233")
    deal_id = deals.seed_released(uid, "seller-x")
    resp = buyer.post(
        f"/api/deals/{deal_id}/review", json={"score": 4, "text": "нашёл на барахолка"}
    )
    assert resp.status_code == 200
    assert resp.json()["data"]["moderation_status"] == "held"


def test_non_party_forbidden(ctx: tuple[FastAPI, FakeDealRepository]) -> None:
    app, deals = ctx
    _buyer, uid = _login(app, "+79161112233")
    deal_id = deals.seed_released(uid, "seller-x")
    stranger, _sid = _login(app, "+79165556677")
    resp = stranger.post(f"/api/deals/{deal_id}/review", json={"score": 1, "text": "плохо"})
    assert resp.status_code == 403


def test_not_released_conflict(ctx: tuple[FastAPI, FakeDealRepository]) -> None:
    app, deals = ctx
    buyer, uid = _login(app, "+79161112233")
    deal = deals.create_and_reserve(
        buyer_id=uid,
        listing_id="L",
        seller_id="seller-x",
        amount_kopecks=100000,
        commission_kopecks=10000,
        delivery_method="self_pickup",
    )
    resp = buyer.post(f"/api/deals/{deal.id}/review", json={"score": 5, "text": "ok"})  # type: ignore[attr-defined]
    assert resp.status_code == 409


def test_double_review_conflict(ctx: tuple[FastAPI, FakeDealRepository]) -> None:
    app, deals = ctx
    buyer, uid = _login(app, "+79161112233")
    deal_id = deals.seed_released(uid, "seller-x")
    assert (
        buyer.post(f"/api/deals/{deal_id}/review", json={"score": 5, "text": "ok"}).status_code
        == 200
    )
    again = buyer.post(f"/api/deals/{deal_id}/review", json={"score": 4, "text": "again"})
    assert again.status_code == 409


def test_profile_lists_reviews(ctx: tuple[FastAPI, FakeDealRepository]) -> None:
    app, deals = ctx
    buyer, buyer_id = _login(app, "+79161112233")
    _seller, seller_id = _login(app, "+79167778899")
    deal_id = deals.seed_released(buyer_id, seller_id)
    buyer.post(f"/api/deals/{deal_id}/review", json={"score": 5, "text": "Отличный продавец"})

    profile = buyer.get(f"/api/users/{seller_id}")
    assert profile.status_code == 200
    data = profile.json()["data"]
    assert data["user"]["id"] == seller_id
    assert len(data["reviews"]) == 1 and data["reviews"][0]["score"] == 5


def test_profile_unknown_user_404(ctx: tuple[FastAPI, FakeDealRepository]) -> None:
    app, _deals = ctx
    client, _uid = _login(app, "+79161112233")
    assert client.get("/api/users/00000000-0000-0000-0000-000000009999").status_code == 404
