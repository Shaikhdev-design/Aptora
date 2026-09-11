from datetime import datetime

from pydantic import BaseModel, Field


ALLOWED_APPLICATION_STATUSES = {
    "SAVED",
    "INTERESTED",
    "APPLIED",
    "SHORTLISTED",
    "REJECTED",
    "SELECTED",
}


class ApplicationCreate(BaseModel):
    opportunity_id: int = Field(gt=0)
    status: str = Field(default="SAVED", min_length=3, max_length=50)
    notes: str | None = None


class ApplicationUpdate(BaseModel):
    status: str | None = Field(
        default=None,
        min_length=3,
        max_length=50,
    )
    notes: str | None = None


class ApplicationResponse(BaseModel):
    id: int
    opportunity_id: int
    title: str
    opportunity_type: str
    provider_name: str
    status: str
    notes: str | None
    applied_at: datetime | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ApplicationListResponse(BaseModel):
    items: list[ApplicationResponse]
    total: int