from datetime import datetime

from sqlalchemy import select

from app.core.database import SessionLocal
from app.ingestion.data_validator import validate_opportunity
from app.ingestion.nsp_fetcher import fetch_nsp_scholarships
from app.models.opportunity import Opportunity


def import_nsp_scholarships() -> None:
    print("Fetching NSP scholarships...\n", flush=True)

    scholarships = fetch_nsp_scholarships()

    print(
        f"Fetched {len(scholarships)} scholarships.\n",
        flush=True,
    )

    db = SessionLocal()

    inserted = 0
    updated = 0
    skipped = 0

    try:
        for index, scholarship in enumerate(
            scholarships,
            start=1,
        ):
            try:
                validation = validate_opportunity(scholarship)

                if not validation.is_valid:
                    skipped += 1
                    print(
                        f"[{index}/{len(scholarships)}] SKIPPED - "
                        f"{scholarship.get('title', 'Unknown')} | "
                        f"{'; '.join(validation.reasons)}",
                        flush=True,
                    )
                    continue

                external_id = scholarship["external_id"]
                source_key = scholarship["source_key"]

                existing = db.scalar(
                    select(Opportunity).where(
                        Opportunity.source_key == source_key,
                        Opportunity.external_id == external_id,
                    )
                )

                if existing:
                    existing.title = scholarship["title"]
                    existing.opportunity_type = (
                        scholarship["opportunity_type"]
                    )
                    existing.provider_name = (
                        scholarship["provider_name"]
                    )
                    existing.description = scholarship["description"]
                    existing.location = scholarship["location"]
                    existing.state = scholarship["state"]
                    existing.application_url = (
                        scholarship["application_url"]
                    )
                    existing.official_source_url = (
                        scholarship["official_source_url"]
                    )
                    existing.deadline = scholarship["deadline"]
                    existing.amount = scholarship["amount"]
                    existing.is_active = scholarship["is_active"]
                    existing.updated_at = datetime.utcnow()

                    updated += 1

                else:
                    opportunity = Opportunity(
                        external_id=external_id,
                        source_key=source_key,
                        title=scholarship["title"],
                        opportunity_type=scholarship[
                            "opportunity_type"
                        ],
                        provider_name=scholarship[
                            "provider_name"
                        ],
                        description=scholarship["description"],
                        location=scholarship["location"],
                        state=scholarship["state"],
                        application_url=scholarship[
                            "application_url"
                        ],
                        official_source_url=scholarship[
                            "official_source_url"
                        ],
                        deadline=scholarship["deadline"],
                        amount=scholarship["amount"],
                        is_active=scholarship["is_active"],
                    )

                    db.add(opportunity)
                    inserted += 1

                db.commit()

                print(
                    f"[{index}/{len(scholarships)}] "
                    f"IMPORTED - {scholarship['title']}",
                    flush=True,
                )

            except Exception as exc:
                db.rollback()
                skipped += 1

                print(
                    f"[{index}/{len(scholarships)}] "
                    f"SKIPPED - {exc}",
                    flush=True,
                )

        print("\n" + "=" * 60)
        print("NSP IMPORT COMPLETE")
        print("=" * 60)
        print(f"Total fetched : {len(scholarships)}")
        print(f"Inserted      : {inserted}")
        print(f"Updated       : {updated}")
        print(f"Skipped       : {skipped}")
        print("=" * 60)

    finally:
        db.close()


if __name__ == "__main__":
    import_nsp_scholarships()