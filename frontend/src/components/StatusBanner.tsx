import React, { useState } from 'react';
import { AlertCircleIcon, CopyIcon, CheckIcon } from './Icons';

interface StatusBannerProps {
  isConfigured: boolean;
  isBackendOnline: boolean;
  healthMessage: string;
}

export const StatusBanner: React.FC<StatusBannerProps> = ({
  isConfigured,
  isBackendOnline,
  healthMessage,
}) => {
  const [copied, setCopied] = useState(false);

  // If everything is online and configured, don't show the banner
  if (isBackendOnline && isConfigured) {
    return null;
  }

  const copyConfigSnippet = () => {
    navigator.clipboard.writeText('GROQ_API_KEY=gsk_your_key_here\nGROQ_MODEL=llama-3.3-70b-versatile');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="status-banner-container" id="status-banner">
      <div className="status-banner-content">
        <div className="status-banner-icon">
          <AlertCircleIcon size={20} />
        </div>
        <div className="status-banner-text">
          <div className="status-banner-title">
            {!isBackendOnline
              ? 'Backend Server Not Detected'
              : 'Groq API Key Setup Required'}
          </div>
          <div className="status-banner-desc">
            {!isBackendOnline ? (
              <span>
                Please start the FastAPI backend server with <code>python run.py</code> inside the <code>backend/</code> directory.
              </span>
            ) : (
              <span>
                {healthMessage || 'To receive live AI responses, add your free Groq API key.'}
                {' '}Get one at{' '}
                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noreferrer"
                  className="banner-link"
                >
                  console.groq.com/keys
                </a>
                {' '}and paste it into <code>backend/.env</code>.
              </span>
            )}
          </div>
        </div>

        {isBackendOnline && !isConfigured && (
          <button
            onClick={copyConfigSnippet}
            className="copy-snippet-btn"
            title="Copy .env template"
            id="copy-env-snippet-btn"
          >
            {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
            <span>{copied ? 'Copied!' : 'Copy .env snippet'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
