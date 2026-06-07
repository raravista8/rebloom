"""Search metro/flowers filters + total count against real Postgres.

OR within each group (metro IN, flower_types overlap), AND across groups; the
JSON-array-overlap SQL (``flower_types::jsonb ?| …``) only runs on a real PG, so
this is an integration test. ``total`` must reflect the filtered count, not the
page size.
"""

from __future__ import annotations

import secrets
from datetime import UTC, datetime, timedelta

import pytest
from app.core.feed.schemas import SearchFilters
from app.infrastructure.postgres.engine import writer_session
from app.infrastructure.postgres.feed_repo import PostgresFeedRepository
from app.infrastructure.postgres.models import Listing, User

pytestmark = pytest.mark.integration


def _phone() -> str:
    return "+79" + "".join(secrets.choice("0123456789") for _ in range(9))


def _seed(
    city_id: str,
    metro: str | None,
    flowers: list[str],
    *,
    size: str = "M",
) -> str:
    """Insert one active listing; return the seller's city for scoping. Each test
    uses a unique city slug so listings don't collide across runs/tests."""
    with writer_session() as session:
        seller = User(phone=_phone(), display_name="Аня")
        session.add(seller)
        session.flush()
        listing = Listing(
            seller_id=seller.id,
            size=size,
            freshness="today",
            price_kopecks=150000,
            city_id=city_id,
            metro_station_id=metro,
            flower_types=flowers,
            status="active",
            freshness_score=1.0,
            expires_at=datetime.now(UTC) + timedelta(days=1),
        )
        session.add(listing)
        session.flush()
        return str(listing.id)


def _city() -> str:
    # city_id column is String(8); a short unique slug keeps the test's listings
    # isolated from any other rows.
    return "t" + secrets.token_hex(3)  # 7 chars


def test_metro_filter_is_or_within_group() -> None:
    repo = PostgresFeedRepository()
    city = _city()
    a = _seed(city, "msk-kievskaya", [])
    b = _seed(city, "msk-kurskaya", [])
    _seed(city, "msk-sokolniki", [])  # not in the requested set

    page, has_more, total = repo.search(
        city, SearchFilters(metro=("msk-kievskaya", "msk-kurskaya")), 0, 20
    )
    ids = {v.id for v in page}
    assert ids == {a, b}
    assert total == 2
    assert has_more is False


def test_flowers_filter_is_overlap_or() -> None:
    repo = PostgresFeedRepository()
    city = _city()
    a = _seed(city, None, ["roses", "peonies"])
    b = _seed(city, None, ["tulips"])
    _seed(city, None, ["lilies"])  # no overlap with the request

    page, _has_more, total = repo.search(city, SearchFilters(flowers=("roses", "tulips")), 0, 20)
    ids = {v.id for v in page}
    assert ids == {a, b}  # roses-listing AND tulips-listing both overlap
    assert total == 2


def test_metro_and_flowers_combined_is_and_across_groups() -> None:
    repo = PostgresFeedRepository()
    city = _city()
    match = _seed(city, "msk-kievskaya", ["roses"])
    _seed(city, "msk-kievskaya", ["lilies"])  # right metro, wrong flowers
    _seed(city, "msk-sokolniki", ["roses"])  # right flowers, wrong metro

    page, _has_more, total = repo.search(
        city, SearchFilters(metro=("msk-kievskaya",), flowers=("roses",)), 0, 20
    )
    assert {v.id for v in page} == {match}
    assert total == 1


def test_total_reflects_filtered_count_not_page_size() -> None:
    repo = PostgresFeedRepository()
    city = _city()
    for _ in range(5):
        _seed(city, "msk-kievskaya", ["roses"])
    _seed(city, "msk-sokolniki", ["roses"])  # filtered out by metro

    page, has_more, total = repo.search(city, SearchFilters(metro=("msk-kievskaya",)), 0, 2)
    assert len(page) == 2  # page is capped
    assert has_more is True
    assert total == 5  # count of ALL matches under the filter


def test_no_filters_counts_all_active_in_city() -> None:
    repo = PostgresFeedRepository()
    city = _city()
    _seed(city, "msk-kievskaya", ["roses"])
    _seed(city, None, [])
    page, _has_more, total = repo.search(city, SearchFilters(), 0, 20)
    assert total == 2
    assert len(page) == 2


def test_metro_resolves_in_the_card() -> None:
    repo = PostgresFeedRepository()
    city = _city()
    _seed(city, "msk-kurskaya", ["roses"])
    page, _has_more, _total = repo.search(city, SearchFilters(), 0, 20)
    card = page[0].to_card()
    assert card["metro"]["name"] == "Курская"
    assert card["flower_types"] == ["roses"]
