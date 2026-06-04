"""Pre-purchase listing chat (T6.3, FR-030, T-05/T-08): seller-or-buyer threads,
contacts held, sender rate-limited, delivered messages broadcast."""

from __future__ import annotations

from app.core.listings.chat import ListingChatService
from app.core.moderation.lexicon import build_lexicon
from app.core.moderation.service import ModerationService
from app.core.result import Err, Ok

from tests.fakes import (
    FakeListingChatRepo,
    FakeListingSellerReader,
    FakeRateLimiter,
    FakeRealtimeBus,
)

LEXICON = build_lexicon(
    profanity=[], hate_slurs=[], banned_terms=[], contact_patterns=[r"@[a-z0-9_]{3,}"]
)


def _svc(
    limiter: FakeRateLimiter | None = None, bus: FakeRealtimeBus | None = None
) -> tuple[ListingChatService, FakeListingChatRepo]:
    sellers, chat = FakeListingSellerReader(), FakeListingChatRepo()
    sellers.seed("L", "seller")
    svc = ListingChatService(
        sellers, chat, ModerationService(LEXICON), limiter or FakeRateLimiter(), bus=bus
    )
    return svc, chat


def test_buyer_starts_thread_in_own_name() -> None:
    svc, chat = _svc()
    res = svc.post("buyerA", "L", "ещё актуально?")
    assert isinstance(res, Ok)
    assert res.value.buyer_id == "buyerA" and res.value.sender_id == "buyerA"
    assert res.value.status == "visible"


def test_seller_must_name_a_thread() -> None:
    svc, _chat = _svc()
    res = svc.post("seller", "L", "здравствуйте")  # no buyer_id
    assert isinstance(res, Err) and res.error.code == "validation_error"


def test_seller_replies_into_buyer_thread() -> None:
    svc, _chat = _svc()
    res = svc.post("seller", "L", "да, актуально", buyer_id="buyerA")
    assert isinstance(res, Ok) and res.value.buyer_id == "buyerA"
    assert res.value.sender_id == "seller"


def test_unknown_listing_not_found() -> None:
    svc, _chat = _svc()
    res = svc.post("buyerA", "missing", "?")
    assert isinstance(res, Err) and res.error.code == "not_found"


def test_contact_is_held_and_not_broadcast() -> None:
    bus = FakeRealtimeBus()
    svc, _chat = _svc(bus=bus)
    res = svc.post("buyerA", "L", "пиши мне @my_handle прямо")
    assert isinstance(res, Ok) and res.value.status == "held"
    assert bus.published == []  # held → off-platform leak blocked, no fan-out


def test_visible_message_is_broadcast() -> None:
    bus = FakeRealtimeBus()
    svc, _chat = _svc(bus=bus)
    svc.post("buyerA", "L", "беру!")
    assert bus.published[0][0] == "listing:L:buyerA"
    assert bus.published[0][1]["type"] == "listing_message"


def test_rate_limited_after_cap() -> None:
    svc, _chat = _svc(limiter=FakeRateLimiter(hard_limit=2))
    assert isinstance(svc.post("buyerA", "L", "1"), Ok)
    assert isinstance(svc.post("buyerA", "L", "2"), Ok)
    third = svc.post("buyerA", "L", "3")
    assert isinstance(third, Err) and third.error.code == "rate_limited"


def test_thread_is_isolated_per_buyer() -> None:
    svc, _chat = _svc()
    svc.post("buyerA", "L", "a")
    svc.post("buyerB", "L", "b")
    a = svc.list_thread("buyerA", "L")
    assert isinstance(a, Ok) and [m.sender_id for m in a.value[0]] == ["buyerA"]
    # The seller views a specific buyer's thread.
    seller_view = svc.list_thread("seller", "L", buyer_id="buyerB")
    assert isinstance(seller_view, Ok) and [m.body for m in seller_view.value[0]] == ["b"]
