
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.core.database import get_db
from app.models.opportunity import Opportunity
from app.models.user import User
from app.schemas.eligibility_rule import (
    ALLOWED_OPERATORS,
    EligibilityRuleCreate,
    EligibilityRuleListResponse,
    EligibilityRuleResponse,
    EligibilityRuleUpdate,
)
from app.services.eligibility_rule_service import (
    create_eligibility_rule,
    delete_eligibility_rule,
    get_eligibility_rule,
    get_eligibility_rules_for_opportunity,
    update_eligibility_rule,
)


router = APIRouter(
    prefix="/eligibility-rules",
    tags=["Eligibility Rules"],
)


def require_admin(current_user: User) -> User:
    if current_user.role.upper() != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrator access is required.",
        )

    return current_user


@router.post(
    "",
    response_model=EligibilityRuleResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_rule(
    rule_data: EligibilityRuleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_admin(current_user)

    opportunity = db.get(Opportunity, rule_data.opportunity_id)

    if not opportunity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Opportunity not found.",
        )

    operator = rule_data.operator.strip().lower()

    if operator not in ALLOWED_OPERATORS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported operator. Allowed operators: {', '.join(sorted(ALLOWED_OPERATORS))}.",
        )

    return create_eligibility_rule(
        db=db,
        opportunity_id=rule_data.opportunity_id,
        rule_type=rule_data.rule_type,
        field_name=rule_data.field_name,
        operator=operator,
        expected_value=rule_data.expected_value,
        description=rule_data.description,
        is_mandatory=rule_data.is_mandatory,
    )


@router.get(
    "/opportunity/{opportunity_id}",
    response_model=EligibilityRuleListResponse,
)
def list_rules(
    opportunity_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    opportunity = db.get(Opportunity, opportunity_id)

    if not opportunity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Opportunity not found.",
        )

    rules = get_eligibility_rules_for_opportunity(
        db=db,
        opportunity_id=opportunity_id,
    )

    return {
        "items": rules,
        "total": len(rules),
    }


@router.get(
    "/{rule_id}",
    response_model=EligibilityRuleResponse,
)
def get_rule(
    rule_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rule = get_eligibility_rule(
        db=db,
        rule_id=rule_id,
    )

    if not rule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Eligibility rule not found.",
        )

    return rule


@router.put(
    "/{rule_id}",
    response_model=EligibilityRuleResponse,
)
def update_rule(
    rule_id: int,
    rule_data: EligibilityRuleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_admin(current_user)

    rule = get_eligibility_rule(
        db=db,
        rule_id=rule_id,
    )

    if not rule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Eligibility rule not found.",
        )

    if rule_data.operator is not None:
        operator = rule_data.operator.strip().lower()

        if operator not in ALLOWED_OPERATORS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported operator. Allowed operators: {', '.join(sorted(ALLOWED_OPERATORS))}.",
            )
    else:
        operator = None

    return update_eligibility_rule(
        db=db,
        rule=rule,
        rule_type=rule_data.rule_type,
        field_name=rule_data.field_name,
        operator=operator,
        expected_value=rule_data.expected_value,
        description=rule_data.description,
        is_mandatory=rule_data.is_mandatory,
    )


@router.delete(
    "/{rule_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_rule(
    rule_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_admin(current_user)

    rule = get_eligibility_rule(
        db=db,
        rule_id=rule_id,
    )

    if not rule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Eligibility rule not found.",
        )

    delete_eligibility_rule(
        db=db,
        rule=rule,
    )

    return None

