"""Pydantic schemas for request and response validation."""

from typing import List, Optional
from pydantic import BaseModel, Field, field_validator


class ChatMessage(BaseModel):
    """Single chat message representing role and text content."""
    role: str = Field(..., description="Message author role: 'user', 'assistant', or 'system'")
    content: str = Field(..., description="Message text content")

    @field_validator("role")
    @classmethod
    def validate_role(cls, value: str) -> str:
        allowed = {"user", "assistant", "system"}
        normalized = value.strip().lower()
        if normalized not in allowed:
            raise ValueError(f"Invalid role '{value}'. Must be one of: {allowed}")
        return normalized

    @field_validator("content")
    @classmethod
    def validate_content(cls, value: str) -> str:
        if not value or not value.strip():
            raise ValueError("Message content cannot be empty.")
        return value.strip()


class ChatRequest(BaseModel):
    """Payload for POST /api/chat."""
    message: str = Field(..., min_length=1, description="The user's query or prompt")
    history: Optional[List[ChatMessage]] = Field(
        default_factory=list,
        description="Optional list of previous messages in the conversation for multi-turn context"
    )
    temperature: Optional[float] = Field(
        default=0.7,
        ge=0.0,
        le=2.0,
        description="Sampling temperature for response generation"
    )

    @field_validator("message")
    @classmethod
    def validate_message(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("Chat message must not be blank.")
        return cleaned


class ChatResponse(BaseModel):
    """Response returned by POST /api/chat."""
    response: str = Field(..., description="The AI assistant's generated response")
    model: str = Field(..., description="The Groq LLM model name used")
    role: str = Field(default="assistant", description="Message role")


class HealthResponse(BaseModel):
    """Response returned by GET /api/health."""
    status: str = Field(..., description="Service status ('ok' or 'degraded')")
    groq_configured: bool = Field(..., description="Whether a valid Groq API key is present")
    model: str = Field(..., description="Configured Groq model")
    message: str = Field(..., description="Setup status or health message")


class ErrorResponse(BaseModel):
    """Standardized error response payload."""
    error: str
    detail: Optional[str] = None
    code: str
