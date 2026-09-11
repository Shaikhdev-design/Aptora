import csv
from pathlib import Path
from typing import Any

from app.ingestion.normalizer import normalize_opportunity


def read_csv_rows(file_path: str) -> list[dict[str, Any]]:
    """
    Read rows from the AICTE CSV dataset.
    """

    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(
            f"Dataset file not found: {file_path}"
        )

    with path.open(
        "r",
        encoding="utf-8-sig",
        newline="",
    ) as file:
        reader = csv.DictReader(file)

        if not reader.fieldnames:
            raise ValueError("CSV file does not contain column headers.")

        rows = list(reader)

    return rows


def import_csv_dataset(file_path: str) -> list[dict[str, Any]]:
    """
    Read and normalize the complete CSV dataset.

    This function does not write anything to the database.
    """

    rows = read_csv_rows(file_path)

    normalized_opportunities = []

    for row_number, row in enumerate(rows, start=2):
        try:
            opportunity = normalize_opportunity(row)
            opportunity["source_row_number"] = row_number

            normalized_opportunities.append(opportunity)

        except Exception as exc:
            print(
                f"Skipping row {row_number}: {exc}"
            )

    return normalized_opportunities


if __name__ == "__main__":
    import sys

    if len(sys.argv) != 2:
        print(
            "Usage: python -m app.ingestion.csv_importer "
            "<path-to-csv>"
        )
        raise SystemExit(1)

    dataset_path = sys.argv[1]

    opportunities = import_csv_dataset(dataset_path)

    print(
        f"Successfully normalized "
        f"{len(opportunities)} opportunities."
    )

    for opportunity in opportunities[:5]:
        print("\n--- Opportunity ---")
        for key, value in opportunity.items():
            print(f"{key}: {value}")