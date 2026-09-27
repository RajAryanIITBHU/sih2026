from fastapi import APIRouter, HTTPException
from backend.database import get_db_cursor
from backend.schemas.station import StationResponse

router = APIRouter(prefix="/stations", tags=["Stations"])


@router.get("", response_model=list[StationResponse])
def get_all_stations():
    """Returns all stations along the corridor ordered by kilometer marker."""
    with get_db_cursor() as cur:
        cur.execute("SELECT * FROM stations ORDER BY km_marker ASC;")
        rows = cur.fetchall()
        return [StationResponse(**row) for row in rows]


@router.get("/{station_id}", response_model=StationResponse)
def get_station_by_id(station_id: str):
    """Returns details for a specific station."""
    with get_db_cursor() as cur:
        cur.execute("SELECT * FROM stations WHERE station_id = %s OR code = %s;", (station_id, station_id.upper()))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail=f"Station '{station_id}' not found")
        return StationResponse(**row)
