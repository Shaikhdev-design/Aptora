from datetime import datetime

from sqlalchemy import select

from app.core.database import SessionLocal
from app.ingestion.aicte_fetcher import fetch_all_aicte_internships
from app.ingestion.aicte_normalizer import normalize_aicte_opportunity
from app.ingestion.data_validator import validate_opportunity
from app.models.opportunity import Opportunity


def import_aicte_internships() -> None:
    print("Fetching all AICTE internships...\n", flush=True)

    items = fetch_all_aicte_internships(page_size=12)

    print(f"\nFetched {len(items)} internships.", flush=True)
    print("Starting database import...\n", flush=True)

    db = SessionLocal()

    inserted = 0
    updated = 0
    skipped = 0

    try:
        for index, item in enumerate(items, start=1):
            try:
                normalized = normalize_aicte_opportunity(item)

                validation = validate_opportunity(normalized)

                if not validation.is_valid:
                    skipped += 1

                    print(
                        f"[{index}/{len(items)}] SKIPPED - "
                        f"{normalized.get('title', 'Unknown')} | "
                        f"{'; '.join(validation.reasons)}",
                        flush=True,
                    )

                    continue

                external_id = normalized["external_id"]
                source_key = normalized["source_key"]

                if not external_id:
                    skipped += 1
                    print(
                        f"[{index}/{len(items)}] SKIPPED - missing external ID",
                        flush=True,
                    )
                    continue

                existing = db.scalar(
                    select(Opportunity).where(
                        Opportunity.source_key == source_key,
                        Opportunity.external_id == external_id,
                    )
                )

                if existing:
                    existing.title = normalized["title"]
                    existing.opportunity_type = normalized["opportunity_type"]
                    existing.provider_name = normalized["provider_name"]
                    existing.description = normalized["description"]
                    existing.location = normalized["location"]
                    existing.state = normalized["state"]
                    existing.application_url = normalized["application_url"]
                    existing.official_source_url = normalized[
                        "official_source_url"
                    ]
                    existing.deadline = normalized["deadline"]
                    existing.amount = normalized["amount"]
                    existing.is_active = normalized["is_active"]
                    existing.updated_at = datetime.utcnow()

                    updated += 1

                else:
                    opportunity = Opportunity(
                        external_id=external_id,
                        source_key=source_key,
                        title=normalized["title"],
                        opportunity_type=normalized["opportunity_type"],
                        provider_name=normalized["provider_name"],
                        description=normalized["description"],
                        location=normalized["location"],
                        state=normalized["state"],
                        application_url=normalized["application_url"],
                        official_source_url=normalized["official_source_url"],
                        deadline=normalized["deadline"],
                        amount=normalized["amount"],
                        is_active=normalized["is_active"],
                    )

                    db.add(opportunity)
                    inserted += 1

                db.commit()

                if index % 25 == 0:
                    print(
                        f"Processed {index}/{len(items)} | "
                        f"Inserted: {inserted} | "
                        f"Updated: {updated} | "
                        f"Skipped: {skipped}",
                        flush=True,
                    )

            except Exception as exc:
                db.rollback()

                skipped += 1

                print(
                    f"[{index}/{len(items)}] SKIPPED - {exc}",
                    flush=True,
                )

        print("\n" + "=" * 60)
        print("AICTE IMPORT COMPLETE")
        print("=" * 60)
        print(f"Total fetched : {len(items)}")
        print(f"Inserted      : {inserted}")
        print(f"Updated       : {updated}")
        print(f"Skipped       : {skipped}")
        print("=" * 60)

    finally:
        db.close()


if __name__ == "__main__":
    import_aicte_internships()