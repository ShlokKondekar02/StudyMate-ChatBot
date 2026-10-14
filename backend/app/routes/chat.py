"""Chat endpoints for StudyMate AI."""

import logging
from fastapi import APIRouter, HTTPException, status
from app.config import settings
from app.schemas import ChatRequest, ChatResponse
from app.services.groq_service import groq_service, GroqConfigurationError

logger = logging.getLogger("studymate.chat_route")
router = APIRouter(prefix="/api", tags=["Chat"])


@router.post(
    "/chat",
    response_model=ChatResponse,
    status_code=status.HTTP_200_OK,
    responses={
        503: {"description": "Groq API key not configured"},
        429: {"description": "Groq rate limit reached"},
        502: {"description": "Groq upstream API error"},
    }
)
async def chat_endpoint(request: ChatRequest) -> ChatResponse:
    """
    Handle user chat message, communicate with Groq LLM API, and return the response.

    - Accepts user's message and optional conversation history.
    - Uses configured Groq Llama model.
    - Never exposes API keys or internal secrets.
    - Returns structured error messages if API key is missing or upstream fails.
    """
    # Reload settings in case .env was recently saved
    settings.reload()

    if not request.message or not request.message.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message field cannot be empty."
        )

    try:
        result = groq_service.generate_chat_response(
            message=request.message,
            history=request.history,
            temperature=request.temperature or 0.7,
        )

        return ChatResponse(
            response=result["response"],
            model=result["model"],
            role="assistant",
        )

    except GroqConfigurationError as e:
        logger.warning("Chat attempted without Groq API key: %s", str(e))
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(e),
        )

    except RuntimeError as e:
        err_msg = str(e)
        logger.error("Chat generation failed: %s", err_msg)

        if "rate limit" in err_msg.lower():
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=err_msg,
            )
        elif "invalid groq api key" in err_msg.lower():
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=err_msg,
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=err_msg,
            )

    except Exception as e:
        logger.exception("Unexpected server error in chat route")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An internal server error occurred while processing your study request."
        )
