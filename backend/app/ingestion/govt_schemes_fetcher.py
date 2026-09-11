from __future__ import annotations

import re
from datetime import datetime
from typing import Any

import requests
from bs4 import BeautifulSoup
from sqlalchemy import text

from app.core.database import engine


NCS_JOB_URL = "https://www.ncs.gov.in/Pages/Search.aspx?OT=nav"

NCS_GOVERNMENT_JOBS_URL = (
    "https://www.ncs.gov.in/pages/govt-job-vacancies.aspx"
)

GOVERNMENT_SERVICES_URL = (
    "https://services.india.gov.in/service/listing"
    "?cat_id=123&ln=en&page_no=2&sort=hit_count%40desc"
)

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/139.0 Safari/537.36"
    ),
    "Accept": (
        "text/html,application/xhtml+xml,application/xml;"
        "q=0.9,*/*;q=0.8"
    ),
    "Accept-Language": "en-IN,en;q=0.9",
}

TIMEOUT = 30


# ---------------------------------------------------------------------------
# HELPERS
# ---------------------------------------------------------------------------

def clean_text(value: str | None) -> str:
    if not value:
        return ""

    value = re.sub(r"\s+", " ", value)
    return value.strip()


def truncate(value: str, length: int = 9000) -> str:
    value = clean_text(value)

    if len(value) <= length:
        return value

    return value[:length].rstrip() + "..."


def fetch_html(url: str) -> str:
    response = requests.get(
        url,
        headers=HEADERS,
        timeout=TIMEOUT,
    )

    response.raise_for_status()

    return response.text


def normalize_date(value: str | None) -> datetime | None:
    if not value:
        return None

    value = clean_text(value)

    formats = [
        "%d/%m/%Y",
        "%d-%m-%Y",
        "%Y-%m-%d",
        "%d %B %Y",
        "%d %b %Y",
    ]

    for fmt in formats:
        try:
            return datetime.strptime(value, fmt)
        except ValueError:
            continue

    return None


def upsert_opportunity(
    opportunity: dict[str, Any],
) -> str:
    """
    Insert or update an opportunity using the existing
    unique(source_key, external_id) constraint.
    """

    sql = text(
        """
        INSERT INTO opportunities (
            title,
            opportunity_type,
            provider_name,
            description,
            location,
            state,
            application_url,
            official_source_url,
            deadline,
            amount,
            is_active,
            created_at,
            updated_at,
            external_id,
            source_key
        )
        VALUES (
            :title,
            :opportunity_type,
            :provider_name,
            :description,
            :location,
            :state,
            :application_url,
            :official_source_url,
            :deadline,
            :amount,
            :is_active,
            :created_at,
            :updated_at,
            :external_id,
            :source_key
        )
        ON CONFLICT (source_key, external_id)
        DO UPDATE SET
            title = EXCLUDED.title,
            opportunity_type = EXCLUDED.opportunity_type,
            provider_name = EXCLUDED.provider_name,
            description = EXCLUDED.description,
            location = EXCLUDED.location,
            state = EXCLUDED.state,
            application_url = EXCLUDED.application_url,
            official_source_url = EXCLUDED.official_source_url,
            deadline = EXCLUDED.deadline,
            amount = EXCLUDED.amount,
            is_active = EXCLUDED.is_active,
            updated_at = EXCLUDED.updated_at
        """
    )

    now = datetime.utcnow()

    values = {
        "title": opportunity["title"],
        "opportunity_type": opportunity["opportunity_type"],
        "provider_name": opportunity["provider_name"],
        "description": opportunity["description"],
        "location": opportunity.get("location"),
        "state": opportunity.get("state"),
        "application_url": opportunity.get("application_url"),
        "official_source_url": opportunity.get(
            "official_source_url"
        ),
        "deadline": opportunity.get("deadline"),
        "amount": opportunity.get("amount"),
        "is_active": opportunity.get("is_active", True),
        "created_at": now,
        "updated_at": now,
        "external_id": opportunity["external_id"],
        "source_key": opportunity["source_key"],
    }

    with engine.begin() as connection:
        result = connection.execute(sql, values)

    return "inserted_or_updated"


