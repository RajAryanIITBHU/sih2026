from datetime import date, datetime
from pydantic import BaseModel


class AssetBase(BaseModel):
    asset_id: str
    name: str
    department: str
    asset_type: str
    track_id: str
    location_km: float
    health_score: float
    failure_probability: float
    rul_days: int
    criticality: float
    last_inspection_date: date | None = None
    overdue_days: int = 0
    priority_score: float = 0.0
    priority_level: str = "LOW"


class AssetUpdate(BaseModel):
    health_score: float | None = None
    failure_probability: float | None = None
    rul_days: int | None = None
    priority_score: float | None = None
    priority_level: str | None = None


class AssetResponse(AssetBase):
    updated_at: datetime | None = None

    class Config:
        from_attributes = True
