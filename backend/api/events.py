from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException
from backend.database import get_db_cursor
from backend.schemas.events import (
    TrackTelemetryEvent,
    SignalTelemetryEvent,
    ElectricalTelemetryEvent,
    WeatherTelemetryEvent,
    EventResponse,
)
from ai.priority import calculate_priority, should_auto_request_maintenance

router = APIRouter(prefix="/events", tags=["Events & Telemetry Ingestion"])


@router.post("/track", response_model=EventResponse)
def ingest_track_event(event: TrackTelemetryEvent):
    """
    Accepts track health telemetry (asset_id, health, vibration, temperature).
    Updates asset health and recalculates failure probability and explainable priority score.
    If priority > 60 (HIGH or CRITICAL), automatically creates a maintenance request in BDMS/RailSync.
    """
    now = event.timestamp or datetime.now(timezone.utc)

    with get_db_cursor() as cur:
        # 1. Fetch current asset state
        cur.execute(
            """
            SELECT asset_id, name, department, track_id, health_score,
                   criticality, overdue_days, rul_days
            FROM assets WHERE asset_id = %s;
            """,
            (event.asset_id,)
        )
        asset = cur.fetchone()
        if not asset:
            raise HTTPException(status_code=404, detail=f"Asset '{event.asset_id}' not found")

        # 2. Derive updated metrics
        health = float(event.health)
        failure_prob = round(max(0.02, min(0.98, (100.0 - health) / 100.0)), 3)
        rul_days = max(1, int((health / 100.0) * 90))

        asset_eval_dict = {
            "asset_id": asset["asset_id"],
            "health_score": health,
            "failure_probability": failure_prob,
            "criticality": float(asset["criticality"]),
            "overdue_days": int(asset["overdue_days"]),
            "rul_days": rul_days,
        }

        # 3. Compute explainable priority score using AI Priority Engine
        priority_result = calculate_priority(asset_eval_dict, traffic_density=0.70)
        priority_score = priority_result["score"]
        priority_level = priority_result["level"]

        # 4. Update asset in database
        cur.execute(
            """
            UPDATE assets
            SET health_score = %s,
                failure_probability = %s,
                rul_days = %s,
                priority_score = %s,
                priority_level = %s,
                updated_at = %s
            WHERE asset_id = %s;
            """,
            (health, failure_prob, rul_days, priority_score, priority_level, now, event.asset_id)
        )

        # 5. Auto-create maintenance request if priority > 60 (HIGH/CRITICAL)
        auto_requested = False
        if should_auto_request_maintenance(priority_result):
            # Check if pending maintenance request already exists for this asset
            cur.execute(
                """
                SELECT request_id FROM maintenance_requests
                WHERE asset_id = %s AND status = 'PENDING';
                """,
                (event.asset_id,)
            )
            existing_req = cur.fetchone()

            if not existing_req:
                req_id = f"AUTO-{event.asset_id}-{int(now.timestamp())}"
                reasons_str = "; ".join(priority_result["reasons"])
                desc = f"AI Auto-Possession Request for {asset['name']}: {reasons_str}"
                cur.execute(
                    """
                    INSERT INTO maintenance_requests (
                        request_id, source_system, department, asset_id, track_id,
                        description, requested_date, preferred_window_start,
                        preferred_window_end, duration_minutes, priority_score,
                        urgency, status
                    ) VALUES (
                        %s, 'AI_AGENT', %s, %s, %s, %s, CURRENT_DATE,
                        '11:00', '13:00', 120, %s, %s, 'PENDING'
                    );
                    """,
                    (
                        req_id,
                        asset["department"],
                        event.asset_id,
                        asset["track_id"],
                        desc,
                        priority_score,
                        priority_level,
                    )
                )
                auto_requested = True

        msg = f"Track asset {event.asset_id} updated: health={health}, priority={priority_score} ({priority_level})"
        if auto_requested:
            msg += " -> High risk detected: Auto-created maintenance request in queue!"

        return EventResponse(
            status="success",
            message=msg,
            asset_id=event.asset_id,
            updated_health=health,
            priority_score=priority_score,
            priority_level=priority_level,
            event_timestamp=now,
        )


@router.post("/signalling", response_model=EventResponse)
def ingest_signal_event(event: SignalTelemetryEvent):
    """Accepts signalling status updates (NORMAL, WARNING, DANGER)."""
    now = event.timestamp or datetime.now(timezone.utc)
    return EventResponse(
        status="success",
        message=f"Signal event for {event.signal_id} on {event.track_id} status={event.status}",
        asset_id=event.signal_id,
        event_timestamp=now,
    )


@router.post("/electrical", response_model=EventResponse)
def ingest_electrical_event(event: ElectricalTelemetryEvent):
    """Accepts OHE / traction voltage and degradation events."""
    now = event.timestamp or datetime.now(timezone.utc)
    return EventResponse(
        status="success",
        message=f"Electrical OHE telemetry for {event.asset_id} on {event.track_id} voltage={event.voltage}kV status={event.status}",
        asset_id=event.asset_id,
        event_timestamp=now,
    )


@router.post("/weather", response_model=EventResponse)
def ingest_weather_event(event: WeatherTelemetryEvent):
    """Accepts weather events across stations (rainfall, storm condition)."""
    now = event.timestamp or datetime.now(timezone.utc)
    risk_factor = 1.8 if "HEAVY" in event.condition or event.rainfall_mm > 30 else (1.3 if event.rainfall_mm > 10 else 1.0)
    with get_db_cursor() as cur:
        cur.execute(
            """
            INSERT INTO weather_reports (weather_id, station_id, temperature_c, rainfall_mm, visibility_km, condition, track_risk_factor, recorded_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (weather_id) DO UPDATE SET
                rainfall_mm = EXCLUDED.rainfall_mm,
                condition = EXCLUDED.condition,
                track_risk_factor = EXCLUDED.track_risk_factor,
                recorded_at = EXCLUDED.recorded_at;
            """,
            (
                f"WTH-{event.station_id}-{int(now.timestamp())}",
                event.station_id,
                event.temperature_c or 28.0,
                event.rainfall_mm,
                event.visibility_km or 5.0,
                event.condition,
                risk_factor,
                now,
            )
        )

    return EventResponse(
        status="success",
        message=f"Weather event recorded for {event.station_id}: rainfall={event.rainfall_mm}mm, condition={event.condition}",
        event_timestamp=now,
    )
