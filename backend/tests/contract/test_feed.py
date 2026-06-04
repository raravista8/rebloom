"""Feed/search endpoints wire through the envelope (API_CONTRACT §3)."""

from __future__ import annotations

from app.api.feed import get_feed_service
from app.core.feed.service import FeedService
from app.main import create_app
from fastapi.testclient import TestClient

from tests.fakes import FakeFeedRepository, make_listing_view


def test_feed_endpoint_returns_cards() -> None:
    app = create_app()
    app.dependency_overrides[get_feed_service] = lambda: FeedService(
        FakeFeedRepository([make_listing_view("l1"), make_listing_view("l2")])
    )
    resp = TestClient(app).get("/api/feed?city_id=msk&section=liked")
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert len(data["items"]) == 2
    assert {"id", "photo_thumb_url", "price_kopecks", "like_count", "seller"} <= set(
        data["items"][0]
    )
    assert data["applied"]["city_id"] == "msk"


def test_search_endpoint_echoes_query_and_filters() -> None:
    app = create_app()
    app.dependency_overrides[get_feed_service] = lambda: FeedService(FakeFeedRepository([]))
    resp = TestClient(app).get("/api/search?city_id=msk&q=розы&size=L&price_min=50000")
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert data["items"] == []
    assert data["applied"]["q"] == "розы"
    assert data["applied"]["filters"] == {"size": "L", "price_min": 50000}


def test_search_rejects_bad_enum() -> None:
    app = create_app()
    app.dependency_overrides[get_feed_service] = lambda: FeedService(FakeFeedRepository([]))
    resp = TestClient(app).get("/api/search?city_id=msk&size=ZZ")
    assert resp.status_code == 422
