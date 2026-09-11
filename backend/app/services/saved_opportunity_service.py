from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.opportunity import Opportunity
from app.models.saved_opportunity import SavedOpportunity


def get_saved_opportunity(
    db: Session,
    user_id: int,
    opportunity_id: int,
) -> SavedOpportunity | None:
    statement = select(SavedOpportunity).where(
        SavedOpportunity.user_id == user_id,
        SavedOpportunity.opportunity_id == opportunity_id,
    )

    return db.scalar(statement)


def save_opportunity(
    db: Session,
    user_id: int,
    opportunity: Opportunity,
) -> SavedOpportunity:
    saved = SavedOpportunity(
        user_id=user_id,
        opportunity_id=opportunity.id,
    )

    db.add(saved)
    db.commit()
    db.refresh(saved)

    return saved


def get_saved_opportunities(
    db: Session,
    user_id: int,
) -> list[tuple[SavedOpportunity, Opportunity]]:
    statement = (
        select(SavedOpportunity, Opportunity)
        .join(
            Opportunity,
            SavedOpportunity.opportunity_id == Opportunity.id,
        )
        .where(SavedOpportunity.user_id == user_id)
        .order_by(SavedOpportunity.created_at.desc())
    )

    return list(db.execute(statement).all())


def delete_saved_opportunity(
    db: Session,
    saved_opportunity: SavedOpportunity,
) -> None:
    db.delete(saved_opportunity)
    db.commit()