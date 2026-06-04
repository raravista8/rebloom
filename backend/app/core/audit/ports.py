"""Audit log port (T-11). Implemented by an append-only Postgres adapter."""

from __future__ import annotations

from typing import Protocol


class AuditLog(Protocol):
    def record(
        self,
        *,
        action: str,
        target_type: str,
        target_id: str,
        actor_id: str | None = None,
        reason: str | None = None,
        request_id: str | None = None,
    ) -> None: ...
