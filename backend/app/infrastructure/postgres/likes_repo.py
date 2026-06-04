"""Postgres LikeRepository — idempotent via the (user, listing) unique index."""

from __future__ import annotations

import uuid

from sqlalchemy import delete, func, select, update
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.orm import Session

from app.infrastructure.postgres.engine import writer_session
from app.infrastructure.postgres.models import Like, Listing


def _recount(session: Session, listing_id: uuid.UUID) -> int:
    count = (
        session.scalar(select(func.count()).select_from(Like).where(Like.listing_id == listing_id))
        or 0
    )
    session.execute(update(Listing).where(Listing.id == listing_id).values(like_count=count))
    return int(count)


class PostgresLikeRepository:
    """Implements :class:`app.core.likes.ports.LikeRepository`."""

    def like(self, user_id: str, listing_id: str) -> int | None:
        try:
            uid, lid = uuid.UUID(user_id), uuid.UUID(listing_id)
        except ValueError:
            return None
        with writer_session() as session:
            if session.get(Listing, lid) is None:
                return None
            session.execute(
                pg_insert(Like)
                .values(id=uuid.uuid4(), user_id=uid, listing_id=lid)
                .on_conflict_do_nothing(index_elements=["user_id", "listing_id"])
            )
            return _recount(session, lid)

    def unlike(self, user_id: str, listing_id: str) -> int | None:
        try:
            uid, lid = uuid.UUID(user_id), uuid.UUID(listing_id)
        except ValueError:
            return None
        with writer_session() as session:
            if session.get(Listing, lid) is None:
                return None
            session.execute(delete(Like).where(Like.user_id == uid, Like.listing_id == lid))
            return _recount(session, lid)
