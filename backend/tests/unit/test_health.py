"""Health/version endpoints return the standard envelope."""

from __future__ import annotations

from fastapi.testclient import TestClient


def test_healthz_alive(client: TestClient) -> None:
    resp = client.get("/healthz")
    assert resp.status_code == 200
    body = resp.json()
    assert body == {"ok": True, "data": {"status": "alive"}}


def test_readyz_envelope(client: TestClient) -> None:
    resp = client.get("/readyz")
    assert resp.status_code == 200
    body = resp.json()
    assert body["ok"] is True
    assert body["data"]["ready"] is True


def test_version_stamp(client: TestClient) -> None:
    resp = client.get("/version")
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert set(data) == {"git_sha", "built_at"}


def test_unknown_route_is_not_found(client: TestClient) -> None:
    resp = client.get("/does-not-exist")
    assert resp.status_code == 404
