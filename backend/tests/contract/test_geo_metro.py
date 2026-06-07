"""Metro catalog endpoint — feeds the web picker + filters (API_CONTRACT §3)."""

from __future__ import annotations

from app.main import create_app
from fastapi.testclient import TestClient


def test_msk_returns_stations_with_a_transfer_hub() -> None:
    resp = TestClient(create_app()).get("/api/geo/metro", params={"city_id": "msk"})
    assert resp.status_code == 200
    stations = resp.json()["data"]["stations"]
    assert len(stations) > 0
    # shape: {id, name, lines:[{name,color}]}
    for s in stations:
        assert set(s) == {"id", "name", "lines"}
        assert all({"name", "color"} == set(line) for line in s["lines"])
    # a transfer hub carries more than one line (multi-colour dots)
    assert any(len(s["lines"]) > 1 for s in stations)


def test_no_metro_city_returns_empty_list() -> None:
    resp = TestClient(create_app()).get("/api/geo/metro", params={"city_id": "nsk"})
    assert resp.status_code == 200
    assert resp.json()["data"]["stations"] == []
