from datetime import date, datetime
from pydantic import BaseModel


class MaintenanceRequestCreate(BaseModel):
    request_id: str | None = None
    source_system: str = "BDMS"  # TMS, SMMS, TDMS, BDMS
    department: str
    asset_id: str | None = None
    track_id: str
    description: str | None = None
    requested_date: date
    preferred_window_start: str  # HH:MM
    preferred_window_end: str    # HH:MM
    duration_minutes: int
    priority_score: float = 50.0
    urgency: str = "MEDIUM"      # LOW, MEDIUM, HIGH, CRITICAL


class MaintenanceRequestResponse(MaintenanceRequestCreate):
    request_id: str
    status: str = "PENDING"
    created_at: datetime | None = None

    class Config:
        from_attributes = True
