"""Notification preferences (FR-090, NOTIFICATIONS.md §4). Three categories:
deals (always on — critical money/deal events), messages (default on), marketing
(opt-in only). The delivery layer consults these before sending non-critical
channels; "deals" is never suppressible."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Protocol

from app.core.errors import NOT_FOUND, DomainError
from app.core.result import Err, Ok, Result


@dataclass(frozen=True, slots=True)
class NotifSettings:
    messages: bool
    marketing: bool
    deals: bool = True  # critical — always on, not user-toggleable

    def to_api(self) -> dict[str, Any]:
        return {"deals": self.deals, "messages": self.messages, "marketing": self.marketing}


class NotifSettingsRepo(Protocol):
    def get(self, user_id: str) -> NotifSettings | None: ...
    def update(
        self, user_id: str, messages: bool | None, marketing: bool | None
    ) -> NotifSettings | None: ...


class NotifSettingsService:
    def __init__(self, repo: NotifSettingsRepo) -> None:
        self._repo = repo

    def get(self, user_id: str) -> Result[NotifSettings, DomainError]:
        settings = self._repo.get(user_id)
        if settings is None:
            return Err(DomainError(NOT_FOUND, "user"))
        return Ok(settings)

    def update(
        self, user_id: str, messages: bool | None, marketing: bool | None
    ) -> Result[NotifSettings, DomainError]:
        settings = self._repo.update(user_id, messages, marketing)
        if settings is None:
            return Err(DomainError(NOT_FOUND, "user"))
        return Ok(settings)
