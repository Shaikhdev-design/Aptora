from datetime import datetime
from typing import Any
from urllib.request import Request, urlopen

from bs4 import BeautifulSoup


NSP_URL = "https://scholarships.gov.in/All-Scholarships"


def fetch_nsp_page() -> str:
    request = Request(
        NSP_URL,
        headers={
            "User-Agent": "Mozilla/5.0 Aptora/1.0",
            "Accept": "text/html,application/xhtml+xml",
        },
    )

    with urlopen(request, timeout=60) as response:
        if response.status != 200:
            raise RuntimeError(f"NSP returned HTTP {response.status}")

        return response.read().decode("utf-8", errors="ignore")


def parse_date(value: str | None) -> datetime | None:
    if not value:
        return None

    value = value.strip()

    for fmt in ("%d-%m-%Y", "%d/%m/%Y", "%Y-%m-%d"):
        try:
            return datetime.strptime(value, fmt)
        except ValueError:
            continue

    return None


def clean_text(value: str) -> str:
    return " ".join(value.split())


def fetch_nsp_scholarships() -> list[dict[str, Any]]:
    html = fetch_nsp_page()
    soup = BeautifulSoup(html, "html.parser")

    results: list[dict[str, Any]] = []
    seen: set[str] = set()

    # Find every text element containing "Student Application".
    # The parent container contains the complete scholarship card.
    application_nodes = soup.find_all(
        string=lambda text: text
        and "Student Application" in text
    )

    for node in application_nodes:
        container = node.parent

        # Walk upward until we have enough content for a scheme card.
        for _ in range(6):
            if container is None:
                break

            text = clean_text(container.get_text(" ", strip=True))

            if len(text) > 100:
                break

            container = container.parent

        if container is None:
            continue

        text = clean_text(container.get_text(" ", strip=True))

        if "Student Application" not in text:
            continue

        # Extract the scholarship title.
        title = None

        # Prefer headings inside the card.
        for heading in container.find_all(["h1", "h2", "h3", "h4", "h5"]):
            heading_text = clean_text(heading.get_text(" ", strip=True))

            if (
                heading_text
                and "Student Application" not in heading_text
                and "Specifications" not in heading_text
                and "FAQ" not in heading_text
            ):
                title = heading_text
                break

        # Fallback: identify a meaningful line from the card.
        if not title:
            lines = [
                clean_text(line)
                for line in container.stripped_strings
                if clean_text(line)
            ]

            for line in lines:
                lower = line.lower()

                if (
                    len(line) > 20
                    and "student application" not in lower
                    and "defective application" not in lower
                    and "institute verification" not in lower
                    and "dno/sno/mno" not in lower
                    and "specifications" not in lower
                    and "faq" not in lower
                ):
                    title = line
                    break

        if not title:
            continue

        title = clean_text(title)

        # Remove obvious navigation/filter headings.
        if title.lower() in {
            "central sector schemes",
            "centrally sponsored schemes",
            "state schemes",
        }:
            continue

        key = title.lower()

        if key in seen:
            continue

        seen.add(key)

        # Determine application status.
        not_open = "student application : not yet opened" in text.lower()

        application_deadline = None

        marker = "Student Application"

        position = text.lower().find(marker.lower())

        if position != -1:
            section = text[position : position + 150]

            # Look for "Open till : DD-MM-YYYY"
            import re

            match = re.search(
                r"Open till\s*:?\s*(\d{2}[-/]\d{2}[-/]\d{4})",
                section,
                re.IGNORECASE,
            )

            if match:
                application_deadline = parse_date(match.group(1))

        results.append(
            {
                "external_id": f"NSP:{key}",
                "source_key": "NATIONAL_SCHOLARSHIP_PORTAL",
                "title": title,
                "opportunity_type": "SCHOLARSHIP",
                "provider_name": "National Scholarship Portal",
                "description": text,
                "location": "India",
                "state": None,
                "application_url": NSP_URL,
                "official_source_url": NSP_URL,
                "deadline": application_deadline,
                "amount": None,
                "is_active": not not_open,
                "source_status": (
                    "NOT_YET_OPENED" if not_open else "OPEN"
                ),
            }
        )

    return results


if __name__ == "__main__":
    scholarships = fetch_nsp_scholarships()

    print(
        f"\nNSP scholarships discovered: {len(scholarships)}\n"
    )

    for index, scholarship in enumerate(scholarships, start=1):
        print(
            f"{index}. {scholarship['title']} "
            f"| {scholarship['source_status']} "
            f"| Deadline: {scholarship['deadline']}"
        )