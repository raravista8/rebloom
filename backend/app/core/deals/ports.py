"""Deals ports — repository (transactional status path) + listing reader.

No-escrow model (ADR-0013): transitions are conditional UPDATEs (WHERE status=…) so
concurrent confirm/cancel/report settle exactly once. No payment/ledger methods.
"""

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
    amount_kopecks: int  # reference price of the listing — NOT a charge (ADR-0013)
    delivery_method: str
    done_at: str | None = None
    created_at: str | None = None
    # Display enrichment (None when not loaded).
    listing_thumb_url: str | None = None
    listing_price_kopecks: int | None = None
    buyer_name: str | None = None
    buyer_rating: float | None = None
    seller_name: str | None = None
    seller_rating: float | None = None

    def to_api(self, *, role: str) -> dict[str, Any]:
        # Nested listing/counterparty per API_CONTRACT §4. price_kopecks is the
        # listing's reference price; the platform processes no payment.
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
                "price_kopecks": self.listing_price_kopecks
                if self.listing_price_kopecks is not None
                else self.amount_kopecks,
            },
            "counterparty": {"id": cp_id, "display_name": cp_name, "seller_rating": cp_rating},
            "delivery_method": self.delivery_method,
            "created_at": self.created_at,
            "done_at": self.done_at,
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
    """Status transitions are single-transaction conditional UPDATEs that lock the
    deal row, so concurrent confirm/cancel/report settle exactly once."""

    def create_and_reserve(
        self,
        *,
        buyer_id: str,
        listing_id: str,
        seller_id: str,
        amount_kopecks: int,
        delivery_method: str,
    ) -> DealView | None: ...

    def get(self, deal_id: str) -> DealView | None: ...
    def list_for_user(
        self, user_id: str, *, role: str | None = None, status: str | None = None, limit: int = 20
    ) -> list[DealView]: ...
    def list_all(self, *, status: str | None = None, limit: int = 50) -> list[DealView]: ...

    def to_meeting(self, deal_id: str) -> DealView | None: ...  # agreed → meeting
    def mark_done(self, deal_id: str) -> DealView | None: ...  # agreed|meeting → done, listing sold
    def report(self, deal_id: str) -> DealView | None: ...  # agreed|meeting → problem
    def cancel(self, deal_id: str) -> DealView | None: ...  # → cancelled, listing active
    def resolve_problem(
        self, deal_id: str, action: str
    ) -> DealView | None: ...  # problem → done|cancelled
