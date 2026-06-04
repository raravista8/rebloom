"""Fraud signals service (FR-073). Records rule-triggered signals (idempotent per
user+type) and exposes the review queue. Recording a signal also bumps the user's
aggregate ``risk_score`` (done in the repo, atomically)."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Protocol

QUEUE_LIMIT = 100


@dataclass(frozen=True, slots=True)
class FraudSignalView:
    id: str
    user_id: str | None
    type: str
    score: int
    evidence: dict[str, Any]
    status: str
    created_at: str | None

    def to_api(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "type": self.type,
            "score": self.score,
            "evidence": self.evidence,
            "status": self.status,
            "created_at": self.created_at,
        }


class FraudRepo(Protocol):
    def record(self, user_id: str, signal_type: str, score: int, evidence: dict[str, Any]) -> None:
        """Upsert a signal (one per user+type) and recompute the user risk score."""
        ...

    def list_open(self, limit: int) -> list[FraudSignalView]: ...


class FraudService:
    def __init__(self, repo: FraudRepo) -> None:
        self._repo = repo

    def record(self, user_id: str, signal_type: str, score: int, evidence: dict[str, Any]) -> None:
        if score > 0:
            self._repo.record(user_id, signal_type, score, evidence)

    def queue(self) -> list[FraudSignalView]:
        return self._repo.list_open(QUEUE_LIMIT)
