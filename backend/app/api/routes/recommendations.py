from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.core.database import get_db
from app.matching.matching_engine import get_matching_opportunities
from app.models.profile import Profile
from app.models.user import User
from app.schemas.recommendation import RecommendationListResponse


router = APIRouter(
    prefix="/recommendations",
    tags=["Recommendations"],
)


@router.get(
    "",
    response_model=RecommendationListResponse,
)
def get_recommendations(
    limit: int = Query(
        default=20,
        ge=1,
        le=100,
    ),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = (
        db.query(Profile)
        .filter(Profile.user_id == current_user.id)
        .first()
    )

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Please create your profile before viewing recommendations.",
        )

    matches = get_matching_opportunities(
        db=db,
        profile=profile,
        limit=limit,
    )

    items = []

    for match in matches:
        opportunity = match["opportunity"]

        items.append(
            {
                "id": opportunity.id,
                "title": opportunity.title,
                "opportunity_type": opportunity.opportunity_type,
                "provider_name": opportunity.provider_name,
                "description": opportunity.description,
                "location": opportunity.location,
                "state": opportunity.state,
                "application_url": opportunity.application_url,
                "official_source_url": opportunity.official_source_url,
                "deadline": (
                    opportunity.deadline.isoformat()
                    if opportunity.deadline
                    else None
                ),
                "amount": opportunity.amount,
                "matching_score": match["matching_score"],
                "eligible": match["eligible"],
                "eligibility_status": match.get(
                    "eligibility_status",
                    "UNKNOWN",
                ),
                "eligibility": match["eligibility"],
            }
        )

    return {
        "items": items,
        "total": len(items),
    }