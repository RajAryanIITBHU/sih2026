from datetime import datetime
from pydantic import BaseModel, Field


class TrackTelemetryEvent(BaseModel):
    asset_id: str
    health: float = Field(..., ge=0.0, le=100.0, description="Asset health score (0-100)")
    vibration: float | None = Field(default=None, description="Vibration reading (e.g. mm/s)")
    temperature: float | None = Field(default=None, description="Rail temperature (Celsius)")
    track_id: str | None = None
    timestamp: datetime | None = None


class SignalTelemetryEvent(BaseModel):
    signal_id: str
    track_id: str
    status: str  # NORMAL, WARNING, DANGER, DEGRADED
    timestamp: datetime | None = None


class ElectricalTelemetryEvent(BaseModel):
    asset_id: str
    track_id: str
    voltage: float
    status: str  # NORMAL, DEGRADING, CRITICAL
    timestamp: datetime | None = None


class WeatherTelemetryEvent(BaseModel):
    station_id: str
    rainfall_mm: float = 0.0
    temperature_c: float | None = None
    visibility_km: float | None = None
    condition: str = "NORMAL"
    timestamp: datetime | None = None


class EventResponse(BaseModel):
    status: str = "success"
    message: str
    asset_id: str | None = None
    updated_health: float | None = None
    priority_score: float | None = None
    priority_level: str | None = None
    event_timestamp: datetime
