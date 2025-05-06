"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

// Sample upcoming tests data
const sampleUpcomingTests = [
  {
    id: "test1",
    examId: "jee-main",
    name: "JEE Main Mock Test",
    date: "2023-05-15",
    time: "10:00 AM",
    duration: "3 hours",
  },
  {
    id: "test2",
    examId: "neet",
    name: "NEET Full Mock Test",
    date: "2023-05-20",
    time: "09:00 AM",
    duration: "3 hours 20 minutes",
  },
  {
    id: "test3",
    examId: "jee-advanced",
    name: "JEE Advanced Paper 1",
    date: "2023-05-25",
    time: "09:00 AM",
    duration: "3 hours",
  },
]

export default function UpcomingTests() {
  const [upcomingTests, setUpcomingTests] = useState(sampleUpcomingTests)

  if (upcomingTests.length === 0) {
    return (
      <div className="flex h-[200px] flex-col items-center justify-center space-y-3 rounded-md border border-dashed p-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Calendar className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-medium">No upcoming tests</h3>
          <p className="text-sm text-muted-foreground">Schedule a test to see it here.</p>
        </div>
        <Button asChild className="mt-2 bg-blue-600 hover:bg-blue-700">
          <Link href="/dashboard/schedule">Schedule Test</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {upcomingTests.map((test) => (
        <div key={test.id} className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-1">
            <h4 className="font-medium">{test.name}</h4>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>{new Date(test.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{test.time}</span>
              </div>
            </div>
          </div>
          <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Link href={`/exams/${test.examId}/simulator`}>Start</Link>
          </Button>
        </div>
      ))}
    </div>
  )
}
