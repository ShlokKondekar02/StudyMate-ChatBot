"""FastAPI application entry point for StudyMate AI."""

import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes.health import router as health_router
from app.routes.chat import router as chat_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - [%(levelname)s] - %(name)s - %(message)s"
)
logger = logging.getLogger("studymate.main")

app = FastAPI(
    title="StudyMate AI API",
    description="Backend service for StudyMate AI college study and exam companion",
    version="1.0.0",
)

# Configure CORS so Vite frontend can communicate seamlessly
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins + ["*"],  # Allow configured origins and local network dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register route modules
app.include_router(health_router)
app.include_router(chat_router)


@app.get("/")
async def root():
    """Welcome endpoint providing basic API details and links."""
    return {
        "app": "StudyMate AI Backend",
        "version": "1.0.0",
        "status": "online",
        "docs_url": "/docs",
        "health_check": "/api/health",
        "chat_endpoint": "/api/chat",
        "model": settings.groq_model,
        "groq_configured": settings.is_groq_configured,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.host, port=settings.port, reload=True)
