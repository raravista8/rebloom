"""Admin user management (FR-071/072, ADMIN_BACKEND_TZ §API). Search, drill-down,
block/unblock, and edit — all 2FA-gated at the API and **audited** here. Viewing a
user's PII and editing user data are themselves audited (ФЗ-152, SECURITY T-16)."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Protocol

from app.core.audit.ports import AuditLog
from app.core.errors import NOT_FOUND, VALIDATION_ERROR, DomainError
from app.core.result import Err, Ok, Result

USER_STATUSES = ("active", "limited", "blocked")  # admin-settable (not "deleted")
SEARCH_LIMIT = 50


@dataclass(frozen=True, slots=True)
class AdminUserRow:
    id: str
    display_name: str | None
    phone_masked: str
    city_id: str | None
    status: str
    seller_rating: float | None
    listings_count: int

    def to_api(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "display_name": self.display_name,
            "phone_masked": self.phone_masked,
            "city_id": self.city_id,
            "status": self.status,
            "seller_rating": self.seller_rating,
            "listings_count": self.listings_count,
        }


@dataclass(frozen=True, slots=True)
class AdminUserDetail:
    row: AdminUserRow
    listings: list[dict[str, Any]]
    reviews: list[dict[str, Any]]
    deals: list[dict[str, Any]]

    def to_api(self) -> dict[str, Any]:
        return {
            "user": self.row.to_api(),
            "listings": self.listings,
            "reviews": self.reviews,
            "deals": self.deals,
        }


class AdminUserRepo(Protocol):
    def search(
        self, q: str | None, city: str | None, status: str | None, limit: int
    ) -> list[AdminUserRow]: ...
    def detail(self, user_id: str) -> AdminUserDetail | None: ...
    def set_status(self, user_id: str, status: str) -> bool: ...
    def update(self, user_id: str, display_name: str | None, city_id: str | None) -> bool: ...


class AdminUserService:
    def __init__(self, repo: AdminUserRepo, audit: AuditLog) -> None:
        self._repo = repo
        self._audit = audit

    def _audit_action(
        self, action: str, actor_id: str, user_id: str, reason: str | None, request_id: str | None
    ) -> None:
        self._audit.record(
            action=action,
            target_type="user",
            target_id=user_id,
            actor_id=actor_id,
            reason=reason,
            request_id=request_id,
        )

    def search(
        self, q: str | None = None, city: str | None = None, status: str | None = None
    ) -> list[AdminUserRow]:
        return self._repo.search(q, city, status, SEARCH_LIMIT)

    def detail(
        self, actor_id: str, user_id: str, request_id: str | None = None
    ) -> Result[AdminUserDetail, DomainError]:
        detail = self._repo.detail(user_id)
        if detail is None:
            return Err(DomainError(NOT_FOUND, "user"))
        # Viewing a user's PII is an access event (ФЗ-152, T-16).
        self._audit_action("admin.user.view", actor_id, user_id, "pii_access", request_id)
        return Ok(detail)

    def set_status(
        self, actor_id: str, user_id: str, status: str, reason: str, request_id: str | None = None
    ) -> Result[str, DomainError]:
        if status not in USER_STATUSES:
            return Err(DomainError(VALIDATION_ERROR, "status"))
        if not self._repo.set_status(user_id, status):
            return Err(DomainError(NOT_FOUND, "user"))
        self._audit_action(f"admin.user.{status}", actor_id, user_id, reason, request_id)
        return Ok(status)

    def edit(
        self,
        actor_id: str,
        user_id: str,
        *,
        display_name: str | None,
        city_id: str | None,
        reason: str,
        request_id: str | None = None,
    ) -> Result[str, DomainError]:
        if not self._repo.update(user_id, display_name, city_id):
            return Err(DomainError(NOT_FOUND, "user"))
        self._audit_action("admin.user.edit", actor_id, user_id, reason, request_id)
        return Ok("updated")
