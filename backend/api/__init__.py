from fastapi import APIRouter
from backend.api.stations import router as stations_router
from backend.api.tracks import router as tracks_router
from backend.api.assets import router as assets_router
from backend.api.trains import router as trains_router
from backend.api.maintenance import router as maintenance_router
from backend.api.recommendations import router as recommendations_router
from backend.api.events import router as events_router

api_router = APIRouter()
api_router.include_router(stations_router)
api_router.include_router(tracks_router)
api_router.include_router(assets_router)
api_router.include_router(trains_router)
api_router.include_router(maintenance_router)
api_router.include_router(recommendations_router)
api_router.include_router(events_router)

__all__ = ["api_router"]
