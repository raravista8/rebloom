"""Photo upload orchestration (FR-011, SECURITY T-04).

Validates ownership, re-encodes/strips via the ImageProcessor port, stores
variants via the ObjectStorage port, and marks the photo processed+approved
(technical pass — image content moderation is AR-3, deferred).
"""

from __future__ import annotations

from app.core.errors import NOT_FOUND, VALIDATION_ERROR, DomainError
from app.core.listings.ports import PhotoRepository
from app.core.photos.ports import ImageProcessor, ObjectStorage
from app.core.result import Err, Ok, Result


class PhotoUploadService:
    def __init__(
        self,
        photos: PhotoRepository,
        processor: ImageProcessor,
        storage: ObjectStorage,
    ) -> None:
        self._photos = photos
        self._processor = processor
        self._storage = storage

    def upload(
        self, owner_id: str, photo_id: str, raw: bytes
    ) -> Result[dict[str, str], DomainError]:
        if self._photos.get_one(owner_id, photo_id) is None:
            return Err(DomainError(NOT_FOUND, "photo"))

        processed = self._processor.process(raw)
        if processed is None:
            return Err(DomainError(VALIDATION_ERROR, "invalid_image"))

        urls = {
            name: self._storage.put(f"photos/{photo_id}/{name}.webp", data, processed.content_type)
            for name, data in processed.variants.items()
        }
        self._photos.mark_processed(photo_id, urls)
        return Ok(urls)
