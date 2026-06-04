"""Single-process periodic scheduler for the single-box deploy (docs/runbooks/
deploy-single-box.md). Runs the backend's maintenance jobs on fixed intervals in
one container — no external cron / RQ-scheduler needed at MVP scale. Each job is
best-effort and isolated: a failing job is logged and never stops the loop.

When the deploy grows past one box, move these to a real scheduler (RQ-scheduler
/ k8s CronJob) — the job functions stay identical."""

from __future__ import annotations

import logging
import time
from collections.abc import Callable

logger = logging.getLogger("rebloom.workers.scheduler")

TICK_SECONDS = 30


def _notifications() -> None:
    from app.infrastructure.notifications import LogEmailProvider, LogPushProvider
    from app.infrastructure.postgres.notifications_repo import PostgresNotificationOutbox
    from app.workers.notifications import deliver_pending

    deliver_pending(PostgresNotificationOutbox(), LogPushProvider(), LogEmailProvider())


def _reservations() -> None:
    from app.workers.reservations import expire_stale_reservations

    expire_stale_reservations()


def _fraud() -> None:
    from app.workers.fraud import scan

    scan()


def _retention() -> None:
    from app.workers.retention import anonymize_due_deletions

    anonymize_due_deletions()


# (name, interval seconds, fn). All run once at boot (last_run starts at 0).
JOBS: list[tuple[str, int, Callable[[], None]]] = [
    ("notifications", 60, _notifications),
    ("reservations", 300, _reservations),
    ("fraud", 3600, _fraud),
    ("retention", 86400, _retention),
]


def due_jobs(now: float, last_run: dict[str, float]) -> list[str]:
    """Names of jobs whose interval has elapsed since their last run."""
    return [name for name, interval, _fn in JOBS if now - last_run.get(name, 0.0) >= interval]


def run_forever(tick_seconds: int = TICK_SECONDS) -> None:  # pragma: no cover
    fns = {name: fn for name, _interval, fn in JOBS}
    last_run: dict[str, float] = {}
    logger.info("scheduler started (%d jobs)", len(JOBS))
    while True:
        now = time.time()
        for name in due_jobs(now, last_run):
            try:
                fns[name]()
            except Exception:
                logger.exception("scheduled job %s failed", name)
            last_run[name] = now
        time.sleep(tick_seconds)


def main() -> None:  # pragma: no cover
    from app.config import get_settings
    from app.infrastructure.logging import configure_logging

    configure_logging(get_settings().log_level)
    run_forever()


if __name__ == "__main__":
    main()
