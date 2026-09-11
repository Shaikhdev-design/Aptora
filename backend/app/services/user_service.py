from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth.password import hash_password
from app.models.user import User
from app.schemas.auth import RegisterRequest


def get_user_by_email(db: Session, email: str) -> User | None:
    """Find a user by email address."""

    statement = select(User).where(User.email == email.lower())

    return db.scalar(statement)


def create_user(db: Session, user_data: RegisterRequest) -> User:
    """Create a new user with a securely hashed password."""

    user = User(
        email=user_data.email.lower(),
        password_hash=hash_password(user_data.password),
        full_name=user_data.full_name.strip(),
        role="USER",
        is_active=True,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user