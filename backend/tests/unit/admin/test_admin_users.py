"""Admin user management (T11.3, FR-071/072): search/detail/block/edit, audited."""

from __future__ import annotations

from app.core.admin.users import AdminUserService
from app.core.result import Err, Ok

from tests.fakes import FakeAdminUserRepo, FakeAuditLog


def _make() -> tuple[AdminUserService, FakeAdminUserRepo, FakeAuditLog]:
    repo, audit = FakeAdminUserRepo(), FakeAuditLog()
    repo.seed("u1", display_name="Аня", city="msk")
    repo.seed("u2", display_name="Борис", city="spb")
    return AdminUserService(repo, audit), repo, audit


def test_search_by_name_and_city() -> None:
    svc, _repo, _audit = _make()
    assert [r.id for r in svc.search(q="ан")] == ["u1"]
    assert [r.id for r in svc.search(city="spb")] == ["u2"]
    assert len(svc.search()) == 2


def test_detail_audits_pii_access() -> None:
    svc, _repo, audit = _make()
    res = svc.detail("admin1", "u1")
    assert isinstance(res, Ok)
    assert audit.entries[-1]["action"] == "admin.user.view"
    assert audit.entries[-1]["reason"] == "pii_access"


def test_detail_missing_user() -> None:
    svc, _repo, _audit = _make()
    assert isinstance(svc.detail("admin1", "ghost"), Err)


def test_block_then_unblock_audited() -> None:
    svc, repo, audit = _make()
    assert isinstance(svc.set_status("admin1", "u1", "blocked", "spam"), Ok)
    assert repo._users["u1"]["status"] == "blocked"
    assert audit.entries[-1]["action"] == "admin.user.blocked"

    svc.set_status("admin1", "u1", "active", "appeal upheld")
    assert repo._users["u1"]["status"] == "active"


def test_invalid_status_rejected() -> None:
    svc, _repo, _audit = _make()
    res = svc.set_status("admin1", "u1", "deleted", "x")  # not admin-settable
    assert isinstance(res, Err) and res.error.code == "validation_error"


def test_edit_audited() -> None:
    svc, repo, audit = _make()
    res = svc.edit("admin1", "u1", display_name="Анна", city_id=None, reason="typo fix")
    assert isinstance(res, Ok)
    assert repo._users["u1"]["display_name"] == "Анна"
    assert audit.entries[-1]["action"] == "admin.user.edit"
