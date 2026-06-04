"""Postgres fraud repo (FR-073). Upserts signals (idempotent per user+type) and
recomputes the user's risk_score = sum of their open signal scores."""

from __future__ import annotations

import uuid
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.dialects.postgresql import insert as pg_insert

from app.core.fraud.service import FraudSignalView
from app.infrastructure.postgres.engine import reader_session, writer_session
from app.infrastructure.postgres.models import FraudSignal, User


def _to_view(s: FraudSignal) -> FraudSignalView:
    return FraudSignalView(
        id=str(s.id),
        user_id=str(s.user_id) if s.user_id else None,
        type=s.type,
        score=s.score,
        evidence=s.evidence or {},
        status=s.status,
        created_at=s.created_at.isoformat() if s.created_at else None,
    )


class PostgresFraudRepo:
    """Implements :class:`app.core.fraud.service.FraudRepo`."""

    def record(self, user_id: str, signal_type: str, score: int, evidence: dict[str, Any]) -> None:
        uid = uuid.UUID(user_id)
        with writer_session() as session:
            session.execute(
                pg_insert(FraudSignal)
                .values(user_id=uid, type=signal_type, score=score, evidence=evidence)
                .on_conflict_do_update(
                    constraint="fraud_user_type",
                    set_={"score": score, "evidence": evidence, "status": "open"},
                )
            )
            # risk_score = sum of this user's open signal scores.
            total = session.scalar(
                select(func.coalesce(func.sum(FraudSignal.score), 0)).where(
                    FraudSignal.user_id == uid, FraudSignal.status == "open"
                )
            )
            user = session.get(User, uid)
            if user is not None:
                user.risk_score = int(total or 0)

    def list_open(self, limit: int) -> list[FraudSignalView]:
        with reader_session() as session:
            rows = session.scalars(
                select(FraudSignal)
                .where(FraudSignal.status == "open")
                .order_by(FraudSignal.score.desc())
                .limit(limit)
            ).all()
            return [_to_view(s) for s in rows]
