"""ЮKassa adapter (ADR-0003). Sandbox stand-in until real creds exist.

Deterministic ids, no card data, no network — the real HTTP adapter (hold/split/
payout + 54-ФЗ + webhook signature) replaces this behind the same PaymentProvider
port (OPERATIONS §4). Card data never touches this module (SECURITY §1).
"""

from __future__ import annotations

from app.core.payments.ports import PaymentIntent, PayoutReceipt, RefundReceipt


class SandboxYooKassa:
    """Implements :class:`app.core.payments.ports.PaymentProvider`."""

    def __init__(self, base_url: str = "https://yookassa.test") -> None:
        self._base = base_url.rstrip("/")

    def create_payment(
        self, deal_id: str, amount_kopecks: int, idempotency_key: str
    ) -> PaymentIntent:
        return PaymentIntent(
            yk_payment_id=f"yk_pay_{deal_id}",
            confirmation_url=f"{self._base}/checkout/{deal_id}",
        )

    def payout(
        self, deal_id: str, seller_id: str, amount_kopecks: int, idempotency_key: str
    ) -> PayoutReceipt:
        return PayoutReceipt(yk_payout_id=f"yk_pout_{deal_id}", fiscal_receipt_id=f"rcpt_{deal_id}")

    def refund(self, deal_id: str, amount_kopecks: int, idempotency_key: str) -> RefundReceipt:
        return RefundReceipt(
            yk_refund_id=f"yk_ref_{deal_id}", fiscal_receipt_id=f"rcpt_ref_{deal_id}"
        )

    def get_payment_status(self, yk_payment_id: str) -> str:
        return "succeeded"
