"""User domain view + public serialization (API_CONTRACT §2 ``user`` shape)."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Any

from app.core.auth.schemas import mask_phone


@dataclass(frozen=True, slots=True)
class UserView:
    """Immutable snapshot of a user, detached from any ORM session."""

    id: str
    phone: str | None  # 🔒 never serialized in the clear (None for OAuth-first users)
    display_name: str | None
    city_id: str | None
    roles: tuple[str, ...]
    seller_rating: float | None
    status: str
    created_at: datetime | None = None  # registration time; drives «N месяцев на площадке»

    def to_public(self, deals_count: int = 0) -> dict[str, Any]:
        return {
            "id": self.id,
            "display_name": self.display_name,
            "phone_masked": mask_phone(self.phone),
            "city_id": self.city_id,
            "roles": list(self.roles),
            "seller_rating": self.seller_rating,
            "deals_count": deals_count,
            # ISO-8601 UTC; non-sensitive (registration month) → public profile tenure row
            "created_at": self.created_at.isoformat() if self.created_at is not None else None,
        }
