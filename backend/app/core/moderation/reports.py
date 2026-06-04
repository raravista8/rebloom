"""User abuse reports (FR-064). A user reports a listing or another user; the
report is queued for moderators. Resolving a report is audited."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Literal, Protocol

from app.core.errors import VALIDATION_ERROR, DomainError
from app.core.result import Err, Ok, Result

TargetType = Literal["listing", "user"]
QUEUE_LIMIT = 100


@dataclass(frozen=True, slots=True)
class ReportView:
    id: str
    reporter_id: str
    target_type: str
    target_id: str
    reason: str
    status: str
    created_at: str | None

    def to_api(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "reporter_id": self.reporter_id,
            "target_type": self.target_type,
            "target_id": self.target_id,
            "reason": self.reason,
            "status": self.status,
            "created_at": self.created_at,
        }


class ReportRepo(Protocol):
    def create(self, reporter_id: str, target_type: str, target_id: str, reason: str) -> str: ...
    def list_open(self, limit: int) -> list[ReportView]: ...


class ReportService:
    def __init__(self, repo: ReportRepo) -> None:
        self._repo = repo

    def report(
        self, reporter_id: str, target_type: str, target_id: str, reason: str
    ) -> Result[str, DomainError]:
        if target_type not in ("listing", "user"):
            return Err(DomainError(VALIDATION_ERROR, "target_type"))
        if reporter_id == target_id:  # can't report yourself
            return Err(DomainError(VALIDATION_ERROR, "self_report"))
        return Ok(self._repo.create(reporter_id, target_type, target_id, reason))

    def queue(self) -> list[ReportView]:
        return self._repo.list_open(QUEUE_LIMIT)
