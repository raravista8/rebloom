"""Live metrics service (T11.1, FR-065/070): online / DAU / MAU / by-platform."""

from __future__ import annotations

from datetime import UTC, datetime

from app.core.analytics.metrics import (
    MetricsService,
    normalize_platform,
    recent_days,
)

from tests.fakes import FakeMetricsRecorder


def test_normalize_platform() -> None:
    assert normalize_platform("iOS") == "ios"
    assert normalize_platform("bogus") == "web"
    assert normalize_platform(None) == "web"


def test_recent_days_most_recent_first() -> None:
    now = datetime(2026, 6, 4, tzinfo=UTC)
    days = recent_days(now, 3)
    assert days == ["2026-06-04", "2026-06-03", "2026-06-02"]


def test_record_activity_marks_heartbeat_and_day() -> None:
    rec = FakeMetricsRecorder()
    svc = MetricsService(rec)
    svc.record_activity("u1", "ios", now_ts=1000.0, day="2026-06-04")
    assert rec.heartbeats == {"u1": 1000.0}
    assert rec.active == [("u1", "2026-06-04", "ios")]


def test_online_within_window() -> None:
    rec = FakeMetricsRecorder()
    svc = MetricsService(rec)
    svc.record_activity("u1", "web", now_ts=1000.0, day="d")
    svc.record_activity("u2", "web", now_ts=1100.0, day="d")
    assert svc.online(now_ts=1200.0) == 2  # both within the 300s window
    assert svc.online(now_ts=1350.0) == 1  # u1 (1000<1050) stale, u2 (1100) ok
    assert svc.online(now_ts=1500.0) == 0  # both older than 300s


def test_dau_mau_and_platform_split() -> None:
    rec = FakeMetricsRecorder()
    svc = MetricsService(rec)
    today, ystr = "2026-06-04", "2026-06-03"
    svc.record_activity("u1", "ios", 1.0, today)
    svc.record_activity("u2", "android", 1.0, today)
    svc.record_activity("u1", "ios", 1.0, ystr)  # same user, earlier day
    svc.record_activity("u3", "web", 1.0, ystr)

    days = [today, ystr]
    assert svc.dau(days) == 2  # u1, u2 today
    assert svc.mau(days) == 3  # u1, u2, u3 over the window
    assert svc.by_platform(days) == {"web": 1, "ios": 1, "android": 1}
