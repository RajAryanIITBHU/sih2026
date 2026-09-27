from fastapi import APIRouter, HTTPException
from backend.database import get_db_cursor
from backend.schemas.track import TrackResponse

router = APIRouter(prefix="/tracks", tags=["Tracks"])


@router.get("", response_model=list[TrackResponse])
def get_all_tracks():
    """Returns all track segments in the corridor."""
    with get_db_cursor() as cur:
        cur.execute("SELECT * FROM tracks ORDER BY track_id ASC;")
        rows = cur.fetchall()
        return [TrackResponse(**row) for row in rows]


@router.get("/{track_id}", response_model=TrackResponse)
def get_track_by_id(track_id: str):
    """Returns details for a specific track segment."""
    with get_db_cursor() as cur:
        cur.execute("SELECT * FROM tracks WHERE track_id = %s;", (track_id,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail=f"Track '{track_id}' not found")
        return TrackResponse(**row)
