from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.core.database import get_db
from app.models.opportunity import Opportunity
from app.models.user import User
from app.schemas.application import (
    ALLOWED_APPLICATION_STATUSES,
    ApplicationCreate,
    ApplicationListResponse,
    ApplicationResponse,
    ApplicationUpdate,
)
from app.services.application_service import (
    create_application,
    get_application,
    get_application_for_opportunity,
    get_user_applications,
    update_application,
)


router = APIRouter(
    prefix="/applications",
    tags=["Applications"],
)


def build_application_response(application, opportunity):
    return {
        "id": application.id,
        "opportunity_id": application.opportunity_id,
        "title": opportunity.title,
        "opportunity_type": opportunity.opportunity_type,
        "provider_name": opportunity.provider_name,
        "status": application.status,
        "notes": application.notes,
        "applied_at": application.applied_at,
        "created_at": application.created_at,
        "updated_at": application.updated_at,
    }


@router.post(
    "",
    response_model=ApplicationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_application(
    application_data: ApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    status_value = application_data.status.strip().upper()

    if status_value not in ALLOWED_APPLICATION_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Invalid application status. Allowed values: "
                + ", ".join(sorted(ALLOWED_APPLICATION_STATUSES))
            ),
        )

    opportunity = (
        db.query(Opportunity)
        .filter(
            Opportunity.id == application_data.opportunity_id,
            Opportunity.is_active.is_(True),
        )
        .first()
    )

    if not opportunity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Opportunity not found.",
        )

    existing = get_application_for_opportunity(
        db=db,
        user_id=current_user.id,
        opportunity_id=application_data.opportunity_id,
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You already have an application record for this opportunity.",
        )

    application = create_application(
        db=db,
        user_id=current_user.id,
        opportunity_id=application_data.opportunity_id,
        status=status_value,
        notes=application_data.notes,
    )

    return build_application_response(application, opportunity)


@router.get(
    "",
    response_model=ApplicationListResponse,
)
def list_my_applications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    applications = get_user_applications(
        db=db,
        user_id=current_user.id,
    )

    items = [
        build_application_response(application, opportunity)
        for application, opportunity in applications
    ]

    return {
        "items": items,
        "total": len(items),
    }


@router.put(
    "/{application_id}",
    response_model=ApplicationResponse,
)
def update_my_application(
    application_id: int,
    application_data: ApplicationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    application = get_application(
        db=db,
        user_id=current_user.id,
        application_id=application_id,
    )

    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found.",
        )

    status_value = None

    if application_data.status is not None:
        status_value = application_data.status.strip().upper()

        if status_value not in ALLOWED_APPLICATION_STATUSES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Invalid application status. Allowed values: "
                    + ", ".join(sorted(ALLOWED_APPLICATION_STATUSES))
                ),
            )

    application = update_application(
        db=db,
        application=application,
        status=status_value,
        notes=application_data.notes,
    )

    opportunity = (
        db.query(Opportunity)
        .filter(Opportunity.id == application.opportunity_id)
        .first()
    )

    if not opportunity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Opportunity associated with this application was not found.",
        )

    return build_application_response(application, opportunity)