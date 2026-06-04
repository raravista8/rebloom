"""DSR service (ФЗ-152, FR-091): export / delete / correct. Deletion soft-disables
the account immediately and schedules anonymization after a retention grace; the
legally-required (anonymized) ledger is never deleted. Every DSR action is
audit-logged (PRIVACY_152FZ.md §2, SECURITY T-10)."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta
from typing import Any

from app.core.audit.ports import AuditLog
from app.core.errors import NOT_FOUND, VALIDATION_ERROR, DomainError
from app.core.privacy.ports import PrivacyRepository
from app.core.result import Err, Ok, Result
from app.core.users.schemas import UserView

RETENTION_GRACE_DAYS = 30


class PrivacyService:
    def __init__(self, repo: PrivacyRepository, audit: AuditLog) -> None:
        self._repo = repo
        self._audit = audit

    def export(
        self, user_id: str, request_id: str | None = None
    ) -> Result[dict[str, Any], DomainError]:
        bundle = self._repo.gather_export(user_id)
        if bundle is None:
            return Err(DomainError(NOT_FOUND, "user"))
        self._audit.record(
            action="dsr.export",
            target_type="user",
            target_id=user_id,
            actor_id=user_id,
            request_id=request_id,
        )
        return Ok(bundle)

    def request_deletion(
        self, user_id: str, confirm: bool, request_id: str | None = None
    ) -> Result[str, DomainError]:
        if not confirm:
            return Err(DomainError(VALIDATION_ERROR, "confirm"))
        now = datetime.now(UTC)
        if not self._repo.soft_delete(user_id, now.isoformat()):
            return Err(DomainError(NOT_FOUND, "user"))
        scheduled_at = (now + timedelta(days=RETENTION_GRACE_DAYS)).isoformat()
        self._audit.record(
            action="dsr.delete_requested",
            target_type="user",
            target_id=user_id,
            actor_id=user_id,
            reason=f"scheduled_at={scheduled_at}",
            request_id=request_id,
        )
        return Ok(scheduled_at)

    def correct(
        self,
        user_id: str,
        *,
        display_name: str | None,
        city_id: str | None,
        request_id: str | None = None,
    ) -> Result[UserView, DomainError]:
        updated = self._repo.update_profile(user_id, display_name=display_name, city_id=city_id)
        if updated is None:
            return Err(DomainError(NOT_FOUND, "user"))
        self._audit.record(
            action="dsr.correct",
            target_type="user",
            target_id=user_id,
            actor_id=user_id,
            request_id=request_id,
        )
        return Ok(updated)
