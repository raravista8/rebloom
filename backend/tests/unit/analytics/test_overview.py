"""Admin overview assembly (T11.2b, FR-070): metrics + ledger finance + user stats
into one KPI bundle."""

from __future__ import annotations

from datetime import UTC, datetime

from app.core.analytics.finance import FinanceService
from app.core.analytics.metrics import MetricsService
from app.core.analytics.overview import OverviewService

from tests.fakes import FakeFinanceRepo, FakeMetricsRecorder, FakeUsersStatsRepo

NOW = datetime(2026, 6, 4, 12, 0, tzinfo=UTC)


def _svc() -> OverviewService:
    rec = FakeMetricsRecorder()
    today = NOW.strftime("%Y-%m-%d")
    rec.heartbeat("u1", NOW.timestamp())
    rec.mark_active("u1", today, "ios")
    rec.mark_active("u2", today, "web")
    finance = FinanceService(
        FakeFinanceRepo(
            totals={"hold": 100_000, "commission": 10_000, "payout": 90_000},
            deals={"released": 1},
        )
    )
    users = FakeUsersStatsRepo(total=42, by_city={"msk": 30, "spb": 12}, growth={"2026-06-04": 5})
    return OverviewService(MetricsService(rec), finance, users)


def test_overview_bundles_all_sections() -> None:
    data = _svc().overview(NOW)
    assert data["online"] == 1
    assert data["dau"] == 2  # u1, u2 active today
    assert data["users_by_platform"] == {"web": 1, "ios": 1, "android": 0}
    assert data["users_total"] == 42
    assert data["users_by_city"] == {"msk": 30, "spb": 12}
    assert data["gmv_kopecks"] == 100_000
    assert data["commission_kopecks"] == 10_000
    assert data["held_kopecks"] == 0
    assert data["deals_by_status"] == {"released": 1}
    assert data["growth_series"] == {"2026-06-04": 5}
