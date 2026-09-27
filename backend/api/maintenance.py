import uuid
from fastapi import APIRouter, HTTPException, Query
from backend.database import get_db_cursor
from backend.schemas.maintenance import MaintenanceRequestCreate, MaintenanceRequestResponse

router = APIRouter(prefix="/maintenance", tags=["Maintenance"])


@router.get("/requests", response_model=list[MaintenanceRequestResponse])
def get_maintenance_requests(
    department: str | None = Query(None, description="Filter by department"),
    status: str | None = Query(None, description="Filter by status (PENDING, APPROVED, etc.)")
):
    """Returns all maintenance requests, ordered by priority score descending."""
    conditions = []
    values = []
    if department:
        conditions.append("department = %s")
        values.append(department.upper())
    if status:
        conditions.append("status = %s")
        values.append(status.upper())

    where_clause = f"WHERE {' AND '.join(conditions)}" if conditions else ""
    query = f"SELECT * FROM maintenance_requests {where_clause} ORDER BY priority_score DESC;"

    with get_db_cursor() as cur:
        cur.execute(query, tuple(values))
        rows = cur.fetchall()
        return [MaintenanceRequestResponse(**row) for row in rows]


@router.post("/requests", response_model=MaintenanceRequestResponse, status_code=201)
def create_maintenance_request(req: MaintenanceRequestCreate):
    """Creates a new maintenance request from BDMS, TMS, SMMS, or TDMS."""
    req_id = req.request_id or f"REQ-{uuid.uuid4().hex[:8].upper()}"
    query = """
    INSERT INTO maintenance_requests (
        request_id, source_system, department, asset_id, track_id, description,
        requested_date, preferred_window_start, preferred_window_end,
        duration_minutes, priority_score, urgency, status
    ) VALUES (
        %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'PENDING'
    ) RETURNING *;
    """
    with get_db_cursor() as cur:
        cur.execute(
            query,
            (
                req_id,
                req.source_system,
                req.department.upper(),
                req.asset_id,
                req.track_id,
                req.description,
                req.requested_date,
                req.preferred_window_start,
                req.preferred_window_end,
                req.duration_minutes,
                req.priority_score,
                req.urgency.upper(),
            ),
        )
        row = cur.fetchone()
        return MaintenanceRequestResponse(**row)


@router.get("/requests/{request_id}", response_model=MaintenanceRequestResponse)
def get_maintenance_request_by_id(request_id: str):
    """Returns details for a specific maintenance request."""
    with get_db_cursor() as cur:
        cur.execute("SELECT * FROM maintenance_requests WHERE request_id = %s;", (request_id,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail=f"Request '{request_id}' not found")
        return MaintenanceRequestResponse(**row)
