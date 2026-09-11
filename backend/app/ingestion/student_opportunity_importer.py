from __future__ import annotations

from datetime import datetime
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import engine
from app.models.opportunity import Opportunity


# ============================================================
# APTORA — FELLOWSHIP / TRAINING / PROGRAM / COMPETITION
# IMPORTER
# ============================================================


def clean_text(value: Any) -> str:
    if value is None:
        return ""

    return " ".join(str(value).split()).strip()


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

    db.add(Opportunity(**values))

    return "inserted"


# ============================================================
# FELLOWSHIPS
# ============================================================


def fellowship_opportunities() -> list[dict[str, Any]]:
    return [
        {
            "source_key": "NSP_FELLOWSHIP",
            "external_id": "VISVESVARAYA-PHD-FULLTIME-2026",
            "title": (
                "Visvesvaraya PhD Scheme for Electronics and IT "
                "— Full Time"
            ),
            "provider_name": (
                "Ministry of Electronics and Information Technology"
            ),
            "description": (
                "Fellowship scheme listed on the National Scholarship "
                "Portal for Academic Year 2026-27. The scheme supports "
                "PhD studies in Electronics and Information Technology."
            ),
            "location": "India",
            "state": None,
            "application_url": "https://scholarships.gov.in/Fellowship",
            "official_source_url": "https://scholarships.gov.in/Fellowship",
            "deadline": None,
        },
        {
            "source_key": "NSP_FELLOWSHIP",
            "external_id": "VISVESVARAYA-PHD-PARTTIME-2026",
            "title": (
                "Visvesvaraya PhD Scheme for Electronics and IT "
                "— Part Time"
            ),
            "provider_name": (
                "Ministry of Electronics and Information Technology"
            ),
            "description": (
                "Part-time fellowship scheme listed on the National "
                "Scholarship Portal for Academic Year 2026-27."
            ),
            "location": "India",
            "state": None,
            "application_url": "https://scholarships.gov.in/Fellowship",
            "official_source_url": "https://scholarships.gov.in/Fellowship",
            "deadline": None,
        },
        {
            "source_key": "NSP_FELLOWSHIP",
            "external_id": "VISVESVARAYA-YFRF-2026",
            "title": (
                "Visvesvaraya PhD Scheme for Electronics and IT "
                "— Young Faculty Research Fellowship"
            ),
            "provider_name": (
                "Ministry of Electronics and Information Technology"
            ),
            "description": (
                "Young Faculty Research Fellowship listed on the "
                "National Scholarship Portal for Academic Year 2026-27."
            ),
            "location": "India",
            "state": None,
            "application_url": "https://scholarships.gov.in/Fellowship",
            "official_source_url": "https://scholarships.gov.in/Fellowship",
            "deadline": None,
        },
        {
            "source_key": "NSP_FELLOWSHIP",
            "external_id": "VISVESVARAYA-PDF-2026",
            "title": (
                "Visvesvaraya PhD Scheme for Electronics and IT "
                "— Post-Doctoral Fellowship"
            ),
            "provider_name": (
                "Ministry of Electronics and Information Technology"
            ),
            "description": (
                "Post-Doctoral Fellowship listed on the National "
                "Scholarship Portal for Academic Year 2026-27."
            ),
            "location": "India",
            "state": None,
            "application_url": "https://scholarships.gov.in/Fellowship",
            "official_source_url": "https://scholarships.gov.in/Fellowship",
            "deadline": None,
        },
        {
            "source_key": "NSP_FELLOWSHIP",
            "external_id": "UGC-NET-JRF-2026",
            "title": (
                "UGC NET Junior Research Fellowship in Sciences, "
                "Humanities and Social Sciences"
            ),
            "provider_name": "University Grants Commission",
            "description": (
                "Junior Research Fellowship scheme listed through "
                "the National Scholarship Portal for Academic Year "
                "2026-27."
            ),
            "location": "India",
            "state": None,
            "application_url": "https://scholarships.gov.in/Fellowship",
            "official_source_url": "https://scholarships.gov.in/Fellowship",
            "deadline": None,
        },
        {
            "source_key": "MINISTRY_CULTURE_FELLOWSHIP",
            "external_id": "CULTURE-SENIOR-JUNIOR-2026-27",
            "title": "Senior-Junior Fellowship 2026-27",
            "provider_name": "Ministry of Culture, Government of India",
            "description": (
                "Ministry of Culture fellowship opportunity for "
                "2026-27. The official Ministry of Culture fellowship "
                "advertisement provides the detailed eligibility and "
                "application requirements."
            ),
            "location": "India",
            "state": None,
            "application_url": (
                "https://culture.gov.in/fellowship-advertisement"
            ),
            "official_source_url": (
                "https://culture.gov.in/fellowship-advertisement"
            ),
            "deadline": None,
        },
    ]


