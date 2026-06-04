"""Cities endpoint returns only enabled launch cities (T4.3)."""

from __future__ import annotations

from app.api.cities import get_city_repo
from app.main import create_app
from fastapi.testclient import TestClient

from tests.fakes import FakeCityRepository


def test_lists_only_enabled_cities() -> None:
    app = create_app()
    app.dependency_overrides[get_city_repo] = lambda: FakeCityRepository(enabled=("msk", "spb"))
    resp = TestClient(app).get("/api/cities")
    assert resp.status_code == 200
    items = resp.json()["data"]["items"]
    assert [c["id"] for c in items] == ["msk", "spb"]
    assert all({"id", "name"} == set(c) for c in items)
