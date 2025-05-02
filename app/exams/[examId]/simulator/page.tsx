"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Clock, Flag, HelpCircle, Info, Maximize2, Minimize2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

// Import exam data based on exam ID
import { getExamData } from "@/lib/exam-data"

export default function ExamSimulator({ params }: { params: { examId: string } }) {
  const router = useRouter()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentSection, setCurrentSection] = useState("physics")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, Record<number, string>>>({
    physics: {},
    chemistry: {},
    mathematics: {},
  })
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, number[]>>({
    physics: [],
    chemistry: [],
    mathematics: [],
  })
  const [timeLeft, setTimeLeft] = useState(10800) // 3 hours in seconds
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false)
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false)
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(true)
  const [isTimerWarning, setIsTimerWarning] = useState(false)
  const [showCalculator, setShowCalculator] = useState(false)
  const examContainerRef = useRef<HTMLDivElement>(null)

  // Get exam data based on exam ID
  const examData = getExamData(params.examId)

  // Format time as hh:mm:ss
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`
  }

  // Timer effect
  useEffect(() => {
    if (isInstructionsOpen) return // Don't start timer until instructions are closed

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          // Auto-submit when time is up
          handleSubmit()
          return 0
        }

        // Show warning when 15 minutes are left
        if (prev === 900) {
          setIsTimerWarning(true)
        }

        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isInstructionsOpen])

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      examContainerRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Listen for fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  const handleAnswerSelect = (questionId: number, answerId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentSection]: {
        ...prev[currentSection],
        [questionId]: answerId,
      },
    }))
  }

  const handleFlagQuestion = (questionId: number) => {
    setFlaggedQuestions((prev) => {
      const sectionFlags = prev[currentSection] || []
      if (sectionFlags.includes(questionId)) {
        return {
          ...prev,
          [currentSection]: sectionFlags.filter((id) => id !== questionId),
        }
      } else {
        return {
          ...prev,
          [currentSection]: [...sectionFlags, questionId],
        }
      }
    })
  }

  const handleNextQuestion = () => {
    const sectionQuestions = examData.sections[currentSection].questions
    if (currentQuestion < sectionQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else if (currentSection === "physics") {
      setCurrentSection("chemistry")
      setCurrentQuestion(0)
    } else if (currentSection === "chemistry") {
      setCurrentSection("mathematics")
      setCurrentQuestion(0)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    } else if (currentSection === "chemistry") {
      setCurrentSection("physics")
      setCurrentQuestion(examData.sections.physics.questions.length - 1)
    } else if (currentSection === "mathematics") {
      setCurrentSection("chemistry")
      setCurrentQuestion(examData.sections.chemistry.questions.length - 1)
    }
  }

  const handleSubmit = () => {
    // In a real app, you would submit the answers to the server
    // For now, we'll just redirect to a results page
    router.push(`/exams/${params.examId}/results`)
  }

  const handleSaveAndNext = () => {
    handleNextQuestion()
  }

  const handleClearResponse = () => {
    const currentQuestionData = examData.sections[currentSection].questions[currentQuestion]
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentSection]: {
        ...prev[currentSection],
        [currentQuestionData.id]: "",
      },
    }))
  }

  const currentQuestionData = examData.sections[currentSection].questions[currentQuestion]

  // Calculate progress for each section
  const sectionProgress = {
    physics: (Object.keys(selectedAnswers.physics).length / examData.sections.physics.questions.length) * 100,
    chemistry: (Object.keys(selectedAnswers.chemistry).length / examData.sections.chemistry.questions.length) * 100,
    mathematics:
      (Object.keys(selectedAnswers.mathematics).length / examData.sections.mathematics.questions.length) * 100,
  }

  // Calculate overall progress
  const totalQuestions =
    examData.sections.physics.questions.length +
    examData.sections.chemistry.questions.length +
    examData.sections.mathematics.questions.length

  const answeredQuestions =
    Object.keys(selectedAnswers.physics).length +
    Object.keys(selectedAnswers.chemistry).length +
    Object.keys(selectedAnswers.mathematics).length

  const overallProgress = (answeredQuestions / totalQuestions) * 100

  return (
    <div ref={examContainerRef} className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      {/* Instructions Dialog */}
      <AlertDialog open={isInstructionsOpen} onOpenChange={setIsInstructionsOpen}>
        <AlertDialogContent className="max-w-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Exam Instructions</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="max-h-[60vh] overflow-y-auto pr-2">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">General Instructions</h3>
                    <ul className="ml-6 list-disc space-y-1 pt-2 text-sm">
                      <li>Total duration of the exam is {examData.duration}.</li>
                      <li>The clock will be set at the server. The countdown timer will display the remaining time.</li>
                      <li>
                        The question palette displayed on the right side of the screen will show the status of each
                        question.
                      </li>
                      <li>You can navigate between sections and questions within a section at any time.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium">Navigating Through Questions</h3>
                    <ul className="ml-6 list-disc space-y-1 pt-2 text-sm">
                      <li>Click on a question number in the question palette to go directly to that question.</li>
                      <li>Click on "Save & Next" to save your answer and move to the next question.</li>
                      <li>Click on "Mark for Review" to flag a question for later review.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium">Answering Questions</h3>
                    <ul className="ml-6 list-disc space-y-1 pt-2 text-sm">
                      <li>For multiple-choice questions, click on the option you think is correct.</li>
                      <li>To change your answer, click on another option.</li>
                      <li>To clear your answer, click on the "Clear Response" button.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium">Marking Scheme</h3>
                    <ul className="ml-6 list-disc space-y-1 pt-2 text-sm">
                      <li>Each question carries {examData.markingScheme.correct} marks for a correct answer.</li>
                      <li>
                        There is a negative marking of {examData.markingScheme.incorrect} mark for each wrong answer.
                      </li>
                      <li>No marks will be deducted for unattempted questions.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium">Submitting the Exam</h3>
                    <ul className="ml-6 list-disc space-y-1 pt-2 text-sm">
                      <li>Click on the "Submit" button only when you have completed the exam.</li>
                      <li>Once submitted, you will not be able to return to the exam.</li>
                      <li>The system will automatically submit your exam when the time expires.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>I have read and understood the instructions</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Timer Warning Dialog */}
      <AlertDialog open={isTimerWarning} onOpenChange={setIsTimerWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Time Alert</AlertDialogTitle>
            <AlertDialogDescription>
              You have only 15 minutes remaining. Please review your answers and submit your exam.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Continue Exam</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Exam Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => setIsExitDialogOpen(true)} aria-label="Exit Exam">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-lg font-semibold">{examData.name} Simulator</h1>
          </div>
          <div className="flex items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => setIsInstructionsOpen(true)}>
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View Instructions</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="flex items-center gap-2">
              <Clock className={`h-4 w-4 ${timeLeft < 900 ? "text-red-500 animate-pulse" : "text-muted-foreground"}`} />
              <span className={`font-medium ${timeLeft < 900 ? "text-red-500" : ""}`}>{formatTime(timeLeft)}</span>
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={toggleFullscreen}>
                    {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button variant="destructive" size="sm" onClick={() => setIsSubmitDialogOpen(true)}>
              Submit Exam
            </Button>
          </div>
        </div>
      </header>

      <div className="container grid flex-1 gap-6 px-4 py-6 md:grid-cols-3 lg:grid-cols-4">
        {/* Question Panel */}
        <div className="md:col-span-2 lg:col-span-3">
          <Card className="h-full">
            <CardContent className="p-6">
              <Tabs value={currentSection} onValueChange={setCurrentSection} className="mb-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="physics">Physics</TabsTrigger>
                  <TabsTrigger value="chemistry">Chemistry</TabsTrigger>
                  <TabsTrigger value="mathematics">Mathematics</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="mb-4 flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">
                    Question {currentQuestion + 1} of {examData.sections[currentSection].questions.length}
                  </span>
                  <h2 className="text-sm font-medium text-muted-foreground">
                    Subject: {currentSection.charAt(0).toUpperCase() + currentSection.slice(1)}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFlagQuestion(currentQuestionData.id)}
                    className={
                      flaggedQuestions[currentSection]?.includes(currentQuestionData.id)
                        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:hover:bg-yellow-800"
                        : ""
                    }
                  >
                    <Flag className="mr-2 h-4 w-4" />
                    {flaggedQuestions[currentSection]?.includes(currentQuestionData.id) ? "Flagged" : "Flag for Review"}
                  </Button>

                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm">
                        <HelpCircle className="mr-2 h-4 w-4" />
                        Help
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Help & Tools</SheetTitle>
                        <SheetDescription>Use these tools to help you solve the problem.</SheetDescription>
                      </SheetHeader>
                      <div className="mt-6 space-y-4">
                        <div>
                          <h3 className="mb-2 text-sm font-medium">Calculator</h3>
                          <div className="rounded-md border p-4">
                            <div className="grid grid-cols-4 gap-2">
                              <Input className="col-span-4" readOnly value="0" />
                              <Button variant="outline" size="sm">
                                7
                              </Button>
                              <Button variant="outline" size="sm">
                                8
                              </Button>
                              <Button variant="outline" size="sm">
                                9
                              </Button>
                              <Button variant="outline" size="sm">
                                ÷
                              </Button>
                              <Button variant="outline" size="sm">
                                4
                              </Button>
                              <Button variant="outline" size="sm">
                                5
                              </Button>
                              <Button variant="outline" size="sm">
                                6
                              </Button>
                              <Button variant="outline" size="sm">
                                ×
                              </Button>
                              <Button variant="outline" size="sm">
                                1
                              </Button>
                              <Button variant="outline" size="sm">
                                2
                              </Button>
                              <Button variant="outline" size="sm">
                                3
                              </Button>
                              <Button variant="outline" size="sm">
                                -
                              </Button>
                              <Button variant="outline" size="sm">
                                0
                              </Button>
                              <Button variant="outline" size="sm">
                                .
                              </Button>
                              <Button variant="outline" size="sm">
                                =
                              </Button>
                              <Button variant="outline" size="sm">
                                +
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="mb-2 text-sm font-medium">Periodic Table</h3>
                          <Button variant="outline" className="w-full">
                            Open Periodic Table
                          </Button>
                        </div>

                        <div>
                          <h3 className="mb-2 text-sm font-medium">Formula Sheet</h3>
                          <Button variant="outline" className="w-full">
                            View Formula Sheet
                          </Button>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>

              <Separator className="mb-6" />

              <div className="space-y-6">
                <div>
                  <h3 className="mb-4 text-lg font-medium">{currentQuestionData.question}</h3>

                  {currentQuestionData.image && (
                    <div className="mb-4 flex justify-center">
                      <img
                        src={currentQuestionData.image || "/placeholder.svg"}
                        alt="Question diagram"
                        className="max-h-[200px] rounded-md border"
                      />
                    </div>
                  )}

                  <RadioGroup
                    value={selectedAnswers[currentSection][currentQuestionData.id] || ""}
                    onValueChange={(value) => handleAnswerSelect(currentQuestionData.id, value)}
                    className="space-y-3"
                  >
                    {currentQuestionData.options.map((option) => (
                      <div
                        key={option.id}
                        className={`flex items-center rounded-lg border p-4 transition-colors ${
                          selectedAnswers[currentSection][currentQuestionData.id] === option.id
                            ? "border-primary bg-primary/5"
                            : "hover:bg-muted/50"
                        }`}
                      >
                        <RadioGroupItem
                          value={option.id}
                          id={`option-${currentQuestionData.id}-${option.id}`}
                          className="mr-3"
                        />
                        <Label
                          htmlFor={`option-${currentQuestionData.id}-${option.id}`}
                          className="flex-1 cursor-pointer"
                        >
                          {option.text}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handlePrevQuestion}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                    </Button>
                    <Button variant="outline" onClick={handleClearResponse}>
                      Clear Response
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveAndNext} className="bg-blue-600 hover:bg-blue-700">
                      Save & Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button onClick={handleNextQuestion} variant="ghost">
                      Skip <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Question Navigator */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 space-y-2">
                <h3 className="font-medium">Overall Progress</h3>
                <Progress value={overallProgress} className="h-2" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    {answeredQuestions} of {totalQuestions} answered
                  </span>
                  <span>{Math.round(overallProgress)}%</span>
                </div>
              </div>

              <Separator className="mb-4" />

              <div className="space-y-4">
                <h3 className="font-medium">Question Navigator</h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="mb-2 text-sm font-medium">Physics</h4>
                    <div className="grid grid-cols-5 gap-2">
                      {examData.sections.physics.questions.map((q, index) => (
                        <Button
                          key={q.id}
                          variant="outline"
                          size="sm"
                          className={`h-10 w-10 p-0 ${
                            currentSection === "physics" && currentQuestion === index ? "border-2 border-primary" : ""
                          } ${
                            selectedAnswers.physics[q.id]
                              ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800"
                              : ""
                          } ${
                            flaggedQuestions.physics?.includes(q.id)
                              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:hover:bg-yellow-800"
                              : ""
                          }`}
                          onClick={() => {
                            setCurrentSection("physics")
                            setCurrentQuestion(index)
                          }}
                        >
                          {index + 1}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-2 text-sm font-medium">Chemistry</h4>
                    <div className="grid grid-cols-5 gap-2">
                      {examData.sections.chemistry.questions.map((q, index) => (
                        <Button
                          key={q.id}
                          variant="outline"
                          size="sm"
                          className={`h-10 w-10 p-0 ${
                            currentSection === "chemistry" && currentQuestion === index ? "border-2 border-primary" : ""
                          } ${
                            selectedAnswers.chemistry[q.id]
                              ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800"
                              : ""
                          } ${
                            flaggedQuestions.chemistry?.includes(q.id)
                              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:hover:bg-yellow-800"
                              : ""
                          }`}
                          onClick={() => {
                            setCurrentSection("chemistry")
                            setCurrentQuestion(index)
                          }}
                        >
                          {index + 1}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-2 text-sm font-medium">Mathematics</h4>
                    <div className="grid grid-cols-5 gap-2">
                      {examData.sections.mathematics.questions.map((q, index) => (
                        <Button
                          key={q.id}
                          variant="outline"
                          size="sm"
                          className={`h-10 w-10 p-0 ${
                            currentSection === "mathematics" && currentQuestion === index
                              ? "border-2 border-primary"
                              : ""
                          } ${
                            selectedAnswers.mathematics[q.id]
                              ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800"
                              : ""
                          } ${
                            flaggedQuestions.mathematics?.includes(q.id)
                              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:hover:bg-yellow-800"
                              : ""
                          }`}
                          onClick={() => {
                            setCurrentSection("mathematics")
                            setCurrentQuestion(index)
                          }}
                        >
                          {index + 1}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <h3 className="font-medium">Legend</h3>
                <div className="grid gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-sm border"></div>
                    <span>Not Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-sm bg-green-100 dark:bg-green-900"></div>
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-sm bg-yellow-100 dark:bg-yellow-900"></div>
                    <span>Flagged for Review</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-sm border-2 border-primary"></div>
                    <span>Current Question</span>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <Button className="w-full" variant="destructive" onClick={() => setIsSubmitDialogOpen(true)}>
                <Save className="mr-2 h-4 w-4" />
                Submit Exam
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Exam?</AlertDialogTitle>
            <AlertDialogDescription>
              You have answered {answeredQuestions} out of {totalQuestions} questions.
              {answeredQuestions < totalQuestions && (
                <span className="mt-2 block font-medium text-destructive">
                  Warning: You have {totalQuestions - answeredQuestions} unanswered questions.
                </span>
              )}
              Are you sure you want to submit your exam? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit}>Submit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Exit Confirmation Dialog */}
      <AlertDialog open={isExitDialogOpen} onOpenChange={setIsExitDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Exit Exam?</AlertDialogTitle>
            <AlertDialogDescription>
              Your progress will be lost if you exit now. Are you sure you want to leave the exam?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push(`/exams/${params.examId}`)}>Exit Exam</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
