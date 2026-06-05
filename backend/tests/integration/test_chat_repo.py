"""T6.1 — chat repo against real Postgres: held messages are hidden from the
counterparty but visible to their own sender (SECURITY T-05)."""

from __future__ import annotations

import secrets
import uuid
from datetime import UTC, datetime, timedelta

import pytest
from app.infrastructure.postgres.chat_repo import PostgresChatRepository
from app.infrastructure.postgres.engine import writer_session
from app.infrastructure.postgres.models import Deal, Listing
from app.infrastructure.postgres.users_repo import PostgresUserRepository

pytestmark = pytest.mark.integration


def _phone() -> str:
    return f"+79{secrets.randbelow(10**9):09d}"


def _seed_deal() -> tuple[str, str, str]:
    users = PostgresUserRepository()
    buyer = users.get_or_create_by_phone(_phone())
    seller = users.get_or_create_by_phone(_phone())
    with writer_session() as session:
        listing = Listing(
            seller_id=uuid.UUID(seller.id),
            size="M",
            freshness="today",
            price_kopecks=50000,
            city_id="msk",
            status="reserved",
            freshness_score=0,
            expires_at=datetime.now(UTC) + timedelta(days=1),
        )
        session.add(listing)
        session.flush()
        deal = Deal(
            listing_id=listing.id,
            buyer_id=uuid.UUID(buyer.id),
            seller_id=uuid.UUID(seller.id),
            amount_kopecks=50000,
            commission_kopecks=5000,
            status="meeting",
            delivery_method="self_pickup",
        )
        session.add(deal)
        session.flush()
        return str(deal.id), buyer.id, seller.id


def test_held_message_visibility() -> None:
    deal_id, buyer_id, seller_id = _seed_deal()
    repo = PostgresChatRepository()
    repo.add(deal_id, buyer_id, "привет, заберу сегодня", "visible")
    repo.add(deal_id, seller_id, "мой номер 89161234567", "held")

    # Buyer (counterparty to the held message) sees only the visible one.
    buyer_msgs, _ = repo.list_visible_to(deal_id, buyer_id, None, 50)
    assert [m.body for m in buyer_msgs] == ["привет, заберу сегодня"]

    # Seller sees both — their own held message is flagged.
    seller_msgs, _ = repo.list_visible_to(deal_id, seller_id, None, 50)
    assert len(seller_msgs) == 2
    held = [m for m in seller_msgs if m.status == "held"]
    assert len(held) == 1 and held[0].sender_id == seller_id
