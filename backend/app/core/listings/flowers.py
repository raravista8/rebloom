"""Flower-type reference — a fixed, ordered list (export-next.md §2).

Canonical enum for the «тип цветов» field on a listing and the catalog filter.
Order is meaningful (it is the form/filter display order). The IDs are stable
ascii slugs; the RU labels are customer-facing copy («Передарим»).
"""

from __future__ import annotations

# (id, RU label) — order preserved; this list IS the source of truth.
FLOWERS: tuple[tuple[str, str], ...] = (
    ("roses", "Розы"),
    ("peony_roses", "Пионовидные розы"),
    ("peonies", "Пионы"),
    ("tulips", "Тюльпаны"),
    ("hydrangea", "Гортензия"),
    ("chrysanthemums", "Хризантемы"),
    ("eustoma", "Эустома"),
    ("ranunculus", "Ранункулюсы"),
    ("alstroemeria", "Альстромерия"),
    ("lilies", "Лилии"),
    ("wildflowers", "Полевые"),
)

FLOWER_IDS: frozenset[str] = frozenset(fid for fid, _ in FLOWERS)

_LABELS: dict[str, str] = dict(FLOWERS)


def label(flower_id: str) -> str | None:
    return _LABELS.get(flower_id)
