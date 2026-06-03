"""Freshness scoring + expiry (FR-013/014).

Score = base(freshness label) × time-decay over the listing's lifetime, so the
feed favours fresher bouquets and the score reaches ~0 at expiry.
"""

from __future__ import annotations

_BASE: dict[str, float] = {"today": 1.0, "d1_2": 0.7, "d3_plus": 0.4}


def freshness_score(freshness: str, age_hours: float, expiry_hours: float) -> float:
    base = _BASE.get(freshness, 0.4)
    decay = max(0.0, 1.0 - age_hours / expiry_hours) if expiry_hours > 0 else 0.0
    return round(base * decay, 4)


def is_expired(age_hours: float, expiry_hours: float) -> bool:
    return age_hours >= expiry_hours
