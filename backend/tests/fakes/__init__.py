"""In-memory fakes implementing the auth ports — for fast, deterministic tests."""

from __future__ import annotations


def _now_iso() -> str:
    from datetime import UTC, datetime

    return datetime.now(UTC).isoformat()


class FakeClock:
    def __init__(self) -> None:
        self.t = 0.0

    def advance(self, seconds: float) -> None:
        self.t += seconds

    def now(self) -> float:
        return self.t


class FakeOtpStore:
    """Implements :class:`app.core.auth.ports.OtpStore` with a controllable clock."""

    def __init__(self, clock: FakeClock) -> None:
        self._clock = clock
        self._challenge: dict[str, tuple[str, float]] = {}
        self._failures: dict[str, tuple[int, float]] = {}
        self._lock: dict[str, float] = {}
        self._cooldown: dict[str, float] = {}

    @staticmethod
    def _remaining(expiry: float, now: float) -> int:
        return max(0, int(expiry - now))

    def set_challenge(self, phone: str, code_hash: str, ttl: int) -> None:
        self._challenge[phone] = (code_hash, self._clock.now() + ttl)

    def get_challenge(self, phone: str) -> str | None:
        entry = self._challenge.get(phone)
        if entry is None:
            return None
        code_hash, expiry = entry
        if expiry <= self._clock.now():
            del self._challenge[phone]
            return None
        return code_hash

    def clear_challenge(self, phone: str) -> None:
        self._challenge.pop(phone, None)

    def register_failure(self, phone: str, window: int) -> int:
        now = self._clock.now()
        entry = self._failures.get(phone)
        if entry is not None and entry[1] > now:
            count, expiry = entry[0] + 1, entry[1]
        else:
            count, expiry = 1, now + window
        self._failures[phone] = (count, expiry)
        return count

    def clear_failures(self, phone: str) -> None:
        self._failures.pop(phone, None)

    def lock(self, phone: str, ttl: int) -> None:
        self._lock[phone] = self._clock.now() + ttl

    def lock_ttl(self, phone: str) -> int:
        return self._remaining(self._lock.get(phone, 0.0), self._clock.now())

    def start_cooldown(self, phone: str, ttl: int) -> None:
        self._cooldown[phone] = self._clock.now() + ttl

    def cooldown_ttl(self, phone: str) -> int:
        return self._remaining(self._cooldown.get(phone, 0.0), self._clock.now())


class RecordingSms:
    """Implements :class:`app.core.auth.ports.SmsSender`; records what was sent."""

    def __init__(self) -> None:
        self.sent: list[tuple[str, str]] = []

    def send_code(self, phone: str, code: str) -> None:
        self.sent.append((phone, code))

    @property
    def last_code(self) -> str:
        return self.sent[-1][1]


class FakeSessionStore:
    """Implements :class:`app.core.auth.ports.SessionStore` (no TTL simulation)."""

    def __init__(self) -> None:
        self._data: dict[str, str] = {}
        self._2fa: set[str] = set()

    def save(self, token: str, user_id: str, ttl: int) -> None:
        self._data[token] = user_id

    def get(self, token: str) -> str | None:
        return self._data.get(token)

    def delete(self, token: str) -> None:
        self._data.pop(token, None)
        self._2fa.discard(token)

    def refresh(self, token: str, ttl: int) -> None:
        return None

    def mark_2fa(self, token: str, ttl: int) -> None:
        self._2fa.add(token)

    def is_2fa(self, token: str) -> bool:
        return token in self._2fa


