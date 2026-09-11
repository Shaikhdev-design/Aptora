from datetime import datetime
from typing import Any


def clean_text(value: Any) -> str | None:
    """Clean a text value and return None for empty values."""
    if value is None:
        return None

    text = str(value).strip()

    if not text:
        return None

    return text


def normalize_date(value: Any) -> datetime | None:
    """
    Convert dataset date values into Python datetime objects.

    Supports common formats found in the AICTE dataset.
    """
    value = clean_text(value)

    if not value:
        return None

    formats = [
        "%d/%m/%y",
        "%d/%m/%Y",
        "%m/%d/%y",
        "%m/%d/%Y",
        "%d-%m-%Y",
        "%Y-%m-%d",
    ]

    for date_format in formats:
        try:
            return datetime.strptime(value, date_format)
        except ValueError:
            continue

    return None


def normalize_opportunity_type(job_type: Any) -> str:
    """Convert the source job type into an Aptora opportunity type."""

    value = (clean_text(job_type) or "").lower()

    # This dataset contains internship opportunities even though
    # the source column is named Job Type.
    if "intern" in value:
        return "INTERNSHIP"

    return "INTERNSHIP"


def normalize_stipend(value: Any) -> str | None:
    """Clean stipend information while preserving the original meaning."""
    return clean_text(value)


def normalize_duration(value: Any) -> str | None:
    """Clean internship duration information."""
    return clean_text(value)


def normalize_opportunity(row: dict[str, Any]) -> dict[str, Any]:
    """
    Convert one AICTE CSV row into Aptora's opportunity format.
    """

    title = clean_text(row.get("Job Title"))
    company = clean_text(row.get("Company Name"))
    city = clean_text(row.get("Cities"))
    state = clean_text(row.get("States"))
    stipend = normalize_stipend(row.get("Stipend"))
    start_date = clean_text(row.get("Start Date"))
    duration = normalize_duration(row.get("Duration"))
    openings = clean_text(row.get("Numer of Openings"))
    posted_date = normalize_date(row.get("Posted Date"))
    deadline = normalize_date(row.get("Late date to apply"))

    description_parts = []

    if company:
        description_parts.append(f"Internship opportunity with {company}.")

    if duration:
        description_parts.append(f"Duration: {duration}.")

    if stipend:
        description_parts.append(f"Stipend: {stipend}.")

    if start_date:
        description_parts.append(f"Start date: {start_date}.")

    if openings:
        description_parts.append(f"Number of openings: {openings}.")

    description = " ".join(description_parts)

    return {
        "title": title or "Untitled Internship",
        "opportunity_type": normalize_opportunity_type(
            row.get("Job Type")
        ),
        "provider_name": company or "AICTE Internship Provider",
        "description": description or "Internship opportunity listed through the AICTE internship dataset.",
        "location": city,
        "state": state,
        "application_url": None,
        "official_source_url": "https://internship.aicte-india.org/",
        "deadline": deadline,
        "amount": stipend,
        "is_active": bool(deadline and deadline >= datetime.now()),
        "source_posted_date": posted_date,
        "source_start_date": start_date,
        "source_duration": duration,
        "source_openings": openings,
    }