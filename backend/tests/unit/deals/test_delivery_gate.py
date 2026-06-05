"""Address-disclosure gate (T-13, FR-030): seller sets pickup address (encrypted);
revealed to a party only after the seller shares the point (meeting) — never before,
never to a stranger. No-escrow: no payment to gate on (ADR-0013)."""

from __future__ import annotations

import base64

from app.core.deals.delivery import DeliveryService
from app.core.deals.service import DealService
from app.core.result import Err, Ok
from app.infrastructure.crypto import AesGcmCipher

from tests.fakes import FakeDealRepository, FakeListingReader

KEY = base64.b64decode("MDEyMzQ1Njc4OWFiY2RlZjAxMjM0NTY3ODlhYmNkZWY=")
ADDRESS = "Москва, ул. Цветочная, 12"


def _agreed_deal() -> tuple[DeliveryService, FakeDealRepository, str]:
    deals, listings = FakeDealRepository(), FakeListingReader()
    listings.seed("L", "seller", price=100_000, status="active")
    svc = DealService(deals, listings)
    deal = svc.create_deal("buyer", "L", "self_pickup").value  # type: ignore[union-attr]
    delivery = DeliveryService(deals, deals, AesGcmCipher(KEY))
    return delivery, deals, deal.id


def test_only_seller_sets_address() -> None:
    delivery, _deals, did = _agreed_deal()
    assert isinstance(delivery.set_address("buyer", did, ADDRESS), Err)  # buyer can't
    assert isinstance(delivery.set_address("seller", did, ADDRESS), Ok)


def test_address_is_encrypted_at_rest() -> None:
    delivery, deals, did = _agreed_deal()
    delivery.set_address("seller", did, ADDRESS)
    stored = deals.get_pickup_address_enc(did)
    assert stored is not None and ADDRESS not in stored  # ciphertext, not plaintext


def test_not_revealed_before_meeting() -> None:
    delivery, _deals, did = _agreed_deal()  # status == agreed
    delivery.set_address("seller", did, ADDRESS)
    reveal = delivery.get_address("buyer", did)
    assert isinstance(reveal, Ok)
    assert reveal.value.revealed is False and reveal.value.address is None


def test_revealed_to_party_after_meeting() -> None:
    delivery, deals, did = _agreed_deal()
    delivery.set_address("seller", did, ADDRESS)
    deals.to_meeting(did)  # seller shared the point → meeting
    reveal = delivery.get_address("buyer", did)
    assert isinstance(reveal, Ok)
    assert reveal.value.revealed is True and reveal.value.address == ADDRESS


def test_stranger_is_forbidden() -> None:
    delivery, deals, did = _agreed_deal()
    delivery.set_address("seller", did, ADDRESS)
    deals.to_meeting(did)
    assert isinstance(delivery.get_address("intruder", did), Err)
