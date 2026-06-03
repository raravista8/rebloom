"""Normalization converges obfuscated variants to one canonical form."""

from __future__ import annotations

from app.core.moderation.normalize import normalize_basic, normalize_for_match

CANONICAL = "бадворд"


def test_variants_converge() -> None:
    variants = [
        "бадворд",
        "Б А Д В О Р Д",  # spaced
        "бааадворд",  # repeats
        "бaдвoрд",  # latin a/o homoglyphs
        "6адворд",  # leet 6→б
        "бад-ворд!",  # punctuation
    ]
    assert all(normalize_for_match(v) == CANONICAL for v in variants)


def test_diacritics_and_yo_folded() -> None:
    assert normalize_for_match("ёлка") == normalize_for_match("елка")


def test_basic_keeps_digits() -> None:
    assert normalize_basic("Тел: 8-916") == "тел: 8-916"