# ---------------------------------------------------------------------------
# JOBS — NATIONAL CAREER SERVICE
# ---------------------------------------------------------------------------

def parse_ncs_jobs(html: str) -> list[dict[str, Any]]:
    """
    Parse public NCS job-search results.

    NCS is the Government of India's National Career Service.
    """

    soup = BeautifulSoup(html, "html.parser")

    text_content = "\n".join(
        clean_text(item)
        for item in soup.stripped_strings
    )

    jobs: list[dict[str, Any]] = []

    pattern = re.compile(
        r"""
        (?P<title>[^\n]{3,180})
        \n+
        Company:\s*
        (?P<company>[^\n]{2,220})
        .*?
        Job\s+Location:\s*
        (?P<location>[^\n]{2,180})
        .*?
        Salary:\s*
        (?P<salary>[^\n]{1,180})
        .*?
        Job\s+Description:\s*
        (?P<description>.*?)
        (?:
            Posted\s+On\s*:?
            |
            Posted\s+On
        )
        \s*
        (?P<posted>\d{1,2}[/-]\d{1,2}[/-]\d{4})
        """,
        re.IGNORECASE | re.DOTALL | re.VERBOSE,
    )

    matches = pattern.finditer(text_content)

    for index, match in enumerate(matches, start=1):
        title = clean_text(match.group("title"))
        company = clean_text(match.group("company"))
        location = clean_text(match.group("location"))
        salary = clean_text(match.group("salary"))
        description = clean_text(match.group("description"))
        posted = normalize_date(match.group("posted"))

        if not title or not company:
            continue

        # Ignore obvious page labels/navigation.
        ignored_titles = {
            "search jobs",
            "keyword",
            "job location",
            "expected salary",
            "advanced search",
            "sector",
        }

        if title.lower() in ignored_titles:
            continue

        external_id = (
            "NCS_JOB_"
            + re.sub(
                r"[^A-Z0-9]+",
                "_",
                f"{index}_{title}_{company}".upper(),
            ).strip("_")
        )

        jobs.append(
            {
                "title": title[:255],
                "opportunity_type": "JOB",
                "provider_name": company[:255],
                "description": truncate(
                    (
                        description
                        or f"Job listing published on the "
                           f"National Career Service portal."
                    )
                    + (
                        f" Salary information: {salary}."
                        if salary
                        else ""
                    )
                ),
                "location": location[:255] or None,
                "state": None,
                "application_url": NCS_JOB_URL,
                "official_source_url": NCS_JOB_URL,
                "deadline": None,
                "amount": salary[:100] if salary else None,
                "is_active": True,
                "external_id": external_id[:255],
                "source_key": "NCS_JOBS",
                "source_posted_date": posted,
            }
        )

    return jobs


# ---------------------------------------------------------------------------
# JOB FALLBACK — OFFICIAL GOVERNMENT RECRUITMENT PORTALS
# ---------------------------------------------------------------------------

