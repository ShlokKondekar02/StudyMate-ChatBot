"""Health check endpoints for StudyMate AI backend."""

from fastapi import APIRouter
from app.config import settings
from app.schemas import HealthResponse

router = APIRouter(tags=["Health"])


@router.get("/health", response_model=HealthResponse)
@router.get("/api/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """
    Health check endpoint reporting server status and Groq configuration state.
    """
    # Reload settings in case .env was modified while running
    settings.reload()

    is_configured = settings.is_groq_configured
    status = "ok" if is_configured else "degraded"
    message = (
        f"StudyMate AI backend is operational. Groq LLM model: '{settings.groq_model}'."
        if is_configured
        else "StudyMate AI backend is running, but GROQ_API_KEY is not configured yet. "
             "Please add your Groq key to backend/.env to enable live chat responses."
    )

    return HealthResponse(
        status=status,
        groq_configured=is_configured,
        model=settings.groq_model,
        message=message,
    )
