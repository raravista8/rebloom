"""Consent schemas (ФЗ-152, FR-004)."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

ALLOWED_CHANNELS = ("web", "ios", "android", "telegram")


class ConsentIn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    policy_version: str = Field(min_length=1, max_length=32)


@dataclass(frozen=True, slots=True)
class ConsentRecord:
    id: str
    accepted_at: datetime
