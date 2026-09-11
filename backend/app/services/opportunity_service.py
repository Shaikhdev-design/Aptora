from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.models.opportunity import Opportunity
from app.schemas.opportunity import OpportunityCreate, OpportunityUpdate


def get_opportunity(
    db: Session,
    opportunity_id: int,
) -> Opportunity | None:
    statement = select(Opportunity).where(
        Opportunity.id == opportunity_id
    )

    return db.scalar(statement)


def get_opportunities(
    db: Session,
    search: str | None = None,
    opportunity_type: str | None = None,
    state: str | None = None,
    skip: int = 0,
    limit: int = 20,
) -> tuple[list[Opportunity], int]:

    conditions = [
        Opportunity.is_active.is_(True)
    ]

    if search:
        search_pattern = f"%{search}%"

        conditions.append(
            or_(
                Opportunity.title.ilike(search_pattern),
                Opportunity.description.ilike(search_pattern),
                Opportunity.provider_name.ilike(search_pattern),
            )
        )

    if opportunity_type:
        conditions.append(
            Opportunity.opportunity_type.ilike(
                opportunity_type
            )
        )

    if state:
        conditions.append(
            Opportunity.state.ilike(state)
        )

    count_statement = select(
        func.count(Opportunity.id)
    ).where(*conditions)

    total = db.scalar(count_statement) or 0

    statement = (
        select(Opportunity)
        .where(*conditions)
        .order_by(Opportunity.deadline.asc().nullslast())
        .offset(skip)
        .limit(limit)
    )

    opportunities = list(db.scalars(statement).all())

    return opportunities, total


def create_opportunity(
    db: Session,
    opportunity_data: OpportunityCreate,
) -> Opportunity:

    opportunity = Opportunity(
        **opportunity_data.model_dump()
    )

    db.add(opportunity)
    db.commit()
    db.refresh(opportunity)

    return opportunity


def update_opportunity(
    db: Session,
    opportunity: Opportunity,
    opportunity_data: OpportunityUpdate,
) -> Opportunity:

    update_data = opportunity_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(opportunity, field, value)

    db.commit()
    db.refresh(opportunity)

    return opportunity