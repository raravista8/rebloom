"""Users repository port."""

from __future__ import annotations

from typing import Protocol

from app.core.users.schemas import UserView


class UserRepository(Protocol):
    def get_or_create_by_phone(self, phone: str) -> UserView: ...
    def get_by_id(self, user_id: str) -> UserView | None: ...
