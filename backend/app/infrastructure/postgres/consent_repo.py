"""Postgres ConsentRepository — append a versioned ФЗ-152 consent row."""

from __future__ import annotations

import uuid

from app.core.consent.schemas import ConsentRecord
from app.infrastructure.postgres.engine import writer_session
from app.infrastructure.postgres.models import Consent


class PostgresConsentRepository:
    """Implements :class:`app.core.consent.ports.ConsentRepository`."""

    def record(self, user_id: str, policy_version: str, source_channel: str) -> ConsentRecord:
        with writer_session() as session:
            consent = Consent(
                user_id=uuid.UUID(user_id),
                policy_version=policy_version,
                source_channel=source_channel,
            )
            session.add(consent)
            session.flush()
            session.refresh(consent)  # load server-side created_at
            return ConsentRecord(id=str(consent.id), accepted_at=consent.created_at)
