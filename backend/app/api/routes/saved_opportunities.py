from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.core.database import get_db
from app.models.opportunity import Opportunity
from app.models.user import User
from app.schemas.saved_opportunity import (
    SavedOpportunityListResponse,
    SavedOpportunityResponse,
)
from app.services.saved_opportunity_service import (
    delete_saved_opportunity,
    get_saved_opportunity,
    get_saved_opportunities,
    save_opportunity,
)


router = APIRouter(
    prefix="/saved-opportunities",
    tags=["Saved Opportunities"],
)


@router.post(
    "/{opportunity_id}",
    response_model=SavedOpportunityResponse,
    status_code=status.HTTP_201_CREATED,
)
def save_opportunity_for_user(
    opportunity_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    opportunity = (
        db.query(Opportunity)
        .filter(
            Opportunity.id == opportunity_id,
            Opportunity.is_active.is_(True),
        )
        .first()
    )

    if not opportunity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Opportunity not found.",
        )

    existing = get_saved_opportunity(
        db=db,
        user_id=current_user.id,
        opportunity_id=opportunity_id,
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Opportunity is already saved.",
        )

    try:
        saved = save_opportunity(
            db=db,
            user_id=current_user.id,
            opportunity=opportunity,
        )
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Opportunity is already saved.",
        )

    return {
        "id": saved.id,
        "opportunity_id": saved.opportunity_id,
        "created_at": saved.created_at,
        "title": opportunity.title,
        "opportunity_type": opportunity.opportunity_type,
        "provider_name": opportunity.provider_name,
        "deadline": opportunity.deadline,
        "application_url": opportunity.application_url,
        "official_source_url": opportunity.official_source_url,
    }


@router.get(
    "",
    response_model=SavedOpportunityListResponse,
)
def list_saved_opportunities(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    saved_items = get_saved_opportunities(
        db=db,
        user_id=current_user.id,
    )

    items = []

    for saved, opportunity in saved_items:
        items.append(
            {
                "id": saved.id,
                "opportunity_id": saved.opportunity_id,
                "created_at": saved.created_at,
                "title": opportunity.title,
                "opportunity_type": opportunity.opportunity_type,
                "provider_name": opportunity.provider_name,
                "deadline": opportunity.deadline,
                "application_url": opportunity.application_url,
                "official_source_url": opportunity.official_source_url,
            }
        )

    return {
        "items": items,
        "total": len(items),
    }


@router.delete(
    "/{opportunity_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def remove_saved_opportunity(
    opportunity_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    saved = get_saved_opportunity(
        db=db,
        user_id=current_user.id,
        opportunity_id=opportunity_id,
    )

    if not saved:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Saved opportunity not found.",
        )

    delete_saved_opportunity(
        db=db,
        saved_opportunity=saved,
    )

    return None