"""Pre-purchase listing chat endpoints (T6.3, API_CONTRACT, FR-030)."""

from __future__ import annotations

from collections.abc import Iterator

import pytest
from app.api.auth import get_otp_service
from app.api.deps import get_session_service, get_user_repo
from app.api.listing_chat import get_listing_chat_service
from app.core.auth.service import OtpService
from app.core.auth.session import SessionService
from app.core.listings.chat import ListingChatService
from app.core.moderation.lexicon import build_lexicon
from app.core.moderation.service import ModerationService
from app.main import create_app
from fastapi import FastAPI
from fastapi.testclient import TestClient

from tests.fakes import (
    FakeClock,
    FakeListingChatRepo,
    FakeListingSellerReader,
    FakeOtpStore,
    FakeRateLimiter,
    FakeSessionStore,
    FakeUserRepository,
    RecordingSms,
)

CODE = "123456"
LEXICON = build_lexicon(
    profanity=[], hate_slurs=[], banned_terms=[], contact_patterns=[r"@[a-z0-9_]{3,}"]
)


@pytest.fixture
def ctx() -> Iterator[tuple[FastAPI, FakeListingSellerReader]]:
    app = create_app()
    otp = OtpService(FakeOtpStore(FakeClock()), RecordingSms(), "s", code_factory=lambda: CODE)
    sessions = SessionService(FakeSessionStore())
    users = FakeUserRepository()
    sellers = FakeListingSellerReader()
    chat = FakeListingChatRepo()
    svc = ListingChatService(sellers, chat, ModerationService(LEXICON), FakeRateLimiter())
    app.dependency_overrides[get_otp_service] = lambda: otp
    app.dependency_overrides[get_session_service] = lambda: sessions
    app.dependency_overrides[get_user_repo] = lambda: users
    app.dependency_overrides[get_listing_chat_service] = lambda: svc
    yield app, sellers


def _login(app: FastAPI, phone: str) -> tuple[TestClient, str]:
    client = TestClient(app)
    client.post("/api/auth/otp/request", json={"phone": phone})
    client.post("/api/auth/otp/verify", json={"phone": phone, "code": CODE})
    return client, client.get("/api/me").json()["data"]["user"]["id"]


def test_buyer_posts_and_reads_own_thread(ctx: tuple[FastAPI, FakeListingSellerReader]) -> None:
    app, sellers = ctx
    buyer, bid = _login(app, "+79161112233")
    sellers.seed("L", "seller-x")

    resp = buyer.post("/api/listings/L/messages", json={"body": "ещё актуально?"})
    assert resp.status_code == 200
    assert resp.json()["data"]["message"]["mine"] is True

    listed = buyer.get("/api/listings/L/messages")
    assert listed.status_code == 200
    assert len(listed.json()["data"]["messages"]) == 1


def test_contact_is_held(ctx: tuple[FastAPI, FakeListingSellerReader]) -> None:
    app, sellers = ctx
    buyer, _bid = _login(app, "+79161112233")
    sellers.seed("L", "seller-x")
    resp = buyer.post("/api/listings/L/messages", json={"body": "мой тг @prodavec_flowers"})
    assert resp.status_code == 200
    assert resp.json()["data"]["message"]["held"] is True


def test_seller_reply_needs_buyer_id(ctx: tuple[FastAPI, FakeListingSellerReader]) -> None:
    app, sellers = ctx
    seller, sid = _login(app, "+79990001122")
    sellers.seed("L", sid)  # this user is the seller
    resp = seller.post("/api/listings/L/messages", json={"body": "здравствуйте"})
    assert resp.status_code == 422  # buyer_id required → validation_error


def test_requires_auth(ctx: tuple[FastAPI, FakeListingSellerReader]) -> None:
    app, _sellers = ctx
    assert TestClient(app).post("/api/listings/L/messages", json={"body": "x"}).status_code == 401
