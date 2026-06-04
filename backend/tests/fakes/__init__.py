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

    def save(self, token: str, user_id: str, ttl: int) -> None:
        self._data[token] = user_id

    def get(self, token: str) -> str | None:
        return self._data.get(token)

    def delete(self, token: str) -> None:
        self._data.pop(token, None)

    def refresh(self, token: str, ttl: int) -> None:
        return None


class FakeUserRepository:
    """Implements :class:`app.core.users.ports.UserRepository` in memory."""

    def __init__(self) -> None:
        from app.core.users.schemas import UserView

        self._view = UserView
        self._by_phone: dict[str, object] = {}
        self._by_id: dict[str, object] = {}
        self._seq = 0

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
        self._seq = 0
        self.processed: dict[str, dict[str, str]] = {}

    def seed(self, photo_id: str, owner_id: str, status: str = "approved") -> None:
        self._photos[photo_id] = (owner_id, status)

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

    def mark_processed(self, photo_id: str, variants: dict[str, str]) -> None:
        rec = self._photos.get(photo_id)
        if rec is not None:
            self._photos[photo_id] = (rec[0], "approved")
        self.processed[photo_id] = variants


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
