"""Automated text moderation (fail-closed, MODERATION.md §3).

Order: explicit contacts → hate slurs → profanity (all hard ``blocked``) →
banned terms (``review``) → ``clean``. A future ML classifier plugs in for the
probabilistic bucket; its output is untrusted (SECURITY T-15).
"""

from __future__ import annotations

from app.core.moderation.lexicon import Lexicon
from app.core.moderation.normalize import normalize_basic, normalize_for_match
from app.core.moderation.schemas import Verdict


def _contains_any(haystack: str, needles: tuple[str, ...]) -> bool:
    return any(term in haystack for term in needles)


class ModerationService:
    def __init__(self, lexicon: Lexicon) -> None:
        self._lex = lexicon

    def check_text(self, text: str) -> Verdict:
        basic = normalize_basic(text)
        for pattern in self._lex.contact_patterns:
            if pattern.search(basic):
                return Verdict("blocked", "contact")

        squeezed = normalize_for_match(text)
        if _contains_any(squeezed, self._lex.hate_slurs):
            return Verdict("blocked", "hate")
        if _contains_any(squeezed, self._lex.profanity):
            return Verdict("blocked", "profanity")
        if _contains_any(squeezed, self._lex.banned_terms):
            return Verdict("review", "banned")
        return Verdict("clean")
