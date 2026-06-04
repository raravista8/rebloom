"""Deal lifecycle through the service: create → paid_held → released, ledger settles."""

from __future__ import annotations

from app.core.deals.ledger import LedgerEntry, escrow_balance
from app.core.deals.service import DealService
from app.core.result import Err, Ok

from tests.fakes import FakeDealRepository, FakeListingReader, FakePaymentProvider

BPS = 1000  # 10%


def _make() -> tuple[DealService, FakeDealRepository, FakeListingReader, FakePaymentProvider]:
    deals, listings, payments = (
        FakeDealRepository(),
        FakeListingReader(),
        FakePaymentProvider(),
    )
    return DealService(deals, listings, payments, BPS), deals, listings, payments


def _balance(deals: FakeDealRepository, deal_id: str) -> int:
    return escrow_balance([LedgerEntry(deal_id, kind, amt) for kind, amt in deals.ledger(deal_id)])


def test_full_flow_settles_ledger_and_pays_seller() -> None:
    svc, deals, listings, payments = _make()
    listings.seed("L", "seller", price=100_000, status="active")

    created = svc.create_deal("buyer", "L", "self_pickup")
    assert isinstance(created, Ok)
    deal, url = created.value
    assert deal.status == "created" and url

    paid = svc.mark_paid(f"yk_{deal.id}")  # webhook
    assert paid is not None and paid.status == "paid_held"
    assert _balance(deals, deal.id) == 100_000  # funds held

    released = svc.confirm_receipt("buyer", deal.id)
    assert isinstance(released, Ok) and released.value.status == "released"
    assert _balance(deals, deal.id) == 0  # settled — escrow break = 0
    assert payments.payouts == [(deal.id, "seller", 90_000)]  # price − 10%


def test_cannot_buy_own_listing() -> None:
    svc, _deals, listings, _pay = _make()
    listings.seed("L", "me", status="active")
    result = svc.create_deal("me", "L", "self_pickup")
    assert isinstance(result, Err) and result.error.code == "forbidden"


def test_inactive_listing_is_unavailable() -> None:
    svc, _deals, listings, _pay = _make()
    listings.seed("L", "seller", status="reserved")
    result = svc.create_deal("buyer", "L", "self_pickup")
    assert isinstance(result, Err) and result.error.code == "listing_unavailable"


def test_confirm_requires_the_buyer() -> None:
    svc, deals, listings, _pay = _make()
    listings.seed("L", "seller", status="active")
    deal = svc.create_deal("buyer", "L", "self_pickup").value[0]  # type: ignore[union-attr]
    deals.mark_paid(f"yk_{deal.id}")
    result = svc.confirm_receipt("intruder", deal.id)
    assert isinstance(result, Err) and result.error.code == "forbidden"


def test_double_confirm_is_rejected() -> None:
    svc, deals, listings, _pay = _make()
    listings.seed("L", "seller", status="active")
    deal = svc.create_deal("buyer", "L", "self_pickup").value[0]  # type: ignore[union-attr]
    deals.mark_paid(f"yk_{deal.id}")
    assert isinstance(svc.confirm_receipt("buyer", deal.id), Ok)
    again = svc.confirm_receipt("buyer", deal.id)
    assert isinstance(again, Err) and again.error.code == "conflict"


def test_mark_paid_is_idempotent() -> None:
    svc, deals, listings, _pay = _make()
    listings.seed("L", "seller", price=100_000, status="active")
    deal = svc.create_deal("buyer", "L", "self_pickup").value[0]  # type: ignore[union-attr]
    svc.mark_paid(f"yk_{deal.id}")
    svc.mark_paid(f"yk_{deal.id}")  # retried webhook
    assert _balance(deals, deal.id) == 100_000  # single hold, not doubled


def test_get_deal_blocks_non_party() -> None:
    svc, deals, listings, _pay = _make()
    listings.seed("L", "seller", status="active")
    deal = svc.create_deal("buyer", "L", "self_pickup").value[0]  # type: ignore[union-attr]
    assert isinstance(svc.get(deal.id, "buyer"), Ok)
    assert isinstance(svc.get(deal.id, "seller"), Ok)
    blocked = svc.get(deal.id, "stranger")
    assert isinstance(blocked, Err) and blocked.error.code == "forbidden"
