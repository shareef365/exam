"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ExamRedirect({ params }: { params: { examId: string } }) {
  const router = useRouter()
  const examId = params.examId

  useEffect(() => {
    // Redirect to the appropriate exam simulator based on examId
    if (examId === "jee-main") {
      router.push("/exams/jee/simulator")
    } else if (examId === "neet") {
      router.push("/exams/neet/simulator")
    } else if (examId === "eamcet-ap") {
      router.push("/exams/eamcet/simulator")
    } else {
      // Default fallback to JEE if exam not found
      router.push("/exams/jee/simulator")
    }
  }, [examId, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  )
}
