from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class SyncLog(Base):
    """
    A record of one ingestion run for a given data source, for
    provenance and observability of the opportunity pipeline.
    """

    __tablename__ = "sync_logs"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    data_source_id: Mapped[int] = mapped_column(
        ForeignKey("data_sources.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
    )
    # Expected values: SUCCESS, FAILED, PARTIAL

    opportunities_found: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    opportunities_created: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    opportunities_updated: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    error_message: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    started_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
    )

    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    data_source = relationship(
        "DataSource",
        back_populates="sync_logs",
    )
