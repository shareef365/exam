'use client';

import React from 'react';

interface ExamTimerProps {
  timeRemaining: number;
  onTimeUp: () => void;
}

export function ExamTimer({ timeRemaining, onTimeUp }: ExamTimerProps) {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(remainingMinutes).padStart(2, '0')}`;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="text-3xl font-bold text-center text-red-600">
        Time Remaining: {formatTime(timeRemaining)}
      </div>
    </div>
  );
}
