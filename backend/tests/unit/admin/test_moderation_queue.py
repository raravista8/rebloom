"""Moderation-queue service (T10.1b, FR-060/061): list pending/held, approve or
reject with a mandatory reason — every decision is audit-logged (SECURITY T-11)."""

from __future__ import annotations

from app.core.admin.moderation import ModerationQueueService
from app.core.result import Err, Ok

from tests.fakes import FakeAuditLog, FakeModerationQueueRepo


def _make() -> tuple[ModerationQueueService, FakeModerationQueueRepo, FakeAuditLog]:
    repo, audit = FakeModerationQueueRepo(), FakeAuditLog()
    return ModerationQueueService(repo, audit), repo, audit


def test_queue_lists_pending_listings() -> None:
    svc, repo, _audit = _make()
    repo.seed_listing("L1")
    repo.seed_listing("L2", status="active")  # not pending → excluded
    items = svc.queue("listing")
    assert [i.id for i in items] == ["L1"]
    assert items[0].type == "listing"


def test_queue_lists_held_reviews() -> None:
    svc, repo, _audit = _make()
    repo.seed_review("R1")
    repo.seed_review("R2", status="visible")
    items = svc.queue("review")
    assert [i.id for i in items] == ["R1"]


def test_approve_listing_audited() -> None:
    svc, repo, audit = _make()
    repo.seed_listing("L1")
    res = svc.decide(
        actor_id="admin1", item_type="listing", item_id="L1", action="approve", reason="ok"
    )
    assert isinstance(res, Ok) and res.value == "active"
    assert repo._listings["L1"] == "active"
    assert audit.entries[-1]["action"] == "moderation.listing.approve"
    assert audit.entries[-1]["reason"] == "ok"


def test_reject_listing_archives() -> None:
    svc, repo, _audit = _make()
    repo.seed_listing("L1")
    res = svc.decide(
        actor_id="admin1", item_type="listing", item_id="L1", action="reject", reason="blurry"
    )
    assert isinstance(res, Ok) and res.value == "archived"
    assert repo._listings["L1"] == "archived"


def test_approve_review_makes_visible() -> None:
    svc, repo, audit = _make()
    repo.seed_review("R1")
    res = svc.decide(
        actor_id="admin1", item_type="review", item_id="R1", action="approve", reason="fine"
    )
    assert isinstance(res, Ok) and res.value == "visible"
    assert audit.entries[-1]["action"] == "moderation.review.approve"


def test_decide_twice_conflicts() -> None:
    svc, repo, _audit = _make()
    repo.seed_listing("L1")
    svc.decide(actor_id="a", item_type="listing", item_id="L1", action="approve", reason="x")
    again = svc.decide(
        actor_id="a", item_type="listing", item_id="L1", action="approve", reason="x"
    )
    assert isinstance(again, Err) and again.error.code == "conflict"


def test_unknown_item_conflicts() -> None:
    svc, _repo, _audit = _make()
    res = svc.decide(actor_id="a", item_type="review", item_id="nope", action="reject", reason="x")
    assert isinstance(res, Err) and res.error.code == "conflict"


def test_bad_action_is_validation_error() -> None:
    svc, repo, _audit = _make()
    repo.seed_listing("L1")
    res = svc.decide(actor_id="a", item_type="listing", item_id="L1", action="nuke", reason="x")
    assert isinstance(res, Err) and res.error.code == "validation_error"


def test_queue_is_capped() -> None:
    svc, repo, _audit = _make()
    for n in range(60):
        repo.seed_listing(f"L{n}")
    assert len(svc.queue("listing")) <= 50  # QUEUE_LIMIT
