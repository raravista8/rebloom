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
    FakePaymentProvider,
)

BPS = 1000


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
    deals, listings, payments, notifier = (
        FakeDealRepository(),
        FakeListingReader(),
        FakePaymentProvider(),
        _RecordingNotifier(),
    )
    listings.seed("L", "seller", price=100_000, status="active")
    svc = DealService(deals, listings, payments, BPS, notifier=notifier)
    return svc, deals, notifier


def _held(svc: DealService, deals: FakeDealRepository) -> str:
    deal = svc.create_deal("buyer", "L", "self_pickup").value[0]  # type: ignore[union-attr]
    deals.mark_paid(f"yk_{deal.id}")  # paid directly on repo to reach paid_held
    return deal.id


def test_mark_paid_notifies_seller() -> None:
    svc, _deals, notifier = _deal_svc()
    deal = svc.create_deal("buyer", "L", "self_pickup").value[0]  # type: ignore[union-attr]
    svc.mark_paid(f"yk_{deal.id}")
    assert _recipients(notifier) == {"seller"}
    assert _kinds(notifier) == {"deal_status"}


def test_release_notifies_both_parties() -> None:
    svc, deals, notifier = _deal_svc()
    did = _held(svc, deals)
    notifier.drafts.clear()
    svc.confirm_receipt("buyer", did)
    assert _recipients(notifier) == {"buyer", "seller"}


def test_dispute_open_notifies_counterparty_only() -> None:
    svc, deals, notifier = _deal_svc()
    did = _held(svc, deals)
    notifier.drafts.clear()
    svc.open_dispute("buyer", did, reason="x")
    assert _recipients(notifier) == {"seller"}  # the buyer opened it
    assert _kinds(notifier) == {"dispute"}


def test_resolve_notifies_both() -> None:
    svc, deals, notifier = _deal_svc()
    did = _held(svc, deals)
    svc.open_dispute("buyer", did, reason="x")
    notifier.drafts.clear()
    svc.resolve_dispute("admin", did, action="refund", reason="x")
    assert _recipients(notifier) == {"buyer", "seller"}


def test_notify_failure_does_not_break_release() -> None:
    class _Boom:
        def notify(self, draft: NotificationDraft) -> int:
            raise RuntimeError("outbox down")

    deals, listings, payments = FakeDealRepository(), FakeListingReader(), FakePaymentProvider()
    listings.seed("L", "seller", price=100_000, status="active")
    svc = DealService(deals, listings, payments, BPS, notifier=_Boom())
    deal = svc.create_deal("buyer", "L", "self_pickup").value[0]  # type: ignore[union-attr]
    deals.mark_paid(f"yk_{deal.id}")
    result = svc.confirm_receipt("buyer", deal.id)  # must still succeed
    assert result.value.status == "released"  # type: ignore[union-attr]


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
