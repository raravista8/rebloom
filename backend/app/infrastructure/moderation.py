"""Lexicon loader — reads the versioned config file into a domain Lexicon.

The lexicon lives in ``config/moderation/lexicon.json`` (editable by moderators
without a code release; DB-backed editing is post-MVP). MODERATION.md §2-3.
"""

from __future__ import annotations

import json
from pathlib import Path

from app.core.moderation.lexicon import Lexicon, build_lexicon

DEFAULT_LEXICON_PATH = (
    Path(__file__).resolve().parents[2] / "config" / "moderation" / "lexicon.json"
)


def load_lexicon(path: Path = DEFAULT_LEXICON_PATH) -> Lexicon:
    data = json.loads(path.read_text(encoding="utf-8"))
    return build_lexicon(
        profanity=data.get("profanity", []),
        hate_slurs=data.get("hate_slurs", []),
        banned_terms=data.get("banned_terms", []),
        contact_patterns=data.get("contact_patterns", []),
    )
