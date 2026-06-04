"""Postgres reviews repository — one review per (deal, author)."""

from __future__ import annotations

import uuid

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from app.core.reviews.schemas import ReviewView
from app.infrastructure.postgres.engine import reader_session, writer_session
from app.infrastructure.postgres.models import Review


def _to_view(review: Review) -> ReviewView:
    return ReviewView(
        id=str(review.id),
        deal_id=str(review.deal_id),
        author_id=str(review.author_id),
        target_id=str(review.target_id),
        score=review.score,
        text=review.text,
        moderation_status=review.moderation_status,
    )


class PostgresReviewRepository:
    """Implements :class:`app.core.reviews.ports.ReviewRepository`."""

    def create(
        self,
        *,
        deal_id: str,
        author_id: str,
        target_id: str,
        score: int,
        text: str,
        moderation_status: str,
    ) -> ReviewView | None:
        with writer_session() as session:
            review = Review(
                deal_id=uuid.UUID(deal_id),
                author_id=uuid.UUID(author_id),
                target_id=uuid.UUID(target_id),
                score=score,
                text=text,
                moderation_status=moderation_status,
            )
            session.add(review)
            try:
                session.flush()
            except IntegrityError:
                session.rollback()  # unique(deal, author) — already reviewed
                return None
            return _to_view(review)

    def list_for_user(self, target_id: str) -> list[ReviewView]:
        try:
            tid = uuid.UUID(target_id)
        except ValueError:
            return []
        with reader_session() as session:
            rows = session.scalars(
                select(Review)
                .where(Review.target_id == tid, Review.moderation_status == "visible")
                .order_by(Review.created_at.desc())
            ).all()
            return [_to_view(r) for r in rows]
