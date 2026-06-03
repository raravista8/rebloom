"""The shipped lexicon config loads and powers contact detection."""

from __future__ import annotations

from app.core.moderation.service import ModerationService
from app.infrastructure.moderation import load_lexicon


def test_config_loads_nonempty() -> None:
    lexicon = load_lexicon()
    assert lexicon.profanity and lexicon.hate_slurs
    assert lexicon.contact_patterns


def test_real_lexicon_clean_vs_contact() -> None:
    service = ModerationService(load_lexicon())
    assert service.check_text("Свежий букет роз, отдам недорого, самовывоз").is_clean
    assert service.check_text("звоните 8 916 123 45 67").is_blocked
    assert service.check_text("пишите в телеграм @flowers_seller").is_blocked
