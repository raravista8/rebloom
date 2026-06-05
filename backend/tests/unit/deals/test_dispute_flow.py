"""Report (was dispute) lifecycle — no-escrow «оплата при встрече» (ADR-0013):
a party flags a problem → problem; support closes it done/cancelled. No money moves."""

from __future__ import annotations

from app.core.deals.service import DealService
from app.core.result import Err, Ok

from tests.fakes import FakeAuditLog, FakeDealRepository, FakeListingReader


def _make() -> tuple[DealService, FakeDealRepository, FakeAuditLog]:
    deals, listings, audit = FakeDealRepository(), FakeListingReader(), FakeAuditLog()
    listings.seed("L", "seller", price=100_000, status="active")
    return DealService(deals, listings, audit=audit), deals, audit


def _agreed(svc: DealService) -> str:
    return svc.create_deal("buyer", "L", "self_pickup").value.id  # type: ignore[union-attr]


def test_party_reports_problem() -> None:
    svc, _deals, _audit = _make()
    did = _agreed(svc)
    result = svc.report("buyer", did, reason="не пришёл")
    assert isinstance(result, Ok) and result.value.status == "problem"


def test_buyer_cannot_confirm_while_problem_unresolved() -> None:
    svc, _deals, _audit = _make()
    did = _agreed(svc)
    svc.report("buyer", did, reason="x")
    # confirm only allowed from agreed/meeting, not problem
    assert isinstance(svc.confirm_receipt("buyer", did), Err)


def test_non_party_cannot_report() -> None:
    svc, _deals, _audit = _make()
    did = _agreed(svc)
    result = svc.report("intruder", did, reason="x")
    assert isinstance(result, Err) and result.error.code == "forbidden"


def test_cannot_report_a_done_deal() -> None:
    svc, _deals, _audit = _make()
    did = _agreed(svc)
    svc.confirm_receipt("buyer", did)  # → done
    assert isinstance(svc.report("buyer", did, reason="x"), Err)


def test_resolve_done_marks_done() -> None:
    svc, _deals, audit = _make()
    did = _agreed(svc)
    svc.report("buyer", did, reason="x")
    result = svc.resolve_problem("admin", did, action="done", reason="всё ок")
    assert isinstance(result, Ok) and result.value.status == "done"
    assert any("problem_resolved.done" in str(e["action"]) for e in audit.entries)


def test_resolve_cancelled_cancels() -> None:
    svc, _deals, _audit = _make()
    did = _agreed(svc)
    svc.report("buyer", did, reason="x")
    result = svc.resolve_problem("admin", did, action="cancelled", reason="возврат")
    assert isinstance(result, Ok) and result.value.status == "cancelled"


def test_resolve_action_must_be_valid() -> None:
    svc, _deals, _audit = _make()
    did = _agreed(svc)
    svc.report("buyer", did, reason="x")
    assert isinstance(svc.resolve_problem("admin", did, action="refund", reason="x"), Err)


def test_cannot_resolve_a_non_problem_deal() -> None:
    svc, _deals, _audit = _make()
    did = _agreed(svc)  # still agreed, not reported
    result = svc.resolve_problem("admin", did, action="done", reason="x")
    assert isinstance(result, Err) and result.error.code == "conflict"


def test_resolved_problem_is_terminal() -> None:
    svc, _deals, _audit = _make()
    did = _agreed(svc)
    svc.report("buyer", did, reason="x")
    svc.resolve_problem("admin", did, action="done", reason="x")
    again = svc.resolve_problem("admin", did, action="cancelled", reason="x")
    assert isinstance(again, Err)
