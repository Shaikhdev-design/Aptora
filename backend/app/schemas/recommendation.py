from typing import Literal
from pydantic import BaseModel
from datetime import datetime


EligibilityStatus = Literal[
    "ELIGIBLE",
    "NOT_ELIGIBLE",
    "UNKNOWN",
]


class RecommendationItem(BaseModel):
    id: int
    title: str
    opportunity_type: str
    provider_name: str
    description: str
    location: str | None
    state: str | None
    application_url: str | None
    official_source_url: str | None
    deadline: datetime | None
    amount: str | None
    matching_score: float
    eligible: bool | None
    eligibility_status: EligibilityStatus
    eligibility: dict


class RecommendationListResponse(BaseModel):
    items: list[RecommendationItem]
    total: int