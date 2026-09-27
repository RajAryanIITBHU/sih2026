from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.config import settings
from backend.database import init_db_pool, close_db_pool
from backend.api import api_router
from backend.api.recommendations import run_optimization


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize database connection pool
    print(f"Starting {settings.PROJECT_NAME} (env={settings.ENVIRONMENT})...")
    init_db_pool()
    yield
    # Shutdown: close connection pool
    print("Shutting down RailSync backend...")
    close_db_pool()


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="RailSync API — AI-Powered Automatic Block Planning for Indian Railways (Problem Statement 26027)",
    lifespan=lifespan,
)

# CORS configuration for local development & Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all API endpoints
app.include_router(api_router, prefix=settings.API_PREFIX)
app.add_api_route(f"{settings.API_PREFIX}/optimize", run_optimization, methods=["POST"], tags=["Optimizer"])


@app.get("/health", tags=["System"])
def health_check():
    """Healthcheck endpoint for container orchestration & liveness monitoring."""
    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
    }


@app.get("/", tags=["System"])
def root_info():
    """Root info endpoint providing API documentation links."""
    return {
        "title": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs_url": "/docs",
        "endpoints": {
            "stations": f"{settings.API_PREFIX}/stations",
            "tracks": f"{settings.API_PREFIX}/tracks",
            "assets": f"{settings.API_PREFIX}/assets",
            "trains": f"{settings.API_PREFIX}/trains",
            "maintenance_requests": f"{settings.API_PREFIX}/maintenance/requests",
            "recommendations": f"{settings.API_PREFIX}/recommendations",
            "events_track": f"{settings.API_PREFIX}/events/track",
        },
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host=settings.API_HOST, port=settings.API_PORT, reload=True)
