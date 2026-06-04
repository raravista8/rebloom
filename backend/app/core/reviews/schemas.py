"""Review request + view (API_CONTRACT §5)."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from pydantic import BaseModel, ConfigDict, Field

REVIEW_WINDOW_DAYS = 14


class ReviewIn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    score: int = Field(ge=1, le=5)
    text: str = Field(min_length=1, max_length=2000)


@dataclass(frozen=True, slots=True)
class ReviewView:
    id: str
    deal_id: str
    author_id: str
    target_id: str
    score: int
    text: str
    moderation_status: str

    def to_api(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "deal_id": self.deal_id,
            "author_id": self.author_id,
            "target_id": self.target_id,
            "score": self.score,
            "text": self.text,
            "moderation_status": self.moderation_status,
        }
