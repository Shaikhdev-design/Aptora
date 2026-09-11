from typing import Literal

from pydantic import BaseModel, Field


EligibilityStatus = Literal[
    "ELIGIBLE",
    "NOT_ELIGIBLE",
    "UNKNOWN",
]


class MatchingOpportunity(BaseModel):
    id: int
    title: str
    opportunity_type: str
    provider_name: str
    description: str
    location: str | None = None
    state: str | None = None
    application_url: str | None = None
    official_source_url: str | None = None
    deadline: str | None = None
    amount: str | None = None

    matching_score: float = 0.0
    eligible: bool | None = None

    # IMPORTANT:
    # Some older/partially populated matching records do not contain this
    # field. The API must still return a valid response.
    eligibility_status: EligibilityStatus = "UNKNOWN"

    eligibility: dict = Field(default_factory=dict)


class MatchingListResponse(BaseModel):
    items: list[MatchingOpportunity] = Field(default_factory=list)
    total: int = 0