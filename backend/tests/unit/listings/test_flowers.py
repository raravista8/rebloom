"""Flower-type reference list (export-next §2)."""

from __future__ import annotations

from app.core.listings.flowers import FLOWER_IDS, FLOWERS, label


def test_exactly_eleven_in_fixed_order() -> None:
    ids = [fid for fid, _ in FLOWERS]
    assert ids == [
        "roses",
        "peony_roses",
        "peonies",
        "tulips",
        "hydrangea",
        "chrysanthemums",
        "eustoma",
        "ranunculus",
        "alstroemeria",
        "lilies",
        "wildflowers",
    ]


def test_ids_are_unique() -> None:
    ids = [fid for fid, _ in FLOWERS]
    assert len(ids) == len(set(ids)) == len(FLOWER_IDS)


def test_label_lookup() -> None:
    assert label("roses") == "Розы"
    assert label("wildflowers") == "Полевые"
    assert label("unknown") is None
