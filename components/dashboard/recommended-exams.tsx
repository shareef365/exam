import Link from "next/link"
import { ArrowRight, BookOpen, Clock, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function RecommendedExams() {
  const recommendedExams = [
    {
      id: 1,
      name: "JEE Main 2023 Paper Analysis",
      description: "Based on your performance in Physics",
      difficulty: "Medium",
      duration: "3 hours",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Chemistry - Weak Areas Practice",
      description: "Focus on Organic Chemistry concepts",
      difficulty: "Hard",
      duration: "1.5 hours",
      rating: 4.5,
    },
    {
      id: 3,
      name: "Mathematics Speed Test",
      description: "Improve your calculation speed",
      difficulty: "Medium",
      duration: "1 hour",
      rating: 4.7,
    },
  ]

  return (
    <div className="space-y-4">
      {recommendedExams.map((exam) => (
        <div key={exam.id} className="rounded-lg border p-4">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium">{exam.name}</h4>
              <p className="text-sm text-muted-foreground">{exam.description}</p>
              <div className="mt-2 flex items-center gap-4">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{exam.duration}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>{exam.difficulty}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  <span>{exam.rating}</span>
                </div>
              </div>
            </div>
            <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Link href={`/exams/mock-tests/${exam.id}`}>
                Start <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
        </div>
      ))}
      <Button asChild variant="ghost" className="w-full">
        <Link href="/exams">View More Recommendations</Link>
      </Button>
    </div>
  )
}
