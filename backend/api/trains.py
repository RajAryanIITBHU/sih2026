from fastapi import APIRouter, HTTPException, Query
from backend.database import get_db_cursor
from backend.schemas.train import TrainResponse

router = APIRouter(prefix="/trains", tags=["Trains"])


@router.get("", response_model=list[TrainResponse])
def get_all_trains(status: str | None = Query(None, description="Filter by train status")):
    """Returns all trains currently active or scheduled in the corridor."""
    with get_db_cursor() as cur:
        if status:
            cur.execute("SELECT * FROM trains WHERE status = %s ORDER BY priority ASC;", (status.upper(),))
        else:
            cur.execute("SELECT * FROM trains ORDER BY priority ASC, train_id ASC;")
        rows = cur.fetchall()
        return [TrainResponse(**row) for row in rows]


@router.get("/{train_id}", response_model=TrainResponse)
def get_train_by_id(train_id: str):
    """Returns details for a specific train."""
    with get_db_cursor() as cur:
        cur.execute("SELECT * FROM trains WHERE train_id = %s;", (train_id,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail=f"Train '{train_id}' not found")
        return TrainResponse(**row)
