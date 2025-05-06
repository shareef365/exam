import Link from "next/link"
import { ArrowRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ExamsPage() {
  const examCategories = [
    {
      id: "engineering",
      name: "Engineering",
      exams: [
        { id: "jee-main", name: "JEE Main", questions: 90, duration: "3 hours", popularity: "Most Popular" },
        { id: "jee-advanced", name: "JEE Advanced", questions: 54, duration: "3 hours", popularity: "Popular" },
        { id: "bitsat", name: "BITSAT", questions: 150, duration: "3 hours", popularity: "Popular" },
        { id: "eamcet-ap", name: "EAMCET (AP)", questions: 160, duration: "3 hours", popularity: "Popular" },
        { id: "eamcet-ts", name: "EAMCET (TS)", questions: 160, duration: "3 hours", popularity: "Popular" },
        { id: "viteee", name: "VITEEE", questions: 125, duration: "2.5 hours", popularity: "Trending" },
      ],
    },
    {
      id: "medical",
      name: "Medical",
      exams: [
        { id: "neet", name: "NEET", questions: 180, duration: "3 hours", popularity: "Most Popular" },
        { id: "aiims", name: "AIIMS", questions: 200, duration: "3.5 hours", popularity: "Popular" },
        { id: "jipmer", name: "JIPMER", questions: 200, duration: "2.5 hours", popularity: "Popular" },
      ],
    },
    {
      id: "management",
      name: "Management",
      exams: [
        { id: "cat", name: "CAT", questions: 66, duration: "2 hours", popularity: "Most Popular" },
        { id: "xat", name: "XAT", questions: 100, duration: "3 hours", popularity: "Popular" },
        { id: "mat", name: "MAT", questions: 200, duration: "2.5 hours", popularity: "Popular" },
      ],
    },
    {
      id: "government",
      name: "Government",
      exams: [
        { id: "upsc", name: "UPSC CSE", questions: 100, duration: "2 hours", popularity: "Most Popular" },
        { id: "ssc-cgl", name: "SSC CGL", questions: 100, duration: "2 hours", popularity: "Popular" },
        { id: "bank-po", name: "Bank PO", questions: 100, duration: "1 hour", popularity: "Popular" },
      ],
    },
  ]

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <div className="mb-12 space-y-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">All Exams</h1>
        <p className="max-w-[800px] text-gray-500 dark:text-gray-400">
          Browse our comprehensive collection of exam simulators designed to replicate the exact experience of real
          competitive exams.
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search exams..." className="pl-10" />
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">Search</Button>
      </div>

      <Tabs defaultValue="engineering" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="engineering">Engineering</TabsTrigger>
          <TabsTrigger value="medical">Medical</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
          <TabsTrigger value="government">Government</TabsTrigger>
        </TabsList>

        {examCategories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {category.exams.map((exam) => (
                <Link key={exam.id} href={`/exams/${exam.id}`}>
                  <Card className="h-full transition-all hover:shadow-md">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{exam.name}</CardTitle>
                        {exam.popularity === "Most Popular" && (
                          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            {exam.popularity}
                          </span>
                        )}
                        {exam.popularity === "Popular" && (
                          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                            {exam.popularity}
                          </span>
                        )}
                        {exam.popularity === "Trending" && (
                          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                            {exam.popularity}
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Questions</p>
                          <p className="text-xl font-bold">{exam.questions}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Duration</p>
                          <p className="text-xl font-bold">{exam.duration}</p>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full">
                        Try Simulator <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
