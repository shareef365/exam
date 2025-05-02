"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, CheckCircle, ChevronDown, ChevronUp, Download, Home, Printer, Share2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Import exam data
import { getExamData } from "@/lib/exam-data"

export default function ResultsPage({ params }: { params: { examId: string } }) {
  const router = useRouter()
  const [showAnswers, setShowAnswers] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  // Get exam data
  const examData = getExamData(params.examId)

  // Sample results data
  const results = {
    totalQuestions: 90,
    attempted: 85,
    correct: 65,
    incorrect: 20,
    score: 195, // Assuming +3 for correct, -1 for incorrect
    maxScore: 270,
    percentile: 92.5,
    rank: 5240,
    timeTaken: "2h 45m",
    subjectWisePerformance: [
      { subject: "Physics", total: 30, attempted: 28, correct: 22, incorrect: 6, score: 60, maxScore: 90 },
      { subject: "Chemistry", total: 30, attempted: 29, correct: 20, incorrect: 9, score: 51, maxScore: 90 },
      { subject: "Mathematics", total: 30, attempted: 28, correct: 23, incorrect: 5, score: 64, maxScore: 90 },
    ],
    topicWisePerformance: [
      { topic: "Mechanics", total: 10, correct: 8, incorrect: 1, unattempted: 1, subject: "Physics" },
      { topic: "Electromagnetism", total: 8, correct: 6, incorrect: 2, unattempted: 0, subject: "Physics" },
      { topic: "Optics", total: 6, correct: 4, incorrect: 1, unattempted: 1, subject: "Physics" },
      { topic: "Modern Physics", total: 6, correct: 4, incorrect: 2, unattempted: 0, subject: "Physics" },
      { topic: "Physical Chemistry", total: 10, correct: 7, incorrect: 3, unattempted: 0, subject: "Chemistry" },
      { topic: "Organic Chemistry", total: 10, correct: 6, incorrect: 3, unattempted: 1, subject: "Chemistry" },
      { topic: "Inorganic Chemistry", total: 10, correct: 7, incorrect: 3, unattempted: 0, subject: "Chemistry" },
      { topic: "Algebra", total: 10, correct: 8, incorrect: 1, unattempted: 1, subject: "Mathematics" },
      { topic: "Calculus", total: 10, correct: 8, incorrect: 2, unattempted: 0, subject: "Mathematics" },
      { topic: "Coordinate Geometry", total: 10, correct: 7, incorrect: 2, unattempted: 1, subject: "Mathematics" },
    ],
    difficultyAnalysis: {
      easy: { total: 30, correct: 28, incorrect: 2, unattempted: 0 },
      medium: { total: 40, correct: 30, incorrect: 8, unattempted: 2 },
      hard: { total: 20, correct: 7, incorrect: 10, unattempted: 3 },
    },
    timeSpent: {
      physics: "55m",
      chemistry: "50m",
      mathematics: "60m",
    },
    comparisonWithToppers: {
      userScore: 195,
      topperScore: 245,
      averageScore: 160,
    },
  }

  // Sample questions with answers (using the first few questions from exam data)
  const questions = [
    ...examData.sections.physics.questions.slice(0, 3),
    ...examData.sections.chemistry.questions.slice(0, 3),
    ...examData.sections.mathematics.questions.slice(0, 3),
  ].map((q) => ({
    ...q,
    userAnswer:
      Math.random() > 0.3 ? q.correctAnswer : Object.keys(q.options)[Math.floor(Math.random() * q.options.length)],
  }))

  const scorePercentage = (results.score / results.maxScore) * 100

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
          <p className="text-muted-foreground">Exam taken on May 2, 2023</p>
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
              {results.score} / {results.maxScore}
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
              {results.percentile}
              <span className="ml-1 text-sm font-normal text-muted-foreground">%ile</span>
            </div>
            <p className="text-xs text-muted-foreground">Estimated Rank: {results.rank}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{((results.correct / results.attempted) * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {results.correct} correct out of {results.attempted} attempted
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Time Taken</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.timeTaken}</div>
            <p className="text-xs text-muted-foreground">
              {(
                (Number.parseInt(results.timeTaken.split("h")[0]) * 60 +
                  Number.parseInt(results.timeTaken.split(" ")[1].split("m")[0])) /
                results.totalQuestions
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
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Questions</span>
                    <span className="font-medium">{results.totalQuestions}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Attempted</span>
                    <span className="font-medium">{results.attempted}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Unattempted</span>
                    <span className="font-medium">{results.totalQuestions - results.attempted}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Correct</span>
                    <span className="font-medium text-green-600 dark:text-green-400">{results.correct}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Incorrect</span>
                    <span className="font-medium text-red-600 dark:text-red-400">{results.incorrect}</span>
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
                <div className="space-y-4">
                  {results.subjectWisePerformance.map((subject) => (
                    <div key={subject.subject} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{subject.subject}</span>
                        <span className="text-sm">
                          {subject.score}/{subject.maxScore} ({((subject.score / subject.maxScore) * 100).toFixed(1)}%)
                        </span>
                      </div>
                      <Progress value={(subject.score / subject.maxScore) * 100} className="h-2" />
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
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Easy ({results.difficultyAnalysis.easy.total} questions)</span>
                      <span className="text-sm">
                        {results.difficultyAnalysis.easy.correct}/{results.difficultyAnalysis.easy.total} (
                        {(
                          (results.difficultyAnalysis.easy.correct / results.difficultyAnalysis.easy.total) *
                          100
                        ).toFixed(1)}
                        %)
                      </span>
                    </div>
                    <Progress
                      value={(results.difficultyAnalysis.easy.correct / results.difficultyAnalysis.easy.total) * 100}
                      className="h-2 bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Medium ({results.difficultyAnalysis.medium.total} questions)</span>
                      <span className="text-sm">
                        {results.difficultyAnalysis.medium.correct}/{results.difficultyAnalysis.medium.total} (
                        {(
                          (results.difficultyAnalysis.medium.correct / results.difficultyAnalysis.medium.total) *
                          100
                        ).toFixed(1)}
                        %)
                      </span>
                    </div>
                    <Progress
                      value={
                        (results.difficultyAnalysis.medium.correct / results.difficultyAnalysis.medium.total) * 100
                      }
                      className="h-2 bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Hard ({results.difficultyAnalysis.hard.total} questions)</span>
                      <span className="text-sm">
                        {results.difficultyAnalysis.hard.correct}/{results.difficultyAnalysis.hard.total} (
                        {(
                          (results.difficultyAnalysis.hard.correct / results.difficultyAnalysis.hard.total) *
                          100
                        ).toFixed(1)}
                        %)
                      </span>
                    </div>
                    <Progress
                      value={(results.difficultyAnalysis.hard.correct / results.difficultyAnalysis.hard.total) * 100}
                      className="h-2 bg-muted"
                    />
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
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Physics</span>
                    <span className="text-sm">{results.timeSpent.physics}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Chemistry</span>
                    <span className="text-sm">{results.timeSpent.chemistry}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Mathematics</span>
                    <span className="text-sm">{results.timeSpent.mathematics}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total Time</span>
                    <span className="text-sm">{results.timeTaken}</span>
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
                      {results.comparisonWithToppers.userScore}/{results.maxScore} (
                      {((results.comparisonWithToppers.userScore / results.maxScore) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <Progress
                    value={(results.comparisonWithToppers.userScore / results.maxScore) * 100}
                    className="h-2 bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Topper's Score</span>
                    <span className="text-sm">
                      {results.comparisonWithToppers.topperScore}/{results.maxScore} (
                      {((results.comparisonWithToppers.topperScore / results.maxScore) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <Progress
                    value={(results.comparisonWithToppers.topperScore / results.maxScore) * 100}
                    className="h-2 bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Average Score</span>
                    <span className="text-sm">
                      {results.comparisonWithToppers.averageScore}/{results.maxScore} (
                      {((results.comparisonWithToppers.averageScore / results.maxScore) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <Progress
                    value={(results.comparisonWithToppers.averageScore / results.maxScore) * 100}
                    className="h-2 bg-muted"
                  />
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
                  {results.subjectWisePerformance.map((subject) => (
                    <TableRow key={subject.subject}>
                      <TableCell className="font-medium">{subject.subject}</TableCell>
                      <TableCell className="text-right">
                        {subject.attempted}/{subject.total}
                      </TableCell>
                      <TableCell className="text-right">{subject.correct}</TableCell>
                      <TableCell className="text-right">{subject.incorrect}</TableCell>
                      <TableCell className="text-right">
                        {subject.score}/{subject.maxScore}
                      </TableCell>
                      <TableCell className="text-right">
                        {((subject.correct / subject.attempted) * 100).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-3">
            {results.subjectWisePerformance.map((subject) => (
              <Card key={subject.subject}>
                <CardHeader>
                  <CardTitle>{subject.subject}</CardTitle>
                  <CardDescription>
                    Score: {subject.score}/{subject.maxScore} ({((subject.score / subject.maxScore) * 100).toFixed(1)}%)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Attempted</span>
                        <span className="text-sm font-medium">
                          {subject.attempted}/{subject.total} ({((subject.attempted / subject.total) * 100).toFixed(1)}
                          %)
                        </span>
                      </div>
                      <Progress value={(subject.attempted / subject.total) * 100} className="h-1.5" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Correct</span>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                          {subject.correct}/{subject.attempted} (
                          {((subject.correct / subject.attempted) * 100).toFixed(1)}%)
                        </span>
                      </div>
                      <Progress
                        value={(subject.correct / subject.attempted) * 100}
                        className="h-1.5 bg-green-100 dark:bg-green-900"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Incorrect</span>
                        <span className="text-sm font-medium text-red-600 dark:text-red-400">
                          {subject.incorrect}/{subject.attempted} (
                          {((subject.incorrect / subject.attempted) * 100).toFixed(1)}%)
                        </span>
                      </div>
                      <Progress
                        value={(subject.incorrect / subject.attempted) * 100}
                        className="h-1.5 bg-red-100 dark:bg-red-900"
                      />
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
                      {results.topicWisePerformance
                        .filter((topic) => topic.subject === "Physics")
                        .map((topic) => (
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
                      {results.topicWisePerformance
                        .filter((topic) => topic.subject === "Chemistry")
                        .map((topic) => (
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
                      {results.topicWisePerformance
                        .filter((topic) => topic.subject === "Mathematics")
                        .map((topic) => (
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
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
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
