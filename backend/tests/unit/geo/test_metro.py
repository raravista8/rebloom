"""Metro reference data — integrity invariants + resolve/lookup (export-next §1)."""

from __future__ import annotations

import pytest
from app.core.geo.metro import (
    LINES,
    STATIONS,
    get_station,
    is_valid,
    resolve,
    stations_for_city,
)


def test_every_station_line_id_is_a_known_line() -> None:
    """Invariant: no station references a line that doesn't exist."""
    for station in STATIONS.values():
        for lid in station.line_ids:
            assert lid in LINES, f"{station.id} references unknown line {lid}"


def test_every_station_has_at_least_one_line() -> None:
    for station in STATIONS.values():
        assert station.line_ids, f"{station.id} has no line"


def test_station_id_matches_its_city_prefix() -> None:
    for sid, station in STATIONS.items():
        assert sid == station.id
        assert sid.startswith(f"{station.city_id}-")


def test_line_colours_are_hex() -> None:
    for line in LINES.values():
        assert line.color.startswith("#") and len(line.color) == 7


def test_msk_has_all_15_lines_and_spb_has_5() -> None:
    assert sum(1 for lid in LINES if lid.startswith("msk-")) == 15
    assert sum(1 for lid in LINES if lid.startswith("spb-")) == 5


def test_resolve_single_line_station() -> None:
    out = resolve("msk-sokolniki")
    assert out is not None
    assert out["id"] == "msk-sokolniki"
    assert out["name"] == "Сокольники"
    assert out["lines"] == [{"name": "Сокольническая", "color": "#D41317"}]


def test_resolve_transfer_is_multicolour() -> None:
    """Киевская sits on 3 lines → 3 coloured entries."""
    out = resolve("msk-kievskaya")
    assert out is not None
    lines = out["lines"]
    assert isinstance(lines, list)
    assert len(lines) == 3
    colours = {entry["color"] for entry in lines}
    assert len(colours) == 3  # each line a distinct colour


def test_resolve_none_and_unknown_return_none() -> None:
    assert resolve(None) is None
    assert resolve("msk-does-not-exist") is None


def test_is_valid_and_get_station() -> None:
    assert is_valid("spb-sennaya-ploshchad") is True
    assert is_valid("nsk-anything") is False
    assert get_station("nope") is None
    assert get_station("msk-kurskaya") is not None


def test_stations_for_city_scopes_by_city() -> None:
    msk = stations_for_city("msk")
    spb = stations_for_city("spb")
    assert all(s.city_id == "msk" for s in msk)
    assert all(s.city_id == "spb" for s in spb)
    assert stations_for_city("nsk") == []  # no metro seeded → fallback handled by callers


@pytest.mark.parametrize("sid", ["msk-komsomolskaya", "spb-ploshchad-vosstaniya"])
def test_named_transfer_hubs_present(sid: str) -> None:
    assert is_valid(sid)
