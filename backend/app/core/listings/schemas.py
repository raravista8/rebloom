"""Listing enums, request schema, and domain views (API_CONTRACT §1, §3)."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.core.geo.metro import is_valid as metro_is_valid
from app.core.geo.metro import resolve as resolve_metro
from app.core.listings.flowers import FLOWER_IDS

MAX_FLOWER_TYPES = 6

Size = Literal["S", "M", "L", "XL"]
Freshness = Literal["today", "d1_2", "d3_plus"]
ListingStatus = Literal["draft", "pending_review", "active", "reserved", "sold", "archived"]
PhotoModeration = Literal["pending", "approved", "rejected"]


class ListingCreateIn(BaseModel):
    model_config = ConfigDict(extra="forbid")

    size: Size
    freshness: Freshness
    price_kopecks: int = Field(gt=0, le=100_000_000)  # int kopecks, never float
    city_id: str = Field(min_length=2, max_length=8)
    geo: str | None = Field(default=None, max_length=128)  # район — fallback for no-metro cities
    metro_station_id: str | None = Field(default=None, max_length=48)
    flower_types: list[str] = Field(default_factory=list)
    photo_ids: list[str] = Field(min_length=1, max_length=5)
    expires_in_h: int = Field(default=72, ge=1, le=168)

    @field_validator("metro_station_id")
    @classmethod
    def _check_metro(cls, value: str | None) -> str | None:
        if value is not None and not metro_is_valid(value):
            raise ValueError("unknown metro station")
        return value

    @field_validator("flower_types")
    @classmethod
    def _check_flowers(cls, value: list[str]) -> list[str]:
        # Dedupe while preserving order, then validate + cap.
        deduped: list[str] = list(dict.fromkeys(value))
        unknown = [f for f in deduped if f not in FLOWER_IDS]
        if unknown:
            raise ValueError(f"unknown flower types: {unknown}")
        if len(deduped) > MAX_FLOWER_TYPES:
            raise ValueError(f"at most {MAX_FLOWER_TYPES} flower types")
        return deduped


class PhotoCreateIn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    content_type: str = Field(min_length=3, max_length=32)


@dataclass(frozen=True, slots=True)
class PhotoRef:
    id: str
    moderation_status: str  # pending | approved | rejected
    thumb_url: str | None = None
    card_url: str | None = None
    full_url: str | None = None


@dataclass(frozen=True, slots=True)
class ListingView:
    id: str
    seller_id: str
    seller_display_name: str | None
    seller_rating: float | None
    size: str
    freshness: str
    price_kopecks: int
    city_id: str
    geo_coarse: str | None
    metro_station_id: str | None
    flower_types: tuple[str, ...]
    status: str
    like_count: int
    freshness_score: float
    expires_at: datetime
    photos: tuple[PhotoRef, ...]

    def _seller(self) -> dict[str, Any]:
        return {
            "id": self.seller_id,
            "display_name": self.seller_display_name,
            "seller_rating": self.seller_rating,
        }

    def to_card(self, liked: bool = False) -> dict[str, Any]:
        first = self.photos[0] if self.photos else None
        return {
            "id": self.id,
            "photo_thumb_url": first.thumb_url if first else None,
            "size": self.size,
            "freshness": self.freshness,
            "price_kopecks": self.price_kopecks,
            "city_id": self.city_id,
            "metro": resolve_metro(self.metro_station_id),  # station is the card landmark
            "flower_types": list(self.flower_types),
            "like_count": self.like_count,
            "liked": liked,
            "seller": self._seller(),
        }

    def to_detail(self, liked: bool = False) -> dict[str, Any]:
        return {
            **self.to_card(liked),
            "status": self.status,
            "freshness_score": self.freshness_score,
            "expires_at": self.expires_at.isoformat(),
            "geo_coarse": self.geo_coarse,
            "photos": [{"card_url": p.card_url, "full_url": p.full_url} for p in self.photos],
        }
