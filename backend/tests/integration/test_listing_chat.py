"""T6.3 — pre-purchase chat repo + WS thread against real Postgres/Redis."""

from __future__ import annotations

import secrets
import uuid
from collections.abc import Iterator
from datetime import UTC, datetime, timedelta

import pytest
from app.api.deps import get_session_service
from app.api.ws import WS_FORBIDDEN, get_seller_reader
from app.core.auth.session import SessionService
from app.core.realtime.ports import listing_thread_channel
from app.infrastructure.postgres.engine import writer_session
from app.infrastructure.postgres.listing_chat_repo import (
    PostgresListingChatRepository,
    PostgresListingSellerReader,
)
from app.infrastructure.postgres.models import Listing
from app.infrastructure.postgres.users_repo import PostgresUserRepository
from app.infrastructure.realtime import RedisRealtimeBus
from app.main import create_app
from fastapi import FastAPI
from fastapi.testclient import TestClient
from starlette.websockets import WebSocketDisconnect

from tests.fakes import FakeListingSellerReader, FakeSessionStore

pytestmark = pytest.mark.integration


def _phone() -> str:
    return f"+79{secrets.randbelow(10**9):09d}"


def _listing(seller_id: str) -> str:
    with writer_session() as session:
        row = Listing(
            seller_id=uuid.UUID(seller_id),
            size="M",
            freshness="today",
            price_kopecks=50000,
            city_id="msk",
            status="active",
            freshness_score=0,
            expires_at=datetime.now(UTC) + timedelta(days=1),
        )
        session.add(row)
        session.flush()
        return str(row.id)


def test_repo_thread_roundtrip() -> None:
    users = PostgresUserRepository()
    seller = users.get_or_create_by_phone(_phone())
    buyer = users.get_or_create_by_phone(_phone())
    lid = _listing(seller.id)

    assert PostgresListingSellerReader().seller_of(lid) == seller.id
    repo = PostgresListingChatRepository()
    repo.add(lid, buyer.id, buyer.id, "ещё актуально?", "visible")
    repo.add(lid, buyer.id, seller.id, "да, берите", "visible")

    messages, _cursor = repo.list_thread(lid, buyer.id, None, 50)
    assert [m.sender_id for m in messages] == [buyer.id, seller.id]


@pytest.fixture
def app() -> Iterator[FastAPI]:
    application = create_app()
    store = FakeSessionStore()
    store.save("buyer-token", "buyerX", 3600)
    store.save("stranger-token", "stranger", 3600)
    reader = FakeListingSellerReader()
    reader.seed("L9", "sellerX")
    application.dependency_overrides[get_session_service] = lambda: SessionService(store)
    application.dependency_overrides[get_seller_reader] = lambda: reader
    yield application


def test_ws_thread_buyer_receives(app: FastAPI) -> None:
    client = TestClient(app)
    client.cookies.set("session", "buyer-token")
    with client.websocket_connect("/api/ws/listings/L9/threads/buyerX") as ws:
        assert ws.receive_json()["type"] == "connected"
        RedisRealtimeBus().publish(
            listing_thread_channel("L9", "buyerX"), {"type": "listing_message", "x": 1}
        )
        assert ws.receive_json()["type"] == "listing_message"


def test_ws_thread_non_party_forbidden(app: FastAPI) -> None:
    client = TestClient(app)
    client.cookies.set("session", "stranger-token")  # neither seller nor the buyer
    with (
        pytest.raises(WebSocketDisconnect) as exc,
        client.websocket_connect("/api/ws/listings/L9/threads/buyerX") as ws,
    ):
        ws.receive_json()
    assert exc.value.code == WS_FORBIDDEN
