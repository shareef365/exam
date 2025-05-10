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

export default function JEESimulator() {
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

  // Get exam data for JEE
  const examData = getExamData("jee-main")

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
      const result = calculateResults("jee-main", selectedAnswers)
      result.timeSpent = 10800 - timeLeft // Calculate actual time spent
      saveExamResult(result)

      // Show success toast
      toast({
        title: "Exam Submitted",
        description: "Your exam has been submitted successfully.",
      })

      // Redirect to results page
      router.push(`/exams/jee-main/results?session=${result.id}`)
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
    <div ref={examContainerRef} className="flex min-h-screen flex-col bg-[#f5f5f5]">
      {/* Instructions Dialog */}
      <AlertDialog open={isInstructionsOpen} onOpenChange={setIsInstructionsOpen}>
        <AlertDialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader className="bg-[#1e4c87] text-white p-2">
            <AlertDialogTitle className="text-xl font-bold">General Instructions</AlertDialogTitle>
          </AlertDialogHeader>

          <div className="space-y-4 my-4 p-4">
            <div className="space-y-2">
              <p>1. Total duration of JEE (Main) - Paper 1 is 180 minutes.</p>
              <p>
                2. The clock will be set at the server. The countdown timer in the top right corner of screen will
                display the remaining time available for you to complete the examination. When the timer reaches zero,
                the examination will end by itself. You will not be required to end or submit your examination.
              </p>
              <p>
                3. The Questions Palette displayed on the right side of screen will show the status of each question
                using one of the following symbols:
              </p>

              <div className="grid grid-cols-2 gap-4 ml-6 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                  <span>You have not visited the question yet.</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-red-200"></div>
                  <span>You have not answered the question.</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-200"></div>
                  <span>You have answered the question.</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-purple-200"></div>
                  <span>You have NOT answered the question, but have marked the question for review.</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-purple-200 border-2 border-green-500"></div>
                  <span>The question(s) "Answered and Marked for Review" will be considered for evaluation.</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <p>
                4. You can click on the {">"} arrow which appears to the left of question palette to collapse the
                question palette thereby maximizing the question window. To view the question palette again, you can
                click on {"<"} which appears on the right side of question window.
              </p>
              <p>
                5. You can click on your "Profile" image on top right corner of your screen to change the language
                during the exam for entire question paper. On clicking of Profile image you will get a drop-down to
                change the question content to the desired language.
              </p>
              <p>
                6. You can click on to navigate to the bottom and to navigate to the top of the question area, without
                scrolling.
              </p>
            </div>

            <div className="mt-4">
              <h3 className="font-bold">Navigating to a Question:</h3>
              <p>7. To answer a question, do the following:</p>
              <div className="ml-6 space-y-2 mt-2">
                <p>
                  a. Click on the question number in the Question Palette at the right of your screen to go to that
                  numbered question directly. Note that using this option does NOT save your answer to the current
                  question.
                </p>
                <p>
                  b. Click on "Save & Next" to save your answer for the current question and then go to the next
                  question.
                </p>
                <p>
                  c. Click on "Mark for Review & Next" to save your answer for the current question, mark it for review,
                  and then go to the next question.
                </p>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-bold">Answering a Question:</h3>
              <p>8. Procedure for answering a multiple choice type question:</p>
              <div className="ml-6 space-y-2 mt-2">
                <p>a. To select your answer, click on the button of one of the options.</p>
                <p>
                  b. To deselect your chosen answer, click on the button of the chosen option again or click on the
                  Clear Response button.
                </p>
                <p>c. To change your chosen answer, click on the button of another option.</p>
                <p>d. To save your answer, you MUST click on the Save & Next button.</p>
                <p>e. To mark the question for review, click on the Mark for Review & Next button.</p>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-bold">Navigating through sections:</h3>
              <div className="space-y-2">
                <p>
                  9. Sections in this question paper are displayed on the top bar of the screen. Questions in a section
                  can be viewed by clicking on the section name. The section you are currently viewing is highlighted.
                </p>
                <p>
                  10. After clicking the Save & Next button on the last question for a section, you will automatically
                  be taken to the first question of the next section.
                </p>
                <p>
                  11. You can shuffle between sections and questions anytime during the examination as per your
                  convenience only during the time stipulated.
                </p>
                <p>
                  12. Candidate can view the corresponding section summary as part of the legend that appears in every
                  section above the question palette.
                </p>
              </div>
            </div>

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
            <AlertDialogAction className="bg-[#4caf50] hover:bg-[#45a049]">PROCEED</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Timer Warning Dialog */}
      <AlertDialog open={isTimerWarning} onOpenChange={setIsTimerWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">Time Alert</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>You have only 15 minutes remaining. Please review your answers and submit your exam.</div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Continue Exam</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Exam Header */}
      <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <div className="flex items-center gap-2">
            <img src="/placeholder.svg?height=40&width=40" alt="NTA Logo" className="h-10" />
            <div>
              <h1 className="text-sm font-bold">National Testing Agency</h1>
              <p className="text-xs">Excellence in Assessment</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <img src="/placeholder.svg?height=40&width=40" alt="Ministry of Education" className="h-10" />
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div>
                <p className="text-xs">John Smith</p>
                <select className="text-xs border rounded px-1">
                  <option>English</option>
                  <option>Hindi</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-2 bg-[#f5f5f5]">
          <div>
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div>
                <p className="font-semibold">Candidate Name:</p>
                <p>John Smith</p>
              </div>
              <div>
                <p className="font-semibold">Exam Name:</p>
                <p>JEE-Main</p>
              </div>
              <div>
                <p className="font-semibold">Subject Name:</p>
                <p>PAPER 1 ENG</p>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="text-xs font-semibold mr-2">Remaining Time:</div>
            <div className="bg-[#1e4c87] text-white px-2 py-1 rounded text-sm font-mono">{formatTime(timeLeft)}</div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Question Panel */}
        <div className="flex-1 p-4">
          <Card className="border-gray-300 shadow-sm">
            <CardContent className="p-6">
              <div className="mb-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold">Question {currentQuestion + 1}:</h2>
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
                    <p className="font-medium mb-2">Options:</p>
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
                            {index + 1}. {option.text}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t mt-6">
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleClearResponse} className="border-gray-300">
                      CLEAR
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleMarkForReview} className="bg-[#ff9800] hover:bg-[#f57c00] text-white">
                      MARK FOR REVIEW & NEXT
                    </Button>
                    <Button onClick={handleSaveAndNext} className="bg-[#4caf50] hover:bg-[#45a049] text-white">
                      SAVE & NEXT
                    </Button>
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <Button variant="outline" onClick={handlePrevQuestion} className="border-gray-300">
                    <ChevronLeft className="mr-2 h-4 w-4" /> BACK
                  </Button>
                  <Button variant="outline" onClick={handleNextQuestion} className="border-gray-300">
                    NEXT <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Question Palette */}
        <div className="w-[300px] bg-white border-l p-4">
          <div className="space-y-4">
            <div className="bg-[#f5f5f5] p-3 rounded-md">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-gray-200 rounded-sm"></div>
                  <span>Not Visited: {notVisitedCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-red-200 rounded-sm"></div>
                  <span>Not Answered: {visitedQuestions.size - answeredQuestions}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-green-200 rounded-sm"></div>
                  <span>Answered: {answeredQuestions}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-purple-200 rounded-sm"></div>
                  <span>Marked: {totalFlagged}</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center bg-[#1e4c87] text-white px-3 py-1 rounded-t-md">
                <h3 className="text-sm font-medium">Mathematics</h3>
                <span className="text-xs">(1 to 30)</span>
              </div>
              <div className="border border-t-0 rounded-b-md p-2">
                <div className="grid grid-cols-5 gap-2">
                  {examData.sections.mathematics.questions.slice(0, 30).map((q, index) => (
                    <Button
                      key={q.id}
                      variant="outline"
                      size="sm"
                      className={`h-8 w-8 p-0 text-xs font-medium ${
                        currentSection === "mathematics" && currentQuestion === index
                          ? "border-2 border-[#1e4c87]"
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
            </div>

            <div>
              <div className="flex justify-between items-center bg-[#1e4c87] text-white px-3 py-1 rounded-t-md">
                <h3 className="text-sm font-medium">Physics</h3>
                <span className="text-xs">(31 to 60)</span>
              </div>
              <div className="border border-t-0 rounded-b-md p-2">
                <div className="grid grid-cols-5 gap-2">
                  {examData.sections.physics.questions.slice(0, 30).map((q, index) => (
                    <Button
                      key={q.id}
                      variant="outline"
                      size="sm"
                      className={`h-8 w-8 p-0 text-xs font-medium ${
                        currentSection === "physics" && currentQuestion === index
                          ? "border-2 border-[#1e4c87]"
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
                      {index + 31}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center bg-[#1e4c87] text-white px-3 py-1 rounded-t-md">
                <h3 className="text-sm font-medium">Chemistry</h3>
                <span className="text-xs">(61 to 90)</span>
              </div>
              <div className="border border-t-0 rounded-b-md p-2">
                <div className="grid grid-cols-5 gap-2">
                  {examData.sections.chemistry.questions.slice(0, 30).map((q, index) => (
                    <Button
                      key={q.id}
                      variant="outline"
                      size="sm"
                      className={`h-8 w-8 p-0 text-xs font-medium ${
                        currentSection === "chemistry" && currentQuestion === index
                          ? "border-2 border-[#1e4c87]"
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
                      {index + 61}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between gap-2 mt-4">
              <Button
                className="flex-1 bg-[#f44336] hover:bg-[#d32f2f] text-white"
                onClick={() => setIsSubmitDialogOpen(true)}
              >
                SUBMIT
              </Button>
            </div>
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
            <AlertDialogAction onClick={handleSubmit} className="bg-[#4caf50] hover:bg-[#45a049]">
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
              <div>Your progress will be lost if you exit now. Are you sure you want to leave the exam?</div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => router.push(`/exams/jee-main`)}
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