def parse_ncs_government_recruitment_portals(
    html: str,
) -> list[dict[str, Any]]:
    """
    NCS maintains an official list of government recruitment portals.

    If the live NCS job-search page cannot be parsed, these official
    recruitment destinations are imported as JOB opportunities instead
    of inventing vacancies.
    """

    soup = BeautifulSoup(html, "html.parser")

    results: list[dict[str, Any]] = []

    table_rows = soup.find_all("tr")

    for row_index, row in enumerate(table_rows, start=1):
        cells = row.find_all(["td", "th"])

        if len(cells) < 4:
            continue

        values = [
            clean_text(cell.get_text(" ", strip=True))
            for cell in cells
        ]

        ministry = values[0]
        department = values[1]

        links = row.find_all("a", href=True)

        recruitment_url = None

        for link in links:
            href = link.get("href")

            if not href:
                continue

            href = href.strip()

            if (
                "recruit" in href.lower()
                or "career" in href.lower()
                or "vacan" in href.lower()
                or "job" in href.lower()
                or "join" in href.lower()
            ):
                recruitment_url = href
                break

        if not recruitment_url and len(values) >= 4:
            link_candidates = row.find_all("a", href=True)

            if link_candidates:
                recruitment_url = link_candidates[-1].get(
                    "href"
                )

        if not recruitment_url:
            continue

        if recruitment_url.startswith("//"):
            recruitment_url = "https:" + recruitment_url
        elif recruitment_url.startswith("/"):
            recruitment_url = (
                "https://www.ncs.gov.in"
                + recruitment_url
            )
        elif not recruitment_url.startswith("http"):
            continue

        if not ministry or ministry.lower() == "ministry":
            continue

        provider = ministry

        if department and department != ministry:
            provider = f"{ministry} — {department}"

        title = f"Government Recruitment — {provider}"

        external_id = (
            "NCS_GOV_RECRUITMENT_"
            + re.sub(
                r"[^A-Z0-9]+",
                "_",
                f"{row_index}_{provider}".upper(),
            ).strip("_")
        )

        results.append(
            {
                "title": title[:255],
                "opportunity_type": "JOB",
                "provider_name": provider[:255],
                "description": truncate(
                    (
                        "Official government recruitment portal "
                        "listed by India's National Career Service. "
                        "Use the official recruitment page to view "
                        "current vacancies, eligibility and application "
                        "instructions."
                    )
                ),
                "location": "India",
                "state": None,
                "application_url": recruitment_url,
                "official_source_url": NCS_GOVERNMENT_JOBS_URL,
                "deadline": None,
                "amount": None,
                "is_active": True,
                "external_id": external_id[:255],
                "source_key": "NCS_GOV_RECRUITMENT",
            }
        )

    return results


def import_jobs() -> int:
    print("\n========================================")
    print("APTORA — IMPORTING JOBS")
    print("Source: National Career Service")
    print("========================================\n")

    jobs: list[dict[str, Any]] = []

    try:
        print("Fetching live NCS job listings...")

        html = fetch_html(NCS_JOB_URL)

        jobs = parse_ncs_jobs(html)

        print(
            f"Parsed {len(jobs)} live NCS job listings."
        )

    except Exception as exc:
        print(
            "Live NCS job listing extraction failed:"
        )
        print(exc)

    if not jobs:
        print(
            "\nTrying official NCS government recruitment "
            "portal directory..."
        )

        try:
            html = fetch_html(
                NCS_GOVERNMENT_JOBS_URL
            )

            jobs = parse_ncs_government_recruitment_portals(
                html
            )

            print(
                f"Parsed {len(jobs)} official recruitment portals."
            )

        except Exception as exc:
            print(
                "Government recruitment directory extraction failed:"
            )
            print(exc)

    inserted = 0

    for job in jobs:
        try:
            upsert_opportunity(job)
            inserted += 1
        except Exception as exc:
            print(
                f"Skipping job '{job.get('title')}': {exc}"
            )

    print(
        f"\nJobs inserted/updated: {inserted}"
    )

    return inserted


# ---------------------------------------------------------------------------
# GOVERNMENT SCHEMES
# ---------------------------------------------------------------------------

SCHEME_KEYWORDS = (
    "scheme",
    "yojana",
    "mission",
    "pension",
    "fund",
    "programme",
    "program",
)


def looks_like_scheme(title: str, description: str) -> bool:
    combined = (
        f"{title} {description}"
    ).lower()

    return any(
        keyword in combined
        for keyword in SCHEME_KEYWORDS
    )


