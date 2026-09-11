import re
from typing import Any


def clean_text(value: Any) -> str:
    if value is None:
        return ""

    if isinstance(value, list):
        return " ".join(clean_text(item) for item in value)

    return str(value).strip()


def add_rule(
    rules: list[dict[str, Any]],
    rule_type: str,
    field_name: str,
    operator: str,
    expected_value: str,
    description: str,
    is_mandatory: bool = True,
) -> None:
    signature = (
        rule_type,
        field_name,
        operator,
        expected_value,
    )

    for rule in rules:
        existing = (
            rule["rule_type"],
            rule["field_name"],
            rule["operator"],
            rule["expected_value"],
        )

        if existing == signature:
            return

    rules.append(
        {
            "rule_type": rule_type,
            "field_name": field_name,
            "operator": operator,
            "expected_value": expected_value,
            "description": description,
            "is_mandatory": is_mandatory,
        }
    )


def extract_eligibility_rules(
    eligibility_text: str | None,
) -> list[dict[str, Any]]:

    text = clean_text(eligibility_text)

    if not text:
        return []

    normalized = re.sub(r"\s+", " ", text).strip()

    rules: list[dict[str, Any]] = []

    # =========================================================
    # GENDER
    # =========================================================

    if re.search(
        r"\bfemale\s+(?:candidates?|applicants?|students?)\s+only\b",
        normalized,
        re.IGNORECASE,
    ):
        add_rule(
            rules,
            "GENDER",
            "gender",
            "equals",
            "female",
            "Only female candidates are eligible.",
        )

    elif re.search(
        r"\bmale\s+(?:candidates?|applicants?|students?)\s+only\b",
        normalized,
        re.IGNORECASE,
    ):
        add_rule(
            rules,
            "GENDER",
            "gender",
            "equals",
            "male",
            "Only male candidates are eligible.",
        )

    # =========================================================
    # EDUCATION
    # =========================================================

    # IMPORTANT:
    # B.E. is checked by tokenizing the text rather than using
    # a loose regex. This prevents "B.E." from being detected
    # inside words such as "belonging" or "below".

    education_checks = [
        ("B.Tech", r"(?<![A-Za-z])B\s*\.\s*Tech\s*\.?(?![A-Za-z])"),
        ("B.Tech", r"(?<![A-Za-z])BTech(?![A-Za-z])"),

        ("B.E.", r"(?<![A-Za-z])B\s*\.\s*E\s*\.?(?![A-Za-z])"),
        ("B.E.", r"(?<![A-Za-z])BE(?![A-Za-z])"),

        ("M.Tech", r"(?<![A-Za-z])M\s*\.\s*Tech\s*\.?(?![A-Za-z])"),
        ("M.Tech", r"(?<![A-Za-z])MTech(?![A-Za-z])"),

        ("M.E.", r"(?<![A-Za-z])M\s*\.\s*E\s*\.?(?![A-Za-z])"),
        ("M.E.", r"(?<![A-Za-z])ME(?![A-Za-z])"),

        ("B.Sc", r"(?<![A-Za-z])B\s*\.\s*Sc\s*\.?(?![A-Za-z])"),
        ("M.Sc", r"(?<![A-Za-z])M\s*\.\s*Sc\s*\.?(?![A-Za-z])"),

        ("B.Com", r"(?<![A-Za-z])B\s*\.\s*Com\s*\.?(?![A-Za-z])"),

        ("BBA", r"(?<![A-Za-z])B\s*\.\s*B\s*\.\s*A\s*\.?(?![A-Za-z])"),
        ("BBA", r"(?<![A-Za-z])BBA(?![A-Za-z])"),

        ("MBA", r"(?<![A-Za-z])M\s*\.\s*B\s*\.\s*A\s*\.?(?![A-Za-z])"),
        ("MBA", r"(?<![A-Za-z])MBA(?![A-Za-z])"),

        ("B.A.", r"(?<![A-Za-z])B\s*\.\s*A\s*\.?(?![A-Za-z])"),
        ("M.A.", r"(?<![A-Za-z])M\s*\.\s*A\s*\.?(?![A-Za-z])"),

        ("ITI", r"(?<![A-Za-z])ITI(?![A-Za-z])"),
        ("Diploma", r"(?<![A-Za-z])Diploma(?![A-Za-z])"),
        ("12th", r"(?<![A-Za-z])12th\s+pass(?![A-Za-z])"),
        ("12th", r"(?<![A-Za-z])Intermediate(?![A-Za-z])"),
        ("10th", r"(?<![A-Za-z])10th(?:\s+pass)?(?![A-Za-z])"),
        ("Undergraduate", r"(?<![A-Za-z])Undergraduate(?:\s+students?)?(?![A-Za-z])"),
        ("Postgraduate", r"(?<![A-Za-z])Postgraduate(?:\s+students?)?(?![A-Za-z])"),
        ("Graduate", r"(?<![A-Za-z])Graduates?(?![A-Za-z])"),
    ]

    found_education: list[str] = []

    for qualification, pattern in education_checks:
        if re.search(pattern, normalized, re.IGNORECASE):
            if qualification not in found_education:
                found_education.append(qualification)

    if found_education:
        add_rule(
            rules,
            "EDUCATION",
            "education_level",
            "in",
            "|".join(found_education),
            "Eligible educational qualifications: "
            + ", ".join(found_education),
        )

    # =========================================================
    # AGE
    # =========================================================

    age_match = re.search(
        r"(?:age|aged)\s*(?:between\s*)?"
        r"(\d{1,2})\s*(?:to|-)\s*(\d{1,2})",
        normalized,
        re.IGNORECASE,
    )

    if age_match:
        minimum_age = age_match.group(1)
        maximum_age = age_match.group(2)

        add_rule(
            rules,
            "AGE",
            "age",
            "greater_than_or_equal",
            minimum_age,
            f"Minimum age: {minimum_age}.",
        )

        add_rule(
            rules,
            "AGE",
            "age",
            "less_than_or_equal",
            maximum_age,
            f"Maximum age: {maximum_age}.",
        )

    # =========================================================
    # INCOME
    # =========================================================

    income_match = re.search(
        r"(?:annual\s+family\s+income|family\s+income|annual\s+income)"
        r".{0,100}?"
        r"(?:less\s+than|below|not\s+exceeding|"
        r"does\s+not\s+exceed|up\s+to|maximum\s+of)"
        r".{0,30}?"
        r"(?:₹|rs\.?|inr)?\s*([\d,]+)",
        normalized,
        re.IGNORECASE,
    )

    if income_match:
        income = income_match.group(1).replace(",", "")

        add_rule(
            rules,
            "INCOME",
            "annual_family_income",
            "less_than_or_equal",
            income,
            f"Annual family income must not exceed ₹{income}.",
        )

    # =========================================================
    # CATEGORY
    # =========================================================

    category_patterns = [
        ("SC", r"\bSC\b"),
        ("ST", r"\bST\b"),
        ("OBC", r"\bOBC\b"),
        ("EBC", r"\bEBC\b"),
        ("DNT", r"\bDNT\b"),
        ("PWD", r"\bPWD\b"),
        ("EWS", r"\bEWS\b"),
    ]

    found_categories: list[str] = []

    for category, pattern in category_patterns:
        if re.search(pattern, normalized, re.IGNORECASE):
            if category not in found_categories:
                found_categories.append(category)

    if (
        found_categories
        and re.search(
            r"\b(?:belonging|belong|category|categories)\b",
            normalized,
            re.IGNORECASE,
        )
    ):
        add_rule(
            rules,
            "CATEGORY",
            "category",
            "in",
            "|".join(found_categories),
            "Eligible categories: "
            + ", ".join(found_categories),
        )

    # =========================================================
    # LOCATION
    # =========================================================

    states = [
        "Andhra Pradesh",
        "Arunachal Pradesh",
        "Assam",
        "Bihar",
        "Chhattisgarh",
        "Goa",
        "Gujarat",
        "Haryana",
        "Himachal Pradesh",
        "Jharkhand",
        "Karnataka",
        "Kerala",
        "Madhya Pradesh",
        "Maharashtra",
        "Manipur",
        "Meghalaya",
        "Mizoram",
        "Nagaland",
        "Odisha",
        "Punjab",
        "Rajasthan",
        "Sikkim",
        "Tamil Nadu",
        "Telangana",
        "Tripura",
        "Uttar Pradesh",
        "Uttarakhand",
        "West Bengal",
        "Delhi",
        "Jammu and Kashmir",
        "Jammu & Kashmir",
        "Ladakh",
    ]

    location_match = re.search(
        r"(?:domicile|domiciled|resident|residing|"
        r"residence|native|from)\b.{0,100}",
        normalized,
        re.IGNORECASE,
    )

    if location_match:
        location_text = location_match.group(0)

        for state in states:
            if re.search(
                rf"(?<![A-Za-z]){re.escape(state)}(?![A-Za-z])",
                location_text,
                re.IGNORECASE,
            ):
                add_rule(
                    rules,
                    "LOCATION",
                    "state",
                    "equals",
                    state,
                    f"Applicant must be associated with {state}.",
                )
                break

    return rules


if __name__ == "__main__":

    examples = [
        "B.Tech., B.E., Equivalent",
        "ITI, 12th pass, or graduates. Female candidates only.",
        "Candidates aged between 18 to 25 with annual family income below ₹300000.",
        "Applicants must be domiciled in Jammu and Kashmir.",
        "Students belonging to SC category with annual family income below ₹250000.",
    ]

    print("=" * 70)
    print("APTORA ELIGIBILITY EXTRACTOR TEST")
    print("=" * 70)

    for example in examples:
        print("\nEligibility:")
        print(example)

        rules = extract_eligibility_rules(example)

        print("\nRules:")

        if rules:
            for rule in rules:
                print(rule)
        else:
            print("No structured rules detected.")

        print("-" * 70)