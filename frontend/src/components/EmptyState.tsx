import React from 'react';
import { ExamplePrompts } from './ExamplePrompts';
import { GraduationCapIcon, BookOpenIcon, SparklesIcon } from './Icons';

interface EmptyStateProps {
  onSelectPrompt: (prompt: string) => void;
  isLoading: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onSelectPrompt,
  isLoading,
}) => {
  return (
    <div className="empty-state-container" id="welcome-container">
      <div className="empty-state-hero">
        <div className="hero-avatar">
          <GraduationCapIcon size={36} />
        </div>
        <h2 className="hero-title" id="welcome-message-heading">
          Welcome to StudyMate AI
        </h2>
        <p className="hero-description" id="welcome-message-subtext">
          Your personal study and exam companion designed for college students.
          Ask questions, get step-by-step concept explanations, generate revision summaries,
          or test your knowledge with interactive quizzes.
        </p>
      </div>

      <div className="features-preview-row">
        <div className="feature-pill">
          <BookOpenIcon size={16} />
          <span>Academic Concepts</span>
        </div>
        <div className="feature-pill">
          <SparklesIcon size={16} />
          <span>Exam Revision Notes</span>
        </div>
        <div className="feature-pill">
          <GraduationCapIcon size={16} />
          <span>Concept Quizzes</span>
        </div>
      </div>

      <ExamplePrompts onSelectPrompt={onSelectPrompt} disabled={isLoading} />
    </div>
  );
};
