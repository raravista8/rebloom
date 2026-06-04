"""Support tickets (T12.4, FR-092): create / queue / resolve + SLA-overdue flag."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta

from app.core.result import Err, Ok
from app.core.support.service import SupportService

from tests.fakes import FakeAuditLog, FakeSupportRepo


def _svc() -> tuple[SupportService, FakeSupportRepo, FakeAuditLog]:
    repo, audit = FakeSupportRepo(), FakeAuditLog()
    return SupportService(repo, audit), repo, audit


def test_open_ticket_valid_category() -> None:
    svc, _repo, _audit = _svc()
    res = svc.open_ticket("u1", "payment", "не прошла оплата")
    assert isinstance(res, Ok) and res.value.startswith("ticket-")


def test_bad_category() -> None:
    svc, _repo, _audit = _svc()
    res = svc.open_ticket("u1", "spaceship", "x")
    assert isinstance(res, Err) and res.error.code == "validation_error"


def test_resolve_audited() -> None:
    svc, repo, audit = _svc()
    tid = svc.open_ticket("u1", "deal", "проблема").value  # type: ignore[union-attr]
    res = svc.resolve("admin1", tid, "помогли", datetime.now(UTC).isoformat())
    assert isinstance(res, Ok)
    assert repo._tickets[tid]["status"] == "resolved"
    assert audit.entries[-1]["action"] == "support.ticket.resolved"


def test_resolve_unknown_ticket() -> None:
    svc, _repo, _audit = _svc()
    res = svc.resolve("admin1", "ghost", "x", datetime.now(UTC).isoformat())
    assert isinstance(res, Err) and res.error.code == "validation_error"


def test_sla_overdue_flag() -> None:
    svc, repo, _audit = _svc()
    now = datetime.now(UTC)
    repo.seed("old", created_at=(now - timedelta(hours=25)).isoformat())
    repo.seed("fresh", created_at=(now - timedelta(hours=1)).isoformat())
    by_id = {t.id: t.to_api(now=now) for t in svc.queue()}
    assert by_id["old"]["sla_overdue"] is True
    assert by_id["fresh"]["sla_overdue"] is False
