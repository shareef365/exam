import Link from "next/link"
import { ArrowRight, Clock, FileText, HelpCircle, Star, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ExamPage({ params }: { params: { examId: string } }) {
  // This would normally come from a database
  const examData = {
    "jee-main": {
      name: "JEE Main",
      fullName: "Joint Entrance Examination (Main)",
      description:
        "JEE Main is a standardized test conducted for admission to various engineering colleges in India. It is constituted by two papers - Paper 1 and Paper 2. Paper 1 is for admission to B.E./B.Tech courses and is conducted in a Computer Based Test (CBT) mode. Paper 2 is for admission to B.Arch and B.Planning courses.",
      questions: 90,
      duration: "3 hours",
      subjects: ["Physics", "Chemistry", "Mathematics"],
      examPattern: [
        "The exam consists of 90 questions worth a total of 300 marks.",
        "Each subject (Physics, Chemistry, and Mathematics) has 30 questions.",
        "Each question carries 4 marks for correct answers.",
        "There is a negative marking of 1 mark for incorrect answers.",
        "No marks are deducted for unattempted questions.",
      ],
      mockTests: [
        { id: 1, name: "JEE Main 2023 Mock Test 1", questions: 90, duration: "3 hours", difficulty: "Medium" },
        { id: 2, name: "JEE Main 2023 Mock Test 2", questions: 90, duration: "3 hours", difficulty: "Hard" },
        { id: 3, name: "JEE Main 2022 Paper", questions: 90, duration: "3 hours", difficulty: "Medium" },
        { id: 4, name: "JEE Main 2021 Paper", questions: 90, duration: "3 hours", difficulty: "Easy" },
      ],
      popularity: "Most Popular",
      students: "250,000+",
      rating: 4.8,
      reviews: 1250,
    },
    neet: {
      name: "NEET",
      fullName: "National Eligibility cum Entrance Test",
      description:
        "NEET is the qualifying entrance exam for MBBS and BDS programmes in Indian medical and dental colleges. It is conducted by the National Testing Agency (NTA).",
      questions: 180,
      duration: "3 hours 20 minutes",
      subjects: ["Physics", "Chemistry", "Biology (Botany & Zoology)"],
      examPattern: [
        "The exam consists of 180 questions worth a total of 720 marks.",
        "Physics and Chemistry sections contain 45 questions each.",
        "Biology section (Botany & Zoology) contains 90 questions.",
        "Each question carries 4 marks for correct answers.",
        "There is a negative marking of 1 mark for incorrect answers.",
        "No marks are deducted for unattempted questions.",
      ],
      mockTests: [
        { id: 1, name: "NEET 2023 Mock Test 1", questions: 180, duration: "3 hours 20 minutes", difficulty: "Medium" },
        { id: 2, name: "NEET 2023 Mock Test 2", questions: 180, duration: "3 hours 20 minutes", difficulty: "Hard" },
        { id: 3, name: "NEET 2022 Paper", questions: 180, duration: "3 hours 20 minutes", difficulty: "Medium" },
        { id: 4, name: "NEET 2021 Paper", questions: 180, duration: "3 hours 20 minutes", difficulty: "Easy" },
      ],
      popularity: "Most Popular",
      students: "200,000+",
      rating: 4.7,
      reviews: 980,
    },
    "eamcet-ap": {
      name: "EAMCET (AP)",
      fullName: "Engineering, Agriculture and Medical Common Entrance Test (Andhra Pradesh)",
      description:
        "AP EAMCET is a state-level entrance examination conducted for admission to various professional courses offered in university/private colleges in the state of Andhra Pradesh.",
      questions: 160,
      duration: "3 hours",
      subjects: ["Physics", "Chemistry", "Mathematics"],
      examPattern: [
        "The exam consists of 160 questions worth a total of 160 marks.",
        "Physics and Chemistry sections contain 40 questions each.",
        "Mathematics section contains 80 questions.",
        "Each question carries 1 mark for correct answers.",
        "There is no negative marking for incorrect answers.",
      ],
      mockTests: [
        { id: 1, name: "AP EAMCET 2023 Mock Test 1", questions: 160, duration: "3 hours", difficulty: "Medium" },
        { id: 2, name: "AP EAMCET 2023 Mock Test 2", questions: 160, duration: "3 hours", difficulty: "Hard" },
        { id: 3, name: "AP EAMCET 2022 Paper", questions: 160, duration: "3 hours", difficulty: "Medium" },
        { id: 4, name: "AP EAMCET 2021 Paper", questions: 160, duration: "3 hours", difficulty: "Easy" },
      ],
      popularity: "Popular",
      students: "120,000+",
      rating: 4.6,
      reviews: 750,
    },
  }

  // Default exam data in case the exam ID doesn't match
  const defaultExam = {
    name: "Exam",
    fullName: "Competitive Exam",
    description: "This is a competitive exam simulator.",
    questions: 100,
    duration: "3 hours",
    subjects: ["Subject 1", "Subject 2", "Subject 3"],
    examPattern: [
      "The exam consists of multiple-choice questions.",
      "Each question carries marks for correct answers.",
      "There may be negative marking for incorrect answers.",
    ],
    mockTests: [
      { id: 1, name: "Mock Test 1", questions: 100, duration: "3 hours", difficulty: "Medium" },
      { id: 2, name: "Mock Test 2", questions: 100, duration: "3 hours", difficulty: "Hard" },
    ],
    popularity: "Popular",
    students: "50,000+",
    rating: 4.5,
    reviews: 500,
  }

  // Get the exam data based on the exam ID, or use default if not found
  const exam = examData[params.examId as keyof typeof examData] || defaultExam

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <div className="mb-12 grid gap-6 md:grid-cols-2 md:gap-12">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">{exam.name}</h1>
          <p className="text-xl text-muted-foreground">{exam.fullName}</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="ml-1 font-medium">{exam.rating}</span>
              <span className="ml-1 text-muted-foreground">({exam.reviews} reviews)</span>
            </div>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span className="ml-1 text-muted-foreground">{exam.students} students</span>
            </div>
          </div>
          <p className="text-muted-foreground">{exam.description}</p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href={`/exams/${params.examId}/simulator`}>
                Start Simulator <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={`/exams/${params.examId}/mock-tests`}>View Mock Tests</Link>
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-xl font-bold">Exam Overview</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Questions</p>
                  <p className="text-muted-foreground">{exam.questions} questions</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Duration</p>
                  <p className="text-muted-foreground">{exam.duration}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:col-span-2">
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Subjects</p>
                  <p className="text-muted-foreground">{exam.subjects.join(", ")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="exam-pattern" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
          <TabsTrigger value="exam-pattern">Exam Pattern</TabsTrigger>
          <TabsTrigger value="mock-tests">Mock Tests</TabsTrigger>
          <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
        </TabsList>

        <TabsContent value="exam-pattern" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Exam Pattern</CardTitle>
              <CardDescription>Understanding the pattern is crucial for effective preparation</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="ml-6 list-disc space-y-2">
                {exam.examPattern.map((point, index) => (
                  <li key={index} className="text-muted-foreground">
                    {point}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mock-tests" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {exam.mockTests.map((test) => (
              <Card key={test.id} className="h-full">
                <CardHeader>
                  <CardTitle>{test.name}</CardTitle>
                  <CardDescription>
                    <span
                      className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                        test.difficulty === "Easy"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : test.difficulty === "Medium"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {test.difficulty}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Questions</p>
                      <p className="text-xl font-bold">{test.questions}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Duration</p>
                      <p className="text-xl font-bold">{test.duration}</p>
                    </div>
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/exams/${params.examId}/mock-tests/${test.id}`}>Start Test</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="syllabus" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Syllabus</CardTitle>
              <CardDescription>Comprehensive syllabus for {exam.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {exam.subjects.map((subject, index) => (
                  <div key={index}>
                    <h3 className="mb-2 text-xl font-bold">{subject}</h3>
                    <p className="mb-4 text-muted-foreground">
                      Complete syllabus for {subject} as per the latest {exam.name} pattern.
                    </p>
                    <div className="rounded-lg border bg-muted/40 p-4">
                      <p className="text-center text-muted-foreground">
                        Detailed syllabus content will be displayed here.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
