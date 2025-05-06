"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowUpRight, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getExamData } from "@/lib/exam-data"

export default function RecentExams({ examResults = [] }) {
  const [recentExams, setRecentExams] = useState([])

  useEffect(() => {
    // Sort exam results by date (newest first) and take the first 5
    const sortedResults = [...examResults]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
      .map((result) => {
        const examData = getExamData(result.examId)
        return {
          ...result,
          examName: examData.name,
          scorePercentage: ((result.score / result.maxScore) * 100).toFixed(1),
          date: new Date(result.date).toLocaleDateString(),
        }
      })

    setRecentExams(sortedResults)
  }, [examResults])

  if (recentExams.length === 0) {
    return (
      <div className="flex h-[200px] flex-col items-center justify-center space-y-3 rounded-md border border-dashed p-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-medium">No exams taken yet</h3>
          <p className="text-sm text-muted-foreground">Start taking exams to see your performance here.</p>
        </div>
        <Button asChild className="mt-2 bg-blue-600 hover:bg-blue-700">
          <Link href="/exams">Browse Exams</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {recentExams.map((exam) => (
        <div key={exam.id} className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">{exam.examName}</h4>
              <Badge variant={Number(exam.scorePercentage) >= 70 ? "success" : "destructive"}>
                {exam.scorePercentage}%
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {exam.score}/{exam.maxScore} points • {exam.date}
            </p>
          </div>
          <Button asChild variant="ghost" size="icon">
            <Link href={`/exams/${exam.examId}/results?session=${exam.id}`}>
              <ArrowUpRight className="h-4 w-4" />
              <span className="sr-only">View Results</span>
            </Link>
          </Button>
        </div>
      ))}
    </div>
  )
}
