"""Moderation-queue service (FR-060/061): list pending listings / held reviews,
approve or reject with a mandatory reason — every decision is audit-logged
(SECURITY T-11). The actual table writes are behind :class:`ModerationQueueRepo`."""

from __future__ import annotations

from app.core.admin.ports import ItemType, ModerationItem, ModerationQueueRepo
from app.core.audit.ports import AuditLog
from app.core.errors import CONFLICT, VALIDATION_ERROR, DomainError
from app.core.result import Err, Ok, Result

QUEUE_LIMIT = 50  # MVP: a single capped page (the queue is small)
_ACTIONS: frozenset[str] = frozenset({"approve", "reject"})


class ModerationQueueService:
    def __init__(self, repo: ModerationQueueRepo, audit: AuditLog) -> None:
        self._repo = repo
        self._audit = audit

    def queue(self, item_type: ItemType, limit: int = QUEUE_LIMIT) -> list[ModerationItem]:
        capped = max(1, min(limit, QUEUE_LIMIT))
        if item_type == "listing":
            return self._repo.list_pending_listings(capped)
        return self._repo.list_held_reviews(capped)

    def decide(
        self,
        *,
        actor_id: str,
        item_type: ItemType,
        item_id: str,
        action: str,
        reason: str,
        request_id: str | None = None,
    ) -> Result[str, DomainError]:
        if action not in _ACTIONS:
            return Err(DomainError(VALIDATION_ERROR, "action"))
        approve = action == "approve"

        if item_type == "listing":
            applied = self._repo.decide_listing(item_id, approve)
            new_status = "active" if approve else "archived"
        else:
            applied = self._repo.decide_review(item_id, approve)
            new_status = "visible" if approve else "hidden"

        if not applied:
            return Err(DomainError(CONFLICT, "not_in_queue"))

        self._audit.record(
            action=f"moderation.{item_type}.{action}",
            target_type=item_type,
            target_id=item_id,
            actor_id=actor_id,
            reason=reason,
            request_id=request_id,
        )
        return Ok(new_status)
