"""Support tickets (FR-092, SUPPORT.md). Users file tickets by category; support/
admin work an SLA-tracked queue and resolve with an audited reason. First-response
SLA target is 24h — tickets older than that are flagged ``sla_overdue``."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Any, Protocol

from app.core.audit.ports import AuditLog
from app.core.errors import VALIDATION_ERROR, DomainError
from app.core.result import Err, Ok, Result

CATEGORIES = ("deal", "payment", "delivery", "moderation", "account", "other")
SLA_HOURS = 24
QUEUE_LIMIT = 100


@dataclass(frozen=True, slots=True)
class TicketView:
    id: str
    user_id: str
    category: str
    body: str
    status: str
    created_at: str | None

    def to_api(self, *, now: datetime | None = None) -> dict[str, Any]:
        overdue = False
        if self.status == "open" and self.created_at is not None and now is not None:
            overdue = datetime.fromisoformat(self.created_at) < now - timedelta(hours=SLA_HOURS)
        return {
            "id": self.id,
            "user_id": self.user_id,
            "category": self.category,
            "body": self.body,
            "status": self.status,
            "created_at": self.created_at,
            "sla_overdue": overdue,
        }


class SupportRepo(Protocol):
    def create(self, user_id: str, category: str, body: str) -> str: ...
    def list_open(self, limit: int) -> list[TicketView]: ...
    def resolve(self, ticket_id: str, resolved_at: str) -> bool: ...


class SupportService:
    def __init__(self, repo: SupportRepo, audit: AuditLog) -> None:
        self._repo = repo
        self._audit = audit

    def open_ticket(self, user_id: str, category: str, body: str) -> Result[str, DomainError]:
        if category not in CATEGORIES:
            return Err(DomainError(VALIDATION_ERROR, "category"))
        return Ok(self._repo.create(user_id, category, body))

    def queue(self) -> list[TicketView]:
        return self._repo.list_open(QUEUE_LIMIT)

    def resolve(
        self,
        actor_id: str,
        ticket_id: str,
        reason: str,
        now_iso: str,
        request_id: str | None = None,
    ) -> Result[str, DomainError]:
        if not self._repo.resolve(ticket_id, now_iso):
            return Err(DomainError(VALIDATION_ERROR, "ticket"))
        self._audit.record(
            action="support.ticket.resolved",
            target_type="support_ticket",
            target_id=ticket_id,
            actor_id=actor_id,
            reason=reason,
            request_id=request_id,
        )
        return Ok("resolved")