class FakeUserRepository:
    """Implements :class:`app.core.users.ports.UserRepository` in memory."""

    def __init__(self) -> None:
        from app.core.users.schemas import UserView

        self._view = UserView
        self._by_phone: dict[str, object] = {}
        self._by_id: dict[str, object] = {}
        self._secrets: dict[str, str] = {}
        self._seq = 0

    def get_totp_secret(self, user_id: str) -> str | None:
        return self._secrets.get(user_id)

    def make_admin(self, user_id: str, secret: str) -> None:
        """Test helper: promote a user to admin + set their TOTP secret."""
        view = self._by_id.get(user_id)
        if view is None:
            return
        admin = self._view(
            id=view.id,  # type: ignore[attr-defined]
            phone=view.phone,  # type: ignore[attr-defined]
            display_name=view.display_name,  # type: ignore[attr-defined]
            city_id=view.city_id,  # type: ignore[attr-defined]
            roles=("buyer", "admin"),
            seller_rating=view.seller_rating,  # type: ignore[attr-defined]
            status=view.status,  # type: ignore[attr-defined]
        )
        self._by_id[user_id] = admin
        self._by_phone[admin.phone] = admin
        self._secrets[user_id] = secret

    def get_or_create_by_phone(self, phone: str) -> object:
        existing = self._by_phone.get(phone)
        if existing is not None:
            return existing
        self._seq += 1
        view = self._view(
            id=f"00000000-0000-0000-0000-{self._seq:012d}",
            phone=phone,
            display_name=None,
            city_id=None,
            roles=("buyer",),
            seller_rating=None,
            status="active",
        )
        self._by_phone[phone] = view
        self._by_id[view.id] = view
        return view

    def get_by_id(self, user_id: str) -> object | None:
        return self._by_id.get(user_id)

    def set_status(self, user_id: str, status: str) -> None:
        """Test helper: flip a user's status (e.g. to 'deleted'/'blocked')."""
        view = self._by_id.get(user_id)
        if view is None:
            return
        updated = self._view(
            id=view.id,  # type: ignore[attr-defined]
            phone=view.phone,  # type: ignore[attr-defined]
            display_name=view.display_name,  # type: ignore[attr-defined]
            city_id=view.city_id,  # type: ignore[attr-defined]
            roles=view.roles,  # type: ignore[attr-defined]
            seller_rating=view.seller_rating,  # type: ignore[attr-defined]
            status=status,
        )
        self._by_id[user_id] = updated
        self._by_phone[updated.phone] = updated


class FakePrivacyRepository:
    """Implements :class:`app.core.privacy.ports.PrivacyRepository` in memory."""

    def __init__(self) -> None:
        self._users: dict[str, dict[str, object]] = {}
        self.deleted: dict[str, str] = {}

    def seed(self, user_id: str, *, display_name: str | None = "Аня", city_id: str = "msk") -> None:
        self._users[user_id] = {
            "phone": "+79161234567",
            "display_name": display_name,
            "city_id": city_id,
            "status": "active",
        }

    def gather_export(self, user_id: str) -> dict[str, object] | None:
        u = self._users.get(user_id)
        if u is None:
            return None
        return {
            "profile": {"id": user_id, **u},
            "consents": [],
            "listings": [],
            "deals": [],
            "reviews": [],
            "messages": [],
        }

    def soft_delete(self, user_id: str, requested_at: str) -> bool:
        if user_id not in self._users:
            return False
        self._users[user_id]["status"] = "deleted"
        self.deleted[user_id] = requested_at
        return True

    def update_profile(
        self, user_id: str, *, display_name: str | None, city_id: str | None
    ) -> object | None:
        from app.core.users.schemas import UserView

        u = self._users.get(user_id)
        if u is None:
            return None
        if display_name is not None:
            u["display_name"] = display_name
        if city_id is not None:
            u["city_id"] = city_id
        return UserView(
            id=user_id,
            phone=str(u["phone"]),
            display_name=u["display_name"],  # type: ignore[arg-type]
            city_id=u["city_id"],  # type: ignore[arg-type]
            roles=("buyer",),
            seller_rating=None,
            status=str(u["status"]),
        )


class FakeConsentRepository:
    """Implements :class:`app.core.consent.ports.ConsentRepository` in memory."""

    def __init__(self) -> None:
        self.calls: list[tuple[str, str, str]] = []

    def record(self, user_id: str, policy_version: str, source_channel: str) -> object:
        from datetime import UTC, datetime

        from app.core.consent.schemas import ConsentRecord

        self.calls.append((user_id, policy_version, source_channel))
        return ConsentRecord(
            id=f"consent-{len(self.calls)}",
            accepted_at=datetime(2026, 6, 3, tzinfo=UTC),
        )


class FakePhotoRepository:
    """Implements :class:`app.core.listings.ports.PhotoRepository` in memory."""

    def __init__(self) -> None:
        self._photos: dict[str, tuple[str, str]] = {}  # id -> (owner_id, status)
        self._phashes: dict[str, tuple[str, str]] = {}  # id -> (owner_id, phash)
        self._seq = 0
        self.processed: dict[str, dict[str, str]] = {}

    def seed(self, photo_id: str, owner_id: str, status: str = "approved") -> None:
        self._photos[photo_id] = (owner_id, status)

    def seed_phash(self, photo_id: str, owner_id: str, phash: str) -> None:
        """Test helper: an existing processed photo with a known perceptual hash."""
        self._photos[photo_id] = (owner_id, "approved")
        self._phashes[photo_id] = (owner_id, phash)

    def create_pending(self, owner_id: str, content_type: str) -> object:
        from app.core.listings.schemas import PhotoRef

        self._seq += 1
        pid = f"photo-{self._seq}"
        self._photos[pid] = (owner_id, "pending")
        return PhotoRef(id=pid, moderation_status="pending")

    def get_owned(self, owner_id: str, photo_ids: list[str]) -> list[object]:
        from app.core.listings.schemas import PhotoRef

        refs: list[object] = []
        for pid in photo_ids:
            rec = self._photos.get(pid)
            if rec is not None and rec[0] == owner_id:
                refs.append(PhotoRef(id=pid, moderation_status=rec[1]))
        return refs

    def get_one(self, owner_id: str, photo_id: str) -> object | None:
        from app.core.listings.schemas import PhotoRef

        rec = self._photos.get(photo_id)
        if rec is None or rec[0] != owner_id:
            return None
        return PhotoRef(id=photo_id, moderation_status=rec[1])

    def mark_processed(
        self, photo_id: str, variants: dict[str, str], phash: str, approved: bool
    ) -> None:
        rec = self._photos.get(photo_id)
        if rec is not None:
            self._photos[photo_id] = (rec[0], "approved" if approved else "pending")
            self._phashes[photo_id] = (rec[0], phash)
        self.processed[photo_id] = variants

    def other_owner_phashes(self, owner_id: str, limit: int) -> list[tuple[str, str]]:
        return [(pid, phash) for pid, (owner, phash) in self._phashes.items() if owner != owner_id][
            :limit
        ]


