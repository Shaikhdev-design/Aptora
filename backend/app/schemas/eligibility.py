from typing import Literal

from pydantic import BaseModel


EligibilityStatus = Literal[
    "ELIGIBLE",
    "NOT_ELIGIBLE",
    "UNKNOWN",
]


class EligibilityResult(BaseModel):
    eligible: bool | None
    eligibility_status: EligibilityStatus
    total_rules: int
    passed_rules: int
    failed_rules: int
    unknown_rules: int
    results: list[dict]
    message: str