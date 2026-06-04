"""Payment provider port (ADR-0003). Implemented by the ЮKassa adapter."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Protocol


@dataclass(frozen=True, slots=True)
class PaymentIntent:
    yk_payment_id: str
    confirmation_url: str


@dataclass(frozen=True, slots=True)
class PayoutReceipt:
    yk_payout_id: str
    fiscal_receipt_id: str | None


class PaymentProvider(Protocol):
    """Escrow hold (create_payment) + split payout to the seller. Idempotency
    keys make retries safe (SECURITY T-03)."""

    def create_payment(
        self, deal_id: str, amount_kopecks: int, idempotency_key: str
    ) -> PaymentIntent: ...

    def payout(
        self, deal_id: str, seller_id: str, amount_kopecks: int, idempotency_key: str
    ) -> PayoutReceipt: ...

    def get_payment_status(self, yk_payment_id: str) -> str:
        """Re-fetch authoritative status — webhooks are never trusted by body
        alone (SECURITY T-02). Returns e.g. ``succeeded`` / ``pending``."""
        ...
