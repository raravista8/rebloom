"""Listing + photo endpoints (API_CONTRACT §3)."""

from __future__ import annotations

from typing import Annotated, Any

from fastapi import APIRouter, Depends, Request
from fastapi.responses import JSONResponse

from app.api.deps import RequireUserDep
from app.api.envelope import domain_error_response, ok
from app.core.listings.ports import PhotoRepository
from app.core.listings.schemas import ListingCreateIn, PhotoCreateIn
from app.core.listings.service import ListingService
from app.core.result import Ok
from app.infrastructure.postgres.listings_repo import PostgresListingRepository
from app.infrastructure.postgres.photos_repo import PostgresPhotoRepository

router = APIRouter(tags=["listings"])


def get_photo_repo() -> PhotoRepository:
    return PostgresPhotoRepository()


def get_listing_service() -> ListingService:
    return ListingService(PostgresListingRepository(), PostgresPhotoRepository())


PhotoRepoDep = Annotated[PhotoRepository, Depends(get_photo_repo)]
ListingServiceDep = Annotated[ListingService, Depends(get_listing_service)]


@router.post("/api/photos", response_model=None)
def create_photo(
    payload: PhotoCreateIn, user: RequireUserDep, repo: PhotoRepoDep
) -> dict[str, Any]:
    ref = repo.create_pending(user.id, payload.content_type)
    # Direct-to-storage upload URL is issued by the storage adapter in T3.2.
    return ok({"photo_id": ref.id, "upload_url": f"/api/photos/{ref.id}/upload"})


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
