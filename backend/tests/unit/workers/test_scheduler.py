"""Scheduler due-job selection (single-box deploy)."""

from __future__ import annotations

from app.workers.scheduler import JOBS, due_jobs


def test_all_due_at_boot() -> None:
    # last_run empty + a realistic epoch (> the longest interval) → every job is
    # due on the first tick (matches real boot, where now = time.time()).
    assert set(due_jobs(now=1_700_000_000.0, last_run={})) == {n for n, _i, _f in JOBS}


def test_respects_intervals() -> None:
    now = 10_000.0
    # Everything just ran.
    last_run = {name: now for name, _i, _f in JOBS}
    assert due_jobs(now, last_run) == []

    # 90s later: only the 60s notifications job is due.
    assert due_jobs(now + 90, last_run) == ["notifications"]

    # 400s later: notifications (60s) + reservations (300s).
    assert set(due_jobs(now + 400, last_run)) == {"notifications", "reservations"}


def test_intervals_are_sane() -> None:
    by_name = {name: interval for name, interval, _f in JOBS}
    assert (
        by_name["notifications"] < by_name["reservations"] < by_name["fraud"] < by_name["retention"]
    )
