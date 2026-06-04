"""Postgres moderation-queue adapter (FR-060). Reads pending listings / held
reviews; decisions transition status under a row lock (idempotent — a late or
duplicate decision is a no-op). Implements ``ModerationQueueRepo``."""

from __future__ import annotations

import uuid

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.admin.ports import ModerationItem
from app.infrastructure.postgres.engine import reader_session, writer_session
from app.infrastructure.postgres.models import Listing, Review, User


def _listing_item(listing: Listing) -> ModerationItem:
    return ModerationItem(
        id=str(listing.id),
        type="listing",
        created_at=listing.created_at.isoformat() if listing.created_at else None,
        summary={
            "seller_id": str(listing.seller_id),
            "size": listing.size,
            "freshness": listing.freshness,
            "price_kopecks": listing.price_kopecks,
            "city_id": listing.city_id,
        },
    )


def _review_item(review: Review) -> ModerationItem:
    return ModerationItem(
        id=str(review.id),
        type="review",
        created_at=review.created_at.isoformat() if review.created_at else None,
        summary={
            "author_id": str(review.author_id),
            "target_id": str(review.target_id),
            "score": review.score,
            "text": review.text,
        },
    )


class PostgresModerationQueueRepo:
    """Implements :class:`app.core.admin.ports.ModerationQueueRepo`."""

    def list_pending_listings(self, limit: int) -> list[ModerationItem]:
        with reader_session() as session:
            rows = session.scalars(
                select(Listing)
                .where(Listing.status == "pending_review")
                .order_by(Listing.created_at.asc())
                .limit(limit)
            ).all()
            return [_listing_item(r) for r in rows]

    def list_held_reviews(self, limit: int) -> list[ModerationItem]:
        with reader_session() as session:
            rows = session.scalars(
                select(Review)
                .where(Review.moderation_status == "held")
                .order_by(Review.created_at.asc())
                .limit(limit)
            ).all()
            return [_review_item(r) for r in rows]

    def decide_listing(self, listing_id: str, approve: bool) -> bool:
        try:
            lid = uuid.UUID(listing_id)
        except ValueError:
            return False
        with writer_session() as session:
            listing = session.execute(
                select(Listing).where(Listing.id == lid).with_for_update()
            ).scalar_one_or_none()
            if listing is None or listing.status != "pending_review":
                return False
            listing.status = "active" if approve else "archived"
            return True

    def decide_review(self, review_id: str, approve: bool) -> bool:
        try:
            rid = uuid.UUID(review_id)
        except ValueError:
            return False
        with writer_session() as session:
            review = session.execute(
                select(Review).where(Review.id == rid).with_for_update()
            ).scalar_one_or_none()
            if review is None or review.moderation_status != "held":
                return False
            review.moderation_status = "visible" if approve else "hidden"
            if approve:
                _recompute_seller_rating(session, review.target_id)
            return True


def _recompute_seller_rating(session: Session, target_id: uuid.UUID) -> None:
    """Approving a held review makes it count toward the seller rating (FR-041)."""
    avg = session.scalar(
        select(func.avg(Review.score)).where(
            Review.target_id == target_id, Review.moderation_status == "visible"
        )
    )
    user = session.get(User, target_id)
    if user is not None:
        user.seller_rating = round(float(avg), 2) if avg is not None else None
