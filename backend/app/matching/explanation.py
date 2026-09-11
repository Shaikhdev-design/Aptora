from typing import Any


def build_rule_explanation(
    field_name: str,
    operator: str,
    expected_value: Any,
    actual_value: Any,
    passed: bool,
) -> str:
    """Create a human-readable explanation for a rule."""

    readable_field = field_name.replace("_", " ").title()

    if passed:
        return (
            f"{readable_field} requirement met."
        )

    if actual_value is None:
        return (
            f"{readable_field} information "
            "is missing from your profile."
        )

    return (
        f"{readable_field} requirement not met. "
        f"Required: {operator} {expected_value}; "
        f"your value: {actual_value}."
    )