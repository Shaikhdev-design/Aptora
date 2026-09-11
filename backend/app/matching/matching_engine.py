from sqlalchemy.orm import Session

from app.matching.eligibility_checker import check_eligibility
from app.models.opportunity import Opportunity
from app.models.profile import Profile


def calculate_matching_score(
    profile: Profile,
    opportunity: Opportunity,
    eligibility_result: dict,
) -> float:
    """
    Calculate an explainable opportunity matching score.

    Score breakdown:
        Eligibility        +50
        Preferred type     +20
        Field of study     +15
        Location           +10
        Skills/interests    +5

    Maximum score: 100
    """

    score = 0.0

    eligibility_status = eligibility_result.get("eligibility_status")

    # ---------------------------------------------------------
    # ELIGIBILITY
    # ---------------------------------------------------------
    if eligibility_status == "ELIGIBLE":
        score += 50

    # NOT_ELIGIBLE receives no eligibility points.
    # UNKNOWN also receives no eligibility points because
    # Aptora cannot confirm eligibility.

    # ---------------------------------------------------------
    # PREFERRED OPPORTUNITY TYPE
    # ---------------------------------------------------------
    preferred_types = []

    if profile.preferred_opportunity_types:
        preferred_types = [
            item.strip().lower()
            for item in profile.preferred_opportunity_types.split(",")
            if item.strip()
        ]

    opportunity_type = (
        opportunity.opportunity_type or ""
    ).strip().lower()

    if opportunity_type in preferred_types:
        score += 20

    # ---------------------------------------------------------
    # FIELD OF STUDY
    # ---------------------------------------------------------
    field_of_study = (
        profile.field_of_study or ""
    ).strip().lower()

    opportunity_text = (
        f"{opportunity.title or ''} "
        f"{opportunity.description or ''}"
    ).lower()

    if field_of_study and field_of_study in opportunity_text:
        score += 15

    # ---------------------------------------------------------
    # LOCATION
    # ---------------------------------------------------------
    user_location = (
        profile.state
        or profile.location
        or ""
    ).strip().lower()

    opportunity_location = (
        opportunity.state
        or opportunity.location
        or ""
    ).strip().lower()

    if user_location and opportunity_location:
        if (
            user_location in opportunity_location
            or opportunity_location in user_location
        ):
            score += 10

    # ---------------------------------------------------------
    # SKILLS + INTERESTS
    # ---------------------------------------------------------
    profile_keywords = []

    if profile.skills:
        profile_keywords.extend(
            item.strip().lower()
            for item in profile.skills.split(",")
            if item.strip()
        )

    if profile.interests:
        profile_keywords.extend(
            item.strip().lower()
            for item in profile.interests.split(",")
            if item.strip()
        )

    if profile_keywords:
        matched_keywords = [
            keyword
            for keyword in profile_keywords
            if keyword in opportunity_text
        ]

        if matched_keywords:
            score += 5

    return round(
        min(score, 100.0),
        2,
    )


def get_matching_opportunities(
    db: Session,
    profile: Profile,
    limit: int = 20,
) -> list[dict]:
    """
    Return active opportunities ranked by relevance.

    Ranking priority:
        1. ELIGIBLE
        2. UNKNOWN
        3. NOT_ELIGIBLE

    Within each status, higher matching score ranks first.
    """

    opportunities = (
        db.query(Opportunity)
        .filter(
            Opportunity.is_active.is_(True)
        )
        .all()
    )

    matches = []

    status_priority = {
        "ELIGIBLE": 3,
        "UNKNOWN": 2,
        "NOT_ELIGIBLE": 1,
    }

    for opportunity in opportunities:
        eligibility_result = check_eligibility(
            db=db,
            profile=profile,
            opportunity=opportunity,
        )

        score = calculate_matching_score(
            profile=profile,
            opportunity=opportunity,
            eligibility_result=eligibility_result,
        )

        eligibility_status = eligibility_result.get(
            "eligibility_status",
            "UNKNOWN",
        )

        matches.append(
            {
                "opportunity": opportunity,
                "matching_score": score,
                "eligible": eligibility_result.get(
                    "eligible"
                ),
                "eligibility_status": eligibility_status,
                "eligibility": eligibility_result,
            }
        )

    # ---------------------------------------------------------
    # RANK RESULTS
    # ---------------------------------------------------------
    matches.sort(
        key=lambda item: (
            status_priority.get(
                item["eligibility_status"],
                0,
            ),
            item["matching_score"],
        ),
        reverse=True,
    )

    return matches[:limit]