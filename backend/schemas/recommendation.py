from datetime import datetime
from pydantic import BaseModel


class BlockRecommendationCreate(BaseModel):
    recommendation_id: str | None = None
    track_id: str
    start_time: datetime
    end_time: datetime
    duration_minutes: int
    participating_departments: list[str] = []
    maintenance_request_ids: list[str] = []
    expected_delay_minutes: int = 0
    status: str = "PENDING"
    reasons: list[str] = []


class BlockRecommendationResponse(BlockRecommendationCreate):
    recommendation_id: str
    created_at: datetime | None = None

    class Config:
        from_attributes = True


class ApprovalAction(BaseModel):
    action: str  # APPROVE, REJECT, MODIFY
    comment: str | None = None
