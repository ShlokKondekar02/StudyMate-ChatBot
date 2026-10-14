import React, { useState, useEffect, useCallback } from 'react';
import { ChatMessage } from './types';
import { getHealthStatus, sendChatMessage } from './api';
import { Header } from './components/Header';
import { StatusBanner } from './components/StatusBanner';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';

export const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastFailedPrompt, setLastFailedPrompt] = useState<string | null>(null);

  // Backend & Groq Health State
  const [isBackendOnline, setIsBackendOnline] = useState<boolean>(false);
  const [isGroqConfigured, setIsGroqConfigured] = useState<boolean>(false);
  const [groqModel, setGroqModel] = useState<string>('llama-3.3-70b-versatile');
  const [healthMessage, setHealthMessage] = useState<string>('');

  // Helper to format current time
  const getFormattedTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Check backend health
  const checkHealth = useCallback(async () => {
    try {
      const data = await getHealthStatus();
      setIsBackendOnline(true);
      setIsGroqConfigured(data.groq_configured);
      setGroqModel(data.model || 'llama-3.3-70b-versatile');
      setHealthMessage(data.message);
    } catch {
      setIsBackendOnline(false);
      setIsGroqConfigured(false);
      setHealthMessage('Unable to reach backend server on http://localhost:8000');
    }
  }, []);

  useEffect(() => {
    checkHealth();
    // Poll health periodically every 15s to automatically detect when key is added
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  // Send a message to the backend
  const handleSendMessage = async (textToSend?: string) => {
    const prompt = (textToSend ?? input).trim();
    if (!prompt || isLoading) return;

    // Reset error state and clear input field
    setErrorMessage(null);
    setLastFailedPrompt(null);
    setInput('');

    // Append user message to chat immediately
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: prompt,
      timestamp: getFormattedTime(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Build conversation history (exclude system errors and limit last 8 turns)
      const validHistory = updatedMessages
        .filter((m) => !m.isError)
        .slice(-8)
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const result = await sendChatMessage({
        message: prompt,
        history: validHistory,
      });

      // Append assistant response
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: result.response,
        timestamp: getFormattedTime(),
        model: result.model,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'An error occurred while sending message.';
      setErrorMessage(errMsg);
      setLastFailedPrompt(prompt);

      // If backend returned 503 or Groq key missing error, record as structured assistant notification
      if (errMsg.toLowerCase().includes('groq api key') || errMsg.toLowerCase().includes('not configured')) {
        const errorBubble: ChatMessage = {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ **Groq API Key Required:**\n\n${errMsg}\n\nTo resolve this:\n1. Open or create \`backend/.env\`\n2. Add: \`GROQ_API_KEY=gsk_your_actual_key\`\n3. You can get a free key instantly from [console.groq.com/keys](https://console.groq.com/keys)`,
          timestamp: getFormattedTime(),
          isError: true,
        };
        setMessages((prev) => [...prev, errorBubble]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Clear chat
  const handleClearChat = () => {
    setMessages([]);
    setErrorMessage(null);
    setLastFailedPrompt(null);
  };

  // Retry last failed prompt
  const handleRetry = () => {
    if (lastFailedPrompt) {
      handleSendMessage(lastFailedPrompt);
    }
  };

  return (
    <div className="app-shell" id="app-root">
      {/* Background glow effects */}
      <div className="bg-glow bg-glow-top-left" />
      <div className="bg-glow bg-glow-bottom-right" />

      {/* Main Container Card */}
      <div className="app-card" id="app-card">
        {/* Header */}
        <Header
          modelName={groqModel}
          isConfigured={isGroqConfigured}
          isBackendOnline={isBackendOnline}
          hasMessages={messages.length > 0}
          onClearChat={handleClearChat}
          onRefreshHealth={checkHealth}
        />

        {/* Status Alert Banner */}
        <StatusBanner
          isConfigured={isGroqConfigured}
          isBackendOnline={isBackendOnline}
          healthMessage={healthMessage}
        />

        {/* Scrollable Chat Area */}
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          errorMessage={errorMessage}
          onSelectPrompt={(prompt) => handleSendMessage(prompt)}
          onRetry={handleRetry}
          onDismissError={() => setErrorMessage(null)}
        />

        {/* Input Bar */}
        <ChatInput
          input={input}
          setInput={setInput}
          onSend={() => handleSendMessage()}
          isLoading={isLoading}
          disabled={!isBackendOnline}
        />
      </div>
    </div>
  );
};

export default App;
