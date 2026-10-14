import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { MessageBubble } from './MessageBubble';
import { EmptyState } from './EmptyState';
import { BotIcon, AlertCircleIcon, RefreshIcon } from './Icons';

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
  errorMessage: string | null;
  onSelectPrompt: (prompt: string) => void;
  onRetry: () => void;
  onDismissError: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  isLoading,
  errorMessage,
  onSelectPrompt,
  onRetry,
  onDismissError,
}) => {
  const scrollEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll whenever messages or loading state changes
  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, errorMessage]);

  return (
    <div className="chat-window-container" id="chat-window">
      {messages.length === 0 ? (
        <EmptyState onSelectPrompt={onSelectPrompt} isLoading={isLoading} />
      ) : (
        <div className="messages-list" id="messages-list">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="message-row message-row-assistant" id="loading-indicator-row">
              <div className="message-avatar avatar-assistant">
                <BotIcon size={18} />
              </div>
              <div className="message-bubble-container bubble-assistant bubble-loading">
                <div className="loading-dots-container">
                  <span className="loading-dot dot-1" />
                  <span className="loading-dot dot-2" />
                  <span className="loading-dot dot-3" />
                </div>
                <span className="loading-label">StudyMate AI is analyzing and drafting your answer...</span>
              </div>
            </div>
          )}

          {/* Inline Error Alert if latest request failed */}
          {errorMessage && (
            <div className="error-alert-card" id="chat-error-alert">
              <div className="error-alert-left">
                <AlertCircleIcon size={20} className="error-icon" />
                <div className="error-alert-content">
                  <span className="error-alert-title">Request Failed</span>
                  <p className="error-alert-message">{errorMessage}</p>
                </div>
              </div>
              <div className="error-alert-actions">
                <button
                  onClick={onRetry}
                  className="error-retry-btn"
                  id="error-retry-btn"
                  title="Retry previous message"
                >
                  <RefreshIcon size={14} />
                  <span>Retry</span>
                </button>
                <button
                  onClick={onDismissError}
                  className="error-dismiss-btn"
                  id="error-dismiss-btn"
                  title="Dismiss error message"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          <div ref={scrollEndRef} />
        </div>
      )}
    </div>
  );
};
