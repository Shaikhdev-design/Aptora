from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.profile import Profile
from app.schemas.profile import ProfileCreate, ProfileUpdate


def get_profile_by_user_id(
    db: Session,
    user_id: int,
) -> Profile | None:
    """Get a user's profile."""

    statement = select(Profile).where(Profile.user_id == user_id)

    return db.scalar(statement)


def create_profile(
    db: Session,
    user_id: int,
    profile_data: ProfileCreate,
) -> Profile:
    """Create a profile for a user."""

    profile = Profile(
        user_id=user_id,
        **profile_data.model_dump(),
    )

    db.add(profile)
    db.commit()
    db.refresh(profile)

    return profile


def update_profile(
    db: Session,
    profile: Profile,
    profile_data: ProfileUpdate,
) -> Profile:
    """Update an existing profile."""

    update_data = profile_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(profile, field, value)

    db.commit()
    db.refresh(profile)

    return profile