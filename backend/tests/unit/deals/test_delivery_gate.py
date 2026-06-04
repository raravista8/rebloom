"""Address-disclosure gate (T-13, FR-030): seller sets pickup address (encrypted);
revealed to a party only after paid_held, never before, never to a stranger."""

from __future__ import annotations

import base64

from app.core.deals.delivery import DeliveryService
from app.core.result import Err, Ok
from app.infrastructure.crypto import AesGcmCipher

from tests.fakes import FakeDealRepository, FakeListingReader, FakePaymentProvider

KEY = base64.b64decode("MDEyMzQ1Njc4OWFiY2RlZjAxMjM0NTY3ODlhYmNkZWY=")
ADDRESS = "Москва, ул. Цветочная, 12"


def _held_deal() -> tuple[DeliveryService, FakeDealRepository, str]:
    from app.core.deals.service import DealService

    deals, listings, payments = FakeDealRepository(), FakeListingReader(), FakePaymentProvider()
    listings.seed("L", "seller", price=100_000, status="active")
    svc = DealService(deals, listings, payments, 1000)
    deal = svc.create_deal("buyer", "L", "self_pickup").value[0]  # type: ignore[union-attr]
    delivery = DeliveryService(deals, deals, AesGcmCipher(KEY))
    return delivery, deals, deal.id


def test_only_seller_sets_address() -> None:
    delivery, _deals, did = _held_deal()
    assert isinstance(delivery.set_address("buyer", did, ADDRESS), Err)  # buyer can't
    assert isinstance(delivery.set_address("seller", did, ADDRESS), Ok)


def test_address_is_encrypted_at_rest() -> None:
    delivery, deals, did = _held_deal()
    delivery.set_address("seller", did, ADDRESS)
    stored = deals.get_pickup_address_enc(did)
    assert stored is not None and ADDRESS not in stored  # ciphertext, not plaintext


def test_not_revealed_before_paid_held() -> None:
    delivery, _deals, did = _held_deal()  # status == created
    delivery.set_address("seller", did, ADDRESS)
    reveal = delivery.get_address("buyer", did)
    assert isinstance(reveal, Ok)
    assert reveal.value.revealed is False and reveal.value.address is None


def test_revealed_to_party_after_paid_held() -> None:
    delivery, deals, did = _held_deal()
    delivery.set_address("seller", did, ADDRESS)
    deals.mark_paid(f"yk_{did}")  # → paid_held
    reveal = delivery.get_address("buyer", did)
    assert isinstance(reveal, Ok)
    assert reveal.value.revealed is True and reveal.value.address == ADDRESS


def test_stranger_is_forbidden() -> None:
    delivery, deals, did = _held_deal()
    delivery.set_address("seller", did, ADDRESS)
    deals.mark_paid(f"yk_{did}")
    assert isinstance(delivery.get_address("intruder", did), Err)
