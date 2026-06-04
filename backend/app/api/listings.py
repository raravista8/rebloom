"""Listing + photo endpoints (API_CONTRACT §3)."""

from __future__ import annotations

from pathlib import Path
from typing import Annotated, Any

from fastapi import APIRouter, Depends, File, Request, UploadFile
from fastapi.responses import JSONResponse

from app.api.deps import RequireUserDep
from app.api.envelope import domain_error_response, ok
from app.config import get_settings
from app.core.likes.service import LikeService
from app.core.listings.ports import PhotoRepository
from app.core.listings.schemas import ListingCreateIn, PhotoCreateIn
from app.core.listings.service import ListingService
from app.core.photos.service import PhotoUploadService
from app.core.result import Ok
from app.infrastructure.images import PillowImageProcessor
from app.infrastructure.object_storage import LocalFsStorage
from app.infrastructure.postgres.cities_repo import PostgresCityRepository
from app.infrastructure.postgres.likes_repo import PostgresLikeRepository
from app.infrastructure.postgres.listings_repo import PostgresListingRepository
from app.infrastructure.postgres.photos_repo import PostgresPhotoRepository

router = APIRouter(tags=["listings"])


def get_photo_repo() -> PhotoRepository:
    return PostgresPhotoRepository()


def get_listing_service() -> ListingService:
    return ListingService(
        PostgresListingRepository(),
        PostgresPhotoRepository(),
        PostgresCityRepository(),
    )


def get_photo_upload_service() -> PhotoUploadService:
    settings = get_settings()
    storage = LocalFsStorage(Path(settings.photo_storage_dir), settings.cdn_base_url)
    return PhotoUploadService(PostgresPhotoRepository(), PillowImageProcessor(), storage)


def get_like_service() -> LikeService:
    return LikeService(PostgresLikeRepository())


PhotoRepoDep = Annotated[PhotoRepository, Depends(get_photo_repo)]
ListingServiceDep = Annotated[ListingService, Depends(get_listing_service)]
PhotoUploadServiceDep = Annotated[PhotoUploadService, Depends(get_photo_upload_service)]
LikeServiceDep = Annotated[LikeService, Depends(get_like_service)]


@router.post("/api/photos", response_model=None)
def create_photo(
    payload: PhotoCreateIn, user: RequireUserDep, repo: PhotoRepoDep
) -> dict[str, Any]:
    ref = repo.create_pending(user.id, payload.content_type)
    return ok({"photo_id": ref.id, "upload_url": f"/api/photos/{ref.id}/upload"})


@router.post("/api/photos/{photo_id}/upload", response_model=None)
async def upload_photo(
    photo_id: str,
    request: Request,
    user: RequireUserDep,
    service: PhotoUploadServiceDep,
    file: Annotated[UploadFile, File()],
) -> dict[str, Any] | JSONResponse:
    raw = await file.read()
    result = service.upload(user.id, photo_id, raw)
    if isinstance(result, Ok):
        return ok({"variants": result.value})
    return domain_error_response(request, result.error)


@router.post("/api/listings", response_model=None)
def create_listing(
    payload: ListingCreateIn,
    request: Request,
    user: RequireUserDep,
    service: ListingServiceDep,
) -> dict[str, Any] | JSONResponse:
    result = service.create(user.id, payload)
    if isinstance(result, Ok):
        return ok(result.value.to_detail())
    return domain_error_response(request, result.error)


@router.get("/api/listings/{listing_id}", response_model=None)
def get_listing(
    listing_id: str, request: Request, service: ListingServiceDep
) -> dict[str, Any] | JSONResponse:
    result = service.get(listing_id)
    if isinstance(result, Ok):
        return ok(result.value.to_detail())
    return domain_error_response(request, result.error)


@router.post("/api/listings/{listing_id}/like", response_model=None)
def like_listing(
    listing_id: str, request: Request, user: RequireUserDep, service: LikeServiceDep
) -> dict[str, Any] | JSONResponse:
    result = service.like(user.id, listing_id)
    if isinstance(result, Ok):
        count, liked = result.value
        return ok({"like_count": count, "liked": liked})
    return domain_error_response(request, result.error)


@router.delete("/api/listings/{listing_id}/like", response_model=None)
def unlike_listing(
    listing_id: str, request: Request, user: RequireUserDep, service: LikeServiceDep
) -> dict[str, Any] | JSONResponse:
    result = service.unlike(user.id, listing_id)
    if isinstance(result, Ok):
        count, liked = result.value
        return ok({"like_count": count, "liked": liked})
    return domain_error_response(request, result.error)
