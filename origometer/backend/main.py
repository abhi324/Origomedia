from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from api.routes import router as api_router
from api.admin import router as admin_router
from api.media import router as media_router
import logging
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("ORIGO Analytics API starting up")
    yield
    logger.info("ORIGO Analytics API shutting down")


app = FastAPI(
    title="ORIGO Creator Analytics API",
    description="Production-grade creator discovery and analytics for ORIGO.",
    version="1.0.0",
    lifespan=lifespan,
)

# In production the browser only ever talks to origomedia.co — Vercel's rewrite
# proxies /api/v1/* server-side. CORS is only relevant if the backend URL is
# called directly. Keep the allow-list tight; override via env when needed.
default_origins = [
    "https://origomedia.co",
    "https://www.origomedia.co",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
extra_origins = [
    o.strip()
    for o in os.getenv("CORS_ALLOWED_ORIGINS", "").split(",")
    if o.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=default_origins + extra_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    max_age=0,
)

app.include_router(api_router, prefix="/api/v1")
app.include_router(admin_router, prefix="/api/v1/admin")
app.include_router(media_router, prefix="/api/v1/media")


@app.get("/health")
async def health():
    return {"status": "ok", "service": "origo-analytics"}