def parse_government_schemes(
    html: str,
) -> list[dict[str, Any]]:
    """
    Parse government benefit/scheme entries from the official
    National Government Services Portal.

    We intentionally only keep entries that look like actual
    schemes/programmes rather than generic certificates or services.
    """

    soup = BeautifulSoup(html, "html.parser")

    results: list[dict[str, Any]] = []

    seen_urls: set[str] = set()

    for anchor in soup.find_all("a", href=True):
        href = anchor.get("href")

        if not href:
            continue

        href = href.strip()

        if "/service/detail/" not in href:
            continue

        if href.startswith("//"):
            href = "https:" + href
        elif href.startswith("/"):
            href = "https://services.india.gov.in" + href

        if not href.startswith("http"):
            continue

        if href in seen_urls:
            continue

        title = clean_text(
            anchor.get_text(" ", strip=True)
        )

        if not title or len(title) < 4:
            continue

        parent = anchor.parent

        if parent is None:
            continue

        card = parent.parent

        if card is None:
            card = parent

        card_text = clean_text(
            card.get_text(" ", strip=True)
        )

        description = card_text

        if title.lower() in description.lower():
            description = description[
                description.lower().find(
                    title.lower()
                )
                + len(title):
            ].strip()

        description = re.sub(
            r"\bMore\b",
            "",
            description,
            flags=re.IGNORECASE,
        )

        description = clean_text(description)

        if not looks_like_scheme(
            title,
            description,
        ):
            continue

        external_id = (
            "GOV_SCHEME_"
            + re.sub(
                r"[^A-Z0-9]+",
                "_",
                title.upper(),
            ).strip("_")
        )

        results.append(
            {
                "title": title[:255],
                "opportunity_type": "GOVERNMENT_SCHEME",
                "provider_name": (
                    "Government of India"
                ),
                "description": truncate(
                    description
                    or (
                        "Government scheme information "
                        "published through the official "
                        "National Government Services Portal."
                    )
                ),
                "location": "India",
                "state": None,
                "application_url": href,
                "official_source_url": href,
                "deadline": None,
                "amount": None,
                "is_active": True,
                "external_id": external_id[:255],
                "source_key": "INDIA_GOV_SCHEMES",
            }
        )

        seen_urls.add(href)

    return results


def import_government_schemes() -> int:
    print("\n========================================")
    print("APTORA — IMPORTING GOVERNMENT SCHEMES")
    print("Source: Government of India")
    print("========================================\n")

    try:
        html = fetch_html(
            GOVERNMENT_SERVICES_URL
        )

        schemes = parse_government_schemes(html)

        print(
            f"Parsed {len(schemes)} government scheme entries."
        )

    except Exception as exc:
        print(
            "Government scheme extraction failed:"
        )
        print(exc)
        return 0

    inserted = 0

    for scheme in schemes:
        try:
            upsert_opportunity(scheme)
            inserted += 1
        except Exception as exc:
            print(
                f"Skipping scheme "
                f"'{scheme.get('title')}': {exc}"
            )

    print(
        f"\nGovernment schemes inserted/updated: "
        f"{inserted}"
    )

    return inserted


# ---------------------------------------------------------------------------
# SUMMARY
# ---------------------------------------------------------------------------

def print_database_summary() -> None:
    sql = text(
        """
        SELECT
            opportunity_type,
            COUNT(*) AS total
        FROM opportunities
        WHERE is_active = TRUE
        GROUP BY opportunity_type
        ORDER BY opportunity_type
        """
    )

    with engine.begin() as connection:
        rows = connection.execute(sql).fetchall()

    print("\n========================================")
    print("APTORA — ACTIVE OPPORTUNITY SUMMARY")
    print("========================================")

    if not rows:
        print("No active opportunities found.")
        return

    for row in rows:
        print(
            f"{row[0]:25} {row[1]}"
        )

    print("========================================\n")


def main() -> None:
    jobs_count = import_jobs()

    schemes_count = import_government_schemes()

    print_database_summary()

    print(
        "Finished."
        f" Jobs processed: {jobs_count}."
        f" Government schemes processed: {schemes_count}."
    )


if __name__ == "__main__":
    main()