class FakeObjectStorage:
    """Implements :class:`app.core.photos.ports.ObjectStorage` in memory."""

    def __init__(self) -> None:
        self.blobs: dict[str, bytes] = {}

    def put(self, key: str, data: bytes, content_type: str) -> str:
        self.blobs[key] = data
        return f"https://cdn.test/{key}"


class FakeListingRepository:
    """Implements :class:`app.core.listings.ports.ListingRepository` in memory."""

    def __init__(self) -> None:
        self._store: dict[str, object] = {}
        self._seq = 0

    def create(
        self, *, seller_id: str, data: object, status: str, freshness_score: float
    ) -> object:
        from datetime import UTC, datetime, timedelta

        from app.core.listings.schemas import ListingView, PhotoRef

        self._seq += 1
        lid = f"listing-{self._seq}"
        view = ListingView(
            id=lid,
            seller_id=seller_id,
            seller_display_name=None,
            seller_rating=None,
            size=data.size,  # type: ignore[attr-defined]
            freshness=data.freshness,  # type: ignore[attr-defined]
            price_kopecks=data.price_kopecks,  # type: ignore[attr-defined]
            city_id=data.city_id,  # type: ignore[attr-defined]
            geo_coarse=data.geo,  # type: ignore[attr-defined]
            status=status,
            like_count=0,
            freshness_score=freshness_score,
            expires_at=datetime(2026, 6, 4, tzinfo=UTC) + timedelta(hours=data.expires_in_h),  # type: ignore[attr-defined]
            photos=tuple(
                PhotoRef(id=p, moderation_status="approved")
                for p in data.photo_ids  # type: ignore[attr-defined]
            ),
        )
        self._store[lid] = view
        return view

    def get(self, listing_id: str) -> object | None:
        return self._store.get(listing_id)


class FakeCityRepository:
    """Implements :class:`app.core.geo.schemas.CityRepository` in memory."""

    _KNOWN = frozenset({"msk", "spb", "nsk", "ekb", "kzn", "krsk", "nnv", "chel", "ufa", "smr"})

    def __init__(self, enabled: tuple[str, ...] = ("msk", "spb")) -> None:
        self._enabled = set(enabled)

    def get(self, city_id: str) -> object | None:
        from app.core.geo.schemas import CityView

        if city_id not in self._KNOWN:
            return None
        return CityView(id=city_id, name=city_id, enabled=city_id in self._enabled)

    def list_enabled(self) -> list[object]:
        from app.core.geo.schemas import CityView

        return [CityView(id=c, name=c, enabled=True) for c in sorted(self._enabled)]


class FakeLikeRepository:
    """Implements :class:`app.core.likes.ports.LikeRepository` in memory."""

    def __init__(self) -> None:
        self._likes: dict[str, set[str]] = {}

    def seed_listing(self, listing_id: str) -> None:
        self._likes.setdefault(listing_id, set())

    def like(self, user_id: str, listing_id: str) -> int | None:
        if listing_id not in self._likes:
            return None
        self._likes[listing_id].add(user_id)
        return len(self._likes[listing_id])

    def unlike(self, user_id: str, listing_id: str) -> int | None:
        if listing_id not in self._likes:
            return None
        self._likes[listing_id].discard(user_id)
        return len(self._likes[listing_id])


