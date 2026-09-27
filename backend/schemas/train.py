from datetime import datetime
from pydantic import BaseModel


class TrainBase(BaseModel):
    train_id: str
    train_name: str
    train_type: str
    origin: str
    destination: str
    priority: int = 2
    max_speed_kmh: int = 110
    current_station_id: str | None = None
    next_station_id: str | None = None
    status: str = "SCHEDULED"


class TrainResponse(TrainBase):
    updated_at: datetime | None = None

    class Config:
        from_attributes = True
