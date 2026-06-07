"""ListingCreateIn validation + ListingView rendering for metro + flowers.

API_CONTRACT §3: card carries `metro` (resolved) + `flower_types`; create-body
validates the metro id and the flower-type ids (reject unknown / cap / dedupe).
"""

from __future__ import annotations

from datetime import UTC, datetime

import pytest
from app.core.listings.schemas import ListingCreateIn, ListingView, PhotoRef
from pydantic import ValidationError


def _base(**over: object) -> dict[str, object]:
    payload: dict[str, object] = {
        "size": "M",
        "freshness": "today",
        "price_kopecks": 150000,
        "city_id": "msk",
        "photo_ids": ["p1"],
    }
    payload.update(over)
    return payload


def test_metro_and_flowers_default_to_absent_and_empty() -> None:
    data = ListingCreateIn(**_base())  # type: ignore[arg-type]
    assert data.metro_station_id is None
    assert data.flower_types == []


def test_valid_metro_and_flowers_accepted() -> None:
    data = ListingCreateIn(
        **_base(metro_station_id="msk-kievskaya", flower_types=["roses", "peonies"])  # type: ignore[arg-type]
    )
    assert data.metro_station_id == "msk-kievskaya"
    assert data.flower_types == ["roses", "peonies"]


def test_invalid_metro_id_rejected() -> None:
    with pytest.raises(ValidationError):
        ListingCreateIn(**_base(metro_station_id="msk-not-real"))  # type: ignore[arg-type]


def test_unknown_flower_type_rejected() -> None:
    with pytest.raises(ValidationError):
        ListingCreateIn(**_base(flower_types=["roses", "cactus"]))  # type: ignore[arg-type]


def test_flower_types_deduped_preserving_order() -> None:
    data = ListingCreateIn(**_base(flower_types=["roses", "peonies", "roses"]))  # type: ignore[arg-type]
    assert data.flower_types == ["roses", "peonies"]


def test_flower_types_capped() -> None:
    too_many = ["roses", "peonies", "tulips", "lilies", "eustoma", "ranunculus", "alstroemeria"]
    with pytest.raises(ValidationError):
        ListingCreateIn(**_base(flower_types=too_many))  # type: ignore[arg-type]


def _view(metro: str | None, flowers: tuple[str, ...]) -> ListingView:
    return ListingView(
        id="l1",
        seller_id="s1",
        seller_display_name="Аня",
        seller_rating=4.8,
        size="M",
        freshness="today",
        price_kopecks=150000,
        city_id="msk",
        geo_coarse="Патрики",
        metro_station_id=metro,
        flower_types=flowers,
        status="active",
        like_count=0,
        freshness_score=1.0,
        expires_at=datetime(2026, 6, 10, tzinfo=UTC),
        photos=(PhotoRef(id="p1", moderation_status="approved", thumb_url="/t.webp"),),
    )


def test_card_carries_resolved_metro_and_flowers() -> None:
    card = _view("msk-kurskaya", ("roses",)).to_card()
    assert card["metro"] is not None
    assert card["metro"]["name"] == "Курская"
    assert card["flower_types"] == ["roses"]


def test_card_metro_null_when_absent() -> None:
    card = _view(None, ()).to_card()
    assert card["metro"] is None
    assert card["flower_types"] == []


def test_detail_keeps_city_and_metro_and_flowers() -> None:
    detail = _view("msk-kievskaya", ("peonies",)).to_detail()
    assert detail["city_id"] == "msk"  # detail keeps city AND metro
    assert detail["metro"]["name"] == "Киевская"
    assert detail["flower_types"] == ["peonies"]
    assert detail["geo_coarse"] == "Патрики"
