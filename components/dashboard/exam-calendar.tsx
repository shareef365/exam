"use client"

import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card } from "@/components/ui/card"

// Sample scheduled exams
const scheduledExams = [
  {
    id: "exam1",
    examId: "jee-main",
    name: "JEE Main Mock Test",
    date: new Date(2023, 4, 15), // May 15, 2023
    time: "10:00 AM",
  },
  {
    id: "exam2",
    examId: "neet",
    name: "NEET Full Mock Test",
    date: new Date(2023, 4, 20), // May 20, 2023
    time: "09:00 AM",
  },
  {
    id: "exam3",
    examId: "jee-advanced",
    name: "JEE Advanced Paper 1",
    date: new Date(2023, 4, 25), // May 25, 2023
    time: "09:00 AM",
  },
]

export default function ExamCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedExams, setSelectedExams] = useState([])

  // Function to highlight dates with exams
  const isDayWithExam = (day: Date) => {
    return scheduledExams.some(
      (exam) =>
        exam.date.getDate() === day.getDate() &&
        exam.date.getMonth() === day.getMonth() &&
        exam.date.getFullYear() === day.getFullYear(),
    )
  }

  // Update selected exams when date changes
  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate)
    if (newDate) {
      const examsOnSelectedDate = scheduledExams.filter(
        (exam) =>
          exam.date.getDate() === newDate.getDate() &&
          exam.date.getMonth() === newDate.getMonth() &&
          exam.date.getFullYear() === newDate.getFullYear(),
      )
      setSelectedExams(examsOnSelectedDate)
    } else {
      setSelectedExams([])
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="md:w-1/2">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateChange}
          className="rounded-md border"
          modifiers={{ withExam: isDayWithExam }}
          modifiersStyles={{
            withExam: { backgroundColor: "rgba(59, 130, 246, 0.1)", fontWeight: "bold" },
          }}
        />
      </div>
      <div className="md:w-1/2">
        <h3 className="mb-4 font-medium">
          {date ? <>Exams on {date.toLocaleDateString()}</> : <>Select a date to see scheduled exams</>}
        </h3>
        {selectedExams.length > 0 ? (
          <div className="space-y-3">
            {selectedExams.map((exam) => (
              <Card key={exam.id} className="p-3 flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{exam.name}</h4>
                  <p className="text-sm text-muted-foreground">{exam.time}</p>
                </div>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Start Exam
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex h-[200px] flex-col items-center justify-center space-y-3 rounded-md border border-dashed p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <CalendarIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium">No exams scheduled</h3>
              <p className="text-sm text-muted-foreground">
                {date ? "No exams scheduled for this date." : "Select a date to see scheduled exams."}
              </p>
            </div>
            <Button className="mt-2 bg-blue-600 hover:bg-blue-700">Schedule Test</Button>
          </div>
        )}
      </div>
    </div>
  )
}