# ============================================================
# TRAINING
# ============================================================


def training_opportunities() -> list[dict[str, Any]]:
    return [
        {
            "source_key": "NPC_TRAINING",
            "external_id": "NPC-CYBER-LAW-2026",
            "title": (
                "Digital India Fundamentals of Cyber Law & "
                "Cyber Security for Public Offices"
            ),
            "provider_name": "National Productivity Council",
            "description": (
                "Official National Productivity Council training "
                "programme covering fundamentals of cyber law and "
                "cyber security for public offices."
            ),
            "location": "Mount Abu",
            "state": "Rajasthan",
            "application_url": (
                "https://www.npcindia.gov.in/NPC/User/TrainingHeadQuarter"
            ),
            "official_source_url": (
                "https://www.npcindia.gov.in/NPC/User/TrainingHeadQuarter"
            ),
            "deadline": datetime(2026, 9, 18),
        },
        {
            "source_key": "NPC_TRAINING",
            "external_id": "NPC-RTI-MODERN-MGMT-2026",
            "title": (
                "Advance Course on Right to Information Act, 2005 "
                "and Modern Office Management"
            ),
            "provider_name": "National Productivity Council",
            "description": (
                "Official NPC training programme on the Right to "
                "Information Act and modern office management."
            ),
            "location": "Gangtok",
            "state": "Sikkim",
            "application_url": (
                "https://www.npcindia.gov.in/NPC/User/TrainingHeadQuarter"
            ),
            "official_source_url": (
                "https://www.npcindia.gov.in/NPC/User/TrainingHeadQuarter"
            ),
            "deadline": datetime(2026, 9, 18),
        },
        {
            "source_key": "NPC_TRAINING",
            "external_id": "NPC-LEADERSHIP-COMMUNICATION-2026",
            "title": (
                "Leadership, Communication and Interpersonal Skills "
                "for Effective Management"
            ),
            "provider_name": "National Productivity Council",
            "description": (
                "Training programme focused on leadership, communication "
                "and interpersonal skills for effective management."
            ),
            "location": "Goa",
            "state": "Goa",
            "application_url": (
                "https://www.npcindia.gov.in/NPC/User/TrainingHeadQuarter"
            ),
            "official_source_url": (
                "https://www.npcindia.gov.in/NPC/User/TrainingHeadQuarter"
            ),
            "deadline": datetime(2026, 9, 25),
        },
        {
            "source_key": "NPC_TRAINING",
            "external_id": "NPC-AI-WORKPLACE-2026",
            "title": (
                "Advance Course on Digital Transformation Essentials: "
                "Responsible Adoption of Artificial Intelligence at Workplace"
            ),
            "provider_name": "National Productivity Council",
            "description": (
                "Official NPC training programme covering digital "
                "transformation and responsible adoption of artificial "
                "intelligence in the workplace."
            ),
            "location": "Goa",
            "state": "Goa",
            "application_url": (
                "https://www.npcindia.gov.in/NPC/User/TrainingHeadQuarter"
            ),
            "official_source_url": (
                "https://www.npcindia.gov.in/NPC/User/TrainingHeadQuarter"
            ),
            "deadline": datetime(2026, 9, 25),
        },
        {
            "source_key": "NTI_TRAINING",
            "external_id": "NTI-MOLECULAR-XDR-TB-2026",
            "title": (
                "Molecular Detection of M/XDR TB by PCR Based "
                "Line Probe Assay"
            ),
            "provider_name": "National Tuberculosis Institute",
            "description": (
                "Official September 2026 training programme under "
                "the National Tuberculosis Elimination Programme."
            ),
            "location": "India",
            "state": None,
            "application_url": "https://nti.gov.in/training-calendar/",
            "official_source_url": "https://nti.gov.in/training-calendar/",
            "deadline": datetime(2026, 9, 11),
        },
        {
            "source_key": "NTI_TRAINING",
            "external_id": "NTI-PMTPT-2026",
            "title": (
                "PMTPT Training for Program Managers"
            ),
            "provider_name": "National Tuberculosis Institute",
            "description": (
                "Official September 2026 NTEP Management training "
                "programme for programme managers."
            ),
            "location": "India",
            "state": None,
            "application_url": "https://nti.gov.in/training-calendar/",
            "official_source_url": "https://nti.gov.in/training-calendar/",
            "deadline": datetime(2026, 9, 17),
        },
        {
            "source_key": "MANAGE_TRAINING",
            "external_id": "MANAGE-DIGITAL-MARKETING-2026",
            "title": (
                "Digital Marketing Skills for Agri Startups — "
                "IXth Batch"
            ),
            "provider_name": (
                "National Institute of Agricultural Extension Management"
            ),
            "description": (
                "MANAGE training programme on digital marketing skills "
                "for agri startups."
            ),
            "location": "Online",
            "state": None,
            "application_url": "https://www.manage.gov.in/",
            "official_source_url": "https://www.manage.gov.in/",
            "deadline": datetime(2026, 9, 11),
        },
        {
            "source_key": "MANAGE_TRAINING",
            "external_id": "MANAGE-DATA-ANALYTICS-2026",
            "title": (
                "Market Led Extension & Data Analytics"
            ),
            "provider_name": (
                "National Institute of Agricultural Extension Management"
            ),
            "description": (
                "MANAGE programme covering market-led extension and "
                "data analytics."
            ),
            "location": "Hyderabad",
            "state": "Telangana",
            "application_url": "https://www.manage.gov.in/",
            "official_source_url": "https://www.manage.gov.in/",
            "deadline": datetime(2026, 9, 18),
        },
    ]


