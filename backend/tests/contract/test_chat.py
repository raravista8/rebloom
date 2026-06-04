"""Deal chat endpoints (T6.1, API_CONTRACT §4): party-only; contacts held (T-05)."""

from __future__ import annotations

from collections.abc import Iterator

import pytest
from app.api.auth import get_otp_service
from app.api.chat import get_chat_service
from app.api.deps import get_session_service, get_user_repo
from app.core.auth.service import OtpService
from app.core.auth.session import SessionService
from app.core.deals.chat import ChatService
from app.core.moderation.lexicon import build_lexicon
from app.core.moderation.service import ModerationService
from app.main import create_app
from fastapi import FastAPI
from fastapi.testclient import TestClient

from tests.fakes import (
    FakeChatRepository,
    FakeClock,
    FakeDealPartyReader,
    FakeOtpStore,
    FakeSessionStore,
    FakeUserRepository,
    RecordingSms,
)

CODE = "123456"
PHONE_RE = r"(?:\+?7|8)[\s\-(]*\d{3}[\s\-)]*\d{3}[\s\-]*\d{2}[\s\-]*\d{2}"
LEXICON = build_lexicon(
    profanity=[], hate_slurs=[], banned_terms=[], contact_patterns=[r"@[a-zа-я0-9_]{3,}", PHONE_RE]
)
DEAL = "D1"


@pytest.fixture
def ctx() -> Iterator[tuple[FastAPI, FakeDealPartyReader]]:
    app = create_app()
    otp = OtpService(FakeOtpStore(FakeClock()), RecordingSms(), "s", code_factory=lambda: CODE)
    sessions = SessionService(FakeSessionStore())
    users = FakeUserRepository()
    deals = FakeDealPartyReader()
    chat = FakeChatRepository()
    app.dependency_overrides[get_otp_service] = lambda: otp
    app.dependency_overrides[get_session_service] = lambda: sessions
    app.dependency_overrides[get_user_repo] = lambda: users
    app.dependency_overrides[get_chat_service] = lambda: ChatService(
        deals, chat, ModerationService(LEXICON)
    )
    yield app, deals


def _login(app: FastAPI, phone: str) -> tuple[TestClient, str]:
    client = TestClient(app)
    client.post("/api/auth/otp/request", json={"phone": phone})
    client.post("/api/auth/otp/verify", json={"phone": phone, "code": CODE})
    return client, client.get("/api/me").json()["data"]["user"]["id"]


def test_party_chat_roundtrip(ctx: tuple[FastAPI, FakeDealPartyReader]) -> None:
    app, deals = ctx
    buyer, bid = _login(app, "+79161112233")
    seller, sid = _login(app, "+79165556677")
    deals.seed(DEAL, bid, sid)

    posted = buyer.post(f"/api/deals/{DEAL}/messages", json={"body": "ещё доступен?"})
    assert posted.status_code == 200
    assert posted.json()["data"]["message"]["status"] == "visible"

    seen = seller.get(f"/api/deals/{DEAL}/messages")
    assert seen.status_code == 200
    data = seen.json()["data"]
    assert [m["body"] for m in data["messages"]] == ["ещё доступен?"]
    assert data["next_cursor"] is None


def test_contact_message_held_and_hidden(ctx: tuple[FastAPI, FakeDealPartyReader]) -> None:
    app, deals = ctx
    buyer, bid = _login(app, "+79161112233")
    seller, sid = _login(app, "+79165556677")
    deals.seed(DEAL, bid, sid)

    posted = seller.post(f"/api/deals/{DEAL}/messages", json={"body": "звоните +7 916 123 45 67"})
    assert posted.status_code == 200
    assert posted.json()["data"]["message"]["held"] is True

    # Buyer (counterparty) does not receive the held message.
    buyer_msgs = buyer.get(f"/api/deals/{DEAL}/messages").json()["data"]["messages"]
    assert buyer_msgs == []


def test_non_party_forbidden(ctx: tuple[FastAPI, FakeDealPartyReader]) -> None:
    app, deals = ctx
    buyer, bid = _login(app, "+79161112233")
    _seller, sid = _login(app, "+79165556677")
    deals.seed(DEAL, bid, sid)

    stranger, _xid = _login(app, "+79991110000")
    assert stranger.get(f"/api/deals/{DEAL}/messages").status_code == 403
    assert stranger.post(f"/api/deals/{DEAL}/messages", json={"body": "hi"}).status_code == 403


def test_empty_body_rejected(ctx: tuple[FastAPI, FakeDealPartyReader]) -> None:
    app, deals = ctx
    buyer, bid = _login(app, "+79161112233")
    deals.seed(DEAL, bid, "seller-x")
    assert buyer.post(f"/api/deals/{DEAL}/messages", json={"body": ""}).status_code == 422
