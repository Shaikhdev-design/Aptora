
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.eligibility_rule import EligibilityRule


def create_eligibility_rule(
    db: Session,
    opportunity_id: int,
    rule_type: str,
    field_name: str,
    operator: str,
    expected_value: str,
    description: str | None,
    is_mandatory: bool,
) -> EligibilityRule:
    rule = EligibilityRule(
        opportunity_id=opportunity_id,
        rule_type=rule_type.strip(),
        field_name=field_name.strip(),
        operator=operator.strip().lower(),
        expected_value=expected_value.strip(),
        description=description.strip() if description else None,
        is_mandatory=is_mandatory,
    )

    db.add(rule)
    db.commit()
    db.refresh(rule)

    return rule


def get_eligibility_rule(
    db: Session,
    rule_id: int,
) -> EligibilityRule | None:
    return db.scalar(
        select(EligibilityRule).where(
            EligibilityRule.id == rule_id
        )
    )


def get_eligibility_rules_for_opportunity(
    db: Session,
    opportunity_id: int,
) -> list[EligibilityRule]:
    statement = (
        select(EligibilityRule)
        .where(
            EligibilityRule.opportunity_id == opportunity_id
        )
        .order_by(EligibilityRule.id.asc())
    )

    return list(db.scalars(statement).all())


def update_eligibility_rule(
    db: Session,
    rule: EligibilityRule,
    rule_type: str | None = None,
    field_name: str | None = None,
    operator: str | None = None,
    expected_value: str | None = None,
    description: str | None = None,
    is_mandatory: bool | None = None,
) -> EligibilityRule:

    if rule_type is not None:
        rule.rule_type = rule_type.strip()

    if field_name is not None:
        rule.field_name = field_name.strip()

    if operator is not None:
        rule.operator = operator.strip().lower()

    if expected_value is not None:
        rule.expected_value = expected_value.strip()

    if description is not None:
        rule.description = description.strip() or None

    if is_mandatory is not None:
        rule.is_mandatory = is_mandatory

    db.commit()
    db.refresh(rule)

    return rule


def delete_eligibility_rule(
    db: Session,
    rule: EligibilityRule,
) -> None:
    db.delete(rule)
    db.commit()

