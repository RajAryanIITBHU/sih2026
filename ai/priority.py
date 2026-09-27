"""
RailSync AI Priority Scoring Engine
Implements the explainable priority score defined in AGENTS.md §11:
priority = 0.30 * failure_prob + 0.20 * criticality + 0.20 * traffic_density + 0.15 * overdue + 0.15 * failure_history
Output levels:
  0–30:   LOW
  30–60:  MEDIUM
  60–80:  HIGH
  80–100: CRITICAL
"""

from typing import Any


def calculate_priority(asset: dict[str, Any], traffic_density: float = 0.65) -> dict[str, Any]:
    """
    Calculates explainable priority score and reasons for a railway asset.

    Input asset dictionary expects:
      - health_score: float (0.0 to 100.0)
      - failure_probability: float (0.0 to 1.0) [optional, derived from health if missing]
      - criticality: float (0.0 to 1.0)
      - overdue_days: int
      - failure_history_score: float (0.0 to 1.0, defaults to 0.20)
    """
    health = float(asset.get("health_score", 100.0))

    # 1. Derive or use failure_probability
    if "failure_probability" in asset and asset["failure_probability"] is not None:
        failure_prob = float(asset["failure_probability"])
    else:
        failure_prob = max(0.02, min(0.98, (100.0 - health) / 100.0))

    criticality = float(asset.get("criticality", 0.50))
    overdue_days = int(asset.get("overdue_days", 0))

    # Normalize overdue score (30+ days overdue = 1.0)
    overdue_score = min(1.0, max(0.0, overdue_days / 30.0))

    # Historical failure / degradation rate (0.0 to 1.0)
    failure_history = float(asset.get("failure_history_score", 0.20))
    if health < 50:
        failure_history = min(1.0, failure_history + 0.30)

    # 2. Formula calculation
    raw_score = (
        0.30 * failure_prob +
        0.20 * criticality +
        0.20 * traffic_density +
        0.15 * overdue_score +
        0.15 * failure_history
    )
    score_100 = round(min(100.0, max(0.0, raw_score * 100)), 2)

    # 3. Output level classification
    if score_100 >= 80.0:
        level = "CRITICAL"
    elif score_100 >= 60.0:
        level = "HIGH"
    elif score_100 >= 30.0:
        level = "MEDIUM"
    else:
        level = "LOW"

    # 4. Generate explainable reasons
    reasons: list[str] = []
    if failure_prob >= 0.70:
        reasons.append(f"Severe probability of imminent failure ({failure_prob:.2f})")
    elif failure_prob >= 0.45:
        reasons.append(f"Elevated failure probability ({failure_prob:.2f}) due to health degradation ({health:.1f}/100)")

    if criticality >= 0.90:
        reasons.append(f"Vital mainline corridor asset (criticality {criticality:.2f})")
    elif criticality >= 0.75:
        reasons.append(f"High section importance (criticality {criticality:.2f})")

    if overdue_days > 14:
        reasons.append(f"Mandatory inspection is significantly overdue by {overdue_days} days")
    elif overdue_days > 0:
        reasons.append(f"Maintenance overdue by {overdue_days} days")

    if traffic_density >= 0.70:
        reasons.append(f"High traffic corridor density ({traffic_density:.2f}) amplifying failure impact")

    rul = asset.get("rul_days")
    if rul is not None and int(rul) <= 7:
        reasons.append(f"Critical remaining useful life: estimated {rul} days remaining")

    if not reasons:
        reasons.append("Routine asset operating parameters within baseline tolerances")

    return {
        "asset_id": asset.get("asset_id"),
        "score": score_100,
        "level": level,
        "components": {
            "failure_probability": round(failure_prob, 3),
            "criticality": round(criticality, 3),
            "traffic_density": round(traffic_density, 3),
            "overdue_score": round(overdue_score, 3),
            "failure_history": round(failure_history, 3),
        },
        "reasons": reasons,
    }


def should_auto_request_maintenance(priority_result: dict[str, Any]) -> bool:
    """Returns True if the priority score warrants automatic maintenance scheduling."""
    return priority_result["score"] >= 60.0 or priority_result["level"] in ("HIGH", "CRITICAL")
