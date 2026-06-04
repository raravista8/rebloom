"""Postgres chat adapter (FR-030). Persists deal messages and reads them in
chronological order, hiding the counterparty's *held* messages. Implements
:class:`app.core.deals.chat.ChatRepository`."""

from __future__ import annotations

import uuid

from sqlalchemy import or_, select

from app.core.deals.chat import MessageView
from app.infrastructure.postgres.engine import reader_session, writer_session
from app.infrastructure.postgres.models import Message


def _to_view(m: Message) -> MessageView:
    return MessageView(
        id=str(m.id),
        deal_id=str(m.deal_id),
        sender_id=str(m.sender_id),
        body=m.body,
        status=m.status,
        created_at=m.created_at.isoformat() if m.created_at else None,
    )


class PostgresChatRepository:
    """Implements :class:`app.core.deals.chat.ChatRepository`."""

    def add(self, deal_id: str, sender_id: str, body: str, status: str) -> MessageView:
        with writer_session() as session:
            msg = Message(
                deal_id=uuid.UUID(deal_id),
                sender_id=uuid.UUID(sender_id),
                body=body,
                status=status,
            )
            session.add(msg)
            session.flush()
            return _to_view(msg)

    def list_visible_to(
        self, deal_id: str, viewer_id: str, cursor: str | None, limit: int
    ) -> tuple[list[MessageView], str | None]:
        from datetime import datetime

        vid = uuid.UUID(viewer_id)
        with reader_session() as session:
            stmt = (
                select(Message)
                .where(Message.deal_id == uuid.UUID(deal_id))
                # Counterparty sees only delivered messages; the sender always
                # sees their own (held flagged) — SECURITY T-05.
                .where(or_(Message.status == "visible", Message.sender_id == vid))
                .order_by(Message.created_at.asc(), Message.id.asc())
                .limit(limit)
            )
            if cursor:
                stmt = stmt.where(Message.created_at > datetime.fromisoformat(cursor))
            rows = list(session.scalars(stmt).all())
            next_cursor = (
                rows[-1].created_at.isoformat()
                if len(rows) == limit and rows[-1].created_at
                else None
            )
            return [_to_view(m) for m in rows], next_cursor
