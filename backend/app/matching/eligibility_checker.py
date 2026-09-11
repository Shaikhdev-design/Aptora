from sqlalchemy.orm import Session

from app.matching.explanation import build_rule_explanation
from app.matching.rule_evaluator import evaluate_rule
from app.models.eligibility_rule import EligibilityRule
from app.models.opportunity import Opportunity
from app.models.profile import Profile


def get_profile_value(
    profile: Profile,
    field_name: str,
):
    """Get a profile value using the rule's field name."""
    return getattr(profile, field_name, None)


def check_eligibility(
    db: Session,
    profile: Profile,
    opportunity: Opportunity,
) -> dict:
    """
    Check whether a profile satisfies an opportunity's rules.

    Eligibility status:
        ELIGIBLE      - all mandatory rules are satisfied
        NOT_ELIGIBLE  - at least one mandatory rule failed
        UNKNOWN       - no rules exist or required profile data is missing
    """

    rules = (
        db.query(EligibilityRule)
        .filter(
            EligibilityRule.opportunity_id == opportunity.id
        )
        .all()
    )

    # ---------------------------------------------------------
    # NO STRUCTURED RULES
    # ---------------------------------------------------------

    if not rules:
        return {
            "eligible": None,
            "eligibility_status": "UNKNOWN",
            "total_rules": 0,
            "passed_rules": 0,
            "failed_rules": 0,
            "unknown_rules": 0,
            "results": [],
            "message": (
                "Eligibility cannot be determined because "
                "no structured eligibility rules are defined "
                "for this opportunity."
            ),
        }

    results = []

    passed_rules = 0
    failed_rules = 0
    unknown_rules = 0

    # ---------------------------------------------------------
    # EVALUATE EACH RULE
    # ---------------------------------------------------------

    for rule in rules:

        actual_value = get_profile_value(
            profile,
            rule.field_name,
        )

        # Missing profile information means UNKNOWN,
        # not automatically NOT_ELIGIBLE.
        if actual_value is None or (
            isinstance(actual_value, str)
            and not actual_value.strip()
        ):
            rule_status = "UNKNOWN"
            passed = None

            unknown_rules += 1

            explanation = build_rule_explanation(
                field_name=rule.field_name,
                operator=rule.operator,
                expected_value=rule.expected_value,
                actual_value=actual_value,
                passed=False,
            )

            explanation = (
                f"{explanation} "
                "Eligibility cannot be confirmed until "
                "this information is added to your profile."
            )

        else:
            passed = evaluate_rule(
                actual_value=actual_value,
                operator=rule.operator,
                expected_value=rule.expected_value,
            )

            if passed:
                rule_status = "PASSED"
                passed_rules += 1
            else:
                rule_status = "FAILED"
                failed_rules += 1

            explanation = build_rule_explanation(
                field_name=rule.field_name,
                operator=rule.operator,
                expected_value=rule.expected_value,
                actual_value=actual_value,
                passed=passed,
            )

        results.append(
            {
                "rule_id": rule.id,
                "field_name": rule.field_name,
                "operator": rule.operator,
                "expected_value": rule.expected_value,
                "actual_value": actual_value,
                "mandatory": rule.is_mandatory,
                "status": rule_status,
                "passed": passed,
                "explanation": explanation,
            }
        )

    # ---------------------------------------------------------
    # OVERALL STATUS
    # ---------------------------------------------------------

    mandatory_failures = [
        result
        for result in results
        if result["mandatory"]
        and result["status"] == "FAILED"
    ]

    mandatory_unknowns = [
        result
        for result in results
        if result["mandatory"]
        and result["status"] == "UNKNOWN"
    ]

    if mandatory_failures:
        eligibility_status = "NOT_ELIGIBLE"
        eligible = False

        message = (
            "You are not eligible for this opportunity "
            "because one or more mandatory requirements "
            "are not met."
        )

    elif mandatory_unknowns:
        eligibility_status = "UNKNOWN"
        eligible = None

        message = (
            "Eligibility cannot be fully determined yet "
            "because some required information is missing "
            "from your profile."
        )

    else:
        eligibility_status = "ELIGIBLE"
        eligible = True

        message = (
            "You are eligible for this opportunity."
        )

    return {
        "eligible": eligible,
        "eligibility_status": eligibility_status,
        "total_rules": len(rules),
        "passed_rules": passed_rules,
        "failed_rules": failed_rules,
        "unknown_rules": unknown_rules,
        "results": results,
        "message": message,
    }