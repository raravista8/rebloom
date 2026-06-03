"""Consent repository port."""

from __future__ import annotations

from typing import Protocol

from app.core.consent.schemas import ConsentRecord


class ConsentRepository(Protocol):
    def record(self, user_id: str, policy_version: str, source_channel: str) -> ConsentRecord: ...
