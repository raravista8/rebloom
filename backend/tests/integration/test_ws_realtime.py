"""T6.1b — WS realtime against real Redis: a party connects, gets ``connected``,
then receives an event published to the deal channel. Auth/party are faked; the
pub/sub path is real (so this is an integration test)."""

from __future__ import annotations

from collections.abc import Iterator

import pytest
from app.api.deps import get_session_service
from app.api.ws import WS_FORBIDDEN, WS_UNAUTHORIZED, get_party_reader
from app.core.auth.session import SessionService
from app.core.realtime.ports import deal_channel
from app.infrastructure.realtime import RedisRealtimeBus
from app.main import create_app
from fastapi import FastAPI
from fastapi.testclient import TestClient
from starlette.websockets import WebSocketDisconnect

from tests.fakes import FakeDealPartyReader, FakeSessionStore

pytestmark = pytest.mark.integration

DEAL = "ws-deal-1"


@pytest.fixture
def app() -> Iterator[FastAPI]:
    application = create_app()
    store = FakeSessionStore()
    store.save("buyer-token", "buyer", 3600)
    store.save("stranger-token", "stranger", 3600)  # valid session, not a party
    sessions = SessionService(store)
    reader = FakeDealPartyReader()
    reader.seed(DEAL, "buyer", "seller")
    application.dependency_overrides[get_session_service] = lambda: sessions
    application.dependency_overrides[get_party_reader] = lambda: reader
    yield application


def test_party_receives_published_event(app: FastAPI) -> None:
    client = TestClient(app)
    client.cookies.set("session", "buyer-token")
    with client.websocket_connect(f"/api/ws/deals/{DEAL}") as ws:
        assert ws.receive_json() == {"type": "connected", "deal_id": DEAL}
        # Publish on the real Redis channel; the live subscription forwards it.
        RedisRealtimeBus().publish(
            deal_channel(DEAL), {"type": "status", "deal_id": DEAL, "status": "paid_held"}
        )
        event = ws.receive_json()
        assert event["type"] == "status" and event["status"] == "paid_held"


def test_no_session_is_rejected(app: FastAPI) -> None:
    client = TestClient(app)  # no cookie
    with (
        pytest.raises(WebSocketDisconnect) as exc,
        client.websocket_connect(f"/api/ws/deals/{DEAL}") as ws,
    ):
        ws.receive_json()
    assert exc.value.code == WS_UNAUTHORIZED


def test_non_party_is_forbidden(app: FastAPI) -> None:
    client = TestClient(app)
    client.cookies.set("session", "stranger-token")  # resolves, but not a party
    with (
        pytest.raises(WebSocketDisconnect) as exc,
        client.websocket_connect(f"/api/ws/deals/{DEAL}") as ws,
    ):
        ws.receive_json()
    assert exc.value.code == WS_FORBIDDEN
