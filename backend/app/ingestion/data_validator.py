from dataclasses import dataclass
from datetime import datetime
from typing import Any
from urllib.parse import urlparse


SUPPORTED_OPPORTUNITY_TYPES = {
    "SCHOLARSHIP",
    "GOVERNMENT_SCHEME",
    "INTERNSHIP",
    "JOB",
    "FELLOWSHIP",
    "TRAINING",
    "PROGRAM",
    "COMPETITION",
}


@dataclass
class ValidationResult:
    is_valid: bool
    reasons: list[str]


# These are deliberately conservative.
# We only flag obvious test/dummy records and do not try
# to judge whether a real opportunity is "good" or "bad".
OBVIOUS_TEST_MARKERS = (
    "test opportunity",
    "this should not be allowed",
    "testing purpose",
    "don't apply for testing",
    "do not apply for testing",
    "dummy internship",
    "dummy opportunity",
    "dummy listing",
)


def _clean(value: Any) -> str:
    if value is None:
        return ""

    if isinstance(value, list):
        return " ".join(str(item) for item in value)

    return str(value).strip()


def _contains_test_marker(item: dict[str, Any]) -> bool:
    searchable_fields = [
        _clean(item.get("title")),
        _clean(item.get("provider_name")),
        _clean(item.get("description")),
    ]

    searchable_text = " ".join(searchable_fields).lower()

    return any(marker in searchable_text for marker in OBVIOUS_TEST_MARKERS)


def _has_invalid_example_url(item: dict[str, Any]) -> bool:
    urls = [
        _clean(item.get("application_url")),
        _clean(item.get("official_source_url")),
    ]

    for url in urls:
        if not url:
            continue

        try:
            hostname = urlparse(url).hostname
        except ValueError:
            return True

        if hostname and hostname.lower() in {
            "example.com",
            "www.example.com",
        }:
            return True

    return False


def validate_opportunity(item: dict[str, Any]) -> ValidationResult:
    """
    Validate a normalized Aptora opportunity.

    This validator is source-independent.
    It can therefore be used for:
        - AICTE internships
        - scholarships
        - government schemes
        - jobs
        - fellowships
        - training programs
        - competitions
        - future data sources
    """

    reasons: list[str] = []

    title = _clean(item.get("title"))
    provider = _clean(item.get("provider_name"))
    description = _clean(item.get("description"))
    opportunity_type = _clean(item.get("opportunity_type")).upper()

    # Required core fields
    if not title:
        reasons.append("Missing opportunity title")

    if not provider:
        reasons.append("Missing provider name")

    if not description:
        reasons.append("Missing opportunity description")

    # Opportunity type must belong to Aptora's supported categories
    if opportunity_type not in SUPPORTED_OPPORTUNITY_TYPES:
        reasons.append(
            f"Unsupported opportunity type: {opportunity_type or 'EMPTY'}"
        )

    # Detect clearly fake/test records
    if _contains_test_marker(item):
        reasons.append("Obvious test/dummy opportunity")

    # Detect placeholder URLs
    if _has_invalid_example_url(item):
        reasons.append("Placeholder example.com URL")

    # Validate deadline if supplied
    deadline = item.get("deadline")

    if isinstance(deadline, datetime):
        # A past deadline does not make the record invalid.
        # It only means the record should normally become inactive.
        if deadline < datetime.now():
            reasons.append("Deadline has passed")

    is_valid = not any(
        reason in reasons
        for reason in [
            "Missing opportunity title",
            "Missing provider name",
            "Missing opportunity description",
            "Obvious test/dummy opportunity",
            "Placeholder example.com URL",
            *[
                f"Unsupported opportunity type: {opportunity_type or 'EMPTY'}"
            ],
        ]
    )

    return ValidationResult(
        is_valid=is_valid,
        reasons=reasons,
    )


def should_be_active(item: dict[str, Any]) -> bool:
    """
    Determine whether an opportunity should currently be active.

    This is intentionally separate from validation.

    A past opportunity is not necessarily bad data;
    it simply should not appear as an active opportunity.
    """

    deadline = item.get("deadline")

    if isinstance(deadline, datetime) and deadline < datetime.now():
        return False

    if "is_open" in item and item.get("is_open") is False:
        return False

    if "source_is_open" in item and item.get("source_is_open") is False:
        return False

    return True


if __name__ == "__main__":
    print("Testing Aptora opportunity validator...\n")

    test_cases = [
        {
            "title": "Python Data Science Internship",
            "opportunity_type": "INTERNSHIP",
            "provider_name": "Real Technology Company",
            "description": "Work on real data science projects.",
            "official_source_url": "https://company.com/opportunities",
        },
        {
            "title": "Dummy Internship Dont Apply",
            "opportunity_type": "INTERNSHIP",
            "provider_name": "Testing Organization",
            "description": "This is a dummy internship for testing purpose.",
            "official_source_url": "https://internship.aicte-india.org/",
        },
        {
            "title": "Merit Scholarship",
            "opportunity_type": "SCHOLARSHIP",
            "provider_name": "Test Education Foundation",
            "description": "This should not be allowed.",
            "official_source_url": "https://example.com/scholarship",
        },
    ]

    for index, test_case in enumerate(test_cases, start=1):
        result = validate_opportunity(test_case)

        print(f"Test {index}")
        print(f"Valid: {result.is_valid}")
        print(f"Reasons: {result.reasons}")
        print("-" * 50)

    print("\nValidator test complete.")