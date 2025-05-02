import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function FeaturedExams() {
  const featuredExams = [
    {
      id: "jee-main",
      name: "JEE Main",
      description: "Joint Entrance Examination for engineering admissions across India",
      questions: 90,
      duration: "3 hours",
      popularity: "Most Popular",
      color: "bg-blue-600",
    },
    {
      id: "neet",
      name: "NEET",
      description: "National Eligibility cum Entrance Test for medical courses",
      questions: 180,
      duration: "3 hours",
      popularity: "Trending",
      color: "bg-green-600",
    },
    {
      id: "eamcet-ap",
      name: "EAMCET (AP)",
      description: "Engineering, Agriculture and Medical Common Entrance Test for Andhra Pradesh",
      questions: 160,
      duration: "3 hours",
      popularity: "Popular",
      color: "bg-purple-600",
    },
  ]

  return (
    <section className="py-16">
      <div className="container px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Featured Exams</h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400">Our most popular exam simulators that students love</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredExams.map((exam) => (
            <div
              key={exam.id}
              className="relative overflow-hidden rounded-lg border bg-background shadow-sm transition-all hover:shadow-md"
            >
              <div
                className={`absolute right-0 top-0 rounded-bl-lg ${exam.color} px-3 py-1 text-xs font-medium text-white`}
              >
                {exam.popularity}
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold">{exam.name}</h3>
                <p className="mt-2 text-muted-foreground">{exam.description}</p>
                <div className="mt-4 flex items-center gap-4">
                  <div>
                    <p className="text-sm font-medium">Questions</p>
                    <p className="text-2xl font-bold">{exam.questions}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Duration</p>
                    <p className="text-2xl font-bold">{exam.duration}</p>
                  </div>
                </div>
                <Button asChild className="mt-6 w-full" variant="outline">
                  <Link href={`/exams/${exam.id}`}>
                    Try Simulator <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild size="lg">
            <Link href="/exams">
              View All Exams <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
