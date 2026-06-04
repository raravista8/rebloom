"""Fraud rules (ADMIN_BACKEND_TZ §Fraud). Pure threshold functions → a risk
score contribution (0 = clean). MVP is rules+thresholds+manual queue; ML scoring
is post-MVP. IP/device-based signals (multi-account, self-dealing) need the
IP_LOG/SESSION tables and land with analytics events."""

from __future__ import annotations

# Thresholds (tune from the moderation/fraud queue feedback loop).
VELOCITY_LISTINGS_PER_DAY = 10  # a young/normal account rarely exceeds this
DISPUTE_RATE_MIN_DEALS = 3  # need a few deals before the rate is meaningful
DISPUTE_RATE_THRESHOLD = 0.5  # ≥ half of deals disputed → suspicious
PRICE_ANOMALY_RATIO = 0.3  # listed ≤ 30% of the median for size/city → bait

# Score contributions per signal type.
SCORE_VELOCITY = 20
SCORE_DISPUTE_RATE = 40
SCORE_PRICE_ANOMALY = 25
SCORE_PHOTO_REUSE = 30


def velocity_score(listings_last_day: int) -> int:
    """Too many listings in a day → low-effort spam/scam pattern."""
    return SCORE_VELOCITY if listings_last_day > VELOCITY_LISTINGS_PER_DAY else 0


def dispute_rate_score(total_deals: int, disputed_deals: int) -> int:
    """A high share of disputed deals signals a bad actor (once there are enough
    deals to be meaningful)."""
    if total_deals < DISPUTE_RATE_MIN_DEALS:
        return 0
    return SCORE_DISPUTE_RATE if disputed_deals / total_deals >= DISPUTE_RATE_THRESHOLD else 0


def price_anomaly_score(price_kopecks: int, median_kopecks: int) -> int:
    """A price far below the median for the size/city is classic bait."""
    if median_kopecks <= 0:
        return 0
    return SCORE_PRICE_ANOMALY if price_kopecks <= median_kopecks * PRICE_ANOMALY_RATIO else 0
