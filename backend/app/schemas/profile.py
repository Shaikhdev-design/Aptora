from pydantic import BaseModel, Field


class ProfileBase(BaseModel):
    age: int | None = Field(
        default=None,
        ge=13,
        le=100,
    )

    education_level: str | None = Field(
        default=None,
        max_length=100,
    )

    field_of_study: str | None = Field(
        default=None,
        max_length=150,
    )

    institution: str | None = Field(
        default=None,
        max_length=255,
    )

    graduation_year: int | None = Field(
        default=None,
        ge=1900,
        le=2100,
    )

    location: str | None = Field(
        default=None,
        max_length=150,
    )

    state: str | None = Field(
        default=None,
        max_length=100,
    )

    category: str | None = Field(
        default=None,
        max_length=100,
    )

    annual_family_income: int | None = Field(
        default=None,
        ge=0,
    )

    skills: str | None = None

    interests: str | None = None

    preferred_opportunity_types: str | None = None

    gender: str | None = Field(
        default=None,
        max_length=50,
    )


class ProfileCreate(ProfileBase):
    pass


class ProfileUpdate(ProfileBase):
    pass


class ProfileResponse(ProfileBase):
    id: int
    user_id: int

    model_config = {
        "from_attributes": True,
    }