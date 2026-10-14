import React, { useRef, useEffect } from 'react';
import { SendIcon } from './Icons';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  onSend,
  isLoading,
  disabled = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height to accommodate multi-line input up to 160px
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 160);
      textareaRef.current.style.height = `${Math.max(newHeight, 52)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && input.trim() && !disabled) {
        onSend();
      }
    }
  };

  const isSendDisabled = isLoading || !input.trim() || disabled;

  return (
    <div className="chat-input-container" id="chat-input-wrapper">
      <div className="input-box-wrapper">
        <textarea
          ref={textareaRef}
          id="chat-textarea-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question, request revision notes, or try a quiz... (Enter to send)"
          disabled={disabled || isLoading}
          rows={1}
          className="chat-textarea"
          aria-label="Study prompt input"
        />

        <button
          onClick={onSend}
          disabled={isSendDisabled}
          id="chat-send-button"
          className={`send-button ${isSendDisabled ? 'send-button-disabled' : 'send-button-active'}`}
          title={isSendDisabled ? 'Type a question to send' : 'Send message (Enter)'}
          aria-label="Send message"
        >
          {isLoading ? (
            <div className="send-spinner" id="send-spinner" />
          ) : (
            <SendIcon size={18} />
          )}
        </button>
      </div>

      <div className="input-hint-row">
        <span className="input-hint">
          <strong>Enter</strong> to send • <strong>Shift + Enter</strong> for new line
        </span>
        <span className="powered-hint">
          Powered by <strong>Groq Cloud</strong> Llama LLM
        </span>
      </div>
    </div>
  );
};
