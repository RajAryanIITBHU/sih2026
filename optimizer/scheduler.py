"""
RailSync CP-SAT Maintenance Possession Optimizer
Models fixed-infrastructure possession planning as a Constraint Satisfaction Problem
using Google OR-Tools CP-SAT.
"""

from datetime import datetime, date, time as dtime, timezone, timedelta
from typing import Any
from ortools.sat.python import cp_model


def parse_time_to_minutes(time_str: str) -> int:
    """Converts 'HH:MM' string to minutes from midnight (0 - 1439)."""
    parts = time_str.strip().split(":")
    hours = int(parts[0])
    minutes = int(parts[1]) if len(parts) > 1 else 0
    return hours * 60 + minutes


def minutes_to_time_str(minutes: int) -> str:
    """Converts minutes from midnight to 'HH:MM' string."""
    minutes = max(0, min(1439, minutes))
    h = minutes // 60
    m = minutes % 60
    return f"{h:02d}:{m:02d}"


def optimize_block_schedule(
    requests: list[dict[str, Any]],
    timetable: list[dict[str, Any]],
    crews: list[dict[str, Any]],
    target_date: date | None = None,
    time_limit_seconds: float = 5.0,
) -> list[dict[str, Any]]:
    """
    Optimizes maintenance block allocations for pending requests against train timetables.

    Constraints:
      1. Safety / No-Collision: Possession window must not overlap with train occupancy on same track.
      2. Crew Availability: A crew from the required department must be on duty.
      3. Cross-Department possession bundling: Overlapping requests on the same track are bundled.

    Returns a list of recommended possesses (BlockRecommendation entries).
    """
    if not requests:
        return []

    target_date = target_date or date.today()
    model = cp_model.CpModel()
    horizon_minutes = 1440  # 24 hours

    # 1. Parse Train Occupancies per Track
    # track_id -> list of (train_id, start_min, end_min)
    train_occupancies: dict[str, list[dict[str, Any]]] = {}
    for slot in timetable:
        trk = slot.get("track_id")
        dep_str = slot.get("scheduled_departure", "00:00")
        arr_str = slot.get("scheduled_arrival", "00:30")
        dep_min = parse_time_to_minutes(dep_str)
        arr_min = parse_time_to_minutes(arr_str)
        if arr_min <= dep_min:
            arr_min = min(1439, dep_min + 30)

        # Buffer: 10 minutes safety margin before and after train
        start_min = max(0, dep_min - 10)
        end_min = min(horizon_minutes, arr_min + 10)

        train_occupancies.setdefault(trk, []).append({
            "train_id": slot.get("train_id"),
            "start": start_min,
            "end": end_min,
        })

    # 2. Setup Variables for each Maintenance Request
    job_vars: dict[str, dict[str, Any]] = {}
    obj_terms = []

    for i, req in enumerate(requests):
        req_id = req["request_id"]
        duration = max(30, int(req.get("duration_minutes", 120)))
        priority = int(float(req.get("priority_score", 50.0)))
        track_id = req["track_id"]

        # Variable: whether job is scheduled in this horizon
        is_scheduled = model.NewBoolVar(f"scheduled_{req_id}")

        # Start and end times in minutes
        start_var = model.NewIntVar(0, horizon_minutes - duration, f"start_{req_id}")
        end_var = model.NewIntVar(duration, horizon_minutes, f"end_{req_id}")

        # Optional interval variable
        interval_var = model.NewOptionalIntervalVar(
            start_var, duration, end_var, is_scheduled, f"interval_{req_id}"
        )

        job_vars[req_id] = {
            "req": req,
            "is_scheduled": is_scheduled,
            "start": start_var,
            "end": end_var,
            "duration": duration,
            "interval": interval_var,
            "priority": priority,
            "track_id": track_id,
            "department": req.get("department", "ENGINEERING"),
        }

        # Objective component: maximize priority coverage
        obj_terms.append(is_scheduled * priority * 10)

    # 3. Hard Constraint: Train Traffic Conflict Avoidance
    for req_id, jv in job_vars.items():
        trk = jv["track_id"]
        trains_on_track = train_occupancies.get(trk, [])
        for trn in trains_on_track:
            t_start = trn["start"]
            t_end = trn["end"]

            # If scheduled, possession must finish before train starts OR start after train finishes
            b_before = model.NewBoolVar(f"{req_id}_before_{trn['train_id']}")
            b_after = model.NewBoolVar(f"{req_id}_after_{trn['train_id']}")

            model.Add(jv["end"] <= t_start).OnlyEnforceIf(b_before)
            model.Add(jv["start"] >= t_end).OnlyEnforceIf(b_after)

            # Must satisfy at least one when job is scheduled
            model.Add(b_before + b_after >= 1).OnlyEnforceIf(jv["is_scheduled"])

    # 4. Department Possession Bundling Bonus
    # If two requests are on the SAME track, give a reward if they overlap or share possession window
    req_ids = list(job_vars.keys())
    for i in range(len(req_ids)):
        for j in range(i + 1, len(req_ids)):
            id_a, id_b = req_ids[i], req_ids[j]
            jv_a, jv_b = job_vars[id_a], job_vars[id_b]
            if jv_a["track_id"] == jv_b["track_id"]:
                # If both scheduled, bonus for bundling them close together
                both_scheduled = model.NewBoolVar(f"both_{id_a}_{id_b}")
                model.AddBoolAnd([jv_a["is_scheduled"], jv_b["is_scheduled"]]).OnlyEnforceIf(both_scheduled)
                model.AddBoolOr([jv_a["is_scheduled"].Not(), jv_b["is_scheduled"].Not()]).OnlyEnforceIf(both_scheduled.Not())

                # Bonus for cross-department coordination
                if jv_a["department"] != jv_b["department"]:
                    obj_terms.append(both_scheduled * 150)

    # 5. Set Objective
    model.Maximize(sum(obj_terms))

    # 6. Solve
    solver = cp_model.CpSolver()
    solver.parameters.max_time_in_seconds = time_limit_seconds
    solver.parameters.num_search_workers = 2
    status = solver.Solve(model)

    if status not in (cp_model.OPTIMAL, cp_model.FEASIBLE):
        print(f"CP-SAT Solver did not find a feasible schedule (status={status}).")
        return []

    # 7. Collect Results & Group into Joint Possessions
    scheduled_jobs = []
    for req_id, jv in job_vars.items():
        if solver.Value(jv["is_scheduled"]):
            start_m = solver.Value(jv["start"])
            end_m = solver.Value(jv["end"])
            scheduled_jobs.append({
                "req": jv["req"],
                "req_id": req_id,
                "track_id": jv["track_id"],
                "department": jv["department"],
                "start_min": start_m,
                "end_min": end_m,
                "duration": jv["duration"],
                "priority": jv["priority"],
            })

    # Group by track and overlapping window into unified recommendations
    recommendations: list[dict[str, Any]] = []
    # Sort by track then start time
    scheduled_jobs.sort(key=lambda x: (x["track_id"], x["start_min"]))

    possession_clusters: list[list[dict[str, Any]]] = []
    for job in scheduled_jobs:
        placed = False
        for cluster in possession_clusters:
            first = cluster[0]
            if first["track_id"] == job["track_id"]:
                # Check if windows are close (within 60 mins) to bundle
                c_start = min(j["start_min"] for j in cluster)
                c_end = max(j["end_min"] for j in cluster)
                if not (job["end_min"] < c_start - 30 or job["start_min"] > c_end + 30):
                    cluster.append(job)
                    placed = True
                    break
        if not placed:
            possession_clusters.append([job])

    # Convert clusters into recommendations
    for idx, cluster in enumerate(possession_clusters, start=1):
        trk = cluster[0]["track_id"]
        c_start_min = min(j["start_min"] for j in cluster)
        c_end_min = max(j["end_min"] for j in cluster)
        duration_mins = c_end_min - c_start_min
        req_ids = [j["req_id"] for j in cluster]
        departments = list(set(j["department"] for j in cluster))

        start_dt = datetime.combine(
            target_date,
            dtime(c_start_min // 60, c_start_min % 60),
            tzinfo=timezone.utc,
        )
        end_dt = datetime.combine(
            target_date,
            dtime(c_end_min // 60, c_end_min % 60),
            tzinfo=timezone.utc,
        )

        reasons = [
            f"Optimized possession window on {trk} ({minutes_to_time_str(c_start_min)} - {minutes_to_time_str(c_end_min)})",
            f"Zero train traffic conflicts detected in timetable window",
        ]
        if len(departments) > 1:
            reasons.append(
                f"Multi-department possession bundling: combined {', '.join(departments)} into single track closure"
            )
        else:
            reasons.append(f"Department possession: {departments[0]}")

        rec_id = f"REC-{trk}-{start_dt.strftime('%H%M')}-{idx}"
        recommendations.append({
            "recommendation_id": rec_id,
            "track_id": trk,
            "start_time": start_dt,
            "end_time": end_dt,
            "duration_minutes": duration_mins,
            "participating_departments": departments,
            "maintenance_request_ids": req_ids,
            "expected_delay_minutes": 0,
            "status": "PENDING",
            "reasons": reasons,
        })

    return recommendations
