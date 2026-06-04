"""Deal orchestration: create (reserve+payment) → paid_held → released (FR-020..026).

Fail-secure: a deal only leaves ``paid_held`` via an explicit confirm/support;
if the payout call fails the deal stays ``released`` in the ledger (money already
accounted) and the payout is retried — never the reverse (SECURITY A10, T-03).
"""

from __future__ import annotations

import logging

from app.core.audit.ports import AuditLog
from app.core.deals.ports import DealRepository, DealView, ListingReader
from app.core.deals.schemas import compute_commission
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
from app.core.payments.ports import PaymentProvider
from app.core.realtime.ports import RealtimeBus, deal_channel
from app.core.result import Err, Ok, Result

logger = logging.getLogger("rebloom.deals")

# Support resolutions for a disputed deal (FLOW-1 step 4).
_RESOLVE_ACTIONS: frozenset[str] = frozenset({"release", "refund", "partial"})


class DealService:
    def __init__(
        self,
        deals: DealRepository,
        listings: ListingReader,
        payments: PaymentProvider,
        commission_bps: int,
        audit: AuditLog | None = None,
        notifier: Notifier | None = None,
        bus: RealtimeBus | None = None,
    ) -> None:
        self._deals = deals
        self._listings = listings
        self._payments = payments
        self._bps = commission_bps
        self._audit = audit
        self._notifier = notifier
        self._bus = bus

    def _publish_status(self, deal_id: str, status: str) -> None:
        """Broadcast a deal status change to live WS subscribers (best-effort)."""
        if self._bus is not None:
            self._bus.publish(
                deal_channel(deal_id), {"type": "status", "deal_id": deal_id, "status": status}
            )

    def _notify(self, draft: NotificationDraft) -> None:
        """Best-effort: a notification failure must never affect the money path."""
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
    ) -> Result[tuple[DealView, str], DomainError]:
        summary = self._listings.get_summary(listing_id)
        if summary is None:
            return Err(DomainError(NOT_FOUND, "listing"))
        if summary.seller_id == buyer_id:
            return Err(DomainError(FORBIDDEN, "own_listing"))
        if summary.status != "active":
            return Err(DomainError(LISTING_UNAVAILABLE, "not_active"))

        commission = compute_commission(summary.price_kopecks, self._bps)
        deal = self._deals.create_and_reserve(
            buyer_id=buyer_id,
            listing_id=listing_id,
            seller_id=summary.seller_id,
            amount_kopecks=summary.price_kopecks,
            commission_kopecks=commission,
            delivery_method=delivery_method,
        )
        if deal is None:  # lost the reservation race under the row lock
            return Err(DomainError(LISTING_UNAVAILABLE, "reserved"))

        intent = self._payments.create_payment(deal.id, deal.amount_kopecks, deal.id)
        self._deals.attach_payment(deal.id, intent.yk_payment_id, deal.id)
        return Ok((deal, intent.confirmation_url))

    def mark_paid(self, yk_payment_id: str) -> DealView | None:
        """Idempotent: created → paid_held + hold ledger (driven by the webhook)."""
        deal = self._deals.mark_paid(yk_payment_id)
        if deal is not None and deal.status == "paid_held":
            self._notify(events.deal_paid(deal.id, deal.seller_id))  # dedup by event_id
            self._publish_status(deal.id, "paid_held")
        return deal

    def process_payment_notification(self, yk_payment_id: str) -> DealView | None:
        """Webhook entry: re-fetch the authoritative status and only then move the
        deal — never flip on the body alone or an ambiguous status (T-02, A10)."""
        if self._payments.get_payment_status(yk_payment_id) != "succeeded":
            return None
        return self._deals.mark_paid(yk_payment_id)

    def confirm_receipt(self, buyer_id: str, deal_id: str) -> Result[DealView, DomainError]:
        deal = self._deals.get(deal_id)
        if deal is None:
            return Err(DomainError(NOT_FOUND, "deal"))
        if deal.buyer_id != buyer_id:
            return Err(DomainError(FORBIDDEN, "not_buyer"))
        if deal.status != "paid_held":
            return Err(DomainError(CONFLICT, "not_paid_held"))

        released = self._deals.release(deal_id)  # FOR UPDATE; ledger + transition
        if released is None:  # a concurrent confirm/webhook already settled it
            return Err(DomainError(CONFLICT, "release_race"))

        # Ledger is already settled; payout is a best-effort, retryable side effect.
        try:
            receipt = self._payments.payout(
                deal_id, deal.seller_id, deal.payout_kopecks(), f"{deal_id}:payout"
            )
            self._deals.record_payout(deal_id, receipt.yk_payout_id, receipt.fiscal_receipt_id)
        except Exception:
            logger.warning("payout failed for deal %s — released, will retry", deal_id)
        self._record("deal.released", deal_id, buyer_id, "buyer_confirm", None)
        self._notify(events.deal_released(deal_id, deal.buyer_id, is_seller=False))
        self._notify(events.deal_released(deal_id, deal.seller_id, is_seller=True))
        self._publish_status(deal_id, "released")
        return Ok(released)

    def open_dispute(
        self, requester_id: str, deal_id: str, reason: str, request_id: str | None = None
    ) -> Result[DealView, DomainError]:
        """Either party freezes funds before release (FR-024). Funds stay held —
        fail-secure; the only way out is a support resolution."""
        deal = self._deals.get(deal_id)
        if deal is None:
            return Err(DomainError(NOT_FOUND, "deal"))
        if requester_id not in (deal.buyer_id, deal.seller_id):  # T-06
            return Err(DomainError(FORBIDDEN, "not_a_party"))
        if deal.status != "paid_held":
            return Err(DomainError(CONFLICT, "not_disputable"))

        disputed = self._deals.open_dispute(deal_id)
        if disputed is None:  # raced past paid_held
            return Err(DomainError(CONFLICT, "dispute_race"))
        self._record("deal.dispute_opened", deal_id, requester_id, reason, request_id)
        counterparty = deal.seller_id if requester_id == deal.buyer_id else deal.buyer_id
        self._notify(events.dispute_opened(deal_id, counterparty))
        self._publish_status(deal_id, "disputed")
        return Ok(disputed)

    def resolve_dispute(
        self,
        actor_id: str,
        deal_id: str,
        *,
        action: str,
        reason: str,
        refund_kopecks: int = 0,
        request_id: str | None = None,
    ) -> Result[DealView, DomainError]:
        """Support/admin closes a dispute: release to seller, full refund, or a
        partial split. Money settles in the ledger first; provider payout/refund
        are best-effort retryable side effects. Every outcome is audit-logged."""
        if action not in _RESOLVE_ACTIONS:
            return Err(DomainError(VALIDATION_ERROR, "action"))
        deal = self._deals.get(deal_id)
        if deal is None:
            return Err(DomainError(NOT_FOUND, "deal"))
        if deal.status != "disputed":
            return Err(DomainError(CONFLICT, "not_disputed"))
        if action == "partial" and not (0 < refund_kopecks < deal.amount_kopecks):
            return Err(DomainError(VALIDATION_ERROR, "refund_amount"))

        resolved = self._deals.resolve_dispute(deal_id, action, refund_kopecks)
        if resolved is None:  # raced / ledger guard
            return Err(DomainError(CONFLICT, "resolve_race"))

        try:
            if action == "release":
                self._payout(deal, deal.payout_kopecks())
            elif action == "refund":
                self._payments.refund(deal_id, deal.amount_kopecks, f"{deal_id}:refund")
            else:  # partial
                self._payments.refund(deal_id, refund_kopecks, f"{deal_id}:refund")
                self._payout(deal, deal.amount_kopecks - refund_kopecks)
        except Exception:
            logger.warning(
                "dispute %s side-effect failed for %s — settled in ledger, will retry",
                action,
                deal_id,
            )
        self._record(f"deal.dispute_resolved.{action}", deal_id, actor_id, reason, request_id)
        self._notify(events.dispute_resolved(deal_id, deal.buyer_id, action))
        self._notify(events.dispute_resolved(deal_id, deal.seller_id, action))
        self._publish_status(deal_id, resolved.status)
        return Ok(resolved)

    def _payout(self, deal: DealView, amount_kopecks: int) -> None:
        receipt = self._payments.payout(
            deal.id, deal.seller_id, amount_kopecks, f"{deal.id}:payout"
        )
        self._deals.record_payout(deal.id, receipt.yk_payout_id, receipt.fiscal_receipt_id)

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
        """The user's own deals (as buyer or seller). Read-only; no money mutation."""
        return self._deals.list_for_user(user_id, role=role, status=status, limit=limit)
