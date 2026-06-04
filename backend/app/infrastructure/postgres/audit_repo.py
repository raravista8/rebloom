"""Postgres audit log — append-only (DB trigger blocks UPDATE/DELETE, T-11)."""

from __future__ import annotations

import uuid

from app.infrastructure.postgres.engine import writer_session
from app.infrastructure.postgres.models import AuditLog as AuditRow


class PostgresAuditLog:
    """Implements :class:`app.core.audit.ports.AuditLog`."""

    def record(
        self,
        *,
        action: str,
        target_type: str,
        target_id: str,
        actor_id: str | None = None,
        reason: str | None = None,
        request_id: str | None = None,
    ) -> None:
        with writer_session() as session:
            session.add(
                AuditRow(
                    actor_id=uuid.UUID(actor_id) if actor_id else None,
                    action=action,
                    target_type=target_type,
                    target_id=target_id,
                    reason=reason,
                    request_id=request_id,
                )
            )
