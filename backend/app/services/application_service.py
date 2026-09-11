from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.application import Application
from app.models.opportunity import Opportunity


ALLOWED_STATUSES = {
    "SAVED",
    "INTERESTED",
    "APPLIED",
    "SHORTLISTED",
    "REJECTED",
    "SELECTED",
}


def get_application(
    db: Session,
    user_id: int,
    application_id: int,
) -> Application | None:
    statement = select(Application).where(
        Application.id == application_id,
        Application.user_id == user_id,
    )

    return db.scalar(statement)


def get_application_for_opportunity(
    db: Session,
    user_id: int,
    opportunity_id: int,
) -> Application | None:
    statement = select(Application).where(
        Application.user_id == user_id,
        Application.opportunity_id == opportunity_id,
    )

    return db.scalar(statement)


def create_application(
    db: Session,
    user_id: int,
    opportunity_id: int,
    status: str,
    notes: str | None,
) -> Application:
    application = Application(
        user_id=user_id,
        opportunity_id=opportunity_id,
        status=status,
        notes=notes,
    )

    if status == "APPLIED":
        application.applied_at = datetime.now(timezone.utc).replace(tzinfo=None)

    db.add(application)
    db.commit()
    db.refresh(application)

    return application


def get_user_applications(
    db: Session,
    user_id: int,
) -> list[tuple[Application, Opportunity]]:
    statement = (
        select(Application, Opportunity)
        .join(
            Opportunity,
            Application.opportunity_id == Opportunity.id,
        )
        .where(Application.user_id == user_id)
        .order_by(Application.updated_at.desc())
    )

    return list(db.execute(statement).all())


def update_application(
    db: Session,
    application: Application,
    status: str | None,
    notes: str | None,
) -> Application:
    if status is not None:
        application.status = status

        if status == "APPLIED" and application.applied_at is None:
            application.applied_at = datetime.now(timezone.utc).replace(
                tzinfo=None
            )

    if notes is not None:
        application.notes = notes

    db.commit()
    db.refresh(application)

    return application