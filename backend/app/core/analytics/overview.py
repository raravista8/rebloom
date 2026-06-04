"""Admin overview (FR-070, ADMIN_BACKEND_TZ §API): one read-only KPI bundle
combining live metrics (online/DAU/MAU/platform), ledger finance (GMV/commission/
deals-by-status), and user counts (total / by-city / growth). Tamper-proof —
finance is ledger-derived, nothing here writes."""

from __future__ import annotations

from datetime import datetime
from typing import Any, Protocol

from app.core.analytics.finance import FinanceService
from app.core.analytics.metrics import MetricsService, recent_days

GROWTH_DAYS = 30


class UsersStatsRepo(Protocol):
    def total(self) -> int: ...
    def by_city(self) -> dict[str, int]: ...
    def registrations_since(self, since_iso: str) -> dict[str, int]:
        """Registration counts keyed by ``YYYY-MM-DD`` since ``since_iso``."""
        ...


class OverviewService:
    def __init__(
        self, metrics: MetricsService, finance: FinanceService, users: UsersStatsRepo
    ) -> None:
        self._metrics = metrics
        self._finance = finance
        self._users = users

    def overview(
        self, now: datetime, since: str | None = None, until: str | None = None
    ) -> dict[str, Any]:
        days = recent_days(now, GROWTH_DAYS)
        fin = self._finance.summary(since, until)
        return {
            "online": self._metrics.online(now.timestamp()),
            "dau": self._metrics.dau(days),
            "mau": self._metrics.mau(days),
            "users_by_platform": self._metrics.by_platform(days),
            "users_total": self._users.total(),
            "users_by_city": self._users.by_city(),
            "gmv_kopecks": fin.gmv_kopecks,
            "commission_kopecks": fin.commission_kopecks,
            "held_kopecks": fin.held_kopecks,
            "deals_by_status": fin.deals_by_status,
            "growth_series": self._users.registrations_since(days[-1]),
        }
