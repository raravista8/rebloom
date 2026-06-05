"""FR-022 / T-12 — stale reservations expire; fresh ones are left alone."""

from __future__ import annotations

import secrets
import uuid
from datetime import UTC, datetime, timedelta

import pytest
from app.infrastructure.postgres.engine import writer_session
from app.infrastructure.postgres.models import Deal, Listing
from app.infrastructure.postgres.users_repo import PostgresUserRepository
from app.workers.reservations import expire_stale_reservations

pytestmark = pytest.mark.integration


def _phone() -> str:
    return f"+79{secrets.randbelow(10**9):09d}"


def _make_created_deal() -> tuple[uuid.UUID, uuid.UUID]:
    users = PostgresUserRepository()
    seller = users.get_or_create_by_phone(_phone())
    buyer = users.get_or_create_by_phone(_phone())
    with writer_session() as session:
        listing = Listing(
            seller_id=uuid.UUID(seller.id),
            size="M",
            freshness="today",
            price_kopecks=100000,
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
            amount_kopecks=100000,
            commission_kopecks=10000,
            status="agreed",
            delivery_method="self_pickup",
        )
        session.add(deal)
        session.flush()
        return deal.id, listing.id


def test_stale_reservation_cancelled_and_listing_released() -> None:
    deal_id, listing_id = _make_created_deal()
    future = datetime.now(UTC) + timedelta(minutes=31)
    assert expire_stale_reservations(now=future) >= 1
    with writer_session() as session:
        assert session.get(Deal, deal_id).status == "cancelled"  # type: ignore[union-attr]
        assert session.get(Listing, listing_id).status == "active"  # type: ignore[union-attr]


def test_fresh_reservation_is_untouched() -> None:
    deal_id, listing_id = _make_created_deal()
    expire_stale_reservations(now=datetime.now(UTC))  # cutoff = now - 30min
    with writer_session() as session:
        assert session.get(Deal, deal_id).status == "created"  # type: ignore[union-attr]
        assert session.get(Listing, listing_id).status == "reserved"  # type: ignore[union-attr]
