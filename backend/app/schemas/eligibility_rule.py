
from datetime import datetime

from pydantic import BaseModel, Field


ALLOWED_OPERATORS = {
    "equals",
    "not_equals",
    "contains",
    "in",
    "greater_than",
    "greater_than_or_equal",
    "less_than",
    "less_than_or_equal",
}


class EligibilityRuleCreate(BaseModel):
    opportunity_id: int = Field(gt=0)
    rule_type: str = Field(min_length=2, max_length=100)
    field_name: str = Field(min_length=2, max_length=100)
    operator: str = Field(min_length=2, max_length=50)
    expected_value: str = Field(min_length=1)
    description: str | None = None
    is_mandatory: bool = True


class EligibilityRuleUpdate(BaseModel):
    rule_type: str | None = Field(default=None, min_length=2, max_length=100)
    field_name: str | None = Field(default=None, min_length=2, max_length=100)
    operator: str | None = Field(default=None, min_length=2, max_length=50)
    expected_value: str | None = Field(default=None, min_length=1)
    description: str | None = None
    is_mandatory: bool | None = None


class EligibilityRuleResponse(BaseModel):
    id: int
    opportunity_id: int
    rule_type: str
    field_name: str
    operator: str
    expected_value: str
    description: str | None
    is_mandatory: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class EligibilityRuleListResponse(BaseModel):
    items: list[EligibilityRuleResponse]
    total: int
