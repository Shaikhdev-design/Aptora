"""add age to profiles

Revision ID: a76a9e942f99
Revises: eddf2bb66e8c
Create Date: 2026-09-07
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "a76a9e942f99"
down_revision: Union[str, Sequence[str], None] = "eddf2bb66e8c"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "profiles",
        sa.Column("age", sa.Integer(), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("profiles", "age")