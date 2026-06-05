"""Deal orchestration — no-escrow «оплата при встрече» (ADR-0013).

The platform records an agreement and a pickup hand-off; it never holds or moves
money. agreed → meeting → done (+ problem, cancelled). Conflicts are reports, not
disputes — support/moderation warns/limits/blocks or takes the listing down, it
never settles money.
"""

from __future__ import annotations

import logging

from app.core.audit.ports import AuditLog
from app.core.deals.ports import DealRepository, DealView, ListingReader
from app.core.errors import (
    CONFLICT,
    FORBIDDEN,
    LISTING_UNAVAILABLE,
    NOT_FOUND,
    VALIDATION_ERROR,
    DomainError,
)
from app.core.notifications import events
from app.core.notifications.ports import Notifier
from app.core.notifications.schemas import NotificationDraft
from app.core.realtime.ports import RealtimeBus, deal_channel
from app.core.result import Err, Ok, Result

logger = logging.getLogger("rebloom.deals")

# How support/admin may close a reported (`problem`) deal — never moves money.
_RESOLVE_ACTIONS: frozenset[str] = frozenset({"done", "cancelled"})


class DealService:
    def __init__(
        self,
        deals: DealRepository,
        listings: ListingReader,
        audit: AuditLog | None = None,
        notifier: Notifier | None = None,
        bus: RealtimeBus | None = None,
    ) -> None:
        self._deals = deals
        self._listings = listings
        self._audit = audit
        self._notifier = notifier
        self._bus = bus

    def _publish_status(self, deal_id: str, status: str) -> None:
        if self._bus is not None:
            self._bus.publish(
                deal_channel(deal_id), {"type": "status", "deal_id": deal_id, "status": status}
            )

    def _notify(self, draft: NotificationDraft) -> None:
        if self._notifier is None:
            return
        try:
            self._notifier.notify(draft)
        except Exception:
            logger.warning("notify failed for %s", draft.event_id)

    def _record(
        self, action: str, deal_id: str, actor_id: str, reason: str | None, request_id: str | None
    ) -> None:
        if self._audit is not None:
            self._audit.record(
                action=action,
                target_type="deal",
                target_id=deal_id,
                actor_id=actor_id,
                reason=reason,
                request_id=request_id,
            )

    def create_deal(
        self, buyer_id: str, listing_id: str, delivery_method: str
    ) -> Result[DealView, DomainError]:
        """«Написать продавцу» → deal:agreed, listing reserved, chat opens. No payment."""
        summary = self._listings.get_summary(listing_id)
        if summary is None:
            return Err(DomainError(NOT_FOUND, "listing"))
        if summary.seller_id == buyer_id:
            return Err(DomainError(FORBIDDEN, "own_listing"))
        if summary.status != "active":
            return Err(DomainError(LISTING_UNAVAILABLE, "not_active"))

        deal = self._deals.create_and_reserve(
            buyer_id=buyer_id,
            listing_id=listing_id,
            seller_id=summary.seller_id,
            amount_kopecks=summary.price_kopecks,  # reference price, not a charge
            delivery_method=delivery_method,
        )
        if deal is None:  # lost the reservation race under the row lock
            return Err(DomainError(LISTING_UNAVAILABLE, "reserved"))

        self._notify(events.deal_agreed(deal.id, deal.seller_id))
        self._publish_status(deal.id, "agreed")
        return Ok(deal)

    def share_point(self, seller_id: str, deal_id: str) -> Result[DealView, DomainError]:
        """Seller shares the pickup point → meeting. The exact address itself is stored
        and revealed via the delivery gate (T-13); this only advances the status."""
        deal = self._deals.get(deal_id)
        if deal is None:
            return Err(DomainError(NOT_FOUND, "deal"))
        if deal.seller_id != seller_id:
            return Err(DomainError(FORBIDDEN, "not_seller"))
        if deal.status != "agreed":
            return Err(DomainError(CONFLICT, "not_agreed"))
        moved = self._deals.to_meeting(deal_id)
        if moved is None:
            return Err(DomainError(CONFLICT, "share_race"))
        self._record("deal.meeting", deal_id, seller_id, "share_point", None)
        self._notify(events.deal_meeting(deal_id, deal.buyer_id))
        self._publish_status(deal_id, "meeting")
        return Ok(moved)

    def confirm_receipt(self, buyer_id: str, deal_id: str) -> Result[DealView, DomainError]:
        """Buyer confirms they got the bouquet → done, listing sold, reviews open."""
        deal = self._deals.get(deal_id)
        if deal is None:
            return Err(DomainError(NOT_FOUND, "deal"))
        if deal.buyer_id != buyer_id:
            return Err(DomainError(FORBIDDEN, "not_buyer"))
        if deal.status not in ("agreed", "meeting"):
            return Err(DomainError(CONFLICT, "not_open"))
        done = self._deals.mark_done(deal_id)
        if done is None:  # a concurrent confirm/cancel already settled it
            return Err(DomainError(CONFLICT, "done_race"))
        self._record("deal.done", deal_id, buyer_id, "buyer_confirm", None)
        self._notify(events.deal_done(deal_id, deal.buyer_id, is_seller=False))
        self._notify(events.deal_done(deal_id, deal.seller_id, is_seller=True))
        self._publish_status(deal_id, "done")
        return Ok(done)

    def report(
        self, requester_id: str, deal_id: str, reason: str, request_id: str | None = None
    ) -> Result[DealView, DomainError]:
        """Either party flags a problem (no-show, not as described) → problem. Goes to
        support/moderation — no money is involved (ADR-0013)."""
        deal = self._deals.get(deal_id)
        if deal is None:
            return Err(DomainError(NOT_FOUND, "deal"))
        if requester_id not in (deal.buyer_id, deal.seller_id):  # T-06
            return Err(DomainError(FORBIDDEN, "not_a_party"))
        if deal.status not in ("agreed", "meeting"):
            return Err(DomainError(CONFLICT, "not_reportable"))
        flagged = self._deals.report(deal_id)
        if flagged is None:
            return Err(DomainError(CONFLICT, "report_race"))
        self._record("deal.problem", deal_id, requester_id, reason, request_id)
        counterparty = deal.seller_id if requester_id == deal.buyer_id else deal.buyer_id
        self._notify(events.deal_reported(deal_id, counterparty))
        self._publish_status(deal_id, "problem")
        return Ok(flagged)

    def cancel(
        self,
        requester_id: str,
        deal_id: str,
        reason: str | None = None,
        request_id: str | None = None,
    ) -> Result[DealView, DomainError]:
        """A party (or support) cancels → cancelled, listing back to active. No money."""
        deal = self._deals.get(deal_id)
        if deal is None:
            return Err(DomainError(NOT_FOUND, "deal"))
        if requester_id not in (deal.buyer_id, deal.seller_id):
            return Err(DomainError(FORBIDDEN, "not_a_party"))
        if deal.status not in ("agreed", "meeting", "problem"):
            return Err(DomainError(CONFLICT, "not_cancellable"))
        cancelled = self._deals.cancel(deal_id)
        if cancelled is None:
            return Err(DomainError(CONFLICT, "cancel_race"))
        self._record("deal.cancelled", deal_id, requester_id, reason, request_id)
        self._publish_status(deal_id, "cancelled")
        return Ok(cancelled)

    def resolve_problem(
        self,
        actor_id: str,
        deal_id: str,
        *,
        action: str,
        reason: str,
        request_id: str | None = None,
    ) -> Result[DealView, DomainError]:
        """Support/admin closes a reported deal: mark done or cancel. No money moves,
        so no 4-eyes (ADR-0013). Every outcome is audit-logged."""
        if action not in _RESOLVE_ACTIONS:
            return Err(DomainError(VALIDATION_ERROR, "action"))
        deal = self._deals.get(deal_id)
        if deal is None:
            return Err(DomainError(NOT_FOUND, "deal"))
        if deal.status != "problem":
            return Err(DomainError(CONFLICT, "not_problem"))
        resolved = self._deals.resolve_problem(deal_id, action)
        if resolved is None:
            return Err(DomainError(CONFLICT, "resolve_race"))
        self._record(f"deal.problem_resolved.{action}", deal_id, actor_id, reason, request_id)
        self._notify(events.deal_problem_resolved(deal_id, deal.buyer_id, action))
        self._notify(events.deal_problem_resolved(deal_id, deal.seller_id, action))
        self._publish_status(deal_id, resolved.status)
        return Ok(resolved)

    def get(self, deal_id: str, requester_id: str) -> Result[DealView, DomainError]:
        deal = self._deals.get(deal_id)
        if deal is None:
            return Err(DomainError(NOT_FOUND, "deal"))
        if requester_id not in (deal.buyer_id, deal.seller_id):  # IDOR guard, T-06
            return Err(DomainError(FORBIDDEN, "not_a_party"))
        return Ok(deal)

    def list_for_user(
        self, user_id: str, *, role: str | None = None, status: str | None = None, limit: int = 20
    ) -> list[DealView]:
        return self._deals.list_for_user(user_id, role=role, status=status, limit=limit)

    def list_all_deals(self, *, status: str | None = None, limit: int = 50) -> list[DealView]:
        """Admin: every deal (optionally by status). Caller must enforce admin authz."""
        return self._deals.list_all(status=status, limit=limit)
