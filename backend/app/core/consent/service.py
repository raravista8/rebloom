"""Consent capture (FR-004): persist a versioned, channel-tagged acceptance."""

from __future__ import annotations

from app.core.consent.ports import ConsentRepository
from app.core.consent.schemas import ALLOWED_CHANNELS, ConsentRecord
from app.core.errors import VALIDATION_ERROR, DomainError
from app.core.result import Err, Ok, Result


class ConsentService:
    def __init__(self, repo: ConsentRepository) -> None:
        self._repo = repo

    def accept(
        self, user_id: str, policy_version: str, source_channel: str
    ) -> Result[ConsentRecord, DomainError]:
        if source_channel not in ALLOWED_CHANNELS:
            return Err(DomainError(VALIDATION_ERROR, "invalid_channel"))
        return Ok(self._repo.record(user_id, policy_version, source_channel))
