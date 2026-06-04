"""T11.4 — fraud scan over real Postgres: a seller with a high dispute rate gets a
signal and a bumped risk_score."""

from __future__ import annotations

import secrets
import uuid
from datetime import UTC, datetime, timedelta

import pytest
from app.infrastructure.postgres.engine import writer_session
from app.infrastructure.postgres.fraud_repo import PostgresFraudRepo
from app.infrastructure.postgres.models import Deal, FraudSignal, Listing, User
from app.infrastructure.postgres.users_repo import PostgresUserRepository
from app.workers.fraud import scan
from sqlalchemy import select
from sqlalchemy.orm import Session

pytestmark = pytest.mark.integration


def _phone() -> str:
    return f"+79{secrets.randbelow(10**9):09d}"


def _deal(session: Session, seller: uuid.UUID, buyer: uuid.UUID, status: str) -> None:
    listing = Listing(
        seller_id=seller,
        size="M",
        freshness="today",
        price_kopecks=50000,
        city_id="msk",
        status="sold",
        freshness_score=0,
        expires_at=datetime.now(UTC) + timedelta(days=1),
    )
    session.add(listing)
    session.flush()
    session.add(
        Deal(
            listing_id=listing.id,
            buyer_id=buyer,
            seller_id=seller,
            amount_kopecks=50000,
            commission_kopecks=5000,
            status=status,
            delivery_method="self_pickup",
        )
    )


def test_high_dispute_rate_flags_seller() -> None:
    users = PostgresUserRepository()
    seller = uuid.UUID(users.get_or_create_by_phone(_phone()).id)
    buyer = uuid.UUID(users.get_or_create_by_phone(_phone()).id)
    with writer_session() as session:
        _deal(session, seller, buyer, "released")
        _deal(session, seller, buyer, "disputed")
        _deal(session, seller, buyer, "disputed")  # 2/3 disputed → over threshold

    scan()

    with writer_session() as session:
        signal = session.scalar(
            select(FraudSignal).where(
                FraudSignal.user_id == seller, FraudSignal.type == "dispute_rate"
            )
        )
        assert signal is not None and signal.score > 0
        user = session.get(User, seller)
        assert user is not None and user.risk_score >= signal.score


def test_rescan_is_idempotent() -> None:
    seller = uuid.UUID(PostgresUserRepository().get_or_create_by_phone(_phone()).id)
    buyer = uuid.UUID(PostgresUserRepository().get_or_create_by_phone(_phone()).id)
    with writer_session() as session:
        for _ in range(3):
            _deal(session, seller, buyer, "disputed")

    scan()
    scan()  # second run must not duplicate the signal (upsert by user+type)

    repo = PostgresFraudRepo()
    mine = [s for s in repo.list_open(500) if s.user_id == str(seller)]
    assert len(mine) == 1
