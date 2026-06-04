"""Photo upload orchestration (FR-011, SECURITY T-04/T-09).

Validates ownership, re-encodes/strips via the ImageProcessor port, stores
variants via the ObjectStorage port, and marks the photo processed. A photo that
perceptually matches another owner's photo is held ``pending`` for review
(stolen-photo signal, T-09) instead of auto-approved; everything else passes the
technical gate (image content moderation is AR-3, deferred).
"""

from __future__ import annotations

import logging

from app.core.errors import NOT_FOUND, VALIDATION_ERROR, DomainError
from app.core.listings.ports import PhotoRepository
from app.core.photos.phash import find_duplicate
from app.core.photos.ports import ImageProcessor, ObjectStorage
from app.core.result import Err, Ok, Result

logger = logging.getLogger("rebloom.photos")

# How many other-owner hashes to compare against (MVP cap; a BK-tree / bit_count
# index is the scaling path).
_DUP_CANDIDATE_LIMIT = 1000


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
        candidates = self._photos.other_owner_phashes(owner_id, _DUP_CANDIDATE_LIMIT)
        dup_of = find_duplicate(processed.phash, candidates)
        if dup_of is not None:
            logger.warning("photo %s near-duplicate of %s — holding for review", photo_id, dup_of)
        self._photos.mark_processed(photo_id, urls, processed.phash, approved=dup_of is None)
        return Ok(urls)
