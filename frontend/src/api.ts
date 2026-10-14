import { ChatApiResponse, HealthApiResponse, SendMessagePayload } from './types';

const API_BASE_URL = '';

/**
 * Fetch the health and configuration status of the backend.
 */
export async function getHealthStatus(): Promise<HealthApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Server returned ${response.status}`);
    }
    return await response.json();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Backend is unreachable';
    throw new Error(message);
  }
}

/**
 * Send a chat prompt to the FastAPI backend.
 */
export async function sendChatMessage(payload: SendMessagePayload): Promise<ChatApiResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (err: unknown) {
    const networkMsg = err instanceof Error ? err.message : 'Network error';
    throw new Error(
      `Failed to connect to backend server. Make sure the FastAPI backend is running on port 8000. (${networkMsg})`
    );
  }

  if (!response.ok) {
    let errorDetail = '';
    try {
      const errorJson = await response.json();
      errorDetail = errorJson.detail || errorJson.error || JSON.stringify(errorJson);
    } catch {
      errorDetail = `HTTP ${response.status} ${response.statusText}`;
    }

    if (response.status === 503) {
      throw new Error(
        errorDetail || 'Groq API key is not configured. Please set GROQ_API_KEY in backend/.env.'
      );
    }

    if (response.status === 429) {
      throw new Error('Groq rate limit reached. Please wait a moment before sending another prompt.');
    }

    if (response.status === 401) {
      throw new Error('Invalid Groq API key. Please check your GROQ_API_KEY in backend/.env.');
    }

    throw new Error(errorDetail || `Request failed with status ${response.status}`);
  }

  return await response.json();
}
