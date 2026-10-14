import React from 'react';
import { SparklesIcon, ArrowRightIcon } from './Icons';

interface ExamplePromptsProps {
  onSelectPrompt: (promptText: string) => void;
  disabled?: boolean;
}

interface PromptItem {
  id: string;
  category: string;
  title: string;
  prompt: string;
  badgeColor: string;
}

const EXAMPLE_PROMPTS: PromptItem[] = [
  {
    id: 'dbms-norm',
    category: 'Database Systems',
    title: 'Explain DBMS Normalization',
    prompt: 'Explain DBMS normalization.',
    badgeColor: 'badge-blue',
  },
  {
    id: 'net-notes',
    category: 'Computer Networks',
    title: 'Short Exam Notes on Networks',
    prompt: 'Give me short exam notes on computer networks.',
    badgeColor: 'badge-purple',
  },
  {
    id: 'py-quiz',
    category: 'Python Programming',
    title: 'Quiz Me on Python Basics',
    prompt: 'Quiz me on Python basics.',
    badgeColor: 'badge-emerald',
  },
];

export const ExamplePrompts: React.FC<ExamplePromptsProps> = ({
  onSelectPrompt,
  disabled = false,
}) => {
  return (
    <div className="example-prompts-wrapper" id="example-prompts-section">
      <div className="example-prompts-header">
        <SparklesIcon size={16} className="text-accent" />
        <span>Try an example prompt to get started:</span>
      </div>

      <div className="example-prompts-grid">
        {EXAMPLE_PROMPTS.map((item) => (
          <button
            key={item.id}
            id={`example-prompt-${item.id}`}
            onClick={() => onSelectPrompt(item.prompt)}
            disabled={disabled}
            className="example-prompt-card"
            title={`Ask: "${item.prompt}"`}
          >
            <div className="prompt-card-top">
              <span className={`prompt-card-badge ${item.badgeColor}`}>
                {item.category}
              </span>
              <ArrowRightIcon size={14} className="prompt-card-arrow" />
            </div>
            <div className="prompt-card-text">
              <span className="prompt-quote">"{item.prompt}"</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
