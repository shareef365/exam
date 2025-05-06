"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, BookOpen, Clock, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

// Sample recommended exams
const sampleRecommendedExams = [
  {
    id: "jee-main",
    name: "JEE Main Full Mock Test",
    difficulty: "Medium",
    duration: "3 hours",
    relevance: 95,
    description: "Complete mock test with all sections to prepare for JEE Main.",
  },
  {
    id: "jee-advanced",
    name: "JEE Advanced Physics",
    difficulty: "Hard",
    duration: "1 hour",
    relevance: 85,
    description: "Focus on improving your physics score with this targeted test.",
  },
  {
    id: "neet",
    name: "NEET Chemistry Practice",
    difficulty: "Medium",
    duration: "1 hour 30 minutes",
    relevance: 80,
    description: "Practice chemistry questions for NEET preparation.",
  },
]

export default function RecommendedExams({ examResults = [] }) {
  const [recommendedExams, setRecommendedExams] = useState([])

  useEffect(() => {
    // In a real app, this would analyze exam results to make personalized recommendations
    // For now, we'll use sample data
    setRecommendedExams(sampleRecommendedExams)
  }, [examResults])

  return (
    <div className="space-y-4">
      {recommendedExams.map((exam) => (
        <div key={exam.id} className="rounded-lg border p-4">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="font-medium">{exam.name}</h4>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="h-3.5 w-3.5 text-green-500" />
              <span className="text-green-500">{exam.relevance}% match</span>
            </div>
          </div>
          <p className="mb-3 text-sm text-muted-foreground">{exam.description}</p>
          <div className="mb-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              <span>{exam.difficulty}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{exam.duration}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Progress value={exam.relevance} className="w-1/2 h-1.5" />
            <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Link href={`/exams/${exam.id}`}>
                Start <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
