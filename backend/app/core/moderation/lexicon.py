"""Lexicon value object — denylists in normalized form + compiled contact regexes.

Built from config data (loaded by infrastructure); this module stays pure.
"""

from __future__ import annotations

import re
from collections.abc import Iterable
from dataclasses import dataclass

from app.core.moderation.normalize import normalize_for_match


@dataclass(frozen=True, slots=True)
class Lexicon:
    profanity: tuple[str, ...]
    hate_slurs: tuple[str, ...]
    banned_terms: tuple[str, ...]
    contact_patterns: tuple[re.Pattern[str], ...]


def _normalize_terms(terms: Iterable[str]) -> tuple[str, ...]:
    return tuple(sorted({n for t in terms if (n := normalize_for_match(t))}))


def build_lexicon(
    *,
    profanity: Iterable[str],
    hate_slurs: Iterable[str],
    banned_terms: Iterable[str],
    contact_patterns: Iterable[str],
) -> Lexicon:
    return Lexicon(
        profanity=_normalize_terms(profanity),
        hate_slurs=_normalize_terms(hate_slurs),
        banned_terms=_normalize_terms(banned_terms),
        contact_patterns=tuple(re.compile(p, re.IGNORECASE) for p in contact_patterns),
    )
