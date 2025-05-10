"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowRight, CheckCircle, ChevronDown, ChevronUp, Download, Home, Printer, Share2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import {
  Chart,
  ChartContent,
  PieChartContainer,
  ChartPie,
  ChartCell,
  PieChartTooltip,
  BarChartContainer,
  ChartBar,
  ChartXAxis,
  ChartYAxis,
  ChartLegend,
  ChartTooltip,
  LineChartContainer,
  ChartLine,
  ChartGrid,
} from "@/components/ui/chart"

// Import exam data and results
import { getExamData } from "@/lib/exam-data"
import { getExamResult, getLatestExamResult } from "@/lib/exam-results"

export default function ResultsPage({ params }: { params: { examId: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [showAnswers, setShowAnswers] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [examResult, setExamResult] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Get session ID from URL or use latest result
  const sessionId = searchParams.get("session")

  // Get exam data
  const examData = getExamData(params.examId)

  useEffect(() => {
    // Get exam result based on session ID or latest result
    let result
    if (sessionId) {
      result = getExamResult(sessionId)
    } else {
      result = getLatestExamResult()
    }

    if (result) {
      setExamResult(result)
    } else {
      // If no result found, create a sample result for demo purposes
      const sampleResult = {
        id: "sample_result",
        examId: params.examId,
        userId: "user_1",
        date: new Date().toISOString(),
        timeSpent: 9000, // 2h 30m
        answers: {},
        score: 195,
        maxScore: 270,
        correctAnswers: 65,
        incorrectAnswers: 20,
        unattempted: 5,
        sectionResults: {
          physics: {
            score: 60,
            maxScore: 90,
            correct: 22,
            incorrect: 6,
            unattempted: 2,
            accuracy: 78.6,
            topicResults: {
              mechanics: { correct: 8, incorrect: 1, unattempted: 1, total: 10 },
              electromagnetism: { correct: 6, incorrect: 2, unattempted: 0, total: 8 },
              optics: { correct: 4, incorrect: 1, unattempted: 1, total: 6 },
              modernPhysics: { correct: 4, incorrect: 2, unattempted: 0, total: 6 },
            },
            timeSpent: 3000,
          },
          chemistry: {
            score: 51,
            maxScore: 90,
            correct: 20,
            incorrect: 9,
            unattempted: 1,
            accuracy: 69.0,
            topicResults: {
              physicalChemistry: { correct: 7, incorrect: 3, unattempted: 0, total: 10 },
              organicChemistry: { correct: 6, incorrect: 3, unattempted: 1, total: 10 },
              inorganicChemistry: { correct: 7, incorrect: 3, unattempted: 0, total: 10 },
            },
            timeSpent: 3150,
          },
          mathematics: {
            score: 84,
            maxScore: 90,
            correct: 23,
            incorrect: 5,
            unattempted: 2,
            accuracy: 82.1,
            topicResults: {
              algebra: { correct: 8, incorrect: 1, unattempted: 1, total: 10 },
              calculus: { correct: 8, incorrect: 2, unattempted: 0, total: 10 },
              coordinateGeometry: { correct: 7, incorrect: 2, unattempted: 1, total: 10 },
            },
            timeSpent: 2850,
          },
        },
        difficultyResults: {
          easy: { correct: 27, incorrect: 3, unattempted: 0, total: 30, accuracy: 90 },
          medium: { correct: 30, incorrect: 10, unattempted: 0, total: 40, accuracy: 75 },
          hard: { correct: 8, incorrect: 7, unattempted: 5, total: 20, accuracy: 53.3 },
        },
        timeDistribution: {
          physics: 3000,
          chemistry: 3150,
          mathematics: 2850,
        },
        questionTimes: {
          // Sample data for time spent per question
          1: 45,
          2: 60,
          3: 90,
          4: 30,
          5: 120,
          // ... more questions
        },
        percentile: 92.5,
        rank: 750,
        previousAttempts: [
          { date: "2023-01-15", score: 180, maxScore: 270, percentile: 85.2 },
          { date: "2023-02-20", score: 189, maxScore: 270, percentile: 88.7 },
          { date: "2023-03-25", score: 195, maxScore: 270, percentile: 92.5 },
        ],
      }
      setExamResult(sampleResult)

      toast({
        title: "Demo Mode",
        description: "Showing sample results as no exam data was found.",
      })
    }

    setLoading(false)
  }, [sessionId, params.examId, toast])

  if (loading) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading results...</p>
        </div>
      </div>
    )
  }

  // Sample questions with answers (using the first few questions from exam data)
  const questions = [
    ...examData.sections.physics.questions.slice(0, 3),
    ...examData.sections.chemistry.questions.slice(0, 3),
    ...examData.sections.mathematics.questions.slice(0, 3),
  ].map((q) => ({
    ...q,
    userAnswer: examResult.answers[q.id] || null,
  }))

  const scorePercentage = (examResult.score / examResult.maxScore) * 100

  // Data for pie charts
  const attemptedData = [
    { name: "Correct", value: examResult.correctAnswers, color: "#22c55e" },
    { name: "Incorrect", value: examResult.incorrectAnswers, color: "#ef4444" },
    { name: "Unattempted", value: examResult.unattempted, color: "#94a3b8" },
  ]

  const subjectData = Object.entries(examResult.sectionResults).map(([key, value]: [string, any]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: value.score,
    maxScore: value.maxScore,
    accuracy: value.accuracy,
    color: key === "physics" ? "#3b82f6" : key === "chemistry" ? "#8b5cf6" : "#ec4899",
  }))

  // Data for difficulty analysis
  const difficultyData = examResult.difficultyResults
    ? [
        {
          name: "Easy",
          score: examResult.difficultyResults?.easy?.accuracy || 90,
          fullMark: 100,
          correct: examResult.difficultyResults?.easy?.correct || 27,
          total: examResult.difficultyResults?.easy?.total || 30,
          color: "#4caf50",
        },
        {
          name: "Medium",
          score: examResult.difficultyResults.medium.accuracy,
          fullMark: 100,
          correct: examResult.difficultyResults.medium.correct,
          total: examResult.difficultyResults.medium.total,
          color: "#ff9800",
        },
        {
          name: "Hard",
          score: examResult.difficultyResults.hard.accuracy,
          fullMark: 100,
          correct: examResult.difficultyResults.hard.correct,
          total: examResult.difficultyResults.hard.total,
          color: "#f44336",
        },
      ]
    : [
        {
          name: "Easy",
          score: 90,
          fullMark: 100,
          correct: 27,
          total: 30,
          color: "#4caf50",
        },
        {
          name: "Medium",
          score: 75,
          fullMark: 100,
          correct: 30,
          total: 40,
          color: "#ff9800",
        },
        {
          name: "Hard",
          score: 60,
          fullMark: 100,
          correct: 12,
          total: 20,
          color: "#f44336",
        },
      ]

  // Data for time distribution
  const timeDistributionData = examResult.timeDistribution
    ? Object.entries(examResult.timeDistribution).map(([subject, time]: [string, any]) => ({
        name: subject.charAt(0).toUpperCase() + subject.slice(1),
        value: time,
        percent: time / examResult.timeSpent,
        color: subject === "physics" ? "#3b82f6" : subject === "chemistry" ? "#8b5cf6" : "#ec4899",
      }))
    : Object.entries(examResult.sectionResults).map(([subject, data]: [string, any]) => ({
        name: subject.charAt(0).toUpperCase() + subject.slice(1),
        value: data.timeSpent || Math.floor(examResult.timeSpent / 3),
        percent: (data.timeSpent || Math.floor(examResult.timeSpent / 3)) / examResult.timeSpent,
        color: subject === "physics" ? "#3b82f6" : subject === "chemistry" ? "#8b5cf6" : "#ec4899",
      }))

  // Data for progress over time
  const progressData = examResult.previousAttempts
    ? examResult.previousAttempts.map((attempt: any, index: number) => ({
        name: `Attempt ${index + 1}`,
        date: new Date(attempt.date).toLocaleDateString(),
        score: attempt.score,
        percentile: attempt.percentile,
      }))
    : [
        {
          name: "Previous",
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          score: Math.floor(examResult.score * 0.9),
          percentile: examResult.percentile ? examResult.percentile - 5 : 85,
        },
      ]

  // Add current attempt to progress data
  progressData.push({
    name: "Current",
    date: new Date(examResult.date).toLocaleDateString(),
    score: examResult.score,
    percentile: examResult.percentile || (examResult.score / examResult.maxScore) * 100 * 0.95,
  })

  // Data for topic-wise analysis
  const getTopicData = (section: string) => {
    const sectionData = examResult.sectionResults[section]
    if (!sectionData || !sectionData.topicResults) {
      // Provide default topic data if topicResults doesn't exist
      if (section === "physics") {
        return [
          { topic: "Mechanics", total: 10, correct: 8, incorrect: 1, unattempted: 1, accuracy: 88.9 },
          { topic: "Electromagnetism", total: 8, correct: 6, incorrect: 2, unattempted: 0, accuracy: 75 },
          { topic: "Optics", total: 6, correct: 4, incorrect: 1, unattempted: 1, accuracy: 80 },
          { topic: "Modern Physics", total: 6, correct: 4, incorrect: 2, unattempted: 0, accuracy: 66.7 },
        ]
      } else if (section === "chemistry") {
        return [
          { topic: "Physical Chemistry", total: 10, correct: 7, incorrect: 3, unattempted: 0, accuracy: 70 },
          { topic: "Organic Chemistry", total: 10, correct: 6, incorrect: 3, unattempted: 1, accuracy: 66.7 },
          { topic: "Inorganic Chemistry", total: 10, correct: 7, incorrect: 3, unattempted: 0, accuracy: 70 },
        ]
      } else {
        return [
          { topic: "Algebra", total: 10, correct: 8, incorrect: 1, unattempted: 1, accuracy: 88.9 },
          { topic: "Calculus", total: 10, correct: 8, incorrect: 2, unattempted: 0, accuracy: 80 },
          { topic: "Coordinate Geometry", total: 10, correct: 7, incorrect: 2, unattempted: 1, accuracy: 77.8 },
        ]
      }
    }

    return Object.entries(sectionData.topicResults).map(([topic, data]: [string, any]) => ({
      topic: topic.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()),
      total: data.total,
      correct: data.correct,
      incorrect: data.incorrect,
      unattempted: data.unattempted,
      accuracy:
        data.correct && data.correct + data.incorrect > 0 ? (data.correct / (data.correct + data.incorrect)) * 100 : 0,
    }))
  }

  const COLORS = ["#22c55e", "#ef4444", "#94a3b8", "#3b82f6", "#8b5cf6", "#ec4899"]

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <div className="mb-8 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Your Exam Results</h1>
        <p className="mt-4 max-w-[600px] text-muted-foreground">
          Here's how you performed in the {examData.name} exam. Review your answers and learn from your mistakes.
        </p>
      </div>

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Performance Summary</h2>
          <p className="text-muted-foreground">Exam taken on {new Date(examResult.date).toLocaleDateString()}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Share via Email</DropdownMenuItem>
              <DropdownMenuItem>Share via WhatsApp</DropdownMenuItem>
              <DropdownMenuItem>Copy Link</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {examResult.score} / {examResult.maxScore}
              <span className="ml-2 text-sm font-normal text-muted-foreground">({scorePercentage.toFixed(1)}%)</span>
            </div>
            <Progress value={scorePercentage} className="mt-2 h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Percentile & Rank</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {examResult.percentile ? examResult.percentile.toFixed(1) : "90.0"}
              <span className="ml-1 text-sm font-normal text-muted-foreground">%ile</span>
            </div>
            <p className="text-xs text-muted-foreground">Estimated Rank: {examResult.rank}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {examResult.correctAnswers + examResult.incorrectAnswers > 0
                ? (
                    (examResult.correctAnswers / (examResult.correctAnswers + examResult.incorrectAnswers)) *
                    100
                  ).toFixed(1)
                : "0"}
              %
            </div>
            <p className="text-xs text-muted-foreground">
              {examResult.correctAnswers} correct out of {examResult.correctAnswers + examResult.incorrectAnswers}{" "}
              attempted
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Time Taken</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(examResult.timeSpent / 3600)}h {Math.floor((examResult.timeSpent % 3600) / 60)}m
            </div>
            <p className="text-xs text-muted-foreground">
              {(
                examResult.timeSpent /
                60 /
                (examResult.correctAnswers + examResult.incorrectAnswers + examResult.unattempted)
              ).toFixed(1)}{" "}
              min per question
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-12">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subject-analysis">Subject Analysis</TabsTrigger>
          <TabsTrigger value="topic-analysis">Topic Analysis</TabsTrigger>
          <TabsTrigger value="questions">Question Review</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>Your overall performance in the exam</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="space-y-4 w-full md:w-1/2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Questions</span>
                      <span className="font-medium">
                        {examResult.correctAnswers + examResult.incorrectAnswers + examResult.unattempted}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Attempted</span>
                      <span className="font-medium">{examResult.correctAnswers + examResult.incorrectAnswers}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Unattempted</span>
                      <span className="font-medium">{examResult.unattempted}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Correct</span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        {examResult.correctAnswers}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Incorrect</span>
                      <span className="font-medium text-red-600 dark:text-red-400">{examResult.incorrectAnswers}</span>
                    </div>
                  </div>

                  <div className="w-full md:w-1/2 h-[200px] mt-4 md:mt-0">
                    <Chart>
                      <ChartContent width="100%" height="100%">
                        <PieChartContainer>
                          <ChartPie
                            data={attemptedData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            dataKey="value"
                          >
                            {attemptedData.map((entry, index) => (
                              <ChartCell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </ChartPie>
                          <PieChartTooltip />
                          <ChartLegend />
                        </PieChartContainer>
                      </ChartContent>
                    </Chart>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subject-wise Performance</CardTitle>
                <CardDescription>See how you performed in each subject</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] mb-4">
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
                        <ChartBar dataKey="value" fill="#3b82f6" name="Score" />
                      </BarChartContainer>
                    </ChartContent>
                  </Chart>
                </div>

                <div className="space-y-4 mt-4">
                  {Object.entries(examResult.sectionResults).map(([subject, data]: [string, any]) => (
                    <div key={subject} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{subject.charAt(0).toUpperCase() + subject.slice(1)}</span>
                        <span className="text-sm">
                          {data.score}/{data.maxScore} ({((data.score / data.maxScore) * 100).toFixed(1)}%)
                        </span>
                      </div>
                      <Progress value={(data.score / data.maxScore) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Difficulty Analysis</CardTitle>
                <CardDescription>Your performance across different difficulty levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] mb-4">
                  <Chart>
                    <ChartContent width="100%" height="100%">
                      <BarChartContainer
                        data={difficultyData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <ChartXAxis dataKey="name" />
                        <ChartYAxis />
                        <ChartTooltip />
                        <ChartBar dataKey="score" name="Accuracy %" radius={[4, 4, 0, 0]}>
                          {difficultyData.map((entry, index) => (
                            <ChartCell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </ChartBar>
                      </BarChartContainer>
                    </ChartContent>
                  </Chart>
                </div>

                <div className="space-y-4">
                  {difficultyData.map((item) => (
                    <div key={item.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {item.name} ({item.total} questions)
                        </span>
                        <span className="text-sm">
                          {item.correct}/{item.total} ({item.score.toFixed(1)}%)
                        </span>
                      </div>
                      <Progress
                        value={item.score}
                        className="h-2 bg-muted"
                        indicatorClassName={
                          item.name === "Easy"
                            ? "bg-green-500"
                            : item.name === "Medium"
                              ? "bg-orange-500"
                              : "bg-red-500"
                        }
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Time Management</CardTitle>
                <CardDescription>How you spent your time during the exam</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] mb-4">
                  <Chart>
                    <ChartContent width="100%" height="100%">
                      <PieChartContainer>
                        <ChartPie
                          data={timeDistributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {timeDistributionData.map((entry, index) => (
                            <ChartCell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </ChartPie>
                        <PieChartTooltip />
                      </PieChartContainer>
                    </ChartContent>
                  </Chart>
                </div>

                <div className="space-y-4">
                  {timeDistributionData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-sm">{Math.floor(item.value / 60)} minutes</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total Time</span>
                    <span className="text-sm">
                      {Math.floor(examResult.timeSpent / 3600)}h {Math.floor((examResult.timeSpent % 3600) / 60)}m
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Score Comparison</CardTitle>
                <CardDescription>How your score compares with others</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Your Score</span>
                      <span className="text-sm">
                        {examResult.score}/{examResult.maxScore} (
                        {((examResult.score / examResult.maxScore) * 100).toFixed(1)}%)
                      </span>
                    </div>
                    <Progress value={(examResult.score / examResult.maxScore) * 100} className="h-2 bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Topper's Score</span>
                      <span className="text-sm">
                        {Math.round(examResult.maxScore * 0.9)}/{examResult.maxScore} ({(90).toFixed(1)}%)
                      </span>
                    </div>
                    <Progress value={90} className="h-2 bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Average Score</span>
                      <span className="text-sm">
                        {Math.round(examResult.maxScore * 0.6)}/{examResult.maxScore} ({(60).toFixed(1)}%)
                      </span>
                    </div>
                    <Progress value={60} className="h-2 bg-muted" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progress Over Time</CardTitle>
                <CardDescription>Your improvement across multiple attempts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <Chart>
                    <ChartContent width="100%" height="100%">
                      <LineChartContainer
                        data={progressData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <ChartXAxis dataKey="name" />
                        <ChartYAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                        <ChartYAxis yAxisId="right" orientation="right" stroke="#8b5cf6" />
                        <ChartTooltip />
                        <ChartLegend />
                        <ChartLine
                          yAxisId="left"
                          type="monotone"
                          dataKey="score"
                          stroke="#3b82f6"
                          activeDot={{ r: 8 }}
                          name="Score"
                        />
                        <ChartLine
                          yAxisId="right"
                          type="monotone"
                          dataKey="percentile"
                          stroke="#8b5cf6"
                          name="Percentile"
                        />
                        <ChartGrid strokeDasharray="3 3" />
                      </LineChartContainer>
                    </ChartContent>
                  </Chart>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="subject-analysis" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Subject-wise Analysis</CardTitle>
              <CardDescription>Detailed breakdown of your performance in each subject</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead className="text-right">Attempted</TableHead>
                    <TableHead className="text-right">Correct</TableHead>
                    <TableHead className="text-right">Incorrect</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                    <TableHead className="text-right">Accuracy</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(examResult.sectionResults).map(([subject, data]: [string, any]) => (
                    <TableRow key={subject}>
                      <TableCell className="font-medium">
                        {subject.charAt(0).toUpperCase() + subject.slice(1)}
                      </TableCell>
                      <TableCell className="text-right">
                        {data.correct + data.incorrect}/{data.correct + data.incorrect + data.unattempted}
                      </TableCell>
                      <TableCell className="text-right">{data.correct}</TableCell>
                      <TableCell className="text-right">{data.incorrect}</TableCell>
                      <TableCell className="text-right">
                        {data.score}/{data.maxScore}
                      </TableCell>
                      <TableCell className="text-right">{data.accuracy ? data.accuracy.toFixed(1) : "0"}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-3">
            {Object.entries(examResult.sectionResults).map(([subject, data]: [string, any]) => (
              <Card key={subject}>
                <CardHeader>
                  <CardTitle>{subject.charAt(0).toUpperCase() + subject.slice(1)}</CardTitle>
                  <CardDescription>
                    Score: {data.score}/{data.maxScore} ({((data.score / data.maxScore) * 100).toFixed(1)}%)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[150px] mb-4">
                    <Chart>
                      <ChartContent width="100%" height="100%">
                        <PieChartContainer>
                          <ChartPie
                            data={[
                              { name: "Correct", value: data.correct, color: "#22c55e" },
                              { name: "Incorrect", value: data.incorrect, color: "#ef4444" },
                              { name: "Unattempted", value: data.unattempted, color: "#94a3b8" },
                            ]}
                            cx="50%"
                            cy="50%"
                            outerRadius={60}
                            dataKey="value"
                          >
                            <ChartCell fill="#22c55e" />
                            <ChartCell fill="#ef4444" />
                            <ChartCell fill="#94a3b8" />
                          </ChartPie>
                          <PieChartTooltip />
                          <ChartLegend />
                        </PieChartContainer>
                      </ChartContent>
                    </Chart>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Attempted</span>
                        <span className="text-sm font-medium">
                          {data.correct + data.incorrect}/{data.correct + data.incorrect + data.unattempted} (
                          {(
                            ((data.correct + data.incorrect) / (data.correct + data.incorrect + data.unattempted)) *
                            100
                          ).toFixed(1)}
                          %)
                        </span>
                      </div>
                      <Progress
                        value={
                          ((data.correct + data.incorrect) / (data.correct + data.incorrect + data.unattempted)) * 100
                        }
                        className="h-1.5"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Correct</span>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                          {data.correct}/{data.correct + data.incorrect} ({data.accuracy.toFixed(1)}%)
                        </span>
                      </div>
                      <Progress value={data.accuracy} className="h-1.5 bg-green-100 dark:bg-green-900" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Incorrect</span>
                        <span className="text-sm font-medium text-red-600 dark:text-red-400">
                          {data.incorrect}/{data.correct + data.incorrect} ({(100 - data.accuracy).toFixed(1)}%)
                        </span>
                      </div>
                      <Progress value={100 - data.accuracy} className="h-1.5 bg-red-100 dark:bg-red-900" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {Object.entries(examResult.sectionResults).map(([subject, data]: [string, any]) => (
              <Card key={`${subject}-time`}>
                <CardHeader>
                  <CardTitle>{subject.charAt(0).toUpperCase() + subject.slice(1)} Time Analysis</CardTitle>
                  <CardDescription>
                    Time spent: {Math.floor((data.timeSpent || examResult.timeSpent / 3) / 60)} minutes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[150px] mb-4">
                    <Chart>
                      <ChartContent width="100%" height="100%">
                        <PieChartContainer>
                          <ChartPie
                            data={[
                              {
                                name: "Time per Correct",
                                value:
                                  data.correct > 0 ? (data.timeSpent || examResult.timeSpent / 3) / data.correct : 0,
                                color: "#22c55e",
                                display: `${((data.timeSpent || examResult.timeSpent / 3) / data.correct / 60).toFixed(1)} min/q`,
                              },
                              {
                                name: "Time per Incorrect",
                                value:
                                  data.incorrect > 0
                                    ? (data.timeSpent || examResult.timeSpent / 3) / data.incorrect
                                    : 0,
                                color: "#ef4444",
                                display: `${((data.timeSpent || examResult.timeSpent / 3) / data.incorrect / 60).toFixed(1)} min/q`,
                              },
                              {
                                name: "Unused Time",
                                value: data.unattempted > 0 ? (data.timeSpent || examResult.timeSpent / 3) * 0.1 : 0,
                                color: "#94a3b8",
                                display: "Unused",
                              },
                            ]}
                            cx="50%"
                            cy="50%"
                            outerRadius={60}
                            dataKey="value"
                          >
                            <ChartCell fill="#22c55e" />
                            <ChartCell fill="#ef4444" />
                            <ChartCell fill="#94a3b8" />
                          </ChartPie>
                          <ChartTooltip />
                          <ChartLegend />
                        </PieChartContainer>
                      </ChartContent>
                    </Chart>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Average time per question:</span>
                      <span className="font-medium">
                        {(
                          (data.timeSpent || examResult.timeSpent / 3) /
                          (data.correct + data.incorrect + data.unattempted) /
                          60
                        ).toFixed(1)}{" "}
                        min
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Time per correct answer:</span>
                      <span className="font-medium text-green-600">
                        {data.correct > 0
                          ? ((data.timeSpent || examResult.timeSpent / 3) / data.correct / 60).toFixed(1)
                          : "N/A"}{" "}
                        min
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Time per incorrect answer:</span>
                      <span className="font-medium text-red-600">
                        {data.incorrect > 0
                          ? ((data.timeSpent || examResult.timeSpent / 3) / data.incorrect / 60).toFixed(1)
                          : "N/A"}{" "}
                        min
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="topic-analysis" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Topic-wise Analysis</CardTitle>
              <CardDescription>Detailed breakdown of your performance by topics</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="physics" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="physics">Physics</TabsTrigger>
                  <TabsTrigger value="chemistry">Chemistry</TabsTrigger>
                  <TabsTrigger value="mathematics">Mathematics</TabsTrigger>
                </TabsList>
                <TabsContent value="physics" className="pt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Topic</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">Correct</TableHead>
                        <TableHead className="text-right">Incorrect</TableHead>
                        <TableHead className="text-right">Unattempted</TableHead>
                        <TableHead className="text-right">Accuracy</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getTopicData("physics").map((topic) => (
                        <TableRow key={topic.topic}>
                          <TableCell className="font-medium">{topic.topic}</TableCell>
                          <TableCell className="text-right">{topic.total}</TableCell>
                          <TableCell className="text-right">{topic.correct}</TableCell>
                          <TableCell className="text-right">{topic.incorrect}</TableCell>
                          <TableCell className="text-right">{topic.unattempted}</TableCell>
                          <TableCell className="text-right">{topic.accuracy.toFixed(1)}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Topic Performance Visualization</h3>
                    <div className="h-[300px]">
                      <Chart>
                        <ChartContent width="100%" height="100%">
                          <BarChartContainer
                            data={getTopicData("physics")}
                            margin={{
                              top: 20,
                              right: 30,
                              left: 20,
                              bottom: 70,
                            }}
                          >
                            <ChartXAxis dataKey="topic" angle={-45} textAnchor="end" height={70} />
                            <ChartYAxis />
                            <ChartTooltip />
                            <ChartLegend />
                            <ChartBar dataKey="correct" stackId="a" fill="#22c55e" name="Correct" />
                            <ChartBar dataKey="incorrect" stackId="a" fill="#ef4444" name="Incorrect" />
                            <ChartBar dataKey="unattempted" stackId="a" fill="#94a3b8" name="Unattempted" />
                          </BarChartContainer>
                        </ChartContent>
                      </Chart>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="chemistry" className="pt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Topic</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">Correct</TableHead>
                        <TableHead className="text-right">Incorrect</TableHead>
                        <TableHead className="text-right">Unattempted</TableHead>
                        <TableHead className="text-right">Accuracy</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getTopicData("chemistry").map((topic) => (
                        <TableRow key={topic.topic}>
                          <TableCell className="font-medium">{topic.topic}</TableCell>
                          <TableCell className="text-right">{topic.total}</TableCell>
                          <TableCell className="text-right">{topic.correct}</TableCell>
                          <TableCell className="text-right">{topic.incorrect}</TableCell>
                          <TableCell className="text-right">{topic.unattempted}</TableCell>
                          <TableCell className="text-right">{topic.accuracy.toFixed(1)}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Topic Performance Visualization</h3>
                    <div className="h-[300px]">
                      <Chart>
                        <ChartContent width="100%" height="100%">
                          <BarChartContainer
                            data={getTopicData("chemistry")}
                            margin={{
                              top: 20,
                              right: 30,
                              left: 20,
                              bottom: 70,
                            }}
                          >
                            <ChartXAxis dataKey="topic" angle={-45} textAnchor="end" height={70} />
                            <ChartYAxis />
                            <ChartTooltip />
                            <ChartLegend />
                            <ChartBar dataKey="correct" stackId="a" fill="#22c55e" name="Correct" />
                            <ChartBar dataKey="incorrect" stackId="a" fill="#ef4444" name="Incorrect" />
                            <ChartBar dataKey="unattempted" stackId="a" fill="#94a3b8" name="Unattempted" />
                          </BarChartContainer>
                        </ChartContent>
                      </Chart>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="mathematics" className="pt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Topic</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">Correct</TableHead>
                        <TableHead className="text-right">Incorrect</TableHead>
                        <TableHead className="text-right">Unattempted</TableHead>
                        <TableHead className="text-right">Accuracy</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getTopicData("mathematics").map((topic) => (
                        <TableRow key={topic.topic}>
                          <TableCell className="font-medium">{topic.topic}</TableCell>
                          <TableCell className="text-right">{topic.total}</TableCell>
                          <TableCell className="text-right">{topic.correct}</TableCell>
                          <TableCell className="text-right">{topic.incorrect}</TableCell>
                          <TableCell className="text-right">{topic.unattempted}</TableCell>
                          <TableCell className="text-right">{topic.accuracy.toFixed(1)}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Topic Performance Visualization</h3>
                    <div className="h-[300px]">
                      <Chart>
                        <ChartContent width="100%" height="100%">
                          <BarChartContainer
                            data={getTopicData("mathematics")}
                            margin={{
                              top: 20,
                              right: 30,
                              left: 20,
                              bottom: 70,
                            }}
                          >
                            <ChartXAxis dataKey="topic" angle={-45} textAnchor="end" height={70} />
                            <ChartYAxis />
                            <ChartTooltip />
                            <ChartLegend />
                            <ChartBar dataKey="correct" stackId="a" fill="#22c55e" name="Correct" />
                            <ChartBar dataKey="incorrect" stackId="a" fill="#ef4444" name="Incorrect" />
                            <ChartBar dataKey="unattempted" stackId="a" fill="#94a3b8" name="Unattempted" />
                          </BarChartContainer>
                        </ChartContent>
                      </Chart>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Strength & Weakness Analysis</CardTitle>
              <CardDescription>Identify your strong and weak areas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-medium mb-4">Strong Topics</h3>
                  <div className="space-y-4">
                    {[...getTopicData("physics"), ...getTopicData("chemistry"), ...getTopicData("mathematics")]
                      .sort((a, b) => b.accuracy - a.accuracy)
                      .slice(0, 5)
                      .map((topic, index) => (
                        <div key={`strength-${index}`} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{topic.topic}</span>
                            <span className="text-sm text-green-600">{topic.accuracy.toFixed(1)}%</span>
                          </div>
                          <Progress
                            value={topic.accuracy}
                            className="h-2 bg-green-100"
                            indicatorClassName="bg-green-600"
                          />
                        </div>
                      ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Weak Topics</h3>
                  <div className="space-y-4">
                    {[...getTopicData("physics"), ...getTopicData("chemistry"), ...getTopicData("mathematics")]
                      .filter((topic) => topic.correct + topic.incorrect > 0) // Only include attempted topics
                      .sort((a, b) => a.accuracy - b.accuracy)
                      .slice(0, 5)
                      .map((topic, index) => (
                        <div key={`weakness-${index}`} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{topic.topic}</span>
                            <span className="text-sm text-red-600">{topic.accuracy.toFixed(1)}%</span>
                          </div>
                          <Progress value={topic.accuracy} className="h-2 bg-red-100" indicatorClassName="bg-red-600" />
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Recommendations</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <h4 className="font-medium text-blue-800 mb-2">Focus on Weak Areas</h4>
                    <p className="text-sm text-blue-700">
                      Based on your performance, we recommend focusing on the following topics:
                    </p>
                    <ul className="list-disc list-inside mt-2 text-sm text-blue-700">
                      {[...getTopicData("physics"), ...getTopicData("chemistry"), ...getTopicData("mathematics")]
                        .filter((topic) => topic.correct + topic.incorrect > 0)
                        .sort((a, b) => a.accuracy - b.accuracy)
                        .slice(0, 3)
                        .map((topic, index) => (
                          <li key={`rec-${index}`}>{topic.topic} - Practice more questions and review concepts</li>
                        ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                    <h4 className="font-medium text-green-800 mb-2">Time Management</h4>
                    <p className="text-sm text-green-700">
                      You spent an average of{" "}
                      {(
                        examResult.timeSpent /
                        60 /
                        (examResult.correctAnswers + examResult.incorrectAnswers + examResult.unattempted)
                      ).toFixed(1)}{" "}
                      minutes per question. Try to reduce time on easier questions to have more time for difficult ones.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-6 pt-6">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Question Analysis</h2>
            <Button variant="outline" onClick={() => setShowAnswers(!showAnswers)}>
              {showAnswers ? "Hide Answers" : "Show Answers"}
              {showAnswers ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
            </Button>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {questions.map((question) => (
              <AccordionItem key={question.id} value={`question-${question.id}`}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-start text-left">
                    <div className="mr-4 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full">
                      {question.userAnswer === question.correctAnswer ? (
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      ) : question.userAnswer ? (
                        <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-gray-300"></div>
                      )}
                    </div>
                    <div>
                      <span className="font-medium">Q{question.id}. </span>
                      <span className="text-muted-foreground">{question.question}</span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="ml-10 space-y-4">
                    {question.image && (
                      <div className="flex justify-center">
                        <img
                          src={question.image || "/placeholder.svg"}
                          alt="Question diagram"
                          className="max-h-[200px] rounded-md border"
                        />
                      </div>
                    )}

                    <div className="grid gap-2">
                      {question.options.map((option) => (
                        <div
                          key={option.id}
                          className={`rounded-lg border p-3 ${
                            showAnswers && option.id === question.correctAnswer
                              ? "border-green-600 bg-green-50 dark:border-green-400 dark:bg-green-950"
                              : option.id === question.userAnswer && option.id !== question.correctAnswer
                                ? "border-red-600 bg-red-50 dark:border-red-400 dark:bg-red-950"
                                : option.id === question.userAnswer
                                  ? "border-blue-600 bg-blue-50 dark:border-blue-400 dark:bg-blue-950"
                                  : ""
                          }`}
                        >
                          <div className="flex items-center">
                            <div className="mr-2 flex h-5 w-5 items-center justify-center rounded-full border text-xs">
                              {option.id.toUpperCase()}
                            </div>
                            <span>{option.text}</span>
                            {showAnswers && option.id === question.correctAnswer && (
                              <CheckCircle className="ml-auto h-4 w-4 text-green-600 dark:text-green-400" />
                            )}
                            {option.id === question.userAnswer && option.id !== question.correctAnswer && (
                              <XCircle className="ml-auto h-4 w-4 text-red-600 dark:text-red-400" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {showAnswers && (
                      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
                        <h4 className="mb-2 font-medium">Explanation</h4>
                        <p className="text-sm text-muted-foreground">{question.explanation}</p>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>
      </Tabs>

      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Button asChild variant="outline" size="lg">
          <Link href="/dashboard">
            <Home className="mr-2 h-4 w-4" />
            Go to Dashboard
          </Link>
        </Button>
        <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
          <Link href={`/exams/${params.examId}/simulator`}>
            Try Again <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
