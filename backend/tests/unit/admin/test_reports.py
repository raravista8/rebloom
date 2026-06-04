"""User abuse reports (T11.5, FR-064): validation + queue."""

from __future__ import annotations

from app.core.moderation.reports import ReportService
from app.core.result import Err, Ok

from tests.fakes import FakeReportRepo


def _svc() -> tuple[ReportService, FakeReportRepo]:
    repo = FakeReportRepo()
    return ReportService(repo), repo


def test_report_listing() -> None:
    svc, _repo = _svc()
    res = svc.report("u1", "listing", "L1", "чужие фото")
    assert isinstance(res, Ok) and res.value.startswith("report-")


def test_bad_target_type() -> None:
    svc, _repo = _svc()
    res = svc.report("u1", "comment", "X", "x")
    assert isinstance(res, Err) and res.error.code == "validation_error"


def test_cannot_report_self() -> None:
    svc, _repo = _svc()
    res = svc.report("u1", "user", "u1", "x")
    assert isinstance(res, Err) and res.error.code == "validation_error"


def test_queue_lists_open() -> None:
    svc, _repo = _svc()
    svc.report("u1", "user", "u2", "груб")
    svc.report("u3", "listing", "L9", "скам")
    assert len(svc.queue()) == 2
