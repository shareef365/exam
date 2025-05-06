"use client"

import { useState, useEffect } from "react"
import {
  Chart,
  ChartContent,
  BarChartContainer,
  ChartBar,
  ChartXAxis,
  ChartYAxis,
  ChartTooltip,
  ChartLegend,
  PieChartContainer,
  ChartPie,
  ChartCell,
} from "@/components/ui/chart"
import { Progress } from "@/components/ui/progress"

export default function SubjectPerformance({ examResults = [], showTrends = false }) {
  const [subjectData, setSubjectData] = useState([])

  useEffect(() => {
    if (examResults.length === 0) {
      // Default data if no exam results
      setSubjectData([
        { name: "Physics", score: 65, maxScore: 100, accuracy: 65, color: "#3b82f6" },
        { name: "Chemistry", score: 48, maxScore: 100, accuracy: 48, color: "#8b5cf6" },
        { name: "Mathematics", score: 72, maxScore: 100, accuracy: 72, color: "#ec4899" },
      ])
      return
    }

    // Calculate average scores by subject
    const subjectScores = {}
    const subjectMaxScores = {}
    const subjectAccuracy = {}
    const subjectCount = {}

    examResults.forEach((result) => {
      if (!result.sectionResults) return

      Object.entries(result.sectionResults).forEach(([subject, data]) => {
        const subjectName = subject.charAt(0).toUpperCase() + subject.slice(1)

        if (!subjectScores[subjectName]) {
          subjectScores[subjectName] = 0
          subjectMaxScores[subjectName] = 0
          subjectAccuracy[subjectName] = 0
          subjectCount[subjectName] = 0
        }

        subjectScores[subjectName] += data.score
        subjectMaxScores[subjectName] += data.maxScore
        subjectAccuracy[subjectName] += data.accuracy
        subjectCount[subjectName]++
      })
    })

    const colors = {
      Physics: "#3b82f6",
      Chemistry: "#8b5cf6",
      Mathematics: "#ec4899",
    }

    const processedData = Object.keys(subjectScores).map((subject) => ({
      name: subject,
      score: Math.round(subjectScores[subject] / subjectCount[subject]),
      maxScore: Math.round(subjectMaxScores[subject] / subjectCount[subject]),
      accuracy: Math.round(subjectAccuracy[subject] / subjectCount[subject]),
      color: colors[subject] || "#64748b",
    }))

    setSubjectData(processedData)
  }, [examResults])

  if (showTrends) {
    return (
      <Chart>
        <ChartContent width="100%" height="100%">
          <BarChartContainer
            data={subjectData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <ChartXAxis dataKey="name" />
            <ChartYAxis />
            <ChartTooltip />
            <ChartLegend />
            <ChartBar dataKey="accuracy" name="Accuracy %" fill="#3b82f6" />
          </BarChartContainer>
        </ChartContent>
      </Chart>
    )
  }

  return (
    <div className="space-y-6">
      <div className="h-[200px]">
        <Chart>
          <ChartContent width="100%" height="100%">
            <PieChartContainer>
              <ChartPie
                data={subjectData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                dataKey="score"
                nameKey="name"
              >
                {subjectData.map((entry, index) => (
                  <ChartCell key={`cell-${index}`} fill={entry.color} />
                ))}
              </ChartPie>
              <ChartTooltip />
              <ChartLegend />
            </PieChartContainer>
          </ChartContent>
        </Chart>
      </div>

      <div className="space-y-4">
        {subjectData.map((subject) => (
          <div key={subject.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">{subject.name}</span>
              <span className="text-sm">
                {subject.score}/{subject.maxScore} ({subject.accuracy}%)
              </span>
            </div>
            <Progress value={subject.accuracy} className="h-2" />
          </div>
        ))}
      </div>
    </div>
  )
}
