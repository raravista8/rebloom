"""DSR service (T12.3, ФЗ-152, FR-091): export / delete / correct, all audited."""

from __future__ import annotations

from app.core.privacy.service import PrivacyService
from app.core.result import Err, Ok

from tests.fakes import FakeAuditLog, FakePrivacyRepository

UID = "user-1"


def _make() -> tuple[PrivacyService, FakePrivacyRepository, FakeAuditLog]:
    repo, audit = FakePrivacyRepository(), FakeAuditLog()
    repo.seed(UID)
    return PrivacyService(repo, audit), repo, audit


def test_export_returns_bundle_and_audits() -> None:
    svc, _repo, audit = _make()
    res = svc.export(UID)
    assert isinstance(res, Ok)
    assert set(res.value) >= {"profile", "consents", "listings", "deals", "reviews", "messages"}
    assert any(e["action"] == "dsr.export" for e in audit.entries)


def test_export_unknown_user_not_found() -> None:
    svc, _repo, _audit = _make()
    res = svc.export("ghost")
    assert isinstance(res, Err) and res.error.code == "not_found"


def test_delete_requires_confirm() -> None:
    svc, repo, _audit = _make()
    res = svc.request_deletion(UID, confirm=False)
    assert isinstance(res, Err) and res.error.code == "validation_error"
    assert UID not in repo.deleted  # nothing happened


def test_delete_soft_disables_and_schedules() -> None:
    svc, repo, audit = _make()
    res = svc.request_deletion(UID, confirm=True)
    assert isinstance(res, Ok) and res.value  # scheduled_at iso string
    assert repo._users[UID]["status"] == "deleted"  # soft-disabled now
    assert UID in repo.deleted
    assert any(e["action"] == "dsr.delete_requested" for e in audit.entries)


def test_delete_unknown_user_not_found() -> None:
    svc, _repo, _audit = _make()
    res = svc.request_deletion("ghost", confirm=True)
    assert isinstance(res, Err) and res.error.code == "not_found"


def test_correct_updates_profile_and_audits() -> None:
    svc, repo, audit = _make()
    res = svc.correct(UID, display_name="Анна", city_id=None)
    assert isinstance(res, Ok) and res.value.display_name == "Анна"
    assert repo._users[UID]["display_name"] == "Анна"
    assert repo._users[UID]["city_id"] == "msk"  # untouched
    assert any(e["action"] == "dsr.correct" for e in audit.entries)
