"""T10.1b — moderation queue against real Postgres: pending listing approve →
active; held review approve → visible + counts toward the seller rating (FR-060/061)."""

from __future__ import annotations

import secrets
import uuid
from datetime import UTC, datetime, timedelta

import pytest
from app.infrastructure.postgres.engine import writer_session
from app.infrastructure.postgres.models import Deal, Listing, Review
from app.infrastructure.postgres.moderation_repo import PostgresModerationQueueRepo
from app.infrastructure.postgres.users_repo import PostgresUserRepository

pytestmark = pytest.mark.integration


def _phone() -> str:
    return f"+79{secrets.randbelow(10**9):09d}"


def test_pending_listing_approve_activates() -> None:
    users = PostgresUserRepository()
    seller = users.get_or_create_by_phone(_phone())
    with writer_session() as session:
        listing = Listing(
            seller_id=uuid.UUID(seller.id),
            size="M",
            freshness="today",
            price_kopecks=50000,
            city_id="msk",
            status="pending_review",
            freshness_score=0,
            expires_at=datetime.now(UTC) + timedelta(days=1),
        )
        session.add(listing)
        session.flush()
        lid = str(listing.id)

    repo = PostgresModerationQueueRepo()
    assert lid in {i.id for i in repo.list_pending_listings(50)}
    assert repo.decide_listing(lid, approve=True) is True
    assert repo.decide_listing(lid, approve=True) is False  # idempotent: no longer pending

    with writer_session() as session:
        assert session.get(Listing, uuid.UUID(lid)).status == "active"


def test_held_review_approve_makes_visible_and_rates() -> None:
    users = PostgresUserRepository()
    seller = users.get_or_create_by_phone(_phone())
    buyer = users.get_or_create_by_phone(_phone())
    seller_uuid = uuid.UUID(seller.id)
    with writer_session() as session:
        listing = Listing(
            seller_id=seller_uuid,
            size="L",
            freshness="today",
            price_kopecks=80000,
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
            seller_id=seller_uuid,
            amount_kopecks=80000,
            commission_kopecks=8000,
            status="done",
            delivery_method="self_pickup",
            released_at=datetime.now(UTC),
        )
        session.add(deal)
        session.flush()
        review = Review(
            deal_id=deal.id,
            author_id=uuid.UUID(buyer.id),
            target_id=seller_uuid,
            score=5,
            text="held pending moderation",
            moderation_status="held",
        )
        session.add(review)
        session.flush()
        rid = str(review.id)

    repo = PostgresModerationQueueRepo()
    assert rid in {i.id for i in repo.list_held_reviews(50)}
    assert repo.decide_review(rid, approve=True) is True

    with writer_session() as session:
        assert session.get(Review, uuid.UUID(rid)).moderation_status == "visible"
        from app.infrastructure.postgres.models import User

        user = session.get(User, seller_uuid)
        assert user is not None and float(user.seller_rating) == 5.0
