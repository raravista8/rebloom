"""Moderation verdict (MODERATION.md §3-4)."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Literal

ModerationDecision = Literal["clean", "blocked", "review"]


@dataclass(frozen=True, slots=True)
class Verdict:
    """Outcome of an automated check.

    ``blocked`` → hard hit → API ``content_blocked`` (no echo of the term).
    ``review`` → probabilistic → listing held ``pending_review``.
    ``clean`` → publish.
    """

    decision: ModerationDecision
    category: str = ""  # profanity | hate | contact | banned

    @property
    def is_blocked(self) -> bool:
        return self.decision == "blocked"

    @property
    def needs_review(self) -> bool:
        return self.decision == "review"

    @property
    def is_clean(self) -> bool:
        return self.decision == "clean"
