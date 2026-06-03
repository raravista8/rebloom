"""Phone normalization → canonical RU E.164."""

from __future__ import annotations

import pytest
from app.core.auth.schemas import mask_phone, normalize_phone


@pytest.mark.parametrize(
    ("raw", "expected"),
    [
        ("+79161234567", "+79161234567"),
        ("89161234567", "+79161234567"),
        ("79161234567", "+79161234567"),
        ("9161234567", "+79161234567"),
        ("+7 (916) 123-45-67", "+79161234567"),
        ("8 916 123 45 67", "+79161234567"),
    ],
)
def test_normalize_valid(raw: str, expected: str) -> None:
    assert normalize_phone(raw) == expected


@pytest.mark.parametrize(
    "raw",
    ["", "123", "+123456", "12345678901234", "abcdefghij", "+11234567890"],
)
def test_normalize_invalid(raw: str) -> None:
    assert normalize_phone(raw) is None


def test_mask_phone_keeps_last_two() -> None:
    masked = mask_phone("+79161234567")
    assert masked.startswith("+7")
    assert masked.endswith("67")
    assert len(masked) == len("+79161234567")
    assert "9161234" not in masked  # middle digits hidden
