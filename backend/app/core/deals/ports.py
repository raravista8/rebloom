"""Deals ports — repository (transactional money path) + listing reader."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Protocol


@dataclass(frozen=True, slots=True)
class DealView:
    id: str
    status: str
    listing_id: str
    buyer_id: str
    seller_id: str
    amount_kopecks: int
    commission_kopecks: int
    delivery_method: str
    released_at: str | None
    created_at: str | None = None
    # Display enrichment (None when not loaded — money logic never reads these).
    listing_thumb_url: str | None = None
    listing_price_kopecks: int | None = None
    buyer_name: str | None = None
    buyer_rating: float | None = None
    seller_name: str | None = None
    seller_rating: float | None = None

    def payout_kopecks(self) -> int:
        return self.amount_kopecks - self.commission_kopecks

    def to_api(self, *, role: str) -> dict[str, Any]:
        # Nested listing/counterparty per API_CONTRACT §4.
        if role == "buyer":
            cp_id, cp_name, cp_rating = self.seller_id, self.seller_name, self.seller_rating
        else:
            cp_id, cp_name, cp_rating = self.buyer_id, self.buyer_name, self.buyer_rating
        return {
            "id": self.id,
            "status": self.status,
            "role": role,
            "listing": {
                "id": self.listing_id,
                "photo_thumb_url": self.listing_thumb_url,
                "price_kopecks": self.listing_price_kopecks,
            },
            "counterparty": {"id": cp_id, "display_name": cp_name, "seller_rating": cp_rating},
            "amount_kopecks": self.amount_kopecks,
            "commission_kopecks": self.commission_kopecks,
            "delivery_method": self.delivery_method,
            "created_at": self.created_at,
            "released_at": self.released_at,
        }


@dataclass(frozen=True, slots=True)
class ListingSummary:
    id: str
    status: str
    price_kopecks: int
    seller_id: str


class ListingReader(Protocol):
    def get_summary(self, listing_id: str) -> ListingSummary | None: ...


class DealRepository(Protocol):
    """All mutations are single-transaction; release/mark_paid lock the deal row
    (SELECT … FOR UPDATE) so concurrent confirms/webhooks settle exactly once."""

    def create_and_reserve(
        self,
        *,
        buyer_id: str,
        listing_id: str,
        seller_id: str,
        amount_kopecks: int,
        commission_kopecks: int,
        delivery_method: str,
    ) -> DealView | None: ...

    def attach_payment(self, deal_id: str, yk_payment_id: str, idempotency_key: str) -> None: ...
    def get(self, deal_id: str) -> DealView | None: ...
    def list_for_user(
        self, user_id: str, *, role: str | None = None, status: str | None = None, limit: int = 20
    ) -> list[DealView]: ...
    def list_all(self, *, status: str | None = None, limit: int = 50) -> list[DealView]: ...
    def mark_paid(self, yk_payment_id: str) -> DealView | None: ...
    def release(self, deal_id: str) -> DealView | None: ...
    def open_dispute(self, deal_id: str) -> DealView | None: ...
    def resolve_dispute(
        self, deal_id: str, action: str, refund_kopecks: int = 0
    ) -> DealView | None: ...
    def record_payout(
        self, deal_id: str, yk_payout_id: str, fiscal_receipt_id: str | None
    ) -> None: ...
