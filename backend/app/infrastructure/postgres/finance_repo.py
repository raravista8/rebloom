"""Postgres finance adapter — read-only aggregates over the ledger + deals
(reads from the replica). Implements :class:`app.core.analytics.finance.FinanceRepo`."""

from __future__ import annotations

from datetime import datetime

from sqlalchemy import func, select

from app.infrastructure.postgres.engine import reader_session
from app.infrastructure.postgres.models import Deal, LedgerEntry


def _parse(value: str | None) -> datetime | None:
    return datetime.fromisoformat(value) if value else None


class PostgresFinanceRepo:
    """Implements :class:`app.core.analytics.finance.FinanceRepo`."""

    def ledger_totals(self, since: str | None, until: str | None) -> dict[str, int]:
        lo, hi = _parse(since), _parse(until)
        with reader_session() as session:
            stmt = select(
                LedgerEntry.kind, func.coalesce(func.sum(LedgerEntry.amount_kopecks), 0)
            ).group_by(LedgerEntry.kind)
            if lo is not None:
                stmt = stmt.where(LedgerEntry.created_at >= lo)
            if hi is not None:
                stmt = stmt.where(LedgerEntry.created_at < hi)
            return {kind: int(total) for kind, total in session.execute(stmt).all()}

    def deals_by_status(self, since: str | None, until: str | None) -> dict[str, int]:
        lo, hi = _parse(since), _parse(until)
        with reader_session() as session:
            stmt = select(Deal.status, func.count()).group_by(Deal.status)
            if lo is not None:
                stmt = stmt.where(Deal.created_at >= lo)
            if hi is not None:
                stmt = stmt.where(Deal.created_at < hi)
            return {status: int(count) for status, count in session.execute(stmt).all()}
