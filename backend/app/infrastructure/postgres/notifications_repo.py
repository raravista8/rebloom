"""Postgres notification outbox (NOTIFICATIONS.md §6). Enqueue is idempotent via
the (event_id, channel, user) unique key; delivery transitions are done under a
row lock. Implements :class:`app.core.notifications.ports.NotificationOutbox`."""

from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert as pg_insert

from app.core.notifications.ports import OutboxRow
from app.core.notifications.schemas import Channel, NotificationDraft, NotificationView
from app.infrastructure.postgres.engine import reader_session, writer_session
from app.infrastructure.postgres.models import Notification


class _Row:
    """Detached outbox row (satisfies ports.OutboxRow)."""

    __slots__ = ("attempts", "body", "channel", "id", "kind", "title", "user_id")

    def __init__(self, n: Notification) -> None:
        self.id = str(n.id)
        self.user_id = str(n.user_id)
        self.channel: Channel = n.channel  # type: ignore[assignment]
        self.kind = n.kind
        self.title = n.title
        self.body = n.body
        self.attempts = n.attempts


def _to_view(n: Notification) -> NotificationView:
    return NotificationView(
        id=str(n.id),
        kind=n.kind,
        title=n.title,
        body=n.body,
        payload=n.payload or {},
        read=n.read,
        created_at=n.created_at.isoformat() if n.created_at else None,
    )


class PostgresNotificationOutbox:
    """Implements :class:`app.core.notifications.ports.NotificationOutbox`."""

    def enqueue(self, draft: NotificationDraft) -> int:
        rows = [
            {
                "event_id": draft.event_id,
                "user_id": uuid.UUID(draft.user_id),
                "channel": channel,
                "kind": draft.kind,
                "title": draft.title,
                "body": draft.body,
                "payload": draft.payload or None,
            }
            for channel in draft.channels
        ]
        with writer_session() as session:
            # ON CONFLICT DO NOTHING on (event_id, channel, user) → idempotent.
            # RETURNING yields only the rows actually inserted (skipped conflicts
            # are not returned), so its length is the real "new rows" count —
            # rowcount is unreliable (-1) for multi-row ON CONFLICT inserts.
            result = session.execute(
                pg_insert(Notification)
                .values(rows)
                .on_conflict_do_nothing(constraint="notif_event_channel_user")
                .returning(Notification.id)
            )
            return len(result.all())

    def list_pending(self, limit: int) -> list[OutboxRow]:
        with writer_session() as session:
            rows = (
                session.execute(
                    select(Notification)
                    .where(Notification.status == "pending")
                    .order_by(Notification.created_at.asc())
                    .limit(limit)
                    .with_for_update(skip_locked=True)
                )
                .scalars()
                .all()
            )
            return [_Row(n) for n in rows]

    def mark_sent(self, row_id: str) -> None:
        with writer_session() as session:
            n = session.get(Notification, uuid.UUID(row_id))
            if n is not None:
                n.status = "sent"

    def mark_attempt_failed(self, row_id: str, max_attempts: int) -> None:
        with writer_session() as session:
            n = session.get(Notification, uuid.UUID(row_id))
            if n is None:
                return
            n.attempts += 1
            if n.attempts >= max_attempts:
                n.status = "failed"  # give up; stays for inspection

    def list_inapp(
        self, user_id: str, cursor: str | None, limit: int
    ) -> tuple[list[NotificationView], str | None]:
        try:
            uid = uuid.UUID(user_id)
        except ValueError:
            return [], None
        with reader_session() as session:
            stmt = (
                select(Notification)
                .where(Notification.user_id == uid, Notification.channel == "inapp")
                .order_by(Notification.created_at.desc(), Notification.id.desc())
                .limit(limit)
            )
            if cursor:
                stmt = stmt.where(Notification.created_at < datetime.fromisoformat(cursor))
            rows = list(session.scalars(stmt).all())
            next_cursor = (
                rows[-1].created_at.isoformat()
                if len(rows) == limit and rows[-1].created_at
                else None
            )
            return [_to_view(n) for n in rows], next_cursor
