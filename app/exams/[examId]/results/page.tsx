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
  RadialBarChartContainer,
  ChartRadialBar,
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
          },
          chemistry: {
            score: 51,
            maxScore: 90,
            correct: 20,
            incorrect: 9,
            unattempted: 1,
            accuracy: 69.0,
          },
          mathematics: {
            score: 84,
            maxScore: 90,
            correct: 23,
            incorrect: 5,
            unattempted: 2,
            accuracy: 82.1,
          },
        },
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

  const difficultyData = [
    { name: "Easy", score: 90, fullMark: 100 },
    { name: "Medium", score: 75, fullMark: 100 },
    { name: "Hard", score: 60, fullMark: 100 },
  ]

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
              {(scorePercentage * 0.95).toFixed(1)}
              <span className="ml-1 text-sm font-normal text-muted-foreground">%ile</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Estimated Rank: {Math.floor(5000 * (1 - scorePercentage / 100))}
            </p>
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
                      <RadialBarChartContainer
                        cx="50%"
                        cy="50%"
                        innerRadius="10%"
                        outerRadius="80%"
                        barSize={10}
                        data={difficultyData}
                      >
                        <ChartRadialBar
                          minAngle={15}
                          background
                          clockWise
                          dataKey="score"
                          label={{ position: "insideStart", fill: "#888" }}
                        />
                        <ChartLegend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
                        <ChartTooltip />
                      </RadialBarChartContainer>
                    </ChartContent>
                  </Chart>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Easy (30 questions)</span>
                      <span className="text-sm">27/30 (90%)</span>
                    </div>
                    <Progress value={90} className="h-2 bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Medium (40 questions)</span>
                      <span className="text-sm">30/40 (75%)</span>
                    </div>
                    <Progress value={75} className="h-2 bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Hard (20 questions)</span>
                      <span className="text-sm">12/20 (60%)</span>
                    </div>
                    <Progress value={60} className="h-2 bg-muted" />
                  </div>
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
                          data={subjectData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {subjectData.map((entry, index) => (
                            <ChartCell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </ChartPie>
                        <PieChartTooltip />
                      </PieChartContainer>
                    </ChartContent>
                  </Chart>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Physics</span>
                    <span className="text-sm">{Math.floor((examResult.timeSpent * 0.3) / 60)} minutes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Chemistry</span>
                    <span className="text-sm">{Math.floor((examResult.timeSpent * 0.35) / 60)} minutes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Mathematics</span>
                    <span className="text-sm">{Math.floor((examResult.timeSpent * 0.35) / 60)} minutes</span>
                  </div>
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
                      <TableCell className="text-right">{data.accuracy.toFixed(1)}%</TableCell>
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
                      {[
                        { topic: "Mechanics", total: 10, correct: 8, incorrect: 1, unattempted: 1 },
                        { topic: "Electromagnetism", total: 8, correct: 6, incorrect: 2, unattempted: 0 },
                        { topic: "Optics", total: 6, correct: 4, incorrect: 1, unattempted: 1 },
                        { topic: "Modern Physics", total: 6, correct: 4, incorrect: 2, unattempted: 0 },
                      ].map((topic) => (
                        <TableRow key={topic.topic}>
                          <TableCell className="font-medium">{topic.topic}</TableCell>
                          <TableCell className="text-right">{topic.total}</TableCell>
                          <TableCell className="text-right">{topic.correct}</TableCell>
                          <TableCell className="text-right">{topic.incorrect}</TableCell>
                          <TableCell className="text-right">{topic.unattempted}</TableCell>
                          <TableCell className="text-right">
                            {topic.correct + topic.incorrect > 0
                              ? ((topic.correct / (topic.correct + topic.incorrect)) * 100).toFixed(1)
                              : 0}
                            %
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
                      {[
                        { topic: "Physical Chemistry", total: 10, correct: 7, incorrect: 3, unattempted: 0 },
                        { topic: "Organic Chemistry", total: 10, correct: 6, incorrect: 3, unattempted: 1 },
                        { topic: "Inorganic Chemistry", total: 10, correct: 7, incorrect: 3, unattempted: 0 },
                      ].map((topic) => (
                        <TableRow key={topic.topic}>
                          <TableCell className="font-medium">{topic.topic}</TableCell>
                          <TableCell className="text-right">{topic.total}</TableCell>
                          <TableCell className="text-right">{topic.correct}</TableCell>
                          <TableCell className="text-right">{topic.incorrect}</TableCell>
                          <TableCell className="text-right">{topic.unattempted}</TableCell>
                          <TableCell className="text-right">
                            {topic.correct + topic.incorrect > 0
                              ? ((topic.correct / (topic.correct + topic.incorrect)) * 100).toFixed(1)
                              : 0}
                            %
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
                      {[
                        { topic: "Algebra", total: 10, correct: 8, incorrect: 1, unattempted: 1 },
                        { topic: "Calculus", total: 10, correct: 8, incorrect: 2, unattempted: 0 },
                        { topic: "Coordinate Geometry", total: 10, correct: 7, incorrect: 2, unattempted: 1 },
                      ].map((topic) => (
                        <TableRow key={topic.topic}>
                          <TableCell className="font-medium">{topic.topic}</TableCell>
                          <TableCell className="text-right">{topic.total}</TableCell>
                          <TableCell className="text-right">{topic.correct}</TableCell>
                          <TableCell className="text-right">{topic.incorrect}</TableCell>
                          <TableCell className="text-right">{topic.unattempted}</TableCell>
                          <TableCell className="text-right">
                            {topic.correct + topic.incorrect > 0
                              ? ((topic.correct / (topic.correct + topic.incorrect)) * 100).toFixed(1)
                              : 0}
                            %
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
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