def make_listing_view(listing_id: str = "l1", city_id: str = "msk") -> object:
    """Build a minimal ListingView for feed/search tests."""
    from datetime import UTC, datetime

    from app.core.listings.schemas import ListingView

    return ListingView(
        id=listing_id,
        seller_id="s1",
        seller_display_name=None,
        seller_rating=None,
        size="M",
        freshness="today",
        price_kopecks=100000,
        city_id=city_id,
        geo_coarse=None,
        status="active",
        like_count=0,
        freshness_score=1.0,
        expires_at=datetime(2026, 6, 4, tzinfo=UTC),
        photos=(),
    )


class FakeFeedRepository:
    """Implements :class:`app.core.feed.schemas.FeedRepository` in memory."""

    def __init__(self, items: object = ()) -> None:
        self._items = list(items)  # type: ignore[call-overload]

    def feed(
        self, city_id: str, section: str, offset: int, limit: int
    ) -> tuple[list[object], bool]:
        page = self._items[offset : offset + limit]
        return page, (offset + limit) < len(self._items)

    def search(
        self, city_id: str, filters: object, offset: int, limit: int
    ) -> tuple[list[object], bool]:
        page = self._items[offset : offset + limit]
        return page, (offset + limit) < len(self._items)


class FakeListingReader:
    """Implements :class:`app.core.deals.ports.ListingReader` in memory."""

    def __init__(self) -> None:
        self._listings: dict[str, dict[str, object]] = {}

    def seed(
        self, listing_id: str, seller_id: str, price: int = 100000, status: str = "active"
    ) -> None:
        self._listings[listing_id] = {
            "seller_id": seller_id,
            "price": price,
            "status": status,
        }

    def get_summary(self, listing_id: str) -> object | None:
        from app.core.deals.ports import ListingSummary

        row = self._listings.get(listing_id)
        if row is None:
            return None
        return ListingSummary(
            id=listing_id,
            status=str(row["status"]),
            price_kopecks=int(row["price"]),  # type: ignore[arg-type]
            seller_id=str(row["seller_id"]),
        )


class FakePaymentProvider:
    """Implements :class:`app.core.payments.ports.PaymentProvider` in memory."""

    def __init__(self) -> None:
        self.payouts: list[tuple[str, str, int]] = []
        self.refunds: list[tuple[str, int]] = []
        self.status = "succeeded"  # re-fetched status (settable for fail-secure tests)

    def create_payment(self, deal_id: str, amount_kopecks: int, idempotency_key: str) -> object:
        from app.core.payments.ports import PaymentIntent

        return PaymentIntent(
            yk_payment_id=f"yk_{deal_id}", confirmation_url=f"https://pay.test/{deal_id}"
        )

    def payout(
        self, deal_id: str, seller_id: str, amount_kopecks: int, idempotency_key: str
    ) -> object:
        from app.core.payments.ports import PayoutReceipt

        self.payouts.append((deal_id, seller_id, amount_kopecks))
        return PayoutReceipt(yk_payout_id=f"po_{deal_id}", fiscal_receipt_id=f"r_{deal_id}")

    def refund(self, deal_id: str, amount_kopecks: int, idempotency_key: str) -> object:
        from app.core.payments.ports import RefundReceipt

        self.refunds.append((deal_id, amount_kopecks))
        return RefundReceipt(yk_refund_id=f"ref_{deal_id}", fiscal_receipt_id=f"rr_{deal_id}")

    def get_payment_status(self, yk_payment_id: str) -> str:
        return self.status


