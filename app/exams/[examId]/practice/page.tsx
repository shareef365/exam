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
import { Separator } from "@/components/ui/separator"
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
    <div className="container mx-auto mt-8">
      <Button variant="ghost" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <h1 className="text-2xl font-bold mb-4">{exam.title} - Practice</h1>

      <Tabs defaultValue={exam.sections[0].id} className="mb-4" onValueChange={handleSectionChange}>
        <TabsList>
          {exam.sections.map((section: any) => (
            <TabsTrigger key={section.id} value={section.id}>
              {section.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {exam.sections.map((section: any) => (
          <TabsContent key={section.id} value={section.id}>
            <div className="flex">
              <div className="w-2/3 pr-4">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Question {currentQuestionIndex + 1} / {sectionQuestions.length}
                      <Button variant="ghost" size="icon" onClick={toggleBookmark}>
                        {bookmarkedQuestions.has(currentQuestionIndex) ? (
                          <BookmarkPlus className="h-4 w-4 text-yellow-500" />
                        ) : (
                          <BookmarkPlus className="h-4 w-4" />
                        )}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {currentQuestion ? (
                      <div>
                        <p className="mb-4">{currentQuestion.question}</p>
                        <RadioGroup value={selectedAnswer || ""} onValueChange={handleAnswerChange}>
                          {currentQuestion.options.map((option: string, index: number) => (
                            <div key={index} className="flex items-center space-x-2">
                              <RadioGroupItem value={option} id={`option-${index}`} />
                              <Label htmlFor={`option-${index}`}>{option}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                        {showExplanation && (
                          <div className="mt-4">
                            <Separator className="mb-2" />
                            <p className="font-bold">Explanation:</p>
                            <p>{currentQuestion.explanation}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p>No questions available in this section.</p>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" onClick={resetQuestion} disabled={!currentQuestion}>
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                    <div>
                      <Button
                        variant="secondary"
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

              <div className="w-1/3 pl-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Question List</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-2">
                      {sectionQuestions.map((question: any, index: number) => (
                        <Button
                          key={index}
                          variant="outline"
                          className={`w-full h-10 flex items-center justify-center ${getQuestionStatusClass(index)}`}
                          onClick={() => goToQuestion(index)}
                        >
                          {index + 1}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={() => setShowQuestionsDialog(true)}>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>All Questions</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {questions.map((question: any, index: number) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>Question {index + 1}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{question.question}</p>
                </CardContent>
                <CardFooter>
                  <Button
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
