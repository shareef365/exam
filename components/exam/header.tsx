'use client';

import React from 'react';

interface ExamHeaderProps {
  examName: string;
}

export function ExamHeader({ examName }: ExamHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <img src="/images/jee-logo.png" alt="JEE Logo" className="h-12 w-auto mr-4" />
            <div className="text-xl font-bold">{examName}</div>
          </div>
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
              Submit
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
