from datetime import datetime
from pydantic import BaseModel


class StationBase(BaseModel):
    station_id: str
    code: str
    name: str
    division: str
    zone: str
    lat: float
    lon: float
    platforms: int = 2
    km_marker: float


class StationResponse(StationBase):
    created_at: datetime | None = None

    class Config:
        from_attributes = True
