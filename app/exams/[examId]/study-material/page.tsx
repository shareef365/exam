import Link from "next/link"
import { ArrowRight, BookOpen, FileText, Video, Download, ExternalLink, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function StudyMaterialPage({ params }: { params: { examId: string } }) {
  // This would normally come from a database
  const examId = params.examId

  // Mock data for study materials
  const examData = {
    "jee-main": {
      name: "JEE Main",
      subjects: ["Physics", "Chemistry", "Mathematics"],
      materials: {
        notes: [
          {
            id: 1,
            title: "Physics - Mechanics Comprehensive Notes",
            description: "Complete notes covering Newton's Laws, Work, Energy, and Rotational Dynamics",
            subject: "Physics",
            pages: 45,
            downloadCount: 2500,
            lastUpdated: "2023-10-15",
            premium: false,
          },
          {
            id: 2,
            title: "Organic Chemistry Reaction Mechanisms",
            description: "Detailed explanation of all important organic chemistry reactions with mechanisms",
            subject: "Chemistry",
            pages: 68,
            downloadCount: 1800,
            lastUpdated: "2023-11-02",
            premium: true,
          },
          {
            id: 3,
            title: "Calculus Master Notes",
            description: "Comprehensive notes on differentiation, integration and their applications",
            subject: "Mathematics",
            pages: 72,
            downloadCount: 3200,
            lastUpdated: "2023-09-28",
            premium: false,
          },
        ],
        videos: [
          {
            id: 1,
            title: "Electromagnetism Masterclass",
            description: "Complete explanation of electromagnetic induction and related concepts",
            subject: "Physics",
            duration: "1h 45m",
            viewCount: 15000,
            instructor: "Dr. Rajesh Kumar",
            premium: true,
          },
          {
            id: 2,
            title: "Periodic Table and Chemical Bonding",
            description: "Learn about periodic trends and different types of chemical bonds",
            subject: "Chemistry",
            duration: "2h 10m",
            viewCount: 12500,
            instructor: "Dr. Priya Singh",
            premium: false,
          },
          {
            id: 3,
            title: "Coordinate Geometry Problem Solving",
            description: "Advanced problem solving techniques for coordinate geometry questions",
            subject: "Mathematics",
            duration: "1h 30m",
            viewCount: 18000,
            instructor: "Prof. Amit Verma",
            premium: false,
          },
        ],
        formulas: [
          {
            id: 1,
            title: "Physics Formula Sheet",
            description: "Comprehensive collection of all important physics formulas for JEE Main",
            subject: "Physics",
            formulas: 120,
            downloadCount: 5000,
            lastUpdated: "2023-11-10",
            premium: false,
          },
          {
            id: 2,
            title: "Chemistry Equations and Constants",
            description: "Important chemical equations, constants and conversion factors",
            subject: "Chemistry",
            formulas: 85,
            downloadCount: 4200,
            lastUpdated: "2023-10-25",
            premium: false,
          },
          {
            id: 3,
            title: "Mathematics Formula Handbook",
            description: "Complete collection of mathematical formulas with examples",
            subject: "Mathematics",
            formulas: 150,
            downloadCount: 6500,
            lastUpdated: "2023-11-05",
            premium: true,
          },
        ],
        previousPapers: [
          {
            id: 1,
            title: "JEE Main 2023 (January Session)",
            description: "Complete question paper with detailed solutions",
            questions: 90,
            difficulty: "Medium",
            downloadCount: 8500,
            premium: false,
          },
          {
            id: 2,
            title: "JEE Main 2023 (April Session)",
            description: "Complete question paper with detailed solutions",
            questions: 90,
            difficulty: "Hard",
            downloadCount: 7800,
            premium: false,
          },
          {
            id: 3,
            title: "JEE Main 2022 (All Sessions Compilation)",
            description: "Compilation of all JEE Main 2022 papers with topic-wise analysis",
            questions: 360,
            difficulty: "Mixed",
            downloadCount: 12000,
            premium: true,
          },
        ],
      },
      progress: {
        physics: 65,
        chemistry: 48,
        mathematics: 72,
        overall: 62,
      },
    },
    neet: {
      name: "NEET",
      subjects: ["Physics", "Chemistry", "Biology"],
      materials: {
        notes: [
          {
            id: 1,
            title: "Human Physiology Complete Notes",
            description: "Comprehensive notes on all human body systems and their functions",
            subject: "Biology",
            pages: 85,
            downloadCount: 3200,
            lastUpdated: "2023-10-20",
            premium: false,
          },
          {
            id: 2,
            title: "Organic Chemistry for NEET",
            description: "Detailed notes on organic chemistry with NEET-specific focus",
            subject: "Chemistry",
            pages: 62,
            downloadCount: 2800,
            lastUpdated: "2023-11-05",
            premium: true,
          },
        ],
        videos: [
          {
            id: 1,
            title: "Cell Biology Masterclass",
            description: "Detailed explanation of cell structure, function and division",
            subject: "Biology",
            duration: "2h 15m",
            viewCount: 18500,
            instructor: "Dr. Meera Sharma",
            premium: true,
          },
          {
            id: 2,
            title: "Thermodynamics and Kinetics",
            description: "Complete explanation of thermodynamic principles and chemical kinetics",
            subject: "Chemistry",
            duration: "1h 55m",
            viewCount: 14200,
            instructor: "Dr. Anand Gupta",
            premium: false,
          },
        ],
        formulas: [
          {
            id: 1,
            title: "Biology Important Concepts",
            description: "Key biological concepts, cycles and processes for quick revision",
            subject: "Biology",
            formulas: 95,
            downloadCount: 6200,
            lastUpdated: "2023-11-12",
            premium: false,
          },
        ],
        previousPapers: [
          {
            id: 1,
            title: "NEET 2023",
            description: "Complete question paper with detailed solutions",
            questions: 180,
            difficulty: "Medium",
            downloadCount: 9500,
            premium: false,
          },
        ],
      },
      progress: {
        physics: 55,
        chemistry: 68,
        biology: 72,
        overall: 65,
      },
    },
  }

  const exam = examData[examId as keyof typeof examData]

  if (!exam) {
    return (
      <div className="container px-4 py-12 md:px-6 md:py-16">
        <h1 className="text-3xl font-bold">Study Material Not Found</h1>
        <p className="mt-4">The requested exam study material could not be found.</p>
        <Button asChild className="mt-6">
          <Link href="/exams">Browse All Exams</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{exam.name} Study Material</h1>
          <p className="text-muted-foreground">
            Comprehensive study resources to help you prepare for your {exam.name} exam
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/exams/${examId}`}>Exam Details</Link>
          </Button>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href={`/exams/${examId}/practice`}>
              Practice Questions <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your Study Progress</CardTitle>
          <CardDescription>Track your preparation progress across subjects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Overall Progress</span>
                <span>{exam.progress.overall}%</span>
              </div>
              <Progress value={exam.progress.overall} className="h-2" />
            </div>

            {exam.subjects.map((subject) => (
              <div key={subject} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{subject}</span>
                  <span>{exam.progress[subject.toLowerCase()]}%</span>
                </div>
                <Progress value={exam.progress[subject.toLowerCase()]} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Study Materials Tabs */}
      <Tabs defaultValue="notes" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="notes">
            <BookOpen className="mr-2 h-4 w-4" />
            Notes
          </TabsTrigger>
          <TabsTrigger value="videos">
            <Video className="mr-2 h-4 w-4" />
            Video Lectures
          </TabsTrigger>
          <TabsTrigger value="formulas">
            <FileText className="mr-2 h-4 w-4" />
            Formula Sheets
          </TabsTrigger>
          <TabsTrigger value="papers">
            <FileText className="mr-2 h-4 w-4" />
            Previous Papers
          </TabsTrigger>
        </TabsList>

        {/* Notes Tab */}
        <TabsContent value="notes" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {exam.materials.notes.map((note) => (
              <Card key={note.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between">
                    <Badge variant="outline">{note.subject}</Badge>
                    {note.premium && <Badge className="bg-amber-500">Premium</Badge>}
                  </div>
                  <CardTitle className="mt-2 line-clamp-2">{note.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{note.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <FileText className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span>{note.pages} pages</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Updated: {note.lastUpdated}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-3 border-t">
                  <Button asChild variant="outline" className="w-full">
                    <Link href="#">
                      <Download className="mr-2 h-4 w-4" />
                      Download Notes
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Videos Tab */}
        <TabsContent value="videos" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {exam.materials.videos.map((video) => (
              <Card key={video.id} className="overflow-hidden">
                <div className="aspect-video bg-muted relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Video className="h-12 w-12 text-muted-foreground opacity-50" />
                  </div>
                  {video.premium && <Badge className="absolute top-2 right-2 bg-amber-500">Premium</Badge>}
                </div>
                <CardHeader className="pb-3">
                  <Badge variant="outline">{video.subject}</Badge>
                  <CardTitle className="mt-2 line-clamp-2">{video.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{video.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span>{video.duration}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">By: {video.instructor}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-3 border-t">
                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                    <Link href="#">
                      <Video className="mr-2 h-4 w-4" />
                      Watch Video
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Formula Sheets Tab */}
        <TabsContent value="formulas" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {exam.materials.formulas.map((formula) => (
              <Card key={formula.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between">
                    <Badge variant="outline">{formula.subject}</Badge>
                    {formula.premium && <Badge className="bg-amber-500">Premium</Badge>}
                  </div>
                  <CardTitle className="mt-2 line-clamp-2">{formula.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{formula.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <FileText className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span>{formula.formulas} formulas</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Updated: {formula.lastUpdated}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-3 border-t">
                  <Button asChild variant="outline" className="w-full">
                    <Link href="#">
                      <Download className="mr-2 h-4 w-4" />
                      Download Formula Sheet
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Previous Papers Tab */}
        <TabsContent value="papers" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {exam.materials.previousPapers.map((paper) => (
              <Card key={paper.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between">
                    <Badge
                      variant="outline"
                      className={
                        paper.difficulty === "Easy"
                          ? "border-green-500 text-green-500"
                          : paper.difficulty === "Medium"
                            ? "border-yellow-500 text-yellow-500"
                            : paper.difficulty === "Hard"
                              ? "border-red-500 text-red-500"
                              : ""
                      }
                    >
                      {paper.difficulty}
                    </Badge>
                    {paper.premium && <Badge className="bg-amber-500">Premium</Badge>}
                  </div>
                  <CardTitle className="mt-2 line-clamp-2">{paper.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{paper.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <FileText className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span>{paper.questions} questions</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{paper.downloadCount.toLocaleString()} downloads</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-3 border-t flex gap-2">
                  <Button asChild variant="outline" className="w-full">
                    <Link href="#">
                      <Download className="mr-2 h-4 w-4" />
                      Download Paper
                    </Link>
                  </Button>
                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                    <Link href={`/exams/${examId}/practice?paper=${paper.id}`}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Practice
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
