"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Clock, BookmarkPlus, ChevronLeft, ChevronRight, Maximize2, Minimize2, Flag, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { getExamById, getExamQuestions } from "@/lib/exam-data"

export default function MockTestPage() {
  const params = useParams()
  const router = useRouter()
  const examId = params.examId as string

  const [exam, setExam] = useState<any>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [currentSection, setCurrentSection] = useState<string>("")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Set<number>>(new Set())
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set())
  const [visitedQuestions, setVisitedQuestions] = useState<Set<number>>(new Set())
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)
  const [confirmSubmit, setConfirmSubmit] = useState(false)
  const [showCalculator, setShowCalculator] = useState(false)
  const [showPalette, setShowPalette] = useState(true)

  // Initialize exam data
  useEffect(() => {
    const examData = getExamById(examId)
    if (examData) {
      setExam(examData)
      const allQuestions = getExamQuestions(examId)
      setQuestions(allQuestions)

      if (examData.sections && examData.sections.length > 0) {
        setCurrentSection(examData.sections[0].id)
      }

      // Set timer based on exam duration (in minutes)
      setTimeRemaining(examData.duration * 60)
    }
  }, [examId])

  // Timer effect
  useEffect(() => {
    if (timeRemaining <= 0 || showInstructions) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmitExam()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeRemaining, showInstructions])

  // Mark current question as visited
  useEffect(() => {
    if (!showInstructions) {
      setVisitedQuestions((prev) => new Set(prev).add(currentQuestionIndex))
    }
  }, [currentQuestionIndex, showInstructions])

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  // Format time remaining
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Get current section questions
  const getCurrentSectionQuestions = () => {
    if (!exam || !questions.length) return []
    return questions.filter((q) => q.sectionId === currentSection)
  }

  // Get current question
  const getCurrentQuestion = () => {
    const sectionQuestions = getCurrentSectionQuestions()
    return sectionQuestions[currentQuestionIndex] || null
  }

  // Navigation handlers
  const goToNextQuestion = () => {
    const sectionQuestions = getCurrentSectionQuestions()
    if (currentQuestionIndex < sectionQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const goToQuestion = (index: number) => {
    const sectionQuestions = getCurrentSectionQuestions()
    if (index >= 0 && index < sectionQuestions.length) {
      setCurrentQuestionIndex(index)
    }
  }

  // Change section handler
  const handleSectionChange = (sectionId: string) => {
    setCurrentSection(sectionId)
    setCurrentQuestionIndex(0)
  }

  // Answer handlers
  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  // Bookmark handler
  const toggleBookmark = (index: number) => {
    setBookmarkedQuestions((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  // Flag handler
  const toggleFlag = (index: number) => {
    setFlaggedQuestions((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  // Submit exam handler
  const handleSubmitExam = () => {
    // Calculate results
    const results = {
      examId,
      examName: exam?.name,
      totalQuestions: questions.length,
      answeredQuestions: Object.keys(answers).length,
      timeSpent: exam?.duration * 60 - timeRemaining,
      answers,
      date: new Date().toISOString(),
    }

    // Store results in localStorage for demo purposes
    // In a real app, this would be sent to a server
    localStorage.setItem(`exam_result_${examId}_${Date.now()}`, JSON.stringify(results))

    // Navigate to results page
    router.push(`/exams/${examId}/results?session=${Date.now()}`)
  }

  // Get question status class
  const getQuestionStatusClass = (index: number) => {
    const sectionQuestions = getCurrentSectionQuestions()
    const question = sectionQuestions[index]

    if (!question) return ""

    if (flaggedQuestions.has(index)) {
      return "bg-yellow-100 border-yellow-500 dark:bg-yellow-900"
    }

    if (answers[question.id]) {
      return "bg-green-100 border-green-500 dark:bg-green-900"
    }

    if (visitedQuestions.has(index)) {
      return "bg-purple-100 border-purple-500 dark:bg-purple-900"
    }

    return "bg-gray-100 border-gray-300 dark:bg-gray-800"
  }

  if (!exam || !questions.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  const currentQuestion = getCurrentQuestion()
  const sectionQuestions = getCurrentSectionQuestions()

  return (
    <div className="min-h-screen bg-background">
      {/* Instructions Dialog */}
      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{exam.name} - Exam Instructions</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 my-4">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">General Instructions:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Total duration of the exam is {exam.duration} minutes.</li>
                <li>The clock will be set at the server. The countdown timer will display the remaining time.</li>
                <li>
                  The question palette displayed on the right side of screen will show the status of each question.
                </li>
                <li>You can navigate between sections and questions as per your convenience.</li>
                <li>To answer a question, click on one of the option buttons.</li>
              </ul>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Navigating through sections:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Sections in this question paper are displayed on the top bar of the screen.</li>
                <li>Click on the section name to view questions in that section.</li>
                <li>The section you are currently viewing is highlighted.</li>
              </ul>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Question palette:</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="mb-2">
                    The question palette at the right of the screen shows the status of each question:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-gray-200 mr-2"></div>
                      <span>You have not visited the question yet.</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-purple-200 mr-2"></div>
                      <span>You have visited the question but not answered it.</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-green-200 mr-2"></div>
                      <span>You have answered the question.</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-yellow-200 mr-2"></div>
                      <span>You have flagged the question for review.</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="mb-2">
                    The Marked for Review status simply acts as a reminder that you have set to look at the question
                    again.
                  </p>
                  <p>
                    If an answer is selected for a question that is Marked for Review, the answer will be considered in
                    the final evaluation.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Answering questions:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>To select your answer, click on one of the option buttons.</li>
                <li>To change your answer, click another option.</li>
                <li>To save your answer, you MUST click on "Save & Next".</li>
                <li>
                  To deselect a chosen answer, click on the chosen option again or click on the Clear Response button.
                </li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowInstructions(false)} className="w-full sm:w-auto">
              I have read and understood the instructions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Submit Dialog */}
      <Dialog open={confirmSubmit} onOpenChange={setConfirmSubmit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Submission</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4">Are you sure you want to submit your exam?</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-muted p-3 rounded-lg">
                <p className="font-medium">Total Questions</p>
                <p className="text-xl">{questions.length}</p>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <p className="font-medium">Answered</p>
                <p className="text-xl">{Object.keys(answers).length}</p>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <p className="font-medium">Flagged</p>
                <p className="text-xl">{flaggedQuestions.size}</p>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <p className="font-medium">Not Visited</p>
                <p className="text-xl">{questions.length - visitedQuestions.size}</p>
              </div>
            </div>
            <p className="text-muted-foreground">Once submitted, you cannot return to this exam.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmSubmit(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitExam}>Confirm Submission</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Exam Header */}
      <header className="sticky top-0 z-10 bg-background border-b shadow-sm">
        <div className="container mx-auto px-4 py-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-bold truncate">{exam.name}</h1>
              <Badge variant="outline" className="hidden sm:inline-flex">
                Mock Test
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-muted px-3 py-1 rounded-md">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className={`font-mono ${timeRemaining < 300 ? "text-red-500 font-bold" : ""}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>

              <Button variant="outline" size="sm" onClick={toggleFullscreen} className="hidden sm:flex">
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>

              <Button variant="destructive" size="sm" onClick={() => setConfirmSubmit(true)}>
                Submit
              </Button>
            </div>
          </div>

          {/* Section Tabs */}
          {exam.sections && exam.sections.length > 0 && (
            <Tabs value={currentSection} onValueChange={handleSectionChange} className="mt-2">
              <TabsList className="w-full justify-start overflow-x-auto">
                {exam.sections.map((section: any) => (
                  <TabsTrigger key={section.id} value={section.id} className="whitespace-nowrap">
                    {section.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}

          {/* Progress bar */}
          <Progress value={(Object.keys(answers).length / questions.length) * 100} className="h-1 mt-2" />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Question Area */}
        <div className="lg:col-span-3 space-y-6">
          {currentQuestion && (
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">
                      Question {currentQuestionIndex + 1} of {sectionQuestions.length}
                    </span>
                    <h2 className="text-xl font-semibold mt-1">{currentQuestion.text}</h2>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleBookmark(currentQuestionIndex)}
                      className={bookmarkedQuestions.has(currentQuestionIndex) ? "text-yellow-500" : ""}
                    >
                      <BookmarkPlus className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleFlag(currentQuestionIndex)}
                      className={flaggedQuestions.has(currentQuestionIndex) ? "text-red-500" : ""}
                    >
                      <Flag className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {currentQuestion.image && (
                  <div className="my-4 flex justify-center">
                    <img
                      src={currentQuestion.image || "/placeholder.svg"}
                      alt="Question illustration"
                      className="max-h-64 object-contain rounded-md border"
                    />
                  </div>
                )}

                <RadioGroup
                  value={answers[currentQuestion.id] || ""}
                  onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                  className="mt-6 space-y-4"
                >
                  {currentQuestion.options.map((option: any, index: number) => (
                    <div key={index} className="flex items-start space-x-2 p-3 rounded-md hover:bg-muted">
                      <RadioGroupItem value={option.id} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        {option.text}
                        {option.image && (
                          <img
                            src={option.image || "/placeholder.svg"}
                            alt={`Option ${index + 1}`}
                            className="mt-2 max-h-32 object-contain"
                          />
                        )}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={goToPrevQuestion} disabled={currentQuestionIndex === 0}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  <Button onClick={goToNextQuestion} disabled={currentQuestionIndex === sectionQuestions.length - 1}>
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Question Palette */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Question Palette</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowPalette(!showPalette)}>
                {showPalette ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>

            {showPalette && (
              <>
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {sectionQuestions.map((_, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className={`h-10 w-10 p-0 font-medium ${getQuestionStatusClass(index)} ${currentQuestionIndex === index ? "ring-2 ring-primary" : ""}`}
                      onClick={() => goToQuestion(index)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>

                <div className="space-y-2 mt-6">
                  <div className="flex items-center text-sm">
                    <div className="w-4 h-4 rounded-full bg-gray-200 mr-2"></div>
                    <span>Not Visited</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-4 h-4 rounded-full bg-purple-200 dark:bg-purple-900 mr-2"></div>
                    <span>Visited</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-4 h-4 rounded-full bg-green-200 dark:bg-green-900 mr-2"></div>
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-4 h-4 rounded-full bg-yellow-200 dark:bg-yellow-900 mr-2"></div>
                    <span>Flagged</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Questions:</span>
                    <span className="font-medium">{sectionQuestions.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Answered:</span>
                    <span className="font-medium">{sectionQuestions.filter((q) => answers[q.id]).length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Not Answered:</span>
                    <span className="font-medium">
                      {sectionQuestions.length - sectionQuestions.filter((q) => answers[q.id]).length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Flagged:</span>
                    <span className="font-medium">{flaggedQuestions.size}</span>
                  </div>
                </div>
              </>
            )}

            <Button variant="default" className="w-full mt-6" onClick={() => setConfirmSubmit(true)}>
              Submit Exam
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
