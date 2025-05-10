'use client';

import React, { useState, useEffect } from 'react';
import { ExamTimer } from '@/components/exam/timer';
import { ExamNavigation } from '@/components/exam/navigation';
import { ExamQuestion } from '@/components/exam/question';
import { ExamHeader } from '@/components/exam/header';

import Image from 'next/image';

export default function JEEExam() {
  const [timeRemaining, setTimeRemaining] = useState(180); // 3 hours in minutes
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [section, setSection] = useState('Physics');
  const [sections] = useState([
    { name: 'Physics', questions: 30 },
    { name: 'Chemistry', questions: 30 },
    { name: 'Mathematics', questions: 30 }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => prev - 1);
    }, 60000); // Decrease every minute

    return () => clearInterval(timer);
  }, []);

  const handleQuestionChange = (index) => {
    setCurrentQuestion(index);
  };

  const handleResponse = (questionId, answer) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const getSectionIndex = () => {
    let count = 0;
    for (let i = 0; i < sections.length; i++) {
      if (currentQuestion < count + sections[i].questions) {
        return i;
      }
      count += sections[i].questions;
    }
    return 0;
  };

  useEffect(() => {
    const sectionIndex = getSectionIndex();
    setSection(sections[sectionIndex].name);
  }, [currentQuestion]);

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Top Info Bar */}
      <div className="bg-white border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between px-6 py-2 text-sm">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-2">
            <Image src="/images/avatar-placeholder.png" alt="Avatar" width={40} height={40} />
          </div>
          <div>
            <div><span className="font-semibold">Candidate Name :</span> <span className="text-orange-600">[Your Name]</span></div>
            <div><span className="font-semibold">Exam Name :</span> JEE-Main</div>
            <div><span className="font-semibold">Subject Name :</span> <span className="text-blue-600 underline cursor-pointer">4050367: B PLANNING 6th JAN 2020 Shift 2 Set 2</span></div>
          </div>
        </div>
        <div className="flex flex-col md:items-end mt-2 md:mt-0">
          <div className="flex items-center space-x-2">
            <span className="font-semibold">Remaining Time</span>
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-mono text-lg border border-blue-300">02:59:53</span>
          </div>
          <select className="mt-2 md:mt-1 border border-gray-300 rounded px-2 py-1 text-xs">
            <option>English</option>
            <option>Hindi</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto mt-4 gap-6">
        {/* Left: Question Area */}
        <div className="flex-1 bg-white rounded shadow-md p-6 min-h-[520px]">
          {/* Question Number and Navigation */}
          <div className="flex items-center justify-between mb-2">
            <button className="text-xl px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">&lt;&lt;</button>
            <span className="text-lg font-semibold">3.</span>
            <button className="text-xl px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">&gt;&gt;</button>
          </div>

          {/* Question Text */}
          <div className="mb-4 text-lg">248</div>
          <div className="mb-4 text-lg">4. <span className="ml-2">256</span></div>

          {/* Options */}
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div><input type="radio" name="opt" className="mr-2" /> 1)</div>
            <div><input type="radio" name="opt" className="mr-2" /> 2)</div>
            <div><input type="radio" name="opt" className="mr-2" /> 3)</div>
            <div><input type="radio" name="opt" className="mr-2" /> 4)</div>
          </div>

          <hr className="my-4" />

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mb-3">
            <button className="bg-green-500 text-white px-4 py-2 rounded font-semibold">SAVE &amp; NEXT</button>
            <button className="bg-white border border-gray-400 px-4 py-2 rounded font-semibold">CLEAR</button>
            <button className="bg-orange-400 text-white px-4 py-2 rounded font-semibold">SAVE &amp; MARK FOR REVIEW</button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded font-semibold">MARK FOR REVIEW &amp; NEXT</button>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button className="bg-gray-200 px-4 py-2 rounded">&lt;&lt; BACK</button>
            <button className="bg-gray-200 px-4 py-2 rounded">NEXT &gt;&gt;</button>
            <button className="bg-green-600 text-white px-6 py-2 rounded font-bold">SUBMIT</button>
          </div>
        </div>

        {/* Right: Palette & Question Grid */}
        <div className="w-full lg:w-80 bg-white rounded shadow-md p-4">
          {/* Status Palette */}
          <div className="mb-4 border-b pb-3">
            <div className="font-semibold mb-2">Legend</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center"><span className="w-6 h-6 rounded-full bg-gray-300 border mr-2 flex items-center justify-center">99</span> Not Visited</div>
              <div className="flex items-center"><span className="w-6 h-6 rounded-full bg-orange-500 text-white border mr-2 flex items-center justify-center">1</span> Not Answered</div>
              <div className="flex items-center"><span className="w-6 h-6 rounded-full bg-green-500 text-white border mr-2 flex items-center justify-center">0</span> Answered</div>
              <div className="flex items-center"><span className="w-6 h-6 rounded-full bg-purple-700 text-white border mr-2 flex items-center justify-center">0</span> Marked for Review</div>
              <div className="flex items-center col-span-2"><span className="w-6 h-6 rounded-full bg-indigo-700 text-white border mr-2 flex items-center justify-center">0</span> Answered &amp; Marked for Review (will be considered for evaluation)</div>
            </div>
          </div>
          {/* Question Grid */}
          <div className="grid grid-cols-7 gap-2 text-xs">
            {Array.from({ length: 56 }, (_, i) => (
              <button
                key={i}
                className={`w-7 h-7 rounded-full border text-center font-bold ${i === 0 ? 'bg-orange-500 text-white' : 'bg-gray-100'}`}
              >
                {String(i + 1).padStart(2, '0')}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
