"""T6.1b — domain services publish realtime events to the bus. Deal status changes
and *delivered* chat messages fan out on the deal channel; held messages don't."""

from __future__ import annotations

from app.core.deals.chat import ChatService
from app.core.deals.service import DealService
from app.core.moderation.lexicon import build_lexicon
from app.core.moderation.service import ModerationService

from tests.fakes import (
    FakeChatRepository,
    FakeDealPartyReader,
    FakeDealRepository,
    FakeListingReader,
    FakeRealtimeBus,
)

LEXICON = build_lexicon(
    profanity=[], hate_slurs=[], banned_terms=[], contact_patterns=[r"@[a-z0-9_]{3,}"]
)


def _channels(bus: FakeRealtimeBus) -> list[str]:
    return [ch for ch, _ in bus.published]


def _types(bus: FakeRealtimeBus) -> list[str]:
    return [str(msg["type"]) for _, msg in bus.published]


# --- deal status ------------------------------------------------------------


def _deal_svc(bus: FakeRealtimeBus) -> tuple[DealService, FakeDealRepository]:
    deals, listings = FakeDealRepository(), FakeListingReader()
    listings.seed("L", "seller", price=100_000, status="active")
    return DealService(deals, listings, bus=bus), deals


def test_status_changes_broadcast() -> None:
    bus = FakeRealtimeBus()
    svc, _deals = _deal_svc(bus)
    deal = svc.create_deal("buyer", "L", "self_pickup").value  # type: ignore[union-attr]
    bus.published.clear()
    svc.share_point("seller", deal.id)
    svc.confirm_receipt("buyer", deal.id)

    assert _channels(bus) == [f"deal:{deal.id}", f"deal:{deal.id}"]
    assert _types(bus) == ["status", "status"]
    statuses = [msg["status"] for _, msg in bus.published]
    assert statuses == ["meeting", "done"]


def test_report_broadcasts_problem_then_resolution() -> None:
    bus = FakeRealtimeBus()
    svc, _deals = _deal_svc(bus)
    deal = svc.create_deal("buyer", "L", "self_pickup").value  # type: ignore[union-attr]
    bus.published.clear()

    svc.report("buyer", deal.id, reason="x")
    svc.resolve_problem("admin", deal.id, action="cancelled", reason="x")
    assert [msg["status"] for _, msg in bus.published] == ["problem", "cancelled"]


# --- chat -------------------------------------------------------------------


def _chat(bus: FakeRealtimeBus) -> ChatService:
    deals, chat = FakeDealPartyReader(), FakeChatRepository()
    deals.seed("D1", "buyer", "seller")
    return ChatService(deals, chat, ModerationService(LEXICON), bus=bus)


def test_visible_message_broadcasts() -> None:
    bus = FakeRealtimeBus()
    _chat(bus).post_message("buyer", "D1", "ещё доступен?")
    assert _channels(bus) == ["deal:D1"]
    channel, msg = bus.published[0]
    assert msg["type"] == "message"
    assert msg["message"]["sender_id"] == "buyer"  # type: ignore[index]


def test_held_message_does_not_broadcast() -> None:
    bus = FakeRealtimeBus()
    _chat(bus).post_message("buyer", "D1", "пиши @seller_handle")  # contact → held
    assert bus.published == []
