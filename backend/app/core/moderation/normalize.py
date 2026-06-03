"""Text normalization to defeat obfuscation before denylist matching.

NFKC → lowercase → strip diacritics → map latin/leet homoglyphs to Cyrillic →
drop separators → collapse repeats. So ``б а д``, ``бaд`` (latin a), ``6ад`` and
``баад`` all converge to one canonical form (MODERATION.md §3.1).
"""

from __future__ import annotations

import re
import unicodedata

# Latin look-alikes + leet digits → Cyrillic canonical.
_HOMOGLYPHS = str.maketrans(
    {
        "a": "а",
        "b": "ь",
        "c": "с",
        "e": "е",
        "h": "н",
        "k": "к",
        "m": "м",
        "n": "п",
        "o": "о",
        "p": "р",
        "t": "т",
        "x": "х",
        "y": "у",
        "0": "о",
        "3": "е",
        "4": "ч",
        "6": "б",
    }
)

_NON_WORD = re.compile(r"[^а-яёa-z0-9]")
_REPEATS = re.compile(r"(.)\1+")


def _strip_diacritics(text: str) -> str:
    decomposed = unicodedata.normalize("NFD", text)
    return "".join(c for c in decomposed if not unicodedata.combining(c))


def normalize_basic(text: str) -> str:
    """Light normalization for regex scans (phones/handles keep their digits)."""
    return unicodedata.normalize("NFKC", text).lower()


def normalize_for_match(text: str) -> str:
    """Aggressive canonical form for substring denylist matching."""
    text = normalize_basic(text)
    text = _strip_diacritics(text).lower()
    text = text.translate(_HOMOGLYPHS)
    text = _NON_WORD.sub("", text)
    return _REPEATS.sub(r"\1", text)
