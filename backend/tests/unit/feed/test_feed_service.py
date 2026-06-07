"""Feed/search pagination + applied echo (FR-016, INTERACTION_STATES §6)."""

from __future__ import annotations

from app.core.feed.schemas import SearchFilters
from app.core.feed.service import FeedService

from tests.fakes import FakeFeedRepository, make_listing_view


def test_feed_empty_has_no_cursor() -> None:
    out = FeedService(FakeFeedRepository([])).feed("msk", "fresh", None, 20)
    assert out["items"] == []
    assert out["next_cursor"] is None
    assert out["applied"]["city_id"] == "msk"
    assert out["applied"]["section"] == "fresh"


def test_feed_pagination_advances_cursor_then_ends() -> None:
    items = [make_listing_view(f"l{i}") for i in range(25)]
    service = FeedService(FakeFeedRepository(items))

    first = service.feed("msk", "fresh", None, 20)
    assert len(first["items"]) == 20
    assert first["next_cursor"] == "20"

    last = service.feed("msk", "fresh", "20", 20)
    assert len(last["items"]) == 5
    assert last["next_cursor"] is None  # end-of-list


def test_limit_is_clamped() -> None:
    items = [make_listing_view(f"l{i}") for i in range(60)]
    out = FeedService(FakeFeedRepository(items)).feed("msk", "fresh", None, 999)
    assert len(out["items"]) == 50  # MAX_LIMIT


def test_empty_vs_no_results_via_applied_echo() -> None:
    service = FeedService(FakeFeedRepository([]))

    # empty: no query/filter → applied.filters is empty
    empty = service.search("msk", None, SearchFilters(), None, 20)
    assert empty["items"] == []
    assert empty["applied"]["q"] is None
    assert empty["applied"]["filters"] == {}

    # no-results: query/filter set → applied echoes them
    no_results = service.search("msk", "розы", SearchFilters(size="L"), None, 20)
    assert no_results["items"] == []
    assert no_results["applied"]["q"] == "розы"
    assert no_results["applied"]["filters"] == {"size": "L"}


def test_search_echoes_metro_and_flowers_filters() -> None:
    service = FeedService(FakeFeedRepository([]))
    out = service.search(
        "msk",
        None,
        SearchFilters(metro=("msk-kievskaya", "msk-kurskaya"), flowers=("roses",)),
        None,
        20,
    )
    assert out["applied"]["filters"] == {
        "metro": ["msk-kievskaya", "msk-kurskaya"],
        "flowers": ["roses"],
    }


def test_search_includes_total() -> None:
    items = [make_listing_view(f"l{i}") for i in range(7)]
    out = FeedService(FakeFeedRepository(items)).search("msk", None, SearchFilters(), None, 3)
    assert len(out["items"]) == 3  # one page
    assert out["total"] == 7  # all matches under the filters, not the page size
    assert out["next_cursor"] == "3"
