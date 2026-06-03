"""Freshness scoring + expiry (FR-013/014)."""

from __future__ import annotations

from app.core.listings.freshness import freshness_score, is_expired


def test_score_starts_at_base_and_decays() -> None:
    assert freshness_score("today", age_hours=0, expiry_hours=72) == 1.0
    assert freshness_score("d1_2", age_hours=0, expiry_hours=72) == 0.7
    mid = freshness_score("today", age_hours=36, expiry_hours=72)
    assert 0.49 <= mid <= 0.51


def test_score_floors_at_zero_after_expiry() -> None:
    assert freshness_score("today", age_hours=100, expiry_hours=72) == 0.0


def test_fresher_label_outranks_staler_at_same_age() -> None:
    assert freshness_score("today", 10, 72) > freshness_score("d3_plus", 10, 72)


def test_is_expired() -> None:
    assert not is_expired(71, 72)
    assert is_expired(72, 72)
