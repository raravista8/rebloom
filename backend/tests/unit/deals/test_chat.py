"""Deal chat service (T6.1, FR-030, SECURITY T-05): party-only; a message with a
contact (phone/@handle) is HELD — persisted but not delivered to the counterparty."""

from __future__ import annotations

from app.core.deals.chat import ChatService
from app.core.moderation.lexicon import build_lexicon
from app.core.moderation.service import ModerationService
from app.core.result import Err, Ok

from tests.fakes import FakeChatRepository, FakeDealPartyReader

PHONE = r"(?:\+?7|8)[\s\-(]*\d{3}[\s\-)]*\d{3}[\s\-]*\d{2}[\s\-]*\d{2}"
LEXICON = build_lexicon(
    profanity=["бадворд"],
    hate_slurs=["злослур"],
    banned_terms=[],
    contact_patterns=[r"@[a-zа-я0-9_]{3,}", PHONE],
)

BUYER, SELLER, STRANGER, DEAL = "buyer", "seller", "stranger", "D1"


def _make() -> tuple[ChatService, FakeChatRepository]:
    deals, chat = FakeDealPartyReader(), FakeChatRepository()
    deals.seed(DEAL, BUYER, SELLER)
    return ChatService(deals, chat, ModerationService(LEXICON)), chat


def test_party_can_post_and_read() -> None:
    svc, _chat = _make()
    posted = svc.post_message(BUYER, DEAL, "Здравствуйте, букет ещё доступен?")
    assert isinstance(posted, Ok) and posted.value.status == "visible"

    seen = svc.list_messages(SELLER, DEAL)
    assert isinstance(seen, Ok)
    msgs, _cursor = seen.value
    assert [m.body for m in msgs] == ["Здравствуйте, букет ещё доступен?"]


def test_contact_message_is_held() -> None:
    svc, _chat = _make()
    posted = svc.post_message(SELLER, DEAL, "пишите мне +7 916 123 45 67")
    assert isinstance(posted, Ok) and posted.value.status == "held"


def test_held_message_hidden_from_counterparty_but_visible_to_sender() -> None:
    svc, _chat = _make()
    svc.post_message(SELLER, DEAL, "мой телеграм @flowerseller")  # held

    # Counterparty does not see the held message…
    buyer_view = svc.list_messages(BUYER, DEAL).value[0]  # type: ignore[union-attr]
    assert buyer_view == []
    # …but the sender sees their own, flagged held.
    seller_view = svc.list_messages(SELLER, DEAL).value[0]  # type: ignore[union-attr]
    assert len(seller_view) == 1 and seller_view[0].status == "held"


def test_profanity_message_is_held() -> None:
    svc, _chat = _make()
    posted = svc.post_message(BUYER, DEAL, "ну ты и бадворд")
    assert isinstance(posted, Ok) and posted.value.status == "held"


def test_non_party_cannot_post() -> None:
    svc, _chat = _make()
    res = svc.post_message(STRANGER, DEAL, "дайте посмотреть")
    assert isinstance(res, Err) and res.error.code == "forbidden"


def test_non_party_cannot_read() -> None:
    svc, _chat = _make()
    res = svc.list_messages(STRANGER, DEAL)
    assert isinstance(res, Err) and res.error.code == "forbidden"


def test_unknown_deal_is_not_found() -> None:
    svc, _chat = _make()
    res = svc.post_message(BUYER, "nope", "hi")
    assert isinstance(res, Err) and res.error.code == "not_found"


def test_empty_message_rejected() -> None:
    svc, _chat = _make()
    res = svc.post_message(BUYER, DEAL, "   ")
    assert isinstance(res, Err) and res.error.code == "validation_error"
