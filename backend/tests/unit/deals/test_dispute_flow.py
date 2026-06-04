"""Dispute lifecycle (T5.6, FR-024, SECURITY T-11): a party freezes funds, support
resolves release/refund/partial — every outcome conserves money (ledger settles to
0) and is audit-logged. Fail-secure: nothing auto-releases while disputed."""

from __future__ import annotations

from app.core.deals.ledger import LedgerEntry, escrow_balance
from app.core.deals.service import DealService
from app.core.result import Err, Ok

from tests.fakes import (
    FakeAuditLog,
    FakeDealRepository,
    FakeListingReader,
    FakePaymentProvider,
)

BPS = 1000  # 10%
PRICE = 100_000


def _make() -> tuple[DealService, FakeDealRepository, FakePaymentProvider, FakeAuditLog]:
    deals, listings, payments, audit = (
        FakeDealRepository(),
        FakeListingReader(),
        FakePaymentProvider(),
        FakeAuditLog(),
    )
    listings.seed("L", "seller", price=PRICE, status="active")
    svc = DealService(deals, listings, payments, BPS, audit=audit)
    return svc, deals, payments, audit


def _held_deal(svc: DealService, deals: FakeDealRepository) -> str:
    deal = svc.create_deal("buyer", "L", "self_pickup").value[0]  # type: ignore[union-attr]
    deals.mark_paid(f"yk_{deal.id}")
    return deal.id


def _balance(deals: FakeDealRepository, deal_id: str) -> int:
    return escrow_balance([LedgerEntry(deal_id, k, a) for k, a in deals.ledger(deal_id)])


# --- opening a dispute -------------------------------------------------------


def test_party_opens_dispute_freezes_funds() -> None:
    svc, deals, _pay, audit = _make()
    did = _held_deal(svc, deals)

    res = svc.open_dispute("buyer", did, reason="не получил букет")
    assert isinstance(res, Ok) and res.value.status == "disputed"
    assert _balance(deals, did) == PRICE  # funds stay held — fail-secure
    assert any(e["action"] == "deal.dispute_opened" for e in audit.entries)


def test_buyer_cannot_confirm_while_disputed() -> None:
    svc, deals, _pay, _audit = _make()
    did = _held_deal(svc, deals)
    svc.open_dispute("seller", did, reason="не забирает")
    # Funds are frozen: the normal release path is closed off.
    res = svc.confirm_receipt("buyer", did)
    assert isinstance(res, Err) and res.error.code == "conflict"


def test_non_party_cannot_open_dispute() -> None:
    svc, deals, _pay, _audit = _make()
    did = _held_deal(svc, deals)
    res = svc.open_dispute("intruder", did, reason="x")
    assert isinstance(res, Err) and res.error.code == "forbidden"


def test_cannot_dispute_unpaid_deal() -> None:
    svc, deals, _pay, _audit = _make()
    deal = svc.create_deal("buyer", "L", "self_pickup").value[0]  # type: ignore[union-attr]
    res = svc.open_dispute("buyer", deal.id, reason="x")
    assert isinstance(res, Err) and res.error.code == "conflict"


# --- resolving a dispute -----------------------------------------------------


def test_resolve_release_pays_seller_and_settles() -> None:
    svc, deals, payments, audit = _make()
    did = _held_deal(svc, deals)
    svc.open_dispute("buyer", did, reason="x")

    res = svc.resolve_dispute("admin1", did, action="release", reason="seller right")
    assert isinstance(res, Ok) and res.value.status == "released"
    assert _balance(deals, did) == 0
    assert payments.payouts == [(did, "seller", 90_000)]  # price − 10%
    assert not payments.refunds
    assert any(e["action"] == "deal.dispute_resolved.release" for e in audit.entries)


def test_resolve_refund_returns_buyer_and_settles() -> None:
    svc, deals, payments, audit = _make()
    did = _held_deal(svc, deals)
    svc.open_dispute("buyer", did, reason="x")

    res = svc.resolve_dispute("admin1", did, action="refund", reason="buyer right")
    assert isinstance(res, Ok) and res.value.status == "refunded"
    assert _balance(deals, did) == 0
    assert payments.refunds == [(did, PRICE)]
    assert not payments.payouts
    assert any(e["action"] == "deal.dispute_resolved.refund" for e in audit.entries)


def test_resolve_partial_splits_and_settles() -> None:
    svc, deals, payments, audit = _make()
    did = _held_deal(svc, deals)
    svc.open_dispute("buyer", did, reason="x")

    res = svc.resolve_dispute(
        "admin1", did, action="partial", refund_kopecks=30_000, reason="half-wilted"
    )
    assert isinstance(res, Ok) and res.value.status == "refunded"
    assert _balance(deals, did) == 0  # 30k refund + 70k payout == 100k held
    assert payments.refunds == [(did, 30_000)]
    assert payments.payouts == [(did, "seller", 70_000)]
    assert any(e["action"] == "deal.dispute_resolved.partial" for e in audit.entries)


def test_partial_amount_must_be_within_bounds() -> None:
    svc, deals, _pay, _audit = _make()
    did = _held_deal(svc, deals)
    svc.open_dispute("buyer", did, reason="x")
    for bad in (0, PRICE, PRICE + 1):
        res = svc.resolve_dispute("admin1", did, action="partial", refund_kopecks=bad, reason="x")
        assert isinstance(res, Err) and res.error.code == "validation_error"


def test_cannot_resolve_a_non_disputed_deal() -> None:
    svc, deals, _pay, _audit = _make()
    did = _held_deal(svc, deals)  # paid_held, not disputed
    res = svc.resolve_dispute("admin1", did, action="release", reason="x")
    assert isinstance(res, Err) and res.error.code == "conflict"


def test_resolved_dispute_is_terminal() -> None:
    svc, deals, _pay, _audit = _make()
    did = _held_deal(svc, deals)
    svc.open_dispute("buyer", did, reason="x")
    svc.resolve_dispute("admin1", did, action="refund", reason="x")
    again = svc.resolve_dispute("admin1", did, action="release", reason="x")
    assert isinstance(again, Err) and again.error.code == "conflict"
