"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, RotateCcw, List, BookmarkPlus, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { getExamById, getExamQuestions } from "@/lib/exam-data"

export default function PracticePage() {
  const params = useParams()
  const router = useRouter()
  const examId = params.examId as string

  const [exam, setExam] = useState<any>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [currentSection, setCurrentSection] = useState<string>("")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Set<number>>(new Set())
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set())
  const [correctAnswers, setCorrectAnswers] = useState<Set<number>>(new Set())
  const [incorrectAnswers, setIncorrectAnswers] = useState<Set<number>>(new Set())
  const [showQuestionsDialog, setShowQuestionsDialog] = useState(false)

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
    }
  }, [examId])

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
      setSelectedAnswer(null)
      setShowExplanation(false)
    }
  }

  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    }
  }

  const goToQuestion = (index: number) => {
    const sectionQuestions = getCurrentSectionQuestions()
    if (index >= 0 && index < sectionQuestions.length) {
      setCurrentQuestionIndex(index)
      setSelectedAnswer(null)
      setShowExplanation(false)
    }
  }

  // Change section handler
  const handleSectionChange = (sectionId: string) => {
    setCurrentSection(sectionId)
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
  }

  // Answer handlers
  const handleAnswerChange = (value: string) => {
    setSelectedAnswer(value)
  }

  const checkAnswer = () => {
    const currentQuestion = getCurrentQuestion()
    if (!selectedAnswer || !currentQuestion) return

    setAnsweredQuestions((prev) => new Set(prev).add(currentQuestionIndex))

    if (selectedAnswer === currentQuestion.correctOption) {
      setCorrectAnswers((prev) => new Set(prev).add(currentQuestionIndex))
    } else {
      setIncorrectAnswers((prev) => new Set(prev).add(currentQuestionIndex))
    }

    setShowExplanation(true)
  }

  // Reset current question
  const resetQuestion = () => {
    setSelectedAnswer(null)
    setShowExplanation(false)

    // Remove from answered, correct, and incorrect sets
    setAnsweredQuestions((prev) => {
      const newSet = new Set(prev)
      newSet.delete(currentQuestionIndex)
      return newSet
    })

    setCorrectAnswers((prev) => {
      const newSet = new Set(prev)
      newSet.delete(currentQuestionIndex)
      return newSet
    })

    setIncorrectAnswers((prev) => {
      const newSet = new Set(prev)
      newSet.delete(currentQuestionIndex)
      return newSet
    })
  }

  // Bookmark handler
  const toggleBookmark = () => {
    const currentQuestion = getCurrentQuestion()
    if (!currentQuestion) return

    setBookmarkedQuestions((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(currentQuestionIndex)) {
        newSet.delete(currentQuestionIndex)
      } else {
        newSet.add(currentQuestionIndex)
      }
      return newSet
    })
  }

  // Get question status class
  const getQuestionStatusClass = (index: number) => {
    if (bookmarkedQuestions.has(index)) return "bookmarked"
    if (correctAnswers.has(index)) return "correct"
    if (incorrectAnswers.has(index)) return "incorrect"
    if (answeredQuestions.has(index)) return "answered"
    return ""
  }

  const sectionQuestions = getCurrentSectionQuestions()
  const currentQuestion = getCurrentQuestion()

  if (!exam) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto mt-8 px-4">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <h1 className="text-2xl font-bold mb-4">{exam.title} - Practice Mode</h1>

      <Tabs defaultValue={exam.sections[0].id} className="mb-4" onValueChange={handleSectionChange}>
        <TabsList className="bg-blue-50 dark:bg-blue-950 p-1">
          {exam.sections.map((section: any) => (
            <TabsTrigger
              key={section.id}
              value={section.id}
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              {section.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {exam.sections.map((section: any) => (
          <TabsContent key={section.id} value={section.id}>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-2/3">
                <Card className="shadow-md">
                  <CardHeader className="border-b">
                    <CardTitle className="flex justify-between items-center">
                      <span>
                        Question {currentQuestionIndex + 1} / {sectionQuestions.length}
                      </span>
                      <Button variant="ghost" size="icon" onClick={toggleBookmark}>
                        {bookmarkedQuestions.has(currentQuestionIndex) ? (
                          <BookmarkPlus className="h-4 w-4 text-yellow-500" />
                        ) : (
                          <BookmarkPlus className="h-4 w-4" />
                        )}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {currentQuestion ? (
                      <div>
                        <p className="mb-6 text-lg">{currentQuestion.question}</p>
                        <RadioGroup
                          value={selectedAnswer || ""}
                          onValueChange={handleAnswerChange}
                          className="space-y-3"
                        >
                          {currentQuestion.options.map((option: string, index: number) => (
                            <div
                              key={index}
                              className={`flex items-center space-x-2 p-3 rounded-md border transition-colors ${
                                selectedAnswer === option
                                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950 dark:border-blue-600"
                                  : "hover:bg-slate-50 dark:hover:bg-slate-900"
                              }`}
                            >
                              <RadioGroupItem value={option} id={`option-${index}`} />
                              <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                                {option}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                        {showExplanation && (
                          <div className="mt-6 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md">
                            <p className="font-bold text-green-800 dark:text-green-300 mb-2">Explanation:</p>
                            <p className="text-green-700 dark:text-green-400">{currentQuestion.explanation}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p>No questions available in this section.</p>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <Button variant="outline" size="sm" onClick={resetQuestion} disabled={!currentQuestion}>
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToPrevQuestion}
                        disabled={currentQuestionIndex === 0}
                      >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Previous
                      </Button>
                      <Button
                        size="sm"
                        onClick={checkAnswer}
                        disabled={!selectedAnswer || showExplanation || !currentQuestion}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Check Answer
                      </Button>
                      <Button
                        size="sm"
                        onClick={goToNextQuestion}
                        disabled={currentQuestionIndex === sectionQuestions.length - 1}
                      >
                        Next
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </div>

              <div className="w-full md:w-1/3">
                <Card className="shadow-md">
                  <CardHeader className="border-b">
                    <CardTitle>Question Navigator</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-4 gap-2">
                      {sectionQuestions.map((question: any, index: number) => (
                        <Button
                          key={index}
                          variant="outline"
                          className={`w-full h-10 flex items-center justify-center font-medium ${
                            currentQuestionIndex === index ? "ring-2 ring-blue-500" : ""
                          } ${
                            correctAnswers.has(index)
                              ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800"
                              : incorrectAnswers.has(index)
                                ? "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
                                : answeredQuestions.has(index)
                                  ? "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                                  : ""
                          } ${bookmarkedQuestions.has(index) ? "border-yellow-500 dark:border-yellow-600" : ""}`}
                          onClick={() => goToQuestion(index)}
                        >
                          {index + 1}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => setShowQuestionsDialog(true)}
                    >
                      <List className="mr-2 h-4 w-4" />
                      Show All Questions
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={showQuestionsDialog} onOpenChange={setShowQuestionsDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">All Questions</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {questions.map((question: any, index: number) => (
              <Card key={index} className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Question {index + 1}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="line-clamp-3 text-sm">{question.question}</p>
                </CardContent>
                <CardFooter className="border-t pt-3">
                  <Button
                    size="sm"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      handleSectionChange(question.sectionId)
                      const sectionQuestions = getCurrentSectionQuestions()
                      const questionIndexInSection = sectionQuestions.findIndex((q) => q.id === question.id)
                      if (questionIndexInSection !== -1) {
                        goToQuestion(questionIndexInSection)
                      }
                      setShowQuestionsDialog(false)
                    }}
                  >
                    Go to Question
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowQuestionsDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
