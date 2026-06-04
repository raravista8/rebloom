"""Privacy/DSR ports (ФЗ-152). The repository spans several tables, so it lives
behind a single port the service drives (PRIVACY_152FZ.md §2)."""

from __future__ import annotations

from typing import Any, Protocol

from app.core.users.schemas import UserView


class PrivacyRepository(Protocol):
    def gather_export(self, user_id: str) -> dict[str, Any] | None:
        """Assemble the subject's data (profile, consents, listings, deals,
        reviews, messages) as a machine-readable dict, or None if no such user."""
        ...

    def soft_delete(self, user_id: str, requested_at: str) -> bool:
        """Soft-disable immediately (status→deleted, stamp the deletion request).
        PII scrubbing happens later via the retention job. False if no user."""
        ...

    def update_profile(
        self, user_id: str, *, display_name: str | None, city_id: str | None
    ) -> UserView | None: ...
