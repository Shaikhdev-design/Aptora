
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_admin
from app.core.database import get_db
from app.models.user import User
from app.schemas.opportunity import (
    OpportunityCreate,
    OpportunityListResponse,
    OpportunityResponse,
    OpportunityUpdate,
)
from app.services.opportunity_service import (
    create_opportunity,
    get_opportunities,
    get_opportunity,
    update_opportunity,
)


router = APIRouter(
    prefix="/opportunities",
    tags=["Opportunities"],
)


@router.get(
    "",
    response_model=OpportunityListResponse,
)
def list_opportunities(
    search: str | None = Query(default=None),
    opportunity_type: str | None = Query(default=None),
    state: str | None = Query(default=None),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """List active Aptora opportunities."""

    opportunities, total = get_opportunities(
        db=db,
        search=search,
        opportunity_type=opportunity_type,
        state=state,
        skip=skip,
        limit=limit,
    )

    return {
        "items": opportunities,
        "total": total,
    }


@router.get(
    "/{opportunity_id}",
    response_model=OpportunityResponse,
)
def get_opportunity_details(
    opportunity_id: int,
    db: Session = Depends(get_db),
):
    """Get details for a single opportunity."""

    opportunity = get_opportunity(
        db,
        opportunity_id,
    )

    if not opportunity or not opportunity.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Opportunity not found.",
        )

    return opportunity


@router.post(
    "",
    response_model=OpportunityResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_opportunity(
    opportunity_data: OpportunityCreate,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Create an opportunity. Administrator access is required."""

    return create_opportunity(
        db,
        opportunity_data,
    )


@router.put(
    "/{opportunity_id}",
    response_model=OpportunityResponse,
)
def update_existing_opportunity(
    opportunity_id: int,
    opportunity_data: OpportunityUpdate,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Update an existing opportunity. Administrator access is required."""

    opportunity = get_opportunity(
        db,
        opportunity_id,
    )

    if not opportunity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Opportunity not found.",
        )

    return update_opportunity(
        db,
        opportunity,
        opportunity_data,
    )

