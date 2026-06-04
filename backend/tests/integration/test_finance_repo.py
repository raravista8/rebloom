"""T11.2a — finance aggregates against real Postgres ledger. Windowed by a
``since`` captured just before inserting, so only this test's rows are counted
(the integration DB persists across runs; tests are serial)."""

from __future__ import annotations

import secrets
import uuid
from datetime import UTC, datetime, timedelta

import pytest
from app.core.analytics.finance import FinanceService
from app.infrastructure.postgres.engine import writer_session
from app.infrastructure.postgres.finance_repo import PostgresFinanceRepo
from app.infrastructure.postgres.models import Deal, LedgerEntry, Listing
from app.infrastructure.postgres.users_repo import PostgresUserRepository
from sqlalchemy import func, select

pytestmark = pytest.mark.integration


def _phone() -> str:
    return f"+79{secrets.randbelow(10**9):09d}"


def test_released_deal_totals_window() -> None:
    users = PostgresUserRepository()
    seller = users.get_or_create_by_phone(_phone())
    buyer = users.get_or_create_by_phone(_phone())
    # Boundary from the DB's own clock: rows inserted below are strictly after it,
    # earlier tests' (append-only, undeletable) ledger rows strictly before.
    with writer_session() as clock:
        since = clock.scalar(select(func.now())).isoformat()  # type: ignore[union-attr]

    with writer_session() as session:
        listing = Listing(
            seller_id=uuid.UUID(seller.id),
            size="M",
            freshness="today",
            price_kopecks=100_000,
            city_id="msk",
            status="sold",
            freshness_score=0,
            expires_at=datetime.now(UTC) + timedelta(days=1),
        )
        session.add(listing)
        session.flush()
        deal = Deal(
            listing_id=listing.id,
            buyer_id=uuid.UUID(buyer.id),
            seller_id=uuid.UUID(seller.id),
            amount_kopecks=100_000,
            commission_kopecks=10_000,
            status="released",
            delivery_method="self_pickup",
            released_at=datetime.now(UTC),
        )
        session.add(deal)
        session.flush()
        session.add_all(
            [
                LedgerEntry(deal_id=deal.id, kind="hold", amount_kopecks=100_000),
                LedgerEntry(deal_id=deal.id, kind="commission", amount_kopecks=10_000),
                LedgerEntry(deal_id=deal.id, kind="payout", amount_kopecks=90_000),
            ]
        )

    summary = FinanceService(PostgresFinanceRepo()).summary(since=since)
    assert summary.gmv_kopecks == 100_000
    assert summary.commission_kopecks == 10_000
    assert summary.payout_kopecks == 90_000
    assert summary.held_kopecks == 0  # ledger settles to zero
    assert summary.deals_by_status.get("released", 0) >= 1
