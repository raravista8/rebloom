"""Deal lifecycle through the service — no-escrow «оплата при встрече» (ADR-0013):
create → agreed → meeting → done, plus report/cancel. No money, no ledger."""

from __future__ import annotations

from app.core.deals.service import DealService
from app.core.result import Err, Ok

from tests.fakes import FakeDealRepository, FakeListingReader


def _make() -> tuple[DealService, FakeDealRepository, FakeListingReader]:
    deals, listings = FakeDealRepository(), FakeListingReader()
    return DealService(deals, listings), deals, listings


def test_full_flow_agreed_meeting_done() -> None:
    svc, _deals, listings = _make()
    listings.seed("L", "seller", price=100_000, status="active")

    created = svc.create_deal("buyer", "L", "self_pickup")
    assert isinstance(created, Ok)
    deal = created.value
    assert deal.status == "agreed"

    met = svc.share_point("seller", deal.id)
    assert isinstance(met, Ok) and met.value.status == "meeting"

    done = svc.confirm_receipt("buyer", deal.id)
    assert isinstance(done, Ok) and done.value.status == "done"
    assert done.value.done_at is not None


def test_confirm_directly_from_agreed() -> None:
    svc, _deals, listings = _make()
    listings.seed("L", "seller", status="active")
    deal = svc.create_deal("buyer", "L", "self_pickup").value  # type: ignore[union-attr]
    done = svc.confirm_receipt("buyer", deal.id)
    assert isinstance(done, Ok) and done.value.status == "done"


def test_cannot_buy_own_listing() -> None:
    svc, _deals, listings = _make()
    listings.seed("L", "me", status="active")
    result = svc.create_deal("me", "L", "self_pickup")
    assert isinstance(result, Err) and result.error.code == "forbidden"


def test_inactive_listing_is_unavailable() -> None:
    svc, _deals, listings = _make()
    listings.seed("L", "seller", status="reserved")
    result = svc.create_deal("buyer", "L", "self_pickup")
    assert isinstance(result, Err) and result.error.code == "listing_unavailable"


def test_share_point_requires_seller() -> None:
    svc, _deals, listings = _make()
    listings.seed("L", "seller", status="active")
    deal = svc.create_deal("buyer", "L", "self_pickup").value  # type: ignore[union-attr]
    assert isinstance(svc.share_point("buyer", deal.id), Err)


def test_confirm_requires_the_buyer() -> None:
    svc, _deals, listings = _make()
    listings.seed("L", "seller", status="active")
    deal = svc.create_deal("buyer", "L", "self_pickup").value  # type: ignore[union-attr]
    result = svc.confirm_receipt("intruder", deal.id)
    assert isinstance(result, Err) and result.error.code == "forbidden"


def test_double_confirm_is_rejected() -> None:
    svc, _deals, listings = _make()
    listings.seed("L", "seller", status="active")
    deal = svc.create_deal("buyer", "L", "self_pickup").value  # type: ignore[union-attr]
    assert isinstance(svc.confirm_receipt("buyer", deal.id), Ok)
    again = svc.confirm_receipt("buyer", deal.id)
    assert isinstance(again, Err) and again.error.code == "conflict"


def test_report_then_cancel() -> None:
    svc, _deals, listings = _make()
    listings.seed("L", "seller", status="active")
    deal = svc.create_deal("buyer", "L", "self_pickup").value  # type: ignore[union-attr]
    flagged = svc.report("buyer", deal.id, "не пришёл")
    assert isinstance(flagged, Ok) and flagged.value.status == "problem"
    cancelled = svc.cancel("seller", deal.id, "договорились")
    assert isinstance(cancelled, Ok) and cancelled.value.status == "cancelled"


def test_cancel_blocked_when_done() -> None:
    svc, _deals, listings = _make()
    listings.seed("L", "seller", status="active")
    deal = svc.create_deal("buyer", "L", "self_pickup").value  # type: ignore[union-attr]
    svc.confirm_receipt("buyer", deal.id)
    blocked = svc.cancel("buyer", deal.id)
    assert isinstance(blocked, Err) and blocked.error.code == "conflict"  # done is terminal


def test_report_requires_a_party() -> None:
    svc, _deals, listings = _make()
    listings.seed("L", "seller", status="active")
    deal = svc.create_deal("buyer", "L", "self_pickup").value  # type: ignore[union-attr]
    assert isinstance(svc.report("intruder", deal.id, "x"), Err)
