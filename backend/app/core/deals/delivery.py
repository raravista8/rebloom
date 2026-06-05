"""Self-pickup address exchange with the disclosure gate (FR-030, SECURITY T-13).

The seller sets the exact pickup address; it is stored AES-256-GCM-encrypted
(ADR-0012) and revealed to the buyer **only after** the deal is ``paid_held``
(coarse geo before that). Either party may read it once revealed; nobody else
(IDOR guard, T-06)."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Protocol

from app.core.crypto.ports import FieldCipher
from app.core.deals.ports import DealRepository
from app.core.errors import CONFLICT, FORBIDDEN, NOT_FOUND, DomainError
from app.core.result import Err, Ok, Result

# Statuses at/after which the exact pickup address may be revealed (after the seller
# shares the point → meeting). No-escrow: there is no payment to gate on (ADR-0013).
_REVEALED_STATUSES = frozenset({"meeting", "done", "problem"})


class PickupAddressStore(Protocol):
    def set_pickup_address(self, deal_id: str, address_enc: str) -> bool: ...
    def get_pickup_address_enc(self, deal_id: str) -> str | None: ...


@dataclass(frozen=True, slots=True)
class AddressReveal:
    revealed: bool
    address: str | None


class DeliveryService:
    def __init__(
        self, deals: DealRepository, store: PickupAddressStore, cipher: FieldCipher
    ) -> None:
        self._deals = deals
        self._store = store
        self._cipher = cipher

    def set_address(self, seller_id: str, deal_id: str, address: str) -> Result[None, DomainError]:
        deal = self._deals.get(deal_id)
        if deal is None:
            return Err(DomainError(NOT_FOUND, "deal"))
        if deal.seller_id != seller_id:  # only the seller provides the meeting point
            return Err(DomainError(FORBIDDEN, "not_seller"))
        if deal.status in ("done", "cancelled"):
            return Err(DomainError(CONFLICT, "deal_closed"))
        self._store.set_pickup_address(deal_id, self._cipher.encrypt(address.strip()))
        return Ok(None)

    def get_address(self, requester_id: str, deal_id: str) -> Result[AddressReveal, DomainError]:
        deal = self._deals.get(deal_id)
        if deal is None:
            return Err(DomainError(NOT_FOUND, "deal"))
        if requester_id not in (deal.buyer_id, deal.seller_id):  # IDOR (T-06)
            return Err(DomainError(FORBIDDEN, "not_a_party"))
        if deal.status not in _REVEALED_STATUSES:  # T-13: coarse until paid
            return Ok(AddressReveal(revealed=False, address=None))
        enc = self._store.get_pickup_address_enc(deal_id)
        address = self._cipher.decrypt(enc) if enc else None
        return Ok(AddressReveal(revealed=True, address=address))
