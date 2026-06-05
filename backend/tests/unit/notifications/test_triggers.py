"""T12.1b — domain events raise notifications (deal lifecycle + chat). Best-effort:
deterministic event_ids; held chat messages do NOT notify the counterparty."""

from __future__ import annotations

from app.core.deals.chat import ChatService
from app.core.deals.service import DealService
from app.core.moderation.lexicon import build_lexicon
from app.core.moderation.service import ModerationService
from app.core.notifications.schemas import NotificationDraft

from tests.fakes import (
    FakeChatRepository,
    FakeDealPartyReader,
    FakeDealRepository,
    FakeListingReader,
)


class _RecordingNotifier:
    def __init__(self) -> None:
        self.drafts: list[NotificationDraft] = []

    def notify(self, draft: NotificationDraft) -> int:
        self.drafts.append(draft)
        return 1


def _recipients(n: _RecordingNotifier) -> set[str]:
    return {d.user_id for d in n.drafts}


def _kinds(n: _RecordingNotifier) -> set[str]:
    return {d.kind for d in n.drafts}


def _deal_svc() -> tuple[DealService, FakeDealRepository, _RecordingNotifier]:
    deals, listings, notifier = FakeDealRepository(), FakeListingReader(), _RecordingNotifier()
    listings.seed("L", "seller", price=100_000, status="active")
    svc = DealService(deals, listings, notifier=notifier)
    return svc, deals, notifier


def _agreed(svc: DealService) -> str:
    return svc.create_deal("buyer", "L", "self_pickup").value.id  # type: ignore[union-attr]


def test_create_notifies_seller() -> None:
    svc, _deals, notifier = _deal_svc()
    _agreed(svc)
    assert _recipients(notifier) == {"seller"}
    assert _kinds(notifier) == {"deal_status"}


def test_done_notifies_both_parties() -> None:
    svc, _deals, notifier = _deal_svc()
    did = _agreed(svc)
    notifier.drafts.clear()
    svc.confirm_receipt("buyer", did)
    assert _recipients(notifier) == {"buyer", "seller"}


def test_report_notifies_counterparty_only() -> None:
    svc, _deals, notifier = _deal_svc()
    did = _agreed(svc)
    notifier.drafts.clear()
    svc.report("buyer", did, reason="x")
    assert _recipients(notifier) == {"seller"}  # the buyer reported it
    assert _kinds(notifier) == {"dispute"}


def test_resolve_notifies_both() -> None:
    svc, _deals, notifier = _deal_svc()
    did = _agreed(svc)
    svc.report("buyer", did, reason="x")
    notifier.drafts.clear()
    svc.resolve_problem("admin", did, action="cancelled", reason="x")
    assert _recipients(notifier) == {"buyer", "seller"}


def test_notify_failure_does_not_break_done() -> None:
    class _Boom:
        def notify(self, draft: NotificationDraft) -> int:
            raise RuntimeError("outbox down")

    deals, listings = FakeDealRepository(), FakeListingReader()
    listings.seed("L", "seller", price=100_000, status="active")
    svc = DealService(deals, listings, notifier=_Boom())
    deal = svc.create_deal("buyer", "L", "self_pickup").value  # type: ignore[union-attr]
    result = svc.confirm_receipt("buyer", deal.id)  # must still succeed
    assert result.value.status == "done"  # type: ignore[union-attr]


# --- chat -------------------------------------------------------------------

LEXICON = build_lexicon(
    profanity=["бадворд"], hate_slurs=[], banned_terms=[], contact_patterns=[r"@[a-z0-9_]{3,}"]
)


def _chat() -> tuple[ChatService, _RecordingNotifier]:
    deals, chat, notifier = FakeDealPartyReader(), FakeChatRepository(), _RecordingNotifier()
    deals.seed("D1", "buyer", "seller")
    return ChatService(deals, chat, ModerationService(LEXICON), notifier=notifier), notifier


def test_visible_message_notifies_counterparty() -> None:
    svc, notifier = _chat()
    svc.post_message("buyer", "D1", "ещё доступен?")
    assert [d.user_id for d in notifier.drafts] == ["seller"]
    assert notifier.drafts[0].kind == "new_message"


def test_held_message_does_not_notify() -> None:
    svc, notifier = _chat()
    svc.post_message("buyer", "D1", "пишите @seller_contact")  # contact → held
    assert notifier.drafts == []
