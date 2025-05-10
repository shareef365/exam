'use client';

import React, { useState } from 'react';

interface ExamQuestionProps {
  questionIndex: number;
  onAnswer: (answer: string) => void;
  isJEE: boolean;
}

const sampleQuestions = [
  {
    question: "A particle is moving in a circular path of radius R with constant speed v. The centripetal acceleration of the particle is:",
    type: 'mcq',
    options: [
      { id: 'a', text: 'v²/R', isCorrect: true },
      { id: 'b', text: 'v/R²', isCorrect: false },
      { id: 'c', text: 'R²/v', isCorrect: false },
      { id: 'd', text: 'R/v²', isCorrect: false }
    ]
  },
  {
    question: "If the position of a particle is given by x = t³ - 6t² + 9t + 11, then its velocity is zero at:",
    type: 'mcq',
    options: [
      { id: 'a', text: 't = 1', isCorrect: false },
      { id: 'b', text: 't = 2', isCorrect: false },
      { id: 'c', text: 't = 3', isCorrect: true },
      { id: 'd', text: 't = 4', isCorrect: false }
    ]
  },
  {
    question: "The number of solutions of the equation sin⁻¹x = 2tan⁻¹x is:",
    type: 'mcq',
    options: [
      { id: 'a', text: '0', isCorrect: false },
      { id: 'b', text: '1', isCorrect: true },
      { id: 'c', text: '2', isCorrect: false },
      { id: 'd', text: '3', isCorrect: false }
    ]
  }
];

export function ExamQuestion({ questionIndex, onAnswer, isJEE }: ExamQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const currentQuestion = sampleQuestions[questionIndex % sampleQuestions.length];

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    onAnswer(option);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="text-2xl font-semibold mb-4">Question {questionIndex + 1}</div>
      
      <div className="mb-6">
        <p className="text-lg">{currentQuestion.question}</p>
      </div>

      <div className="space-y-4">
        {currentQuestion.options.map((option) => (
          <div key={option.id} className="flex items-center">
            <input
              type="radio"
              name={`question-${questionIndex}`}
              value={option.id}
              checked={selectedOption === option.id}
              onChange={() => handleOptionSelect(option.id)}
              className="mr-2"
            />
            <label
              className={`
                flex-1 p-3 rounded-lg text-left cursor-pointer
                ${selectedOption === option.id 
                  ? (option.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')
                  : 'bg-gray-50 hover:bg-gray-100'
                }
                transition-colors
              `}
            >
              {option.id.toUpperCase()}. {option.text}
            </label>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => {
            const prev = questionIndex - 1;
            if (prev >= 0) {
              window.location.href = `/exams/jee?page=${prev}`;
            }
          }}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          disabled={questionIndex === 0}
        >
          Previous
        </button>
        <button
          onClick={() => {
            const next = questionIndex + 1;
            if (next < sampleQuestions.length) {
              window.location.href = `/exams/jee?page=${next}`;
            }
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={questionIndex === sampleQuestions.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
}