# ============================================================
# PROGRAMS
# ============================================================


def program_opportunities() -> list[dict[str, Any]]:
    return [
        {
            "source_key": "MANAGE_PROGRAM",
            "external_id": "MANAGE-NYPDP-2026",
            "title": (
                "National Young Professionals Development Program "
                "on Research Methodology in Agricultural Extension"
            ),
            "provider_name": (
                "National Institute of Agricultural Extension Management"
            ),
            "description": (
                "National Young Professionals Development Program "
                "focused on research methodology in agricultural "
                "extension."
            ),
            "location": "Hyderabad",
            "state": "Telangana",
            "application_url": "https://www.manage.gov.in/",
            "official_source_url": "https://www.manage.gov.in/",
            "deadline": datetime(2026, 9, 11),
        },
        {
            "source_key": "MANAGE_PROGRAM",
            "external_id": "MANAGE-AGRI-INNOVATION-2026",
            "title": (
                "Industry–Academia Collaboration for Agri Innovation"
            ),
            "provider_name": (
                "National Institute of Agricultural Extension Management"
            ),
            "description": (
                "Official MANAGE programme focused on collaboration "
                "between industry and academia for agricultural "
                "innovation."
            ),
            "location": "Online",
            "state": None,
            "application_url": "https://www.manage.gov.in/",
            "official_source_url": "https://www.manage.gov.in/",
            "deadline": datetime(2026, 9, 12),
        },
        {
            "source_key": "MANAGE_PROGRAM",
            "external_id": "MANAGE-STARTUP-CONNECT-2026",
            "title": (
                "14th Agri Startup Stakeholder Connect Program"
            ),
            "provider_name": (
                "National Institute of Agricultural Extension Management"
            ),
            "description": (
                "Official MANAGE programme connecting stakeholders "
                "in the agricultural startup ecosystem."
            ),
            "location": "India",
            "state": None,
            "application_url": "https://www.manage.gov.in/",
            "official_source_url": "https://www.manage.gov.in/",
            "deadline": datetime(2026, 9, 12),
        },
        {
            "source_key": "INDIA_GOV_PROGRAM",
            "external_id": "SMART-INDIA-HACKATHON-2026",
            "title": "Smart India Hackathon",
            "provider_name": "Ministry of Education",
            "description": (
                "Nationwide initiative providing students a platform "
                "to solve pressing real-world problems and develop "
                "product innovation and problem-solving skills."
            ),
            "location": "India",
            "state": None,
            "application_url": (
                "https://www.india.gov.in/category/"
                "education-learning/subcategory/higher-education/"
                "details/website-of-smart-india-hackathon"
            ),
            "official_source_url": (
                "https://www.india.gov.in/category/"
                "education-learning/subcategory/higher-education/"
                "details/website-of-smart-india-hackathon"
            ),
            "deadline": None,
        },
    ]


# ============================================================
# COMPETITIONS
# ============================================================


