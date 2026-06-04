"""Perceptual-hash comparison (T3.4, SECURITY T-09)."""

from __future__ import annotations

from app.core.photos.phash import DUPLICATE_MAX_DISTANCE, find_duplicate, hamming


def test_hamming_identical_is_zero() -> None:
    assert hamming("0123456789abcdef", "0123456789abcdef") == 0


def test_hamming_counts_differing_bits() -> None:
    assert hamming("0000000000000000", "000000000000000f") == 4  # 0xf = 4 set bits
    assert hamming("0000000000000000", "ffffffffffffffff") == 64


def test_find_duplicate_matches_near() -> None:
    target = "0000000000000000"
    near = "0000000000000003"  # distance 2 ≤ threshold
    far = "ffffffffffffffff"  # distance 64
    assert find_duplicate(target, [("far", far), ("near", near)]) == "near"


def test_find_duplicate_none_when_all_far() -> None:
    assert find_duplicate("0000000000000000", [("a", "ffffffffffffffff")]) is None


def test_threshold_boundary() -> None:
    # exactly DUPLICATE_MAX_DISTANCE bits set ⇒ still a match
    bits = (1 << DUPLICATE_MAX_DISTANCE) - 1
    assert find_duplicate("0000000000000000", [("x", f"{bits:016x}")]) == "x"
    over = (1 << (DUPLICATE_MAX_DISTANCE + 1)) - 1
    assert find_duplicate("0000000000000000", [("x", f"{over:016x}")]) is None


def test_empty_candidate_hash_ignored() -> None:
    assert find_duplicate("0000000000000000", [("x", "")]) is None
