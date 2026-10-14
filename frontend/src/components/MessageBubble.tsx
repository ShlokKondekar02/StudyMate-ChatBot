import React, { useState } from 'react';
import { ChatMessage } from '../types';
import { BotIcon, UserIcon, CopyIcon, CheckIcon, AlertCircleIcon } from './Icons';

interface MessageBubbleProps {
  message: ChatMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const isError = Boolean(message.isError);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  // Basic formatted rendering for markdown-like text (code blocks, bold, lists, headings)
  const renderFormattedContent = (content: string) => {
    // Split content into code blocks vs regular text
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const firstLine = lines[0].trim();
        const hasLang = /^[a-zA-Z0-9_-]+$/.test(firstLine);
        const language = hasLang ? firstLine : '';
        const code = hasLang ? lines.slice(1).join('\n') : lines.join('\n');

        return (
          <div key={index} className="code-block-wrapper">
            <div className="code-block-header">
              <span className="code-block-lang">{language || 'code'}</span>
              <button
                className="code-copy-btn"
                onClick={() => {
                  navigator.clipboard.writeText(code);
                }}
                title="Copy code"
              >
                <CopyIcon size={12} />
                <span>Copy</span>
              </button>
            </div>
            <pre className="code-block-pre">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      // Format standard markdown (headings, bold, lists, inline code)
      const lines = part.split('\n');
      return (
        <div key={index} className="prose-block">
          {lines.map((line, lIndex) => {
            const trimmed = line.trim();

            if (!trimmed) {
              return <div key={lIndex} className="prose-empty-line" />;
            }

            // Headings ###
            if (trimmed.startsWith('### ')) {
              return (
                <h4 key={lIndex} className="prose-h3">
                  {formatInline(trimmed.substring(4))}
                </h4>
              );
            }
            if (trimmed.startsWith('## ')) {
              return (
                <h3 key={lIndex} className="prose-h2">
                  {formatInline(trimmed.substring(3))}
                </h3>
              );
            }
            if (trimmed.startsWith('# ')) {
              return (
                <h2 key={lIndex} className="prose-h1">
                  {formatInline(trimmed.substring(2))}
                </h2>
              );
            }

            // Bullet points
            if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
              return (
                <div key={lIndex} className="prose-bullet">
                  <span className="prose-bullet-dot">•</span>
                  <span>{formatInline(trimmed.substring(2))}</span>
                </div>
              );
            }

            // Numbered list
            const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
            if (numMatch) {
              return (
                <div key={lIndex} className="prose-numbered">
                  <span className="prose-num">{numMatch[1]}.</span>
                  <span>{formatInline(numMatch[2])}</span>
                </div>
              );
            }

            // Blockquotes
            if (trimmed.startsWith('> ')) {
              return (
                <blockquote key={lIndex} className="prose-quote">
                  {formatInline(trimmed.substring(2))}
                </blockquote>
              );
            }

            // Normal paragraph
            return (
              <p key={lIndex} className="prose-p">
                {formatInline(line)}
              </p>
            );
          })}
        </div>
      );
    });
  };

  // Helper for inline styles: bold, italics, backtick code
  const formatInline = (text: string): React.ReactNode => {
    // Tokenize by `code` and **bold**
    const tokens = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
    return tokens.map((token, i) => {
      if (token.startsWith('`') && token.endsWith('`')) {
        return (
          <code key={i} className="inline-code">
            {token.slice(1, -1)}
          </code>
        );
      }
      if (token.startsWith('**') && token.endsWith('**')) {
        return <strong key={i}>{token.slice(2, -2)}</strong>;
      }
      return token;
    });
  };

  return (
    <div
      className={`message-row ${isUser ? 'message-row-user' : 'message-row-assistant'} ${
        isError ? 'message-row-error' : ''
      }`}
      id={`message-${message.id}`}
    >
      {/* Avatar */}
      <div className={`message-avatar ${isUser ? 'avatar-user' : isError ? 'avatar-error' : 'avatar-assistant'}`}>
        {isUser ? (
          <UserIcon size={18} />
        ) : isError ? (
          <AlertCircleIcon size={18} />
        ) : (
          <BotIcon size={18} />
        )}
      </div>

      {/* Bubble Container */}
      <div className={`message-bubble-container ${isUser ? 'bubble-user' : isError ? 'bubble-error' : 'bubble-assistant'}`}>
        {/* Header / Meta */}
        <div className="message-meta-row">
          <span className="message-sender-name">
            {isUser ? 'You' : isError ? 'System Notice' : 'StudyMate AI'}
          </span>
          {message.model && !isUser && (
            <span className="message-model-tag">{message.model}</span>
          )}
          <span className="message-timestamp">{message.timestamp}</span>
        </div>

        {/* Content Body */}
        <div className="message-body">
          {renderFormattedContent(message.content)}
        </div>

        {/* Footer actions for assistant */}
        {!isUser && !isError && (
          <div className="message-bubble-footer">
            <button
              onClick={handleCopy}
              className="action-pill-button"
              title="Copy answer to clipboard"
            >
              {copied ? <CheckIcon size={13} /> : <CopyIcon size={13} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
