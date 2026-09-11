from datetime import datetime

from pydantic import BaseModel, Field


class OpportunityBase(BaseModel):
    title: str = Field(min_length=2, max_length=255)
    opportunity_type: str = Field(min_length=2, max_length=50)
    provider_name: str = Field(min_length=2, max_length=255)
    description: str
    location: str | None = None
    state: str | None = None
    application_url: str | None = None
    official_source_url: str | None = None
    deadline: datetime | None = None
    amount: str | None = None
    is_active: bool = True


class OpportunityCreate(OpportunityBase):
    pass


class OpportunityUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=2, max_length=255)
    opportunity_type: str | None = Field(default=None, max_length=50)
    provider_name: str | None = Field(default=None, max_length=255)
    description: str | None = None
    location: str | None = None
    state: str | None = None
    application_url: str | None = None
    official_source_url: str | None = None
    deadline: datetime | None = None
    amount: str | None = None
    is_active: bool | None = None


class OpportunityResponse(OpportunityBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True,
    }


class OpportunityListResponse(BaseModel):
    items: list[OpportunityResponse]
    total: int