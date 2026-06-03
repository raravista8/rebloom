"""Listing enums, request schema, and domain views (API_CONTRACT §1, §3)."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field

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
    geo: str | None = Field(default=None, max_length=128)
    photo_ids: list[str] = Field(min_length=1, max_length=5)
    expires_in_h: int = Field(default=72, ge=1, le=168)


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
