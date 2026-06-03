"""Moderation decisions on a controlled lexicon (no real slurs in tests)."""

from __future__ import annotations

import pytest
from app.core.moderation.lexicon import build_lexicon
from app.core.moderation.service import ModerationService

PHONE = r"(?:\+?7|8)[\s\-(]*\d{3}[\s\-)]*\d{3}[\s\-]*\d{2}[\s\-]*\d{2}"
LEXICON = build_lexicon(
    profanity=["бадворд"],
    hate_slurs=["злослур"],
    banned_terms=["другаяплощадка"],
    contact_patterns=[r"@[a-zа-я0-9_]{3,}", PHONE],
)
SERVICE = ModerationService(LEXICON)


def test_clean_text_passes() -> None:
    assert SERVICE.check_text("Красивый свежий букет пионов, самовывоз").is_clean


@pytest.mark.parametrize(
    "text",
    [
        "тут бадворд внутри",
        "б а д в о р д",
        "бааадворд",
        "бaдвoрд",  # latin homoglyphs
        "6адворд",  # leet
    ],
)
def test_profanity_obfuscations_blocked(text: str) -> None:
    verdict = SERVICE.check_text(text)
    assert verdict.is_blocked and verdict.category == "profanity"


def test_hate_slur_blocked() -> None:
    assert SERVICE.check_text("ты злослур").category == "hate"


def test_banned_term_goes_to_review() -> None:
    verdict = SERVICE.check_text("продаю на другаяплощадка")
    assert verdict.needs_review and verdict.category == "banned"


@pytest.mark.parametrize(
    "text",
    [
        "пиши мне @ivan_petrov",
        "звони +7 916 123 45 67",
        "мой номер 8(916)123-45-67",
    ],
)
def test_contacts_blocked(text: str) -> None:
    verdict = SERVICE.check_text(text)
    assert verdict.is_blocked and verdict.category == "contact"