class FakeDealRepository:
    """Implements :class:`app.core.deals.ports.DealRepository` in memory."""

    def __init__(self) -> None:
        self._deals: dict[str, dict[str, object]] = {}
        self._by_payment: dict[str, str] = {}
        self._seq = 0

    def _view(self, deal_id: str) -> object:
        from app.core.deals.ports import DealView

        d = self._deals[deal_id]
        return DealView(
            id=deal_id,
            status=str(d["status"]),
            listing_id=str(d["listing_id"]),
            buyer_id=str(d["buyer_id"]),
            seller_id=str(d["seller_id"]),
            amount_kopecks=int(d["amount"]),  # type: ignore[arg-type]
            commission_kopecks=int(d["commission"]),  # type: ignore[arg-type]
            delivery_method=str(d["delivery"]),
            released_at=d["released_at"],  # type: ignore[arg-type]
        )

    def ledger(self, deal_id: str) -> list[tuple[str, int]]:
        return self._deals[deal_id]["ledger"]  # type: ignore[return-value]

    def create_and_reserve(
        self,
        *,
        buyer_id: str,
        listing_id: str,
        seller_id: str,
        amount_kopecks: int,
        commission_kopecks: int,
        delivery_method: str,
    ) -> object | None:
        self._seq += 1
        did = f"deal-{self._seq}"
        self._deals[did] = {
            "status": "created",
            "buyer_id": buyer_id,
            "seller_id": seller_id,
            "listing_id": listing_id,
            "amount": amount_kopecks,
            "commission": commission_kopecks,
            "delivery": delivery_method,
            "released_at": None,
            "ledger": [],
        }
        return self._view(did)

    def attach_payment(self, deal_id: str, yk_payment_id: str, idempotency_key: str) -> None:
        self._by_payment[yk_payment_id] = deal_id

    def get(self, deal_id: str) -> object | None:
        return self._view(deal_id) if deal_id in self._deals else None

    def parties(self, deal_id: str) -> tuple[str, str] | None:
        d = self._deals.get(deal_id)
        if d is None:
            return None
        return str(d["buyer_id"]), str(d["seller_id"])

    def mark_paid(self, yk_payment_id: str) -> object | None:
        did = self._by_payment.get(yk_payment_id)
        if did is None:
            return None
        d = self._deals[did]
        if d["status"] == "created":
            d["status"] = "paid_held"
            d["ledger"].append(("hold", int(d["amount"])))  # type: ignore[union-attr,arg-type]
        return self._view(did)

    def release(self, deal_id: str) -> object | None:
        d = self._deals.get(deal_id)
        if d is None or d["status"] not in ("paid_held", "disputed"):
            return None
        amount, commission = int(d["amount"]), int(d["commission"])  # type: ignore[arg-type]
        d["ledger"].append(("commission", commission))  # type: ignore[union-attr]
        d["ledger"].append(("payout", amount - commission))  # type: ignore[union-attr]
        d["status"] = "released"
        d["released_at"] = _now_iso()
        return self._view(deal_id)

    def open_dispute(self, deal_id: str) -> object | None:
        d = self._deals.get(deal_id)
        if d is None or d["status"] != "paid_held":
            return None
        d["status"] = "disputed"  # funds stay held — no ledger change
        return self._view(deal_id)

    def resolve_dispute(self, deal_id: str, action: str, refund_kopecks: int = 0) -> object | None:
        d = self._deals.get(deal_id)
        if d is None or d["status"] != "disputed":
            return None
        amount, commission = int(d["amount"]), int(d["commission"])  # type: ignore[arg-type]
        ledger = d["ledger"]
        if action == "release":
            ledger.append(("commission", commission))  # type: ignore[union-attr]
            ledger.append(("payout", amount - commission))  # type: ignore[union-attr]
            d["status"] = "released"
        elif action == "refund":
            ledger.append(("refund", amount))  # type: ignore[union-attr]
            d["status"] = "refunded"
        elif action == "partial":
            if not (0 < refund_kopecks < amount):
                return None
            ledger.append(("refund", refund_kopecks))  # type: ignore[union-attr]
            ledger.append(("payout", amount - refund_kopecks))  # type: ignore[union-attr]
            d["status"] = "refunded"
        else:
            return None
        d["released_at"] = _now_iso()
        return self._view(deal_id)

    def record_payout(self, deal_id: str, yk_payout_id: str, fiscal_receipt_id: str | None) -> None:
        self._deals[deal_id]["payout"] = (yk_payout_id, fiscal_receipt_id)

    def seed_released(self, buyer_id: str, seller_id: str, amount: int = 100000) -> str:
        """Test helper: a released deal (released just now, within the review window)."""
        self._seq += 1
        did = f"deal-{self._seq}"
        self._deals[did] = {
            "status": "released",
            "buyer_id": buyer_id,
            "seller_id": seller_id,
            "listing_id": "L",
            "amount": amount,
            "commission": amount // 10,
            "delivery": "self_pickup",
            "released_at": _now_iso(),
            "ledger": [
                ("hold", amount),
                ("commission", amount // 10),
                ("payout", amount - amount // 10),
            ],
        }
        return did


class FakeReviewRepository:
    """Implements :class:`app.core.reviews.ports.ReviewRepository` in memory."""

    def __init__(self) -> None:
        self._reviews: list[object] = []
        self._keys: set[tuple[str, str]] = set()
        self._seq = 0

    def create(
        self,
        *,
        deal_id: str,
        author_id: str,
        target_id: str,
        score: int,
        text: str,
        moderation_status: str,
    ) -> object | None:
        from app.core.reviews.schemas import ReviewView

        key = (deal_id, author_id)
        if key in self._keys:
            return None
        self._keys.add(key)
        self._seq += 1
        view = ReviewView(
            id=f"review-{self._seq}",
            deal_id=deal_id,
            author_id=author_id,
            target_id=target_id,
            score=score,
            text=text,
            moderation_status=moderation_status,
        )
        self._reviews.append(view)
        return view

    def list_for_user(self, target_id: str) -> list[object]:
        return [
            r
            for r in self._reviews
            if r.target_id == target_id and r.moderation_status == "visible"  # type: ignore[attr-defined]
        ]


class FakeDealPartyReader:
    """Implements :class:`app.core.deals.chat.DealPartyReader` in memory."""

    def __init__(self) -> None:
        self._parties: dict[str, tuple[str, str]] = {}

    def seed(self, deal_id: str, buyer_id: str, seller_id: str) -> None:
        self._parties[deal_id] = (buyer_id, seller_id)

    def parties(self, deal_id: str) -> tuple[str, str] | None:
        return self._parties.get(deal_id)


class FakeChatRepository:
    """Implements :class:`app.core.deals.chat.ChatRepository` in memory."""

    def __init__(self) -> None:
        self._messages: list[object] = []
        self._seq = 0

    def add(self, deal_id: str, sender_id: str, body: str, status: str) -> object:
        from app.core.deals.chat import MessageView

        self._seq += 1
        view = MessageView(
            id=f"msg-{self._seq}",
            deal_id=deal_id,
            sender_id=sender_id,
            body=body,
            status=status,
            created_at=_now_iso(),
        )
        self._messages.append(view)
        return view

    def list_visible_to(
        self, deal_id: str, viewer_id: str, cursor: str | None, limit: int
    ) -> tuple[list[object], str | None]:
        visible = [
            m
            for m in self._messages
            if m.deal_id == deal_id  # type: ignore[attr-defined]
            and (m.status == "visible" or m.sender_id == viewer_id)  # type: ignore[attr-defined]
        ]
        return visible[:limit], None


class FakeReportRepo:
    """Implements :class:`app.core.moderation.reports.ReportRepo` in memory."""

    def __init__(self) -> None:
        self._reports: list[object] = []
        self._seq = 0

    def create(self, reporter_id: str, target_type: str, target_id: str, reason: str) -> str:
        from app.core.moderation.reports import ReportView

        self._seq += 1
        rid = f"report-{self._seq}"
        self._reports.append(
            ReportView(
                id=rid,
                reporter_id=reporter_id,
                target_type=target_type,
                target_id=target_id,
                reason=reason,
                status="open",
                created_at=_now_iso(),
            )
        )
        return rid

    def list_open(self, limit: int) -> list[object]:
        return [r for r in self._reports if r.status == "open"][:limit]  # type: ignore[attr-defined]


class FakeModerationQueueRepo:
    """Implements :class:`app.core.admin.ports.ModerationQueueRepo` in memory."""

    def __init__(self) -> None:
        self._listings: dict[str, str] = {}  # id -> status
        self._reviews: dict[str, str] = {}  # id -> moderation_status

    def seed_listing(self, listing_id: str, status: str = "pending_review") -> None:
        self._listings[listing_id] = status

    def seed_review(self, review_id: str, status: str = "held") -> None:
        self._reviews[review_id] = status

    def list_pending_listings(self, limit: int) -> list[object]:
        from app.core.admin.ports import ModerationItem

        return [
            ModerationItem(id=i, type="listing", created_at=None, summary={})
            for i, s in self._listings.items()
            if s == "pending_review"
        ][:limit]

    def list_held_reviews(self, limit: int) -> list[object]:
        from app.core.admin.ports import ModerationItem

        return [
            ModerationItem(id=i, type="review", created_at=None, summary={})
            for i, s in self._reviews.items()
            if s == "held"
        ][:limit]

    def decide_listing(self, listing_id: str, approve: bool) -> bool:
        if self._listings.get(listing_id) != "pending_review":
            return False
        self._listings[listing_id] = "active" if approve else "archived"
        return True

    def decide_review(self, review_id: str, approve: bool) -> bool:
        if self._reviews.get(review_id) != "held":
            return False
        self._reviews[review_id] = "visible" if approve else "hidden"
        return True


class _FakeRow:
    __slots__ = ("attempts", "body", "channel", "id", "kind", "title", "user_id")

    def __init__(self, data: dict[str, object]) -> None:
        self.id = str(data["id"])
        self.user_id = str(data["user_id"])
        self.channel = str(data["channel"])
        self.kind = str(data["kind"])
        self.title = str(data["title"])
        self.body = str(data["body"])
        self.attempts = int(data["attempts"])  # type: ignore[arg-type]


class FakeNotificationOutbox:
    """Implements :class:`app.core.notifications.ports.NotificationOutbox`."""

    def __init__(self) -> None:
        self._rows: dict[str, dict[str, object]] = {}
        self._keys: set[tuple[str, str, str]] = set()  # (event_id, channel, user)
        self._seq = 0

    def enqueue(self, draft: object) -> int:
        created = 0
        for channel in draft.channels:  # type: ignore[attr-defined]
            key = (draft.event_id, channel, draft.user_id)  # type: ignore[attr-defined]
            if key in self._keys:
                continue
            self._keys.add(key)
            self._seq += 1
            rid = f"notif-{self._seq}"
            self._rows[rid] = {
                "id": rid,
                "event_id": draft.event_id,  # type: ignore[attr-defined]
                "user_id": draft.user_id,  # type: ignore[attr-defined]
                "channel": channel,
                "kind": draft.kind,  # type: ignore[attr-defined]
                "title": draft.title,  # type: ignore[attr-defined]
                "body": draft.body,  # type: ignore[attr-defined]
                "payload": draft.payload,  # type: ignore[attr-defined]
                "status": "pending",
                "attempts": 0,
                "read": False,
                "ts": _now_iso(),
            }
            created += 1
        return created

    def list_pending(self, limit: int) -> list[object]:
        return [_FakeRow(r) for r in self._rows.values() if r["status"] == "pending"][:limit]

    def mark_sent(self, row_id: str) -> None:
        if row_id in self._rows:
            self._rows[row_id]["status"] = "sent"

    def mark_attempt_failed(self, row_id: str, max_attempts: int) -> None:
        r = self._rows.get(row_id)
        if r is None:
            return
        r["attempts"] = int(r["attempts"]) + 1  # type: ignore[arg-type]
        if int(r["attempts"]) >= max_attempts:  # type: ignore[arg-type]
            r["status"] = "failed"

    def list_inapp(
        self, user_id: str, cursor: str | None, limit: int
    ) -> tuple[list[object], str | None]:
        from app.core.notifications.schemas import NotificationView

        views = [
            NotificationView(
                id=str(r["id"]),
                kind=str(r["kind"]),
                title=str(r["title"]),
                body=str(r["body"]),
                payload=r["payload"] or {},  # type: ignore[arg-type]
                read=bool(r["read"]),
                created_at=str(r["ts"]),
            )
            for r in self._rows.values()
            if r["user_id"] == user_id and r["channel"] == "inapp"
        ]
        return views[:limit], None


class FakePushProvider:
    """Implements PushProvider; records sends, optionally fails."""

    def __init__(self, fail: bool = False) -> None:
        self.sent: list[tuple[str, str]] = []
        self._fail = fail

    def send(self, user_id: str, title: str, body: str) -> None:
        if self._fail:
            raise RuntimeError("push down")
        self.sent.append((user_id, title))


class FakeEmailProvider:
    """Implements EmailProvider; records sends, optionally fails."""

    def __init__(self, fail: bool = False) -> None:
        self.sent: list[tuple[str, str]] = []
        self._fail = fail

    def send(self, user_id: str, subject: str, body: str) -> None:
        if self._fail:
            raise RuntimeError("smtp down")
        self.sent.append((user_id, subject))


class FakeListingSellerReader:
    """Implements :class:`app.core.listings.chat.ListingSellerReader` in memory."""

    def __init__(self) -> None:
        self._sellers: dict[str, str] = {}

    def seed(self, listing_id: str, seller_id: str) -> None:
        self._sellers[listing_id] = seller_id

    def seller_of(self, listing_id: str) -> str | None:
        return self._sellers.get(listing_id)


class FakeListingChatRepo:
    """Implements :class:`app.core.listings.chat.ListingChatRepo` in memory."""

    def __init__(self) -> None:
        self._messages: list[object] = []
        self._seq = 0

    def add(self, listing_id: str, buyer_id: str, sender_id: str, body: str, status: str) -> object:
        from app.core.listings.chat import ListingMessageView

        self._seq += 1
        view = ListingMessageView(
            id=f"lmsg-{self._seq}",
            listing_id=listing_id,
            buyer_id=buyer_id,
            sender_id=sender_id,
            body=body,
            status=status,
            created_at=_now_iso(),
        )
        self._messages.append(view)
        return view

    def list_thread(
        self, listing_id: str, buyer_id: str, cursor: str | None, limit: int
    ) -> tuple[list[object], str | None]:
        thread = [
            m
            for m in self._messages
            if m.listing_id == listing_id and m.buyer_id == buyer_id  # type: ignore[attr-defined]
        ]
        return thread[:limit], None


class FakeRateLimiter:
    """Implements :class:`app.core.listings.chat.RateLimiter`; counts per key."""

    def __init__(self, hard_limit: int | None = None) -> None:
        self._counts: dict[str, int] = {}
        self._hard_limit = hard_limit  # override to force RATE_LIMITED in tests

    def allow(self, key: str, limit: int, window_sec: int) -> bool:
        self._counts[key] = self._counts.get(key, 0) + 1
        cap = self._hard_limit if self._hard_limit is not None else limit
        return self._counts[key] <= cap


class FakeMetricsRecorder:
    """Implements :class:`app.core.analytics.metrics.MetricsRecorder` in memory."""

    def __init__(self) -> None:
        self.heartbeats: dict[str, float] = {}
        self.active: list[tuple[str, str, str]] = []  # (user, day, platform)

    def heartbeat(self, user_id: str, now_ts: float) -> None:
        self.heartbeats[user_id] = now_ts

    def online_count(self, now_ts: float, window_sec: int) -> int:
        return sum(1 for ts in self.heartbeats.values() if ts >= now_ts - window_sec)

    def mark_active(self, user_id: str, day: str, platform: str) -> None:
        self.active.append((user_id, day, platform))

    def active_count(self, days: list[str]) -> int:
        return len({u for u, d, _p in self.active if d in days})

    def active_count_by_platform(self, days: list[str], platform: str) -> int:
        return len({u for u, d, p in self.active if d in days and p == platform})


class FakeRealtimeBus:
    """Implements :class:`app.core.realtime.ports.RealtimeBus`; records publishes."""

    def __init__(self) -> None:
        self.published: list[tuple[str, dict[str, object]]] = []

    def publish(self, channel: str, message: dict[str, object]) -> None:
        self.published.append((channel, message))


class FakeAdminUserRepo:
    """Implements :class:`app.core.admin.users.AdminUserRepo` in memory."""

    def __init__(self) -> None:
        self._users: dict[str, dict[str, object]] = {}

    def seed(
        self, user_id: str, *, display_name: str = "Аня", status: str = "active", city: str = "msk"
    ) -> None:
        self._users[user_id] = {"display_name": display_name, "status": status, "city": city}

    def _row(self, user_id: str) -> object:
        from app.core.admin.users import AdminUserRow

        u = self._users[user_id]
        return AdminUserRow(
            id=user_id,
            display_name=str(u["display_name"]),
            phone_masked="+7•••••",
            city_id=str(u["city"]),
            status=str(u["status"]),
            seller_rating=None,
            listings_count=0,
        )

    def search(
        self, q: str | None, city: str | None, status: str | None, limit: int
    ) -> list[object]:
        out = []
        for uid, u in self._users.items():
            if q and q.lower() not in str(u["display_name"]).lower() and q != uid:
                continue
            if city and u["city"] != city:
                continue
            if status and u["status"] != status:
                continue
            out.append(self._row(uid))
        return out[:limit]

    def detail(self, user_id: str) -> object | None:
        from app.core.admin.users import AdminUserDetail

        if user_id not in self._users:
            return None
        return AdminUserDetail(row=self._row(user_id), listings=[], reviews=[], deals=[])  # type: ignore[arg-type]

    def set_status(self, user_id: str, status: str) -> bool:
        if user_id not in self._users or self._users[user_id]["status"] == "deleted":
            return False
        self._users[user_id]["status"] = status
        return True

    def update(self, user_id: str, display_name: str | None, city_id: str | None) -> bool:
        if user_id not in self._users:
            return False
        if display_name is not None:
            self._users[user_id]["display_name"] = display_name
        if city_id is not None:
            self._users[user_id]["city"] = city_id
        return True


class FakeUsersStatsRepo:
    """Implements :class:`app.core.analytics.overview.UsersStatsRepo` in memory."""

    def __init__(
        self,
        total: int = 0,
        by_city: dict[str, int] | None = None,
        growth: dict[str, int] | None = None,
    ) -> None:
        self._total = total
        self._by_city = by_city or {}
        self._growth = growth or {}

    def total(self) -> int:
        return self._total

    def by_city(self) -> dict[str, int]:
        return dict(self._by_city)

    def registrations_since(self, since_iso: str) -> dict[str, int]:
        return dict(self._growth)


class FakeFinanceRepo:
    """Implements :class:`app.core.analytics.finance.FinanceRepo` in memory."""

    def __init__(
        self,
        totals: dict[str, int] | None = None,
        deals: dict[str, int] | None = None,
    ) -> None:
        self._totals = totals or {}
        self._deals = deals or {}

    def ledger_totals(self, since: str | None, until: str | None) -> dict[str, int]:
        return dict(self._totals)

    def deals_by_status(self, since: str | None, until: str | None) -> dict[str, int]:
        return dict(self._deals)


class FakeAuditLog:
    """Implements :class:`app.core.audit.ports.AuditLog` in memory."""

    def __init__(self) -> None:
        self.entries: list[dict[str, object]] = []

    def record(
        self,
        *,
        action: str,
        target_type: str,
        target_id: str,
        actor_id: str | None = None,
        reason: str | None = None,
        request_id: str | None = None,
    ) -> None:
        self.entries.append(
            {
                "action": action,
                "target_type": target_type,
                "target_id": target_id,
                "actor_id": actor_id,
                "reason": reason,
            }
        )
