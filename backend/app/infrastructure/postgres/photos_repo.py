"""Postgres PhotoRepository — photo records (bytes pipeline lands in T3.2)."""

from __future__ import annotations

import secrets
import uuid

from sqlalchemy import select

from app.core.listings.schemas import PhotoRef
from app.infrastructure.postgres.engine import writer_session
from app.infrastructure.postgres.models import Photo


def _to_ref(photo: Photo) -> PhotoRef:
    variants = photo.variants or {}
    return PhotoRef(
        id=str(photo.id),
        moderation_status=photo.moderation_status,
        thumb_url=variants.get("thumb"),
        card_url=variants.get("card"),
        full_url=variants.get("full"),
    )


class PostgresPhotoRepository:
    """Implements :class:`app.core.listings.ports.PhotoRepository`."""

    def create_pending(self, owner_id: str, content_type: str) -> PhotoRef:
        with writer_session() as session:
            photo = Photo(
                owner_id=uuid.UUID(owner_id),
                object_key=f"u/{owner_id}/{secrets.token_urlsafe(16)}",
                content_type=content_type,
                moderation_status="pending",
            )
            session.add(photo)
            session.flush()
            return _to_ref(photo)

    def get_owned(self, owner_id: str, photo_ids: list[str]) -> list[PhotoRef]:
        try:
            oid = uuid.UUID(owner_id)
            pids = [uuid.UUID(p) for p in photo_ids]
        except ValueError:
            return []
        with writer_session() as session:
            rows = session.scalars(
                select(Photo).where(Photo.owner_id == oid, Photo.id.in_(pids))
            ).all()
            return [_to_ref(p) for p in rows]
