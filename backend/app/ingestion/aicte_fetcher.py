import json
import time
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen


AICTE_API_URL = (
    "https://internship.aicte-india.org/"
    "api/v1/catalogue/internships"
)

MAX_RETRIES = 4
REQUEST_TIMEOUT = 60
RETRY_DELAY_SECONDS = 3


def fetch_aicte_page(
    page: int = 1,
    page_size: int = 12,
    sort: str = "best",
) -> dict[str, Any]:

    params = urlencode(
        {
            "sort": sort,
            "page": page,
            "pageSize": page_size,
        }
    )

    url = f"{AICTE_API_URL}?{params}"

    request = Request(
        url,
        headers={
            "User-Agent": "Aptora/1.0",
            "Accept": "application/json",
        },
    )

    last_error: Exception | None = None

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            with urlopen(
                request,
                timeout=REQUEST_TIMEOUT,
            ) as response:

                if response.status != 200:
                    raise RuntimeError(
                        f"AICTE API returned HTTP "
                        f"{response.status}"
                    )

                return json.loads(
                    response.read().decode("utf-8")
                )

        except (URLError, TimeoutError, HTTPError) as exc:
            last_error = exc

            if attempt == MAX_RETRIES:
                break

            print(
                f"Page {page}: request failed "
                f"(attempt {attempt}/{MAX_RETRIES}). "
                f"Retrying in {RETRY_DELAY_SECONDS}s...",
                flush=True,
            )

            time.sleep(RETRY_DELAY_SECONDS)

    raise RuntimeError(
        f"Failed to fetch AICTE page {page} "
        f"after {MAX_RETRIES} attempts: {last_error}"
    )


def fetch_all_aicte_internships(
    page_size: int = 12,
) -> list[dict[str, Any]]:

    first_page = fetch_aicte_page(
        page=1,
        page_size=page_size,
    )

    items = list(
        first_page.get("items", [])
    )

    total_pages = first_page.get(
        "totalPages",
        1,
    )

    total = first_page.get(
        "total",
        len(items),
    )

    print(
        f"AICTE API: {total} total internships "
        f"across {total_pages} pages.",
        flush=True,
    )

    for page in range(
        2,
        total_pages + 1,
    ):
        print(
            f"Fetching page {page}/{total_pages}...",
            flush=True,
        )

        data = fetch_aicte_page(
            page=page,
            page_size=page_size,
        )

        items.extend(
            data.get("items", [])
        )

    return items


if __name__ == "__main__":
    print(
        "Testing AICTE live API...\n",
        flush=True,
    )

    data = fetch_aicte_page(
        page=1,
        page_size=12,
    )

    items = data.get("items", [])

    print(
        f"Total available: {data.get('total')}",
        flush=True,
    )

    print(
        f"Total pages: {data.get('totalPages')}",
        flush=True,
    )

    print(
        f"Items received: {len(items)}",
        flush=True,
    )

    if items:
        first = items[0]

        print("\n--- First Internship ---")

        print(
            f"ID: {first.get('id')}"
        )

        print(
            f"Title: {first.get('title')}"
        )

        print(
            f"Organization: {first.get('organization')}"
        )

        print(
            f"Location: {first.get('location')}"
        )

        print(
            f"State: {first.get('state')}"
        )

        print(
            f"Mode: {first.get('mode')}"
        )

        print(
            f"Duration: {first.get('duration')}"
        )

        print(
            f"Stipend: {first.get('stipendDisplay')}"
        )

        print(
            f"Deadline: {first.get('deadline')}"
        )

        print(
            f"Skills: {first.get('skills')}"
        )

        print(
            f"Eligibility: {first.get('eligibility')}"
        )

        print(
            f"Verified: {first.get('verified')}"
        )

        print(
            f"Open: {first.get('isOpen')}"
        )