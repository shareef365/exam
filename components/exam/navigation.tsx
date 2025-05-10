'use client';

import React from 'react';

interface ExamNavigationProps {
  totalQuestions: number;
  currentQuestion: number;
  onChange: (index: number) => void;
  responses: Record<number, string>;
}

export function ExamNavigation({ 
  totalQuestions, 
  currentQuestion, 
  onChange, 
  responses 
}: ExamNavigationProps) {
  const renderQuestionButton = (index: number) => {
    const isAttempted = responses.hasOwnProperty(index);
    const isCurrent = index === currentQuestion;

    return (
      <button
        key={index}
        onClick={() => onChange(index)}
        className={`
          w-8 h-8 rounded-full text-center mx-1 my-1
          ${isCurrent ? 'bg-blue-500 text-white' : 'bg-gray-200'}
          ${isAttempted && !isCurrent ? 'bg-green-200' : ''}
          hover:bg-gray-300 transition-colors
        `}
      >
        {index + 1}
      </button>
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md sticky top-0">
      <div className="text-lg font-semibold mb-4">Question Navigation</div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: totalQuestions }, (_, i) => renderQuestionButton(i))}
      </div>
    </div>
  );
}
