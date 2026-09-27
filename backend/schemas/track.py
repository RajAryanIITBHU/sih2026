from datetime import datetime
from pydantic import BaseModel


class TrackBase(BaseModel):
    track_id: str
    from_station_id: str
    to_station_id: str
    name: str
    length_km: float
    track_type: str = "DOUBLE_ELECTRIFIED"
    max_speed_kmh: int = 110
    electrification: str = "25kV AC"
    criticality: float = 0.50
    status: str = "ACTIVE"


class TrackResponse(TrackBase):
    created_at: datetime | None = None

    class Config:
        from_attributes = True
