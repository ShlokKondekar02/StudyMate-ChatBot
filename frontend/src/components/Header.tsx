import React from 'react';
import { GraduationCapIcon, TrashIcon, RefreshIcon } from './Icons';

interface HeaderProps {
  modelName: string;
  isConfigured: boolean;
  isBackendOnline: boolean;
  hasMessages: boolean;
  onClearChat: () => void;
  onRefreshHealth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  modelName,
  isConfigured,
  isBackendOnline,
  hasMessages,
  onClearChat,
  onRefreshHealth,
}) => {
  return (
    <header className="app-header" id="app-header">
      <div className="header-left">
        <div className="logo-container">
          <div className="logo-icon-wrapper">
            <GraduationCapIcon size={24} className="logo-icon" />
          </div>
          <div className="logo-text">
            <div className="title-row">
              <h1 className="header-title" id="header-title">StudyMate AI</h1>
              <span className="badge-academic">Prompt Engineering</span>
            </div>
            <p className="header-subtitle" id="header-subtitle">Your personal study and exam companion</p>
          </div>
        </div>
      </div>

      <div className="header-right">
        {/* Model & System Status Badge */}
        <div
          className={`status-chip ${isBackendOnline ? (isConfigured ? 'status-ready' : 'status-warning') : 'status-offline'}`}
          id="system-status-chip"
          title={`Backend: ${isBackendOnline ? 'Online' : 'Offline'} | Groq: ${isConfigured ? 'Ready' : 'API Key Missing'}`}
        >
          <span className="status-dot"></span>
          <span className="status-text">
            {!isBackendOnline
              ? 'Backend Offline'
              : isConfigured
              ? modelName || 'Groq Llama'
              : 'Groq Key Needed'}
          </span>
          <button
            onClick={onRefreshHealth}
            className="icon-button-subtle"
            title="Refresh backend status"
            id="refresh-health-button"
            aria-label="Refresh status"
          >
            <RefreshIcon size={13} />
          </button>
        </div>

        {/* Clear Chat Button */}
        {hasMessages && (
          <button
            onClick={onClearChat}
            className="clear-chat-button"
            id="clear-chat-button"
            title="Clear all messages from the chat"
          >
            <TrashIcon size={16} />
            <span>Clear Chat</span>
          </button>
        )}
      </div>
    </header>
  );
};
