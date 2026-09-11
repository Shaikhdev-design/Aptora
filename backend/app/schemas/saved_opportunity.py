from datetime import datetime

from pydantic import BaseModel


class SavedOpportunityResponse(BaseModel):
    id: int
    opportunity_id: int
    created_at: datetime
    title: str
    opportunity_type: str
    provider_name: str
    deadline: datetime | None
    application_url: str | None
    official_source_url: str | None

    model_config = {"from_attributes": True}


class SavedOpportunityListResponse(BaseModel):
    items: list[SavedOpportunityResponse]
    total: int