def competition_opportunities() -> list[dict[str, Any]]:
    return [
        {
            "source_key": "MYGOV_COMPETITION",
            "external_id": "PEYJAL-GATHA-2026",
            "title": (
                "Peyjal Gatha — National Water Stories & "
                "Water Ideas Challenge"
            ),
            "provider_name": "MyGov India",
            "description": (
                "National challenge inviting students in Classes "
                "VIII–XII from across India to contribute water "
                "stories and ideas."
            ),
            "location": "India",
            "state": None,
            "application_url": "https://www.mygov.in/",
            "official_source_url": "https://www.mygov.in/",
            "deadline": datetime(2026, 12, 8),
        },
        {
            "source_key": "MYGOV_COMPETITION",
            "external_id": "SHAHEED-BHAGAT-SINGH-ESSAY-2026",
            "title": (
                "Shaheed Bhagat Singh's Words — "
                "One Quote, One Commitment — Essay Competition"
            ),
            "provider_name": "MyGov India",
            "description": (
                "Essay competition hosted on MyGov encouraging "
                "participants to engage with the words and ideas "
                "of Shaheed Bhagat Singh."
            ),
            "location": "India",
            "state": None,
            "application_url": "https://www.mygov.in/",
            "official_source_url": "https://www.mygov.in/",
            "deadline": datetime(2026, 9, 30),
        },
        {
            "source_key": "PIB_COMPETITION",
            "external_id": "DIGITAL-SHRAM-SANKALP-2026",
            "title": (
                "Digital Shram Sankalp — Reimagining India's "
                "Labour Ecosystem with AI"
            ),
            "provider_name": (
                "Ministry of Labour & Employment"
            ),
            "description": (
                "Nationwide ideation hackathon inviting innovators, "
                "start-ups, students, researchers and technology "
                "professionals to propose AI-driven solutions for "
                "India's digital labour ecosystem."
            ),
            "location": "India",
            "state": None,
            "application_url": "https://innovateindia.mygov.in/",
            "official_source_url": (
                "https://www.pib.gov.in/PressReleseDetailm.aspx"
                "?PRID=2305750"
            ),
            "deadline": datetime(2026, 9, 18),
        },
        {
            "source_key": "NTPC_COMPETITION",
            "external_id": "NTPC-ELECTRON-QUIZ-2026-27",
            "title": "NTPC Electron Quiz 2026–27",
            "provider_name": "NTPC Limited",
            "description": (
                "National-level quiz initiative for students pursuing "
                "Engineering and Management programmes. The Mumbai "
                "Regional Round is scheduled for September 17, 2026."
            ),
            "location": "Mumbai",
            "state": "Maharashtra",
            "application_url": "https://www.ntpc.co.in/",
            "official_source_url": (
                "https://www.pib.gov.in/PressReleasePage.aspx"
                "?PRID=2306321&lang=2&reg=48"
            ),
            "deadline": datetime(2026, 9, 17),
        },
    ]


# ============================================================
# IMPORTER
# ============================================================


def import_records(
    db: Session,
    records: list[dict[str, Any]],
    opportunity_type: str,
) -> int:

    processed = 0

    for record in records:
        status = upsert_opportunity(
            db,
            source_key=record["source_key"],
            external_id=record["external_id"],
            title=record["title"],
            provider_name=record["provider_name"],
            opportunity_type=opportunity_type,
            description=record["description"],
            location=record["location"],
            state=record["state"],
            application_url=record["application_url"],
            official_source_url=record["official_source_url"],
            deadline=record["deadline"],
            amount=record.get("amount"),
        )

        if status != "skipped":
            processed += 1

    db.commit()

    return processed


# ============================================================
# SUMMARY
# ============================================================


def print_summary(db: Session) -> None:

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

    print()
    print("========================================")
    print("APTORA — OPPORTUNITY SUMMARY")
    print("========================================")
    print()

    for opportunity_type in sorted(counts):
        print(
            f"{opportunity_type:<25}"
            f"{counts[opportunity_type]}"
        )


# ============================================================
# MAIN
# ============================================================


def main() -> None:

    print()
    print("========================================")
    print("APTORA — STUDENT OPPORTUNITY IMPORTER")
    print("========================================")

    with Session(engine) as db:

        fellowships = fellowship_opportunities()

        training = training_opportunities()

        programs = program_opportunities()

        competitions = competition_opportunities()

        print()
        print(
            f"Fellowships found: {len(fellowships)}"
        )

        print(
            f"Training programmes found: {len(training)}"
        )

        print(
            f"Programs found: {len(programs)}"
        )

        print(
            f"Competitions found: {len(competitions)}"
        )

        fellowship_count = import_records(
            db,
            fellowships,
            "FELLOWSHIP",
        )

        training_count = import_records(
            db,
            training,
            "TRAINING",
        )

        program_count = import_records(
            db,
            programs,
            "PROGRAM",
        )

        competition_count = import_records(
            db,
            competitions,
            "COMPETITION",
        )

        print()
        print("========================================")
        print("IMPORT COMPLETE")
        print("========================================")
        print(
            f"Fellowships inserted/updated: "
            f"{fellowship_count}"
        )
        print(
            f"Training inserted/updated: "
            f"{training_count}"
        )
        print(
            f"Programs inserted/updated: "
            f"{program_count}"
        )
        print(
            f"Competitions inserted/updated: "
            f"{competition_count}"
        )

        print_summary(db)

        print()
        print("========================================")
        print("APTORA — FOUR REMAINING CATEGORIES READY")
        print("========================================")


if __name__ == "__main__":
    main()