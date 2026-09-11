from __future__ import annotations

from datetime import datetime
from typing import Any

import requests
from bs4 import BeautifulSoup
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import engine
from app.models.opportunity import Opportunity


# ============================================================
# APTORA — OFFICIAL GOVERNMENT OPPORTUNITY IMPORTER
# ============================================================

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/140.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-IN,en;q=0.9",
}

NCS_URL = "https://www.ncs.gov.in/Pages/Search.aspx?OT=nav"

UPSC_URL = "https://www.upsc.gov.in/recruitment/recruitment-advertisement"

CDAC_URL = (
    "https://www.cdac.gov.in/index.aspx"
    "?id=ca_cdac_chennai_recruitment_2026"
)

ACTREC_URL = "https://www.actrec.gov.in/jobs"

NCCR_URL = "https://www.nccr.gov.in/?q=recruitment-view"

MEITY_URL = "https://www.meity.gov.in/offerings/vacancies"

INDIA_GOV_BASE = "https://www.india.gov.in"


# ============================================================
# HELPERS
# ============================================================


def clean_text(value: Any) -> str:
    if value is None:
        return ""

    return " ".join(str(value).split()).strip()


def fetch_html(url: str, timeout: int = 20) -> str:
    try:
        response = requests.get(
            url,
            headers=HEADERS,
            timeout=timeout,
        )

        response.raise_for_status()

        return response.text

    except Exception as exc:
        print(f"Could not fetch {url}")
        print(f"Reason: {exc}")
        return ""


def parse_date(value: str | None) -> datetime | None:
    if not value:
        return None

    value = clean_text(value)

    formats = [
        "%d/%m/%Y",
        "%d-%m-%Y",
        "%d.%m.%Y",
        "%d %B %Y",
        "%d %b %Y",
        "%Y-%m-%d",
    ]

    for fmt in formats:
        try:
            return datetime.strptime(value, fmt)
        except ValueError:
            continue

    return None


def parse_date_time(
    value: str | None,
    time_value: str | None = None,
) -> datetime | None:
    if not value:
        return None

    value = clean_text(value)

    date_formats = [
        "%d/%m/%Y",
        "%d-%m-%Y",
        "%d.%m.%Y",
        "%d %B %Y",
        "%d %b %Y",
        "%Y-%m-%d",
    ]

    for fmt in date_formats:
        try:
            parsed = datetime.strptime(value, fmt)

            if time_value:
                try:
                    parsed_time = datetime.strptime(
                        clean_text(time_value),
                        "%H:%M",
                    ).time()

                    return datetime.combine(
                        parsed.date(),
                        parsed_time,
                    )
                except ValueError:
                    pass

            return parsed

        except ValueError:
            continue

    return None


# ============================================================
# DATABASE UPSERT
# ============================================================


def upsert_opportunity(
    db: Session,
    *,
    source_key: str,
    external_id: str,
    title: str,
    provider_name: str,
    opportunity_type: str,
    description: str,
    location: str | None,
    state: str | None,
    application_url: str | None,
    official_source_url: str | None,
    deadline: datetime | None,
    amount: str | None = None,
) -> str:

    title = clean_text(title)

    if not title:
        return "skipped"

    external_id = clean_text(external_id)

    existing = db.execute(
        select(Opportunity).where(
            Opportunity.source_key == source_key,
            Opportunity.external_id == external_id,
        )
    ).scalar_one_or_none()

    values = {
        "title": title,
        "provider_name": clean_text(provider_name),
        "opportunity_type": clean_text(opportunity_type),
        "description": clean_text(description),
        "location": clean_text(location) or None,
        "state": clean_text(state) or None,
        "application_url": application_url,
        "official_source_url": official_source_url,
        "deadline": deadline,
        "amount": clean_text(amount) or None,
        "is_active": True,
        "source_key": source_key,
        "external_id": external_id,
    }

    if existing:
        for field, value in values.items():
            setattr(existing, field, value)

        return "updated"

    opportunity = Opportunity(**values)

    db.add(opportunity)

    return "inserted"


# ============================================================
# NCS — LIVE ATTEMPT
# ============================================================


def parse_ncs_jobs() -> list[dict[str, Any]]:
    print()
    print("Fetching live NCS job listings...")

    html = fetch_html(NCS_URL)

    if not html:
        return []

    soup = BeautifulSoup(html, "html.parser")

    jobs: list[dict[str, Any]] = []

    # NCS may render the live job results dynamically.
    # We therefore only import structured listings if they
    # are actually present in the returned HTML.
    for link in soup.find_all("a", href=True):

        title = clean_text(link.get_text(" ", strip=True))

        if len(title) < 5:
            continue

        title_lower = title.lower()

        job_keywords = [
            "job",
            "vacancy",
            "recruitment",
            "employment",
            "career",
        ]

        if not any(
            keyword in title_lower
            for keyword in job_keywords
        ):
            continue

        href = link.get("href")

        if not href:
            continue

        if href.startswith("/"):
            href = "https://www.ncs.gov.in" + href

        jobs.append(
            {
                "external_id": href,
                "title": title,
                "provider_name": "National Career Service",
                "description": (
                    "Job opportunity listed through the "
                    "Government of India's National Career Service."
                ),
                "location": None,
                "state": None,
                "application_url": href,
                "official_source_url": NCS_URL,
                "deadline": None,
            }
        )

    # Deduplicate links.
    unique: dict[str, dict[str, Any]] = {}

    for job in jobs:
        unique[job["external_id"]] = job

    result = list(unique.values())

    print(f"Parsed {len(result)} live NCS job listings.")

    return result


# ============================================================
# OFFICIAL GOVERNMENT JOB SEEDS
#
# These are sourced from currently published official
# government recruitment pages.
# ============================================================


def official_government_jobs() -> list[dict[str, Any]]:
    return [
        {
            "source_key": "UPSC",
            "external_id": "UPSC-52-2026-APFC",
            "title": (
                "Assistant Provident Fund Commissioner — "
                "UPSC Special Advertisement No. 52/2026"
            ),
            "provider_name": "Union Public Service Commission",
            "description": (
                "Direct recruitment for Assistant Provident Fund "
                "Commissioner posts in the Employees' Provident Fund "
                "Organisation under the Ministry of Labour and Employment. "
                "Special Advertisement No. 52/2026."
            ),
            "location": "All India",
            "state": None,
            "application_url": "https://upsconline.nic.in/ora/",
            "official_source_url": UPSC_URL,
            "deadline": datetime(
                2026,
                9,
                11,
                18,
                0,
            ),
        },
        {
            "source_key": "CDAC",
            "external_id": "CDAC-CHN-PA-2026",
            "title": "Project Associate (Fresher) — C-DAC Chennai",
            "provider_name": (
                "Centre for Development of Advanced Computing"
            ),
            "description": (
                "C-DAC Chennai recruitment for Project Associate "
                "(Fresher). Fourteen posts are listed. Eligible "
                "candidates include B.E./B.Tech graduates in Computer "
                "Science, Information Technology, Electronics & "
                "Communication, Electrical & Electronics and related "
                "fields as specified in the official notification."
            ),
            "location": "Chennai",
            "state": "Tamil Nadu",
            "application_url": (
                "https://forms.gle/TSX7P5BMPy6abJCK6"
            ),
            "official_source_url": CDAC_URL,
            "deadline": datetime(
                2026,
                9,
                22,
                17,
                0,
            ),
        },
        {
            "source_key": "CDAC",
            "external_id": "CDAC-CHN-PE-2026",
            "title": "Project Engineer — C-DAC Chennai",
            "provider_name": (
                "Centre for Development of Advanced Computing"
            ),
            "description": (
                "C-DAC Chennai recruitment for Project Engineer "
                "positions on project-based contract. Candidates must "
                "meet the qualification and experience requirements "
                "specified in the official recruitment notice."
            ),
            "location": "Chennai",
            "state": "Tamil Nadu",
            "application_url": (
                "https://forms.gle/TSX7P5BMPy6abJCK6"
            ),
            "official_source_url": CDAC_URL,
            "deadline": datetime(
                2026,
                9,
                22,
                17,
                0,
            ),
        },
        {
            "source_key": "NCCR",
            "external_id": "NCCR-PROJECT-POSTS-2026",
            "title": "Recruitment of Project Posts — NCCR 2026",
            "provider_name": (
                "National Centre for Coastal Research"
            ),
            "description": (
                "Recruitment of project posts at the National Centre "
                "for Coastal Research. The official recruitment page "
                "lists the recruitment notice and closing date."
            ),
            "location": "Chennai",
            "state": "Tamil Nadu",
            "application_url": NCCR_URL,
            "official_source_url": NCCR_URL,
            "deadline": datetime(
                2026,
                9,
                19,
                17,
                0,
            ),
        },
        {
            "source_key": "ACTREC",
            "external_id": "ACTREC-ADVT-182-2026",
            "title": "Trial Coordinator — ACTREC",
            "provider_name": (
                "Advanced Centre for Treatment, Research and "
                "Education in Cancer"
            ),
            "description": (
                "Walk-in interview opportunity for Trial Coordinator "
                "at ACTREC. Candidates should verify qualification, "
                "experience, venue and interview requirements in the "
                "official advertisement."
            ),
            "location": "Mumbai",
            "state": "Maharashtra",
            "application_url": ACTREC_URL,
            "official_source_url": ACTREC_URL,
            "deadline": datetime(
                2026,
                9,
                16,
            ),
        },
        {
            "source_key": "ACTREC",
            "external_id": "ACTREC-ADVT-184-2026",
            "title": "Junior Research Fellow — ACTREC",
            "provider_name": (
                "Advanced Centre for Treatment, Research and "
                "Education in Cancer"
            ),
            "description": (
                "Walk-in interview opportunity for one Junior "
                "Research Fellow post on project at ACTREC. "
                "Eligibility and project details are provided in "
                "the official recruitment advertisement."
            ),
            "location": "Mumbai",
            "state": "Maharashtra",
            "application_url": ACTREC_URL,
            "official_source_url": ACTREC_URL,
            "deadline": datetime(
                2026,
                9,
                18,
            ),
        },
        {
            "source_key": "ACTREC",
            "external_id": "ACTREC-ADVT-183-2026",
            "title": "Junior Research Fellow — ACTREC",
            "provider_name": (
                "Advanced Centre for Treatment, Research and "
                "Education in Cancer"
            ),
            "description": (
                "Walk-in interview opportunity for Junior Research "
                "Fellow on project at ACTREC. Candidates should "
                "consult the official advertisement for complete "
                "eligibility requirements."
            ),
            "location": "Mumbai",
            "state": "Maharashtra",
            "application_url": ACTREC_URL,
            "official_source_url": ACTREC_URL,
            "deadline": datetime(
                2026,
                9,
                21,
            ),
        },
        {
            "source_key": "ACTREC",
            "external_id": "ACTREC-ADVT-100-2026",
            "title": "Research Assistant — ACTREC",
            "provider_name": (
                "Advanced Centre for Treatment, Research and "
                "Education in Cancer"
            ),
            "description": (
                "Walk-in interview opportunity for Research "
                "Assistant at ACTREC. Candidates should verify "
                "the official advertisement for eligibility and "
                "interview requirements."
            ),
            "location": "Mumbai",
            "state": "Maharashtra",
            "application_url": ACTREC_URL,
            "official_source_url": ACTREC_URL,
            "deadline": datetime(
                2026,
                9,
                22,
            ),
        },
        {
            "source_key": "ACTREC",
            "external_id": "ACTREC-ADVT-181-2026",
            "title": "Research Assistant — ACTREC",
            "provider_name": (
                "Advanced Centre for Treatment, Research and "
                "Education in Cancer"
            ),
            "description": (
                "Walk-in interview opportunity for Research "
                "Assistant at ACTREC. Candidates should consult "
                "the official recruitment page for full details."
            ),
            "location": "Mumbai",
            "state": "Maharashtra",
            "application_url": ACTREC_URL,
            "official_source_url": ACTREC_URL,
            "deadline": datetime(
                2026,
                9,
                23,
            ),
        },
        {
            "source_key": "ACTREC",
            "external_id": "ACTREC-ADVT-189-2026",
            "title": (
                "Scientific Officer — Flow Cytometry — ACTREC"
            ),
            "provider_name": (
                "Advanced Centre for Treatment, Research and "
                "Education in Cancer"
            ),
            "description": (
                "Walk-in or Zoom interview opportunity for "
                "Scientific Officer in Flow Cytometry on contract "
                "basis at ACTREC."
            ),
            "location": "Mumbai",
            "state": "Maharashtra",
            "application_url": ACTREC_URL,
            "official_source_url": ACTREC_URL,
            "deadline": datetime(
                2026,
                9,
                24,
            ),
        },
    ]


# ============================================================
# IMPORT JOBS
# ============================================================


def import_jobs(db: Session) -> int:
    print()
    print("========================================")
    print("APTORA — IMPORTING JOBS")
    print("========================================")
    print()

    total_processed = 0

    # --------------------------------------------------------
    # 1. Attempt live NCS
    # --------------------------------------------------------

    ncs_jobs = parse_ncs_jobs()

    for job in ncs_jobs:
        status = upsert_opportunity(
            db,
            source_key="NCS_JOBS",
            external_id=job["external_id"],
            title=job["title"],
            provider_name=job["provider_name"],
            opportunity_type="JOB",
            description=job["description"],
            location=job["location"],
            state=job["state"],
            application_url=job["application_url"],
            official_source_url=job["official_source_url"],
            deadline=job["deadline"],
        )

        if status != "skipped":
            total_processed += 1

    # --------------------------------------------------------
    # 2. Reliable official recruitment sources
    # --------------------------------------------------------

    print()
    print(
        "Adding current official government recruitment "
        "opportunities..."
    )

    official_jobs = official_government_jobs()

    for job in official_jobs:
        status = upsert_opportunity(
            db,
            source_key=job["source_key"],
            external_id=job["external_id"],
            title=job["title"],
            provider_name=job["provider_name"],
            opportunity_type="JOB",
            description=job["description"],
            location=job["location"],
            state=job["state"],
            application_url=job["application_url"],
            official_source_url=job["official_source_url"],
            deadline=job["deadline"],
        )

        if status != "skipped":
            total_processed += 1

    db.commit()

    print()
    print(f"Jobs inserted/updated: {total_processed}")

    return total_processed


# ============================================================
# GOVERNMENT SCHEMES
#
# Official National Portal of India sources.
# ============================================================


def official_government_schemes() -> list[dict[str, Any]]:
    return [
        {
            "external_id": "PMJDY-2026",
            "title": "Pradhan Mantri Jan-Dhan Yojana",
            "provider_name": "Department of Financial Services",
            "description": (
                "National Mission for Financial Inclusion providing "
                "access to financial services including banking, "
                "savings and deposit accounts, remittance, credit, "
                "insurance and pension in an affordable manner."
            ),
            "location": "India",
            "state": None,
            "application_url": (
                "https://www.india.gov.in/category/"
                "money-taxes/subcategory/banking-insurance/details/"
                "pradhan-mantri-jan-dhan-yojana-scheme-details"
            ),
            "official_source_url": (
                "https://www.india.gov.in/category/"
                "money-taxes/subcategory/banking-insurance/details/"
                "pradhan-mantri-jan-dhan-yojana-scheme-details"
            ),
        },
        {
            "external_id": "PMKISAN-2026",
            "title": "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
            "provider_name": (
                "Ministry of Agriculture & Farmers Welfare"
            ),
            "description": (
                "Government scheme providing financial support to "
                "eligible landholding farmer families. The National "
                "Government Services Portal provides services for "
                "registration, e-KYC and application status."
            ),
            "location": "India",
            "state": None,
            "application_url": (
                "https://services.india.gov.in/service/detail/"
                "pradhan-mantri-fasal-bima-yojana"
            ),
            "official_source_url": (
                "https://services.india.gov.in/service/detail/"
                "pradhan-mantri-fasal-bima-yojana"
            ),
        },
        {
            "external_id": "PMFBY-2026",
            "title": "Pradhan Mantri Fasal Bima Yojana",
            "provider_name": (
                "Ministry of Agriculture & Farmers Welfare"
            ),
            "description": (
                "Crop insurance scheme providing affordable crop "
                "insurance to farmers against losses caused by "
                "natural calamities, pests and diseases."
            ),
            "location": "India",
            "state": None,
            "application_url": (
                "https://services.india.gov.in/service/detail/"
                "pradhan-mantri-fasal-bima-yojana"
            ),
            "official_source_url": (
                "https://services.india.gov.in/service/detail/"
                "pradhan-mantri-fasal-bima-yojana"
            ),
        },
        {
            "external_id": "PMUY-2026",
            "title": "Pradhan Mantri Ujjwala Yojana",
            "provider_name": (
                "Ministry of Petroleum and Natural Gas"
            ),
            "description": (
                "Government scheme providing access to clean cooking "
                "fuel such as LPG to eligible households."
            ),
            "location": "India",
            "state": None,
            "application_url": (
                "https://www.india.gov.in/category/"
                "housing-local-services/subcategory/"
                "electricity-lpg-water/details/"
                "pradhan-mantri-ujjwala-yojana-pmuy"
            ),
            "official_source_url": (
                "https://www.india.gov.in/category/"
                "housing-local-services/subcategory/"
                "electricity-lpg-water/details/"
                "pradhan-mantri-ujjwala-yojana-pmuy"
            ),
        },
        {
            "external_id": "PMVISHWAKARMA-2026",
            "title": "PM Vishwakarma",
            "provider_name": (
                "Government of India"
            ),
            "description": (
                "Government initiative supporting traditional "
                "artisans and craftspeople through assistance and "
                "support mechanisms."
            ),
            "location": "India",
            "state": None,
            "application_url": (
                "https://www.india.gov.in/category/"
                "infrastructure-industries/subcategory/"
                "micro-small-medium-enterprises/details/"
                "website-of-pm-vishwakarma-yojana"
            ),
            "official_source_url": (
                "https://www.india.gov.in/category/"
                "infrastructure-industries/subcategory/"
                "micro-small-medium-enterprises/details/"
                "website-of-pm-vishwakarma-yojana"
            ),
        },
        {
            "external_id": "PMGSY-2026",
            "title": "Pradhan Mantri Gram Sadak Yojana",
            "provider_name": (
                "Ministry of Rural Development"
            ),
            "description": (
                "Government rural road development programme "
                "implemented through the Ministry of Rural Development "
                "and associated agencies."
            ),
            "location": "India",
            "state": None,
            "application_url": (
                "https://www.india.gov.in/category/"
                "infrastructure-industries/subcategory/"
                "infrastructure/details/"
                "pradhan-mantri-gram-sadak-yojana-by-ministry-of-rural-development"
            ),
            "official_source_url": (
                "https://www.india.gov.in/category/"
                "infrastructure-industries/subcategory/"
                "infrastructure/details/"
                "pradhan-mantri-gram-sadak-yojana-by-ministry-of-rural-development"
            ),
        },
        {
            "external_id": "PMSVANIDHI-2026",
            "title": "PM Street Vendor's AtmaNirbhar Nidhi",
            "provider_name": (
                "Government of India"
            ),
            "description": (
                "Government scheme supporting eligible street vendors "
                "through financial assistance and related support."
            ),
            "location": "India",
            "state": None,
            "application_url": (
                "https://www.india.gov.in/category/"
                "housing-local-services"
            ),
            "official_source_url": (
                "https://www.india.gov.in/category/"
                "housing-local-services"
            ),
        },
        {
            "external_id": "PMAY-URBAN-2026",
            "title": "Pradhan Mantri Awas Yojana — Housing for All (Urban)",
            "provider_name": (
                "Ministry of Housing and Urban Affairs"
            ),
            "description": (
                "Government housing programme supporting affordable "
                "housing for eligible beneficiaries in urban areas."
            ),
            "location": "India",
            "state": None,
            "application_url": (
                "https://www.india.gov.in/category/"
                "housing-local-services"
            ),
            "official_source_url": (
                "https://www.india.gov.in/category/"
                "housing-local-services"
            ),
        },
        {
            "external_id": "PMSYM-2026",
            "title": "Pradhan Mantri Shram Yogi Maandhan Yojana",
            "provider_name": (
                "Government of India"
            ),
            "description": (
                "Pension scheme for eligible unorganized-sector "
                "workers aged 18–40 with monthly income within the "
                "prescribed limit."
            ),
            "location": "India",
            "state": None,
            "application_url": (
                "https://services.india.gov.in/service/listing"
                "?cat_id=36&ln=en"
            ),
            "official_source_url": (
                "https://services.india.gov.in/service/listing"
                "?cat_id=36&ln=en"
            ),
        },
        {
            "external_id": "STARTUP-INDIA-SEED-2026",
            "title": "Startup India Seed Fund Scheme",
            "provider_name": (
                "Government of India"
            ),
            "description": (
                "Government initiative providing financial support "
                "to eligible startups for proof of concept, prototype "
                "development, product trials, market entry and "
                "commercialisation."
            ),
            "location": "India",
            "state": None,
            "application_url": (
                "https://www.india.gov.in/"
            ),
            "official_source_url": (
                "https://www.india.gov.in/"
            ),
        },
    ]


