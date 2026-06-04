"""Perceptual-hash similarity (SECURITY T-09). Pure domain helpers — the actual
dHash is computed from pixels in the infrastructure image adapter; here we only
compare the resulting 64-bit hex hashes by Hamming distance.

A small distance means the images are visually near-identical (a re-encoded /
resized copy), which for a *different* owner is a stolen-photo signal."""

from __future__ import annotations

from collections.abc import Iterable

# dHash is 64 bits; ≤ this many differing bits ⇒ "the same picture" (tuned for
# re-encode/resize copies, not merely similar bouquets).
DUPLICATE_MAX_DISTANCE = 10


def hamming(hex_a: str, hex_b: str) -> int:
    """Number of differing bits between two 16-char hex (64-bit) hashes."""
    return (int(hex_a, 16) ^ int(hex_b, 16)).bit_count()


def find_duplicate(
    phash: str,
    candidates: Iterable[tuple[str, str]],
    max_distance: int = DUPLICATE_MAX_DISTANCE,
) -> str | None:
    """Return the id of the first candidate within ``max_distance`` of ``phash``,
    or None. ``candidates`` is ``(photo_id, phash)`` pairs (other owners')."""
    for photo_id, candidate in candidates:
        if candidate and hamming(phash, candidate) <= max_distance:
            return photo_id
    return None
