from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.core.database import get_db
from app.matching.matching_engine import get_matching_opportunities
from app.models.opportunity import Opportunity
from app.models.profile import Profile
from app.models.user import User
from app.schemas.matching import MatchingListResponse


router = APIRouter(
    prefix="/matching",
    tags=["Matching"],
)


def opportunity_to_catalog_item(opportunity: Opportunity) -> dict:
    return {
        "id": opportunity.id,
        "title": opportunity.title,
        "opportunity_type": opportunity.opportunity_type,
        "provider_name": opportunity.provider_name,
        "description": opportunity.description or "",
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
        "matching_score": 0.0,
        "eligible": None,
        "eligibility_status": "UNKNOWN",
        "eligibility": {
            "eligible": None,
            "eligibility_status": "UNKNOWN",
            "total_rules": 0,
            "passed_rules": 0,
            "failed_rules": 0,
            "unknown_rules": 0,
            "results": [],
            "message": (
                "Complete your profile to receive personalised "
                "eligibility and matching results."
            ),
        },
    }


@router.get(
    "/opportunities",
    response_model=MatchingListResponse,
)
def get_my_matching_opportunities(
    limit: int = Query(
        default=100,
        ge=1,
        le=2000,
    ),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Return opportunities for the current user.

    If a profile exists:
        - calculate eligibility
        - calculate matching score
        - rank opportunities

    If a profile does not exist:
        - still return the real opportunity catalogue
        - matching score remains 0
        - eligibility remains UNKNOWN

    This keeps the opportunity catalogue usable while still making
    personalised matching available after profile completion.
    """

    profile = (
        db.query(Profile)
        .filter(Profile.user_id == current_user.id)
        .first()
    )

    # ---------------------------------------------------------
    # NO PROFILE
    # ---------------------------------------------------------
    # Users should still be able to browse and save real
    # opportunities before completing their profile.
    # ---------------------------------------------------------
    if not profile:
        opportunities = (
            db.query(Opportunity)
            .filter(Opportunity.is_active.is_(True))
            .order_by(Opportunity.id.desc())
            .limit(limit)
            .all()
        )

        items = [
            opportunity_to_catalog_item(opportunity)
            for opportunity in opportunities
        ]

        return {
            "items": items,
            "total": len(items),
        }

    # ---------------------------------------------------------
    # PROFILE EXISTS
    # ---------------------------------------------------------
    matches = get_matching_opportunities(
        db=db,
        profile=profile,
        limit=limit,
    )

    items = []

    for match in matches:
        opportunity = match["opportunity"]

        eligibility_result = match.get("eligibility") or {}

        eligibility_status = (
            match.get("eligibility_status")
            or eligibility_result.get("eligibility_status")
            or "UNKNOWN"
        )

        if eligibility_status not in {
            "ELIGIBLE",
            "NOT_ELIGIBLE",
            "UNKNOWN",
        }:
            eligibility_status = "UNKNOWN"

        eligible = match.get("eligible")

        if eligible not in {True, False, None}:
            eligible = None

        items.append(
            {
                "id": opportunity.id,
                "title": opportunity.title,
                "opportunity_type": opportunity.opportunity_type,
                "provider_name": opportunity.provider_name,
                "description": opportunity.description or "",
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
                "matching_score": float(
                    match.get("matching_score") or 0
                ),
                "eligible": eligible,
                "eligibility_status": eligibility_status,
                "eligibility": eligibility_result,
            }
        )

    return {
        "items": items,
        "total": len(items),
    }