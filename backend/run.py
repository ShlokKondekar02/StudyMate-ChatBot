"""Convenience entry point for running the StudyMate AI backend."""

import uvicorn
from app.config import settings

if __name__ == "__main__":
    print(f"Starting StudyMate AI Backend on http://{settings.host}:{settings.port}")
    print(f"Interactive Swagger Docs available at http://{settings.host}:{settings.port}/docs")
    print(f"Configured Groq Model: {settings.groq_model}")
    print(f"Groq API Key Configured: {'YES' if settings.is_groq_configured else 'NO (Set GROQ_API_KEY in .env)'}")
    
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=True
    )
