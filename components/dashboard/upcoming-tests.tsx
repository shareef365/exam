import Link from "next/link"
import { ArrowRight, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function UpcomingTests() {
  const upcomingTests = [
    {
      id: 1,
      name: "JEE Main Full Mock Test",
      date: "Tomorrow, 10:00 AM",
      duration: "3 hours",
      type: "Full Length",
    },
    {
      id: 2,
      name: "Physics - Electromagnetism",
      date: "Wed, 2:00 PM",
      duration: "1 hour",
      type: "Subject Test",
    },
    {
      id: 3,
      name: "Chemistry - Periodic Table",
      date: "Fri, 4:00 PM",
      duration: "45 minutes",
      type: "Topic Test",
    },
  ]

  return (
    <div className="space-y-4">
      {upcomingTests.map((test) => (
        <div key={test.id} className="flex items-start justify-between gap-4 rounded-lg border p-4">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">{test.name}</p>
              <p className="text-sm text-muted-foreground">{test.date}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{test.duration}</span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{test.type}</span>
              </div>
            </div>
          </div>
          <Button asChild size="sm" variant="outline">
            <Link href={`/exams/mock-tests/${test.id}`}>
              Start <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>
      ))}
      <Button asChild variant="ghost" className="w-full">
        <Link href="/dashboard/schedule">View All Scheduled Tests</Link>
      </Button>
    </div>
  )
}
