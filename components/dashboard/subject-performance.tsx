import { Progress } from "@/components/ui/progress"

export default function SubjectPerformance() {
  const subjects = [
    { name: "Physics", score: 78, color: "bg-blue-500" },
    { name: "Chemistry", score: 65, color: "bg-green-500" },
    { name: "Mathematics", score: 82, color: "bg-purple-500" },
    { name: "Biology", score: 70, color: "bg-yellow-500" },
  ]

  return (
    <div className="space-y-4">
      {subjects.map((subject) => (
        <div key={subject.name} className="space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{subject.name}</p>
            <p className="text-sm font-medium">{subject.score}%</p>
          </div>
          <Progress value={subject.score} className={`h-2 ${subject.color}`} />
        </div>
      ))}
    </div>
  )
}