# ============================================================
# IMPORT SCHEMES
# ============================================================


def import_government_schemes(db: Session) -> int:
    print()
    print("========================================")
    print("APTORA — IMPORTING GOVERNMENT SCHEMES")
    print("========================================")
    print()

    schemes = official_government_schemes()

    print(
        f"Preparing {len(schemes)} official government schemes..."
    )

    processed = 0

    for scheme in schemes:

        status = upsert_opportunity(
            db,
            source_key="INDIA_GOV_SCHEMES",
            external_id=scheme["external_id"],
            title=scheme["title"],
            provider_name=scheme["provider_name"],
            opportunity_type="GOVERNMENT_SCHEME",
            description=scheme["description"],
            location=scheme["location"],
            state=scheme["state"],
            application_url=scheme["application_url"],
            official_source_url=scheme["official_source_url"],
            deadline=None,
        )

        if status != "skipped":
            processed += 1

    db.commit()

    print(
        f"Government schemes inserted/updated: {processed}"
    )

    return processed


# ============================================================
# DATABASE SUMMARY
# ============================================================


def print_database_summary(db: Session) -> None:
    print()
    print("========================================")
    print("APTORA — ACTIVE OPPORTUNITY SUMMARY")
    print("========================================")
    print()

    rows = db.execute(
        select(
            Opportunity.opportunity_type,
            Opportunity.id,
        ).where(
            Opportunity.is_active.is_(True)
        )
    ).all()

    counts: dict[str, int] = {}

    for opportunity_type, _ in rows:
        key = opportunity_type or "UNKNOWN"
        counts[key] = counts.get(key, 0) + 1

    for opportunity_type in sorted(counts):
        print(
            f"{opportunity_type:<25} "
            f"{counts[opportunity_type]}"
        )


# ============================================================
# MAIN
# ============================================================


def main() -> None:
    with Session(engine) as db:

        jobs_processed = import_jobs(db)

        schemes_processed = import_government_schemes(db)

        print_database_summary(db)

        print()
        print(
            "========================================"
        )
        print(
            "Finished."
        )
        print(
            f"Jobs processed: {jobs_processed}."
        )
        print(
            f"Government schemes processed: "
            f"{schemes_processed}."
        )
        print(
            "========================================"
        )


if __name__ == "__main__":
    main()