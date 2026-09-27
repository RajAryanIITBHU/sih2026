from fastapi import APIRouter, HTTPException, Query
from backend.database import get_db_cursor
from backend.schemas.asset import AssetResponse, AssetUpdate

router = APIRouter(prefix="/assets", tags=["Assets"])


@router.get("", response_model=list[AssetResponse])
def get_all_assets(department: str | None = Query(None, description="Filter by department")):
    """Returns all assets, optionally filtered by department."""
    with get_db_cursor() as cur:
        if department:
            cur.execute(
                "SELECT * FROM assets WHERE department = %s ORDER BY health_score ASC;",
                (department.upper(),)
            )
        else:
            cur.execute("SELECT * FROM assets ORDER BY health_score ASC;")
        rows = cur.fetchall()
        return [AssetResponse(**row) for row in rows]


@router.get("/{asset_id}", response_model=AssetResponse)
def get_asset_by_id(asset_id: str):
    """Returns details for a specific asset."""
    with get_db_cursor() as cur:
        cur.execute("SELECT * FROM assets WHERE asset_id = %s;", (asset_id,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail=f"Asset '{asset_id}' not found")
        return AssetResponse(**row)


@router.patch("/{asset_id}", response_model=AssetResponse)
def update_asset(asset_id: str, updates: AssetUpdate):
    """Partially updates asset health and priority status."""
    fields = []
    values = []
    if updates.health_score is not None:
        fields.append("health_score = %s")
        values.append(updates.health_score)
    if updates.failure_probability is not None:
        fields.append("failure_probability = %s")
        values.append(updates.failure_probability)
    if updates.rul_days is not None:
        fields.append("rul_days = %s")
        values.append(updates.rul_days)
    if updates.priority_score is not None:
        fields.append("priority_score = %s")
        values.append(updates.priority_score)
    if updates.priority_level is not None:
        fields.append("priority_level = %s")
        values.append(updates.priority_level)

    if not fields:
        raise HTTPException(status_code=400, detail="No fields provided for update")

    fields.append("updated_at = CURRENT_TIMESTAMP")
    values.append(asset_id)

    query = f"UPDATE assets SET {', '.join(fields)} WHERE asset_id = %s RETURNING *;"
    with get_db_cursor() as cur:
        cur.execute(query, tuple(values))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail=f"Asset '{asset_id}' not found")
        return AssetResponse(**row)
