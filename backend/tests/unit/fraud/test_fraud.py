"""Fraud rules + signal service (T11.4, FR-073)."""

from __future__ import annotations

from app.core.fraud.rules import (
    SCORE_DISPUTE_RATE,
    SCORE_VELOCITY,
    dispute_rate_score,
    price_anomaly_score,
    velocity_score,
)
from app.core.fraud.service import FraudService

from tests.fakes import FakeFraudRepo


def test_velocity_rule() -> None:
    assert velocity_score(5) == 0
    assert velocity_score(11) == SCORE_VELOCITY


def test_dispute_rate_rule() -> None:
    assert dispute_rate_score(2, 2) == 0  # too few deals to judge
    assert dispute_rate_score(4, 1) == 0  # 25% — fine
    assert dispute_rate_score(4, 3) == SCORE_DISPUTE_RATE  # 75% — suspicious


def test_price_anomaly_rule() -> None:
    assert price_anomaly_score(9000, 10000) == 0  # near median
    assert price_anomaly_score(2000, 10000) > 0  # 20% of median → bait
    assert price_anomaly_score(5000, 0) == 0  # no median → no signal


def test_service_records_only_positive_scores() -> None:
    repo = FakeFraudRepo()
    svc = FraudService(repo)
    svc.record("u1", "velocity", 0, {})  # ignored
    svc.record("u1", "velocity", 20, {"listings_last_day": "12"})
    q = svc.queue()
    assert len(q) == 1 and q[0].type == "velocity" and q[0].score == 20


def test_queue_sorted_by_score_desc() -> None:
    repo = FakeFraudRepo()
    svc = FraudService(repo)
    svc.record("u1", "velocity", 20, {})
    svc.record("u2", "dispute_rate", 40, {})
    assert [s.score for s in svc.queue()] == [40, 20]


def test_record_is_idempotent_per_user_type() -> None:
    repo = FakeFraudRepo()
    svc = FraudService(repo)
    svc.record("u1", "velocity", 20, {})
    svc.record("u1", "velocity", 25, {})  # same user+type → updates, not dup
    assert len(svc.queue()) == 1 and svc.queue()[0].score == 25
