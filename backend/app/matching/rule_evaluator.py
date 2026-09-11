
from typing import Any


def normalize_value(value: Any) -> Any:
    """
    Normalize values before comparison.

    Strings are stripped and converted to lowercase.
    Lists/tuples/sets are normalized item-by-item.
    Other values are returned unchanged.
    """
    if value is None:
        return None

    if isinstance(value, str):
        return value.strip().lower()

    if isinstance(value, (list, tuple, set)):
        return [normalize_value(item) for item in value]

    return value


def parse_expected_value(value: Any) -> Any:
    """
    Convert values stored as text in the database into useful Python types.

    Examples:
        "800000" -> 800000
        "2026" -> 2026
        "true" -> True
        "ai, data science" -> ["ai", "data science"]
        "undergraduate" -> "undergraduate"
    """
    if not isinstance(value, str):
        return value

    value = value.strip()

    if not value:
        return ""

    # Boolean values
    if value.lower() == "true":
        return True

    if value.lower() == "false":
        return False

    # Integer
    try:
        if "." not in value:
            return int(value)
    except ValueError:
        pass

    # Float
    try:
        return float(value)
    except ValueError:
        pass

    # Comma-separated values
    if "," in value:
        return [
            item.strip().lower()
            for item in value.split(",")
            if item.strip()
        ]

    return value


def evaluate_rule(
    actual_value: Any,
    operator: str,
    expected_value: Any,
) -> bool:
    """
    Evaluate one eligibility rule.

    Supported operators:
        equals
        not_equals
        contains
        in
        greater_than
        greater_than_or_equal
        less_than
        less_than_or_equal
    """

    if actual_value is None:
        return False

    expected = parse_expected_value(expected_value)

    actual = normalize_value(actual_value)
    expected = normalize_value(expected)

    operator = operator.strip().lower()

    try:
        if operator == "equals":
            return actual == expected

        if operator == "not_equals":
            return actual != expected

        if operator == "contains":
            if isinstance(actual, (list, tuple, set)):
                return expected in actual

            return str(expected) in str(actual)

        if operator == "in":
            if isinstance(expected, (list, tuple, set)):
                return actual in expected

            return actual == expected

        if operator == "greater_than":
            return actual > expected

        if operator == "greater_than_or_equal":
            return actual >= expected

        if operator == "less_than":
            return actual < expected

        if operator == "less_than_or_equal":
            return actual <= expected

    except (TypeError, ValueError):
        return False

    return False

