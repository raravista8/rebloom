"""Review + public profile endpoints (API_CONTRACT §5)."""

from __future__ import annotations

from functools import lru_cache
from typing import Annotated, Any

from fastapi import APIRouter, Depends, Request
from fastapi.responses import JSONResponse

from app.api.deps import RequireUserDep, UserRepoDep
from app.api.envelope import domain_error_response, fail, ok, request_id
from app.core.moderation.service import ModerationService
from app.core.result import Ok
from app.core.reviews.schemas import ReviewIn
from app.core.reviews.service import ReviewService
from app.infrastructure.moderation import load_lexicon
from app.infrastructure.postgres.deals_repo import PostgresDealRepository
from app.infrastructure.postgres.reviews_repo import PostgresReviewRepository

router = APIRouter(tags=["reviews"])


@lru_cache(maxsize=1)
def _moderation() -> ModerationService:
    return ModerationService(load_lexicon())


def get_review_service() -> ReviewService:
    return ReviewService(PostgresReviewRepository(), PostgresDealRepository(), _moderation())


ReviewServiceDep = Annotated[ReviewService, Depends(get_review_service)]


@router.post("/api/deals/{deal_id}/review", response_model=None)
def create_review(
    deal_id: str,
    payload: ReviewIn,
    request: Request,
    user: RequireUserDep,
    service: ReviewServiceDep,
) -> dict[str, Any] | JSONResponse:
    result = service.create(user.id, deal_id, payload)
    if isinstance(result, Ok):
        return ok(result.value.to_api())
    return domain_error_response(request, result.error)


@router.get("/api/users/{user_id}", response_model=None)
def get_user(
    user_id: str, request: Request, user_repo: UserRepoDep, service: ReviewServiceDep
) -> dict[str, Any] | JSONResponse:
    profile = user_repo.get_by_id(user_id)
    if profile is None:
        rid = request_id(request)
        return JSONResponse(status_code=404, content=fail("not_found", req_id=rid))
    return ok(
        {
            "user": profile.to_public(),
            "reviews": [r.to_api() for r in service.list_for_user(user_id)],
            "active_listings": [],  # profile listings — follow-up
        }
    )
