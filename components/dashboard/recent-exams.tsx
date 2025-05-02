import Link from "next/link"
import { ArrowUpRight, CheckCircle, XCircle } from "lucide-react"

export default function RecentExams() {
  const recentExams = [
    {
      id: 1,
      name: "JEE Main Mock Test 3",
      date: "2 days ago",
      score: 78,
      maxScore: 100,
      percentile: 82,
      status: "pass",
    },
    {
      id: 2,
      name: "Physics - Mechanics",
      date: "5 days ago",
      score: 65,
      maxScore: 100,
      percentile: 70,
      status: "pass",
    },
    {
      id: 3,
      name: "Chemistry - Organic",
      date: "1 week ago",
      score: 45,
      maxScore: 100,
      percentile: 52,
      status: "fail",
    },
    {
      id: 4,
      name: "Mathematics - Calculus",
      date: "2 weeks ago",
      score: 82,
      maxScore: 100,
      percentile: 88,
      status: "pass",
    },
  ]

  return (
    <div className="space-y-4">
      {recentExams.map((exam) => (
        <div key={exam.id} className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                exam.status === "pass"
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
              }`}
            >
              {exam.status === "pass" ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            </div>
            <div>
              <p className="font-medium">{exam.name}</p>
              <p className="text-sm text-muted-foreground">{exam.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium">
                {exam.score}/{exam.maxScore}
              </p>
              <p className="text-sm text-muted-foreground">{exam.percentile} percentile</p>
            </div>
            <Link
              href={`/exams/results/${exam.id}`}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-muted hover:bg-muted/80"
            >
              <ArrowUpRight className="h-4 w-4" />
              <span className="sr-only">View details</span>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
