export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  model?: string;
  isError?: boolean;
}

export interface SendMessagePayload {
  message: string;
  history?: Array<{
    role: string;
    content: string;
  }>;
  temperature?: number;
}

export interface ChatApiResponse {
  response: string;
  model: string;
  role: string;
}

export interface HealthApiResponse {
  status: 'ok' | 'degraded';
  groq_configured: boolean;
  model: string;
  message: string;
}
