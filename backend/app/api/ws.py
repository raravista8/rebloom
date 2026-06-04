"""Realtime WebSocket: deal status + chat fan-out (API_CONTRACT §8, FR-030).

Receive-only stream — the client subscribes here and still POSTs messages over
REST (which publishes to the same channel). Degrades to polling ``GET /deals/{id}``
if the socket drops. Party-only (T-06): the session cookie must resolve to a
buyer/seller of the deal.
"""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, WebSocket

from app.api.deps import SESSION_COOKIE, SessionServiceDep
from app.core.deals.chat import DealPartyReader
from app.core.realtime.ports import deal_channel
from app.infrastructure.postgres.deals_repo import PostgresDealRepository
from app.infrastructure.realtime import RealtimeSubscription

router = APIRouter(tags=["ws"])

# Application-level close codes (4000–4999 is reserved for app use).
WS_UNAUTHORIZED = 4401
WS_FORBIDDEN = 4403


def get_party_reader() -> DealPartyReader:
    return PostgresDealRepository()


PartyReaderDep = Annotated[DealPartyReader, Depends(get_party_reader)]


@router.websocket("/api/ws/deals/{deal_id}")
async def deal_ws(
    websocket: WebSocket,
    deal_id: str,
    session_service: SessionServiceDep,
    reader: PartyReaderDep,
) -> None:
    await websocket.accept()

    token = websocket.cookies.get(SESSION_COOKIE)
    user_id = session_service.resolve(token) if token else None
    if user_id is None:
        await websocket.close(code=WS_UNAUTHORIZED)
        return

    parties = reader.parties(deal_id)
    if parties is None or user_id not in parties:  # IDOR guard (T-06)
        await websocket.close(code=WS_FORBIDDEN)
        return

    try:
        async with RealtimeSubscription(deal_channel(deal_id)) as subscription:
            # Subscription is live now → safe to announce readiness (no publish race).
            await websocket.send_json({"type": "connected", "deal_id": deal_id})
            async for message in subscription:
                await websocket.send_json(message)
    except Exception:
        return  # client disconnected / send failed → end the stream
