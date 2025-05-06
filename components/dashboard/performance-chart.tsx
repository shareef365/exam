"use client"

import {
  Chart,
  ChartContent,
  LineChartContainer,
  ChartLine,
  ChartXAxis,
  ChartYAxis,
  ChartGrid,
  ChartTooltip,
  ChartLegend,
  PieChartContainer,
  ChartPie,
  ChartCell,
} from "@/components/ui/chart"

const lineData = [
  { name: "Jan", score: 65, average: 60 },
  { name: "Feb", score: 59, average: 60 },
  { name: "Mar", score: 70, average: 62 },
  { name: "Apr", score: 72, average: 63 },
  { name: "May", score: 68, average: 64 },
  { name: "Jun", score: 75, average: 65 },
  { name: "Jul", score: 80, average: 67 },
]

const subjectData = [
  { name: "Physics", value: 65, color: "#3b82f6" },
  { name: "Chemistry", value: 48, color: "#8b5cf6" },
  { name: "Mathematics", value: 72, color: "#ec4899" },
]

export default function PerformanceChart() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="h-[300px] w-full">
        <Chart>
          <ChartContent width="100%" height="100%">
            <LineChartContainer
              data={lineData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <ChartGrid strokeDasharray="3 3" />
              <ChartXAxis dataKey="name" />
              <ChartYAxis />
              <ChartTooltip />
              <ChartLegend />
              <ChartLine type="monotone" dataKey="score" stroke="#3b82f6" activeDot={{ r: 8 }} name="Your Score" />
              <ChartLine type="monotone" dataKey="average" stroke="#9ca3af" name="Class Average" />
            </LineChartContainer>
          </ChartContent>
        </Chart>
      </div>

      <div className="h-[300px] w-full">
        <Chart>
          <ChartContent width="100%" height="100%">
            <PieChartContainer>
              <ChartPie
                data={subjectData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {subjectData.map((entry, index) => (
                  <ChartCell key={`cell-${index}`} fill={entry.color} />
                ))}
              </ChartPie>
              <ChartLegend />
            </PieChartContainer>
          </ChartContent>
        </Chart>
      </div>
    </div>
  )
}
