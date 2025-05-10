"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
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
import { useToast } from "@/components/ui/use-toast"

// Import exam data based on exam ID
import { getExamData } from "@/lib/exam-data"
import { calculateResults, saveExamResult } from "@/lib/exam-results"

export default function EAMCETSimulator() {
  const router = useRouter()
  const { toast } = useToast()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentSection, setCurrentSection] = useState("physics")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
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
  const [visitedQuestions, setVisitedQuestions] = useState<Set<number>>(new Set())
  const examContainerRef = useRef<HTMLDivElement>(null)

  // Get exam data for EAMCET
  const examData = getExamData("eamcet-ap")

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

  // Mark current question as visited
  useEffect(() => {
    if (!isInstructionsOpen) {
      setVisitedQuestions((prev) => new Set(prev).add(currentQuestion))
    }
  }, [currentQuestion, isInstructionsOpen])

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
      [questionId]: answerId,
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
    try {
      // Calculate and save results
      const result = calculateResults("eamcet-ap", selectedAnswers)
      result.timeSpent = 10800 - timeLeft // Calculate actual time spent
      saveExamResult(result)

      // Show success toast
      toast({
        title: "Exam Submitted",
        description: "Your exam has been submitted successfully.",
      })

      // Redirect to results page
      router.push(`/exams/eamcet-ap/results?session=${result.id}`)
    } catch (error) {
      console.error("Error submitting exam:", error)
      toast({
        title: "Error",
        description: "There was an error submitting your exam. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSaveAndNext = () => {
    const currentQuestionData = examData.sections[currentSection].questions[currentQuestion]
    if (selectedAnswers[currentQuestionData.id]) {
      toast({
        title: "Answer Saved",
        description: "Your answer has been saved.",
        variant: "default",
      })
    }
    handleNextQuestion()
  }

  const handleClearResponse = () => {
    const currentQuestionData = examData.sections[currentSection].questions[currentQuestion]
    setSelectedAnswers((prev) => {
      const newAnswers = { ...prev }
      delete newAnswers[currentQuestionData.id]
      return newAnswers
    })

    toast({
      title: "Response Cleared",
      description: "Your answer has been cleared.",
    })
  }

  const handleMarkForReview = () => {
    const currentQuestionData = examData.sections[currentSection].questions[currentQuestion]
    handleFlagQuestion(currentQuestionData.id)
    handleNextQuestion()
  }

  const currentQuestionData = examData.sections[currentSection].questions[currentQuestion]

  // Calculate overall progress
  const totalQuestions =
    examData.sections.physics.questions.length +
    examData.sections.chemistry.questions.length +
    examData.sections.mathematics.questions.length

  const answeredQuestions = Object.keys(selectedAnswers).length

  // Count flagged questions
  const totalFlagged =
    flaggedQuestions.physics.length + flaggedQuestions.chemistry.length + flaggedQuestions.mathematics.length

  // Count not visited questions
  const notVisitedCount = totalQuestions - visitedQuestions.size

  return (
    <div ref={examContainerRef} className="flex min-h-screen flex-col bg-[#f0f4f8]">
      {/* Instructions Dialog */}
      <AlertDialog open={isInstructionsOpen} onOpenChange={setIsInstructionsOpen}>
        <AlertDialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader className="bg-[#0056a4] text-white p-2">
            <AlertDialogTitle className="text-xl font-bold">Other Important Instructions</AlertDialogTitle>
          </AlertDialogHeader>

          <div className="space-y-4 my-4 p-4">
            <h3 className="font-bold text-lg">1. Details of the Question Paper</h3>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2">S.No</th>
                  <th className="border border-gray-300 p-2">Section(Subject) Name</th>
                  <th className="border border-gray-300 p-2">No. of objective type Questions</th>
                  <th className="border border-gray-300 p-2">Marks</th>
                  <th className="border border-gray-300 p-2">Marks Per Question</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2 text-center">1</td>
                  <td className="border border-gray-300 p-2">MATHEMATICS</td>
                  <td className="border border-gray-300 p-2 text-center">80</td>
                  <td className="border border-gray-300 p-2 text-center">80</td>
                  <td className="border border-gray-300 p-2 text-center">1</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 text-center">2</td>
                  <td className="border border-gray-300 p-2">PHYSICS</td>
                  <td className="border border-gray-300 p-2 text-center">40</td>
                  <td className="border border-gray-300 p-2 text-center">40</td>
                  <td className="border border-gray-300 p-2 text-center">1</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 text-center">3</td>
                  <td className="border border-gray-300 p-2">CHEMISTRY</td>
                  <td className="border border-gray-300 p-2 text-center">40</td>
                  <td className="border border-gray-300 p-2 text-center">40</td>
                  <td className="border border-gray-300 p-2 text-center">1</td>
                </tr>
                <tr className="font-bold">
                  <td className="border border-gray-300 p-2 text-center"></td>
                  <td className="border border-gray-300 p-2">Total</td>
                  <td className="border border-gray-300 p-2 text-center">160</td>
                  <td className="border border-gray-300 p-2 text-center">160</td>
                  <td className="border border-gray-300 p-2 text-center"></td>
                </tr>
              </tbody>
            </table>

            <ol className="list-decimal pl-5 space-y-4">
              <li>You will be given 180 minutes to attempt 160 questions.</li>
              <li>The Question Paper consists of objective type questions only.</li>
              <li>There will be no negative marks for wrong answers.</li>
              <li>Questions will be available in two languages – English and Telugu.</li>
              <li>The questions will be displayed on the screen one at a time in both the languages.</li>
              <li>
                Each question will have 4 options, out of which one will be the correct answer and the candidate has to
                select one option.
              </li>
              <li>
                If there is any ambiguity in Telugu version of the question and options, the English version will be
                considered as final.
              </li>
            </ol>

            <div className="mt-6">
              <div className="flex items-center">
                <input type="checkbox" id="agree" className="mr-2" defaultChecked />
                <label htmlFor="agree" className="text-sm">
                  I have read and understood the instructions. All computer hardware allotted to me are in proper
                  working condition. I declare that I am not in possession of / not wearing / not carrying any
                  prohibited gadget like mobile phone, bluetooth devices etc. /any prohibited material with me into the
                  Examination Hall. I agree that in case of not adhering to the instructions, I shall be liable to be
                  debarred from this Test and/or to disciplinary action, which may include ban from future Tests /
                  Examinations.
                </label>
              </div>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogAction className="bg-[#0056a4] hover:bg-[#004080]">I am ready to begin</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Timer Warning Dialog */}
      <AlertDialog open={isTimerWarning} onOpenChange={setIsTimerWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">Time Alert</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="text-sm text-muted-foreground">
                You have only 15 minutes remaining. Please review your answers and submit your exam.
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Continue Exam</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Exam Header */}
      <header className="sticky top-0 z-10 bg-[#0056a4] text-white">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold">TG EAMCET Mock</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white text-[#0056a4] px-3 py-1 rounded">
              <span className="font-mono font-medium">Time Left: {formatTime(timeLeft)}</span>
            </div>
            <Button
              variant="outline"
              className="bg-white text-[#0056a4] hover:bg-gray-100"
              onClick={() => setIsSubmitDialogOpen(true)}
            >
              Submit
            </Button>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="bg-[#f0f4f8] border-b">
          <div className="container px-4">
            <div className="flex">
              <Button
                variant={currentSection === "mathematics" ? "default" : "ghost"}
                className={
                  currentSection === "mathematics"
                    ? "bg-[#0056a4] text-white rounded-none"
                    : "bg-[#e0e7ef] text-[#0056a4] rounded-none"
                }
                onClick={() => setCurrentSection("mathematics")}
              >
                Mathematics
              </Button>
              <Button
                variant={currentSection === "physics" ? "default" : "ghost"}
                className={
                  currentSection === "physics"
                    ? "bg-[#0056a4] text-white rounded-none"
                    : "bg-[#e0e7ef] text-[#0056a4] rounded-none"
                }
                onClick={() => setCurrentSection("physics")}
              >
                Physics
              </Button>
              <Button
                variant={currentSection === "chemistry" ? "default" : "ghost"}
                className={
                  currentSection === "chemistry"
                    ? "bg-[#0056a4] text-white rounded-none"
                    : "bg-[#e0e7ef] text-[#0056a4] rounded-none"
                }
                onClick={() => setCurrentSection("chemistry")}
              >
                Chemistry
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container grid flex-1 gap-6 px-4 py-6 md:grid-cols-4">
        {/* Question Panel */}
        <div className="md:col-span-3">
          <Card className="border-gray-300 shadow-sm">
            <CardContent className="p-6">
              <div className="mb-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold">Question {currentQuestion + 1}:</h2>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium text-muted-foreground">
                      {currentSection.charAt(0).toUpperCase() + currentSection.slice(1)}
                    </div>
                  </div>
                </div>
                <Separator className="my-3" />
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-lg mb-6">{currentQuestionData.question}</p>

                  {currentQuestionData.image && (
                    <div className="mb-6 flex justify-center">
                      <img
                        src={currentQuestionData.image || "/placeholder.svg"}
                        alt="Question diagram"
                        className="max-h-[200px] rounded-md border"
                      />
                    </div>
                  )}

                  <div className="mt-4">
                    <RadioGroup
                      value={selectedAnswers[currentQuestionData.id] || ""}
                      onValueChange={(value) => handleAnswerSelect(currentQuestionData.id, value)}
                      className="space-y-3"
                    >
                      {currentQuestionData.options.map((option, index) => (
                        <div
                          key={option.id}
                          className="flex items-center border border-gray-300 rounded p-3 hover:bg-gray-50"
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
                </div>

                <div className="flex items-center justify-between pt-4 border-t mt-6">
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleClearResponse} className="border-gray-300">
                      Clear Response
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleMarkForReview} className="bg-[#ff9800] hover:bg-[#f57c00] text-white">
                      Mark for Review & Next
                    </Button>
                    <Button onClick={handleSaveAndNext} className="bg-[#0056a4] hover:bg-[#004080] text-white">
                      Save & Next
                    </Button>
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <Button variant="outline" onClick={handlePrevQuestion} className="border-gray-300">
                    <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                  </Button>
                  <Button variant="outline" onClick={handleNextQuestion} className="border-gray-300">
                    Next <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Question Palette */}
        <div className="md:col-span-1">
          <div className="sticky top-24 space-y-4">
            <Card className="border-gray-300 shadow-sm">
              <CardContent className="p-4">
                <div className="mb-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-gray-200 rounded-sm"></div>
                      <span>Not Visited</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-red-200 rounded-sm"></div>
                      <span>Not Answered</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-green-200 rounded-sm"></div>
                      <span>Answered</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-purple-200 rounded-sm"></div>
                      <span>Marked for Review</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Not Visited:</span>
                    <span className="font-medium">{notVisitedCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Not Answered:</span>
                    <span className="font-medium">{visitedQuestions.size - answeredQuestions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Answered:</span>
                    <span className="font-medium">{answeredQuestions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Marked for Review:</span>
                    <span className="font-medium">{totalFlagged}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-300 shadow-sm">
              <CardContent className="p-4">
                <h3 className="font-medium mb-3">Choose a Question</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="mb-2 text-sm font-medium">Mathematics</h4>
                    <div className="grid grid-cols-5 gap-2">
                      {examData.sections.mathematics.questions.map((q, index) => (
                        <Button
                          key={q.id}
                          variant="outline"
                          size="sm"
                          className={`h-8 w-8 p-0 text-xs font-medium ${
                            currentSection === "mathematics" && currentQuestion === index
                              ? "border-2 border-[#0056a4]"
                              : "border-gray-300"
                          } ${
                            selectedAnswers[q.id]
                              ? "bg-green-200 text-green-800"
                              : visitedQuestions.has(index) && currentSection === "mathematics"
                                ? "bg-red-200 text-red-800"
                                : "bg-gray-200"
                          } ${flaggedQuestions.mathematics?.includes(q.id) ? "bg-purple-200 text-purple-800" : ""}`}
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

                  <div>
                    <h4 className="mb-2 text-sm font-medium">Physics</h4>
                    <div className="grid grid-cols-5 gap-2">
                      {examData.sections.physics.questions.map((q, index) => (
                        <Button
                          key={q.id}
                          variant="outline"
                          size="sm"
                          className={`h-8 w-8 p-0 text-xs font-medium ${
                            currentSection === "physics" && currentQuestion === index
                              ? "border-2 border-[#0056a4]"
                              : "border-gray-300"
                          } ${
                            selectedAnswers[q.id]
                              ? "bg-green-200 text-green-800"
                              : visitedQuestions.has(index) && currentSection === "physics"
                                ? "bg-red-200 text-red-800"
                                : "bg-gray-200"
                          } ${flaggedQuestions.physics?.includes(q.id) ? "bg-purple-200 text-purple-800" : ""}`}
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
                          className={`h-8 w-8 p-0 text-xs font-medium ${
                            currentSection === "chemistry" && currentQuestion === index
                              ? "border-2 border-[#0056a4]"
                              : "border-gray-300"
                          } ${
                            selectedAnswers[q.id]
                              ? "bg-green-200 text-green-800"
                              : visitedQuestions.has(index) && currentSection === "chemistry"
                                ? "bg-red-200 text-red-800"
                                : "bg-gray-200"
                          } ${flaggedQuestions.chemistry?.includes(q.id) ? "bg-purple-200 text-purple-800" : ""}`}
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
                </div>
              </CardContent>
            </Card>

            <Button
              className="w-full bg-[#f44336] hover:bg-[#d32f2f] text-white"
              onClick={() => setIsSubmitDialogOpen(true)}
            >
              SUBMIT
            </Button>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Confirm Submission</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4 text-sm text-muted-foreground">
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="font-medium">Total Questions</div>
                    <div className="text-xl">{totalQuestions}</div>
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="font-medium">Answered</div>
                    <div className="text-xl">{answeredQuestions}</div>
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="font-medium">Not Answered</div>
                    <div className="text-xl">{totalQuestions - answeredQuestions}</div>
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="font-medium">Marked for Review</div>
                    <div className="text-xl">{totalFlagged}</div>
                  </div>
                </div>

                {answeredQuestions < totalQuestions && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800">
                    <div className="font-medium">
                      Warning: You have {totalQuestions - answeredQuestions} unanswered questions.
                    </div>
                  </div>
                )}

                <div>Are you sure you want to submit your exam? This action cannot be undone.</div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-300">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit} className="bg-[#0056a4] hover:bg-[#004080]">
              Submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Exit Confirmation Dialog */}
      <AlertDialog open={isExitDialogOpen} onOpenChange={setIsExitDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Exit Exam?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="text-sm text-muted-foreground">
                Your progress will be lost if you exit now. Are you sure you want to leave the exam?
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => router.push(`/exams/eamcet-ap`)}
              className="bg-[#f44336] hover:bg-[#d32f2f]"
            >
              Exit Exam
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
