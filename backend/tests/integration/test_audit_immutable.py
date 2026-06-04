"""SECURITY T-11 — the audit log is append-only (DB blocks UPDATE/DELETE)."""

from __future__ import annotations

import uuid

import pytest
from app.infrastructure.postgres.audit_repo import PostgresAuditLog
from app.infrastructure.postgres.engine import writer_session
from app.infrastructure.postgres.models import AuditLog as AuditRow
from sqlalchemy import select, text

pytestmark = pytest.mark.integration


def test_audit_log_is_append_only() -> None:
    target = uuid.uuid4().hex
    PostgresAuditLog().record(
        action="deal.released", target_type="deal", target_id=target, reason="receipt"
    )

    with writer_session() as session:
        row = session.scalar(select(AuditRow).where(AuditRow.target_id == target))
        assert row is not None and row.action == "deal.released"
        row_id = str(row.id)

    with pytest.raises(Exception, match="append-only"), writer_session() as session:
        session.execute(
            text("UPDATE audit_logs SET reason = 'tampered' WHERE id = :id"),
            {"id": row_id},
        )

    with pytest.raises(Exception, match="append-only"), writer_session() as session:
        session.execute(text("DELETE FROM audit_logs WHERE id = :id"), {"id": row_id})

    with writer_session() as session:
        row = session.get(AuditRow, uuid.UUID(row_id))
        assert row is not None and row.reason == "receipt"  # untampered, still there
