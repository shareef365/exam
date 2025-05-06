// This file handles storing and retrieving exam results

import { getExamData } from "./exam-data"

export interface ExamResult {
  id: string
  examId: string
  userId: string
  date: string
  timeSpent: number
  answers: Record<string, string>
  score?: number
  maxScore?: number
  correctAnswers?: number
  incorrectAnswers?: number
  unattempted?: number
  sectionResults?: {
    [section: string]: {
      score: number
      maxScore: number
      correct: number
      incorrect: number
      unattempted: number
      accuracy: number
    }
  }
}

// Function to calculate results based on answers
export function calculateResults(examId: string, answers: Record<string, string>): ExamResult {
  const examData = getExamData(examId)
  const result: ExamResult = {
    id: `result_${Date.now()}`,
    examId,
    userId: "user_1", // In a real app, this would be the actual user ID
    date: new Date().toISOString(),
    timeSpent: Math.floor(Math.random() * 10800), // Random time spent for demo
    answers,
    score: 0,
    maxScore: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    unattempted: 0,
    sectionResults: {},
  }

  // Initialize section results
  const sections = ["physics", "chemistry", "mathematics"]
  sections.forEach((section) => {
    result.sectionResults![section] = {
      score: 0,
      maxScore: 0,
      correct: 0,
      incorrect: 0,
      unattempted: 0,
      accuracy: 0,
    }
  })

  // Calculate results for each section
  sections.forEach((section) => {
    const sectionQuestions = examData.sections[section].questions
    const sectionResult = result.sectionResults![section]

    sectionResult.maxScore = sectionQuestions.length * examData.markingScheme.correct

    sectionQuestions.forEach((question) => {
      const userAnswer = answers[question.id]

      if (!userAnswer) {
        sectionResult.unattempted++
        result.unattempted!++
      } else if (userAnswer === question.correctAnswer) {
        sectionResult.correct++
        sectionResult.score += examData.markingScheme.correct
        result.correctAnswers!++
        result.score! += examData.markingScheme.correct
      } else {
        sectionResult.incorrect++
        sectionResult.score -= examData.markingScheme.incorrect
        result.incorrectAnswers!++
        result.score! -= examData.markingScheme.incorrect
      }
    })

    // Calculate accuracy
    if (sectionResult.correct + sectionResult.incorrect > 0) {
      sectionResult.accuracy = (sectionResult.correct / (sectionResult.correct + sectionResult.incorrect)) * 100
    }

    result.maxScore! += sectionResult.maxScore
  })

  return result
}

// Function to save exam result
export function saveExamResult(result: ExamResult): void {
  // In a real app, this would save to a database
  // For now, we'll save to localStorage
  const results = getExamResults()
  results.push(result)
  localStorage.setItem("examResults", JSON.stringify(results))
}

// Function to get all exam results
export function getExamResults(): ExamResult[] {
  // In a real app, this would fetch from a database
  // For now, we'll get from localStorage
  const resultsJson = localStorage.getItem("examResults")
  return resultsJson ? JSON.parse(resultsJson) : []
}

// Function to get a specific exam result
export function getExamResult(resultId: string): ExamResult | undefined {
  const results = getExamResults()
  return results.find((result) => result.id === resultId)
}

// Function to get exam results for a specific exam
export function getExamResultsByExamId(examId: string): ExamResult[] {
  const results = getExamResults()
  return results.filter((result) => result.examId === examId)
}

// Function to get exam results for a specific user
export function getExamResultsByUserId(userId: string): ExamResult[] {
  const results = getExamResults()
  return results.filter((result) => result.userId === userId)
}

// Function to get the latest exam result
export function getLatestExamResult(): ExamResult | undefined {
  const results = getExamResults()
  if (results.length === 0) return undefined

  // Sort by date (newest first) and return the first one
  return results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
}
