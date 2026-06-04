"""Postgres pre-purchase listing chat (T6.3). Implements ListingChatRepo +
ListingSellerReader."""

from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import select

from app.core.listings.chat import ListingMessageView
from app.infrastructure.postgres.engine import reader_session, writer_session
from app.infrastructure.postgres.models import Listing, ListingMessage


def _to_view(m: ListingMessage) -> ListingMessageView:
    return ListingMessageView(
        id=str(m.id),
        listing_id=str(m.listing_id),
        buyer_id=str(m.buyer_id),
        sender_id=str(m.sender_id),
        body=m.body,
        status=m.status,
        created_at=m.created_at.isoformat() if m.created_at else None,
    )


class PostgresListingSellerReader:
    """Implements :class:`app.core.listings.chat.ListingSellerReader`."""

    def seller_of(self, listing_id: str) -> str | None:
        try:
            lid = uuid.UUID(listing_id)
        except ValueError:
            return None
        with reader_session() as session:
            row = session.get(Listing, lid)
            return str(row.seller_id) if row is not None else None


class PostgresListingChatRepository:
    """Implements :class:`app.core.listings.chat.ListingChatRepo`."""

    def add(
        self, listing_id: str, buyer_id: str, sender_id: str, body: str, status: str
    ) -> ListingMessageView:
        with writer_session() as session:
            message = ListingMessage(
                listing_id=uuid.UUID(listing_id),
                buyer_id=uuid.UUID(buyer_id),
                sender_id=uuid.UUID(sender_id),
                body=body,
                status=status,
            )
            session.add(message)
            session.flush()
            return _to_view(message)

    def list_thread(
        self, listing_id: str, buyer_id: str, cursor: str | None, limit: int
    ) -> tuple[list[ListingMessageView], str | None]:
        try:
            lid, bid = uuid.UUID(listing_id), uuid.UUID(buyer_id)
        except ValueError:
            return [], None
        with reader_session() as session:
            stmt = (
                select(ListingMessage)
                .where(ListingMessage.listing_id == lid, ListingMessage.buyer_id == bid)
                .order_by(ListingMessage.created_at.asc(), ListingMessage.id.asc())
                .limit(limit)
            )
            if cursor:
                stmt = stmt.where(ListingMessage.created_at > datetime.fromisoformat(cursor))
            rows = list(session.scalars(stmt).all())
            next_cursor = (
                rows[-1].created_at.isoformat()
                if len(rows) == limit and rows[-1].created_at
                else None
            )
            return [_to_view(m) for m in rows], next_cursor
