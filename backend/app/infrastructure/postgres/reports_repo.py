"""Postgres user-reports repo (FR-064). Implements ReportRepo."""

from __future__ import annotations

import uuid

from sqlalchemy import select

from app.core.moderation.reports import ReportView
from app.infrastructure.postgres.engine import reader_session, writer_session
from app.infrastructure.postgres.models import UserReport


def _to_view(r: UserReport) -> ReportView:
    return ReportView(
        id=str(r.id),
        reporter_id=str(r.reporter_id),
        target_type=r.target_type,
        target_id=r.target_id,
        reason=r.reason,
        status=r.status,
        created_at=r.created_at.isoformat() if r.created_at else None,
    )


class PostgresReportRepo:
    """Implements :class:`app.core.moderation.reports.ReportRepo`."""

    def create(self, reporter_id: str, target_type: str, target_id: str, reason: str) -> str:
        with writer_session() as session:
            report = UserReport(
                reporter_id=uuid.UUID(reporter_id),
                target_type=target_type,
                target_id=target_id,
                reason=reason,
                status="open",
            )
            session.add(report)
            session.flush()
            return str(report.id)

    def list_open(self, limit: int) -> list[ReportView]:
        with reader_session() as session:
            rows = session.scalars(
                select(UserReport)
                .where(UserReport.status == "open")
                .order_by(UserReport.created_at.asc())
                .limit(limit)
            ).all()
            return [_to_view(r) for r in rows]
