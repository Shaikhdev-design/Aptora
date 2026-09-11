import json
from datetime import datetime
from typing import Any

from app.ingestion.aicte_fetcher import fetch_aicte_page


AICTE_SOURCE_URL = "https://internship.aicte-india.org/"


def clean_text(value: Any) -> str | None:
    if value is None:
        return None

    if isinstance(value, list):
        if not value:
            return None

        values = [
            clean_text(item)
            for item in value
            if clean_text(item)
        ]

        return ", ".join(values) if values else None

    text = str(value).strip()

    if not text:
        return None

    return text


def normalize_date(value: Any) -> datetime | None:
    value = clean_text(value)

    if not value:
        return None

    formats = [
        "%Y-%m-%d",
        "%Y-%m-%dT%H:%M:%S",
        "%Y-%m-%dT%H:%M:%S.%f",
        "%d/%m/%Y",
        "%d-%m-%Y",
    ]

    for date_format in formats:
        try:
            return datetime.strptime(value, date_format)
        except ValueError:
            continue

    return None


def normalize_stipend(item: dict[str, Any]) -> str | None:
    return (
        clean_text(item.get("stipendDisplay"))
        or clean_text(item.get("stipend"))
        or clean_text(item.get("stipendMax"))
    )


def normalize_skills(skills: Any) -> str | None:
    return clean_text(skills)


def normalize_eligibility(
    eligibility: Any,
) -> str | None:
    return clean_text(eligibility)


def build_description(item: dict[str, Any]) -> str:
    parts: list[str] = []

    description = clean_text(item.get("description"))
    responsibilities = clean_text(
        item.get("responsibilities")
    )
    eligibility = normalize_eligibility(
        item.get("eligibility")
    )
    skills = normalize_skills(
        item.get("skills")
    )
    mode = clean_text(item.get("mode"))
    duration = clean_text(item.get("duration"))
    perks = clean_text(item.get("perks"))

    if description:
        parts.append(description)

    if responsibilities:
        parts.append(
            f"Responsibilities: {responsibilities}"
        )

    if eligibility:
        parts.append(
            f"Eligibility: {eligibility}"
        )

    if skills:
        parts.append(
            f"Skills: {skills}"
        )

    if mode:
        parts.append(
            f"Mode: {mode}"
        )

    if duration:
        parts.append(
            f"Duration: {duration}"
        )

    if perks:
        parts.append(
            f"Perks: {perks}"
        )

    return "\n\n".join(parts) or (
        "AICTE internship opportunity."
    )


def normalize_aicte_opportunity(
    item: dict[str, Any],
) -> dict[str, Any]:

    deadline = normalize_date(
        item.get("deadline")
    )

    is_open = bool(
        item.get("isOpen", False)
    )

    is_active = is_open and (
        deadline is None
        or deadline >= datetime.now()
    )

    external_id = (
        clean_text(item.get("id"))
        or clean_text(item.get("uid"))
    )

    return {
        "external_id": external_id,
        "source_key": "AICTE_INTERNSHIP_PORTAL",

        "title": (
            clean_text(item.get("title"))
            or "Untitled Internship"
        ),

        "opportunity_type": "INTERNSHIP",

        "provider_name": (
            clean_text(item.get("organization"))
            or "AICTE Internship Provider"
        ),

        "description": build_description(item),

        "location": clean_text(
            item.get("location")
        ),

        "state": clean_text(
            item.get("state")
        ),

        "application_url": None,

        "official_source_url": AICTE_SOURCE_URL,

        "deadline": deadline,

        "amount": normalize_stipend(item),

        "is_active": is_active,

        "source_posted_date": normalize_date(
            item.get("postedDate")
        ),

        "source_duration": clean_text(
            item.get("duration")
        ),

        "source_mode": clean_text(
            item.get("mode")
        ),

        "source_skills": normalize_skills(
            item.get("skills")
        ),

        "source_eligibility": normalize_eligibility(
            item.get("eligibility")
        ),

        "source_verified": bool(
            item.get("verified", False)
        ),

        "source_is_open": is_open,

        "source_uid": clean_text(
            item.get("uid")
        ),

        "source_key_from_api": clean_text(
            item.get("sourceKey")
        ),
    }


if __name__ == "__main__":
    print("Fetching one real AICTE internship...\n")

    data = fetch_aicte_page(
        page=1,
        page_size=1,
    )

    items = data.get("items", [])

    if not items:
        raise RuntimeError(
            "AICTE API returned no internships."
        )

    normalized = normalize_aicte_opportunity(
        items[0]
    )

    print(
        "Successfully normalized one AICTE record.\n"
    )

    print(
        json.dumps(
            normalized,
            indent=2,
            ensure_ascii=False,
            default=str,
        )
    )