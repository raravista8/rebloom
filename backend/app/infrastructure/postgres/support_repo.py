"""Postgres support-tickets repo (FR-092). Implements SupportRepo."""

from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import select

from app.core.support.service import TicketView
from app.infrastructure.postgres.engine import reader_session, writer_session
from app.infrastructure.postgres.models import SupportTicket


def _to_view(t: SupportTicket) -> TicketView:
    return TicketView(
        id=str(t.id),
        user_id=str(t.user_id),
        category=t.category,
        body=t.body,
        status=t.status,
        created_at=t.created_at.isoformat() if t.created_at else None,
    )


class PostgresSupportRepo:
    """Implements :class:`app.core.support.service.SupportRepo`."""

    def create(self, user_id: str, category: str, body: str) -> str:
        with writer_session() as session:
            ticket = SupportTicket(
                user_id=uuid.UUID(user_id), category=category, body=body, status="open"
            )
            session.add(ticket)
            session.flush()
            return str(ticket.id)

    def list_open(self, limit: int) -> list[TicketView]:
        with reader_session() as session:
            rows = session.scalars(
                select(SupportTicket)
                .where(SupportTicket.status == "open")
                .order_by(SupportTicket.created_at.asc())  # oldest first (SLA)
                .limit(limit)
            ).all()
            return [_to_view(t) for t in rows]

    def resolve(self, ticket_id: str, resolved_at: str) -> bool:
        try:
            tid = uuid.UUID(ticket_id)
        except ValueError:
            return False
        with writer_session() as session:
            ticket = session.execute(
                select(SupportTicket).where(SupportTicket.id == tid).with_for_update()
            ).scalar_one_or_none()
            if ticket is None or ticket.status != "open":
                return False
            ticket.status = "resolved"
            ticket.resolved_at = datetime.fromisoformat(resolved_at)
            return True
