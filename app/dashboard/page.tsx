"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, BarChart3, BookOpen, Clock, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth-provider"
import { getExamResults } from "@/lib/exam-results"
import RecentExams from "@/components/dashboard/recent-exams"
import UpcomingTests from "@/components/dashboard/upcoming-tests"
import SubjectPerformance from "@/components/dashboard/subject-performance"
import RecommendedExams from "@/components/dashboard/recommended-exams"
import ExamCalendar from "@/components/dashboard/exam-calendar"
import PerformanceChart from "@/components/dashboard/performance-chart"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [examResults, setExamResults] = useState<any[]>([])
  const [dashboardStats, setDashboardStats] = useState({
    testsCompleted: 0,
    averageScore: 0,
    studyTime: 0,
    rankPrediction: 0,
  })

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    // Get exam results from storage
    const results = getExamResults()
    setExamResults(results)

    // Calculate dashboard stats
    if (results.length > 0) {
      const totalScore = results.reduce((sum, result) => sum + (result.score / result.maxScore) * 100, 0)
      const averageScore = totalScore / results.length
      const totalTime = results.reduce((sum, result) => sum + result.timeSpent, 0)

      setDashboardStats({
        testsCompleted: results.length,
        averageScore: Math.round(averageScore),
        studyTime: Math.round(totalTime / 3600), // Convert to hours
        rankPrediction: Math.max(1, Math.floor(10000 * (1 - averageScore / 100))),
      })
    }
  }, [])

  if (isLoading || !user) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-6 md:px-6 md:py-10">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.name}! Track your progress and prepare for your exams.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/exams">Browse Exams</Link>
          </Button>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/dashboard/schedule">
              Schedule Test <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tests Completed</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.testsCompleted}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats.testsCompleted > 0 ? "+1 from last week" : "Start your first test!"}
            </p>
            <Progress value={dashboardStats.testsCompleted > 0 ? 80 : 0} className="mt-3 h-1" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.averageScore}%</div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats.testsCompleted > 1 ? "+5% from last month" : "Complete more tests to see trends"}
            </p>
            <Progress value={dashboardStats.averageScore} className="mt-3 h-1" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Study Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.studyTime}h</div>
            <p className="text-xs text-muted-foreground">This month</p>
            <Progress value={Math.min((dashboardStats.studyTime / 100) * 100, 100)} className="mt-3 h-1" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rank Prediction</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.rankPrediction.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Based on current performance</p>
            <Progress value={Math.max(100 - (dashboardStats.rankPrediction / 10000) * 100, 0)} className="mt-3 h-1" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Recent Exams</CardTitle>
                <CardDescription>Your performance in recent tests</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentExams examResults={examResults} />
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Upcoming Tests</CardTitle>
                <CardDescription>Your scheduled mock tests</CardDescription>
              </CardHeader>
              <CardContent>
                <UpcomingTests />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Subject Performance</CardTitle>
                <CardDescription>Your performance by subject</CardDescription>
              </CardHeader>
              <CardContent>
                <SubjectPerformance examResults={examResults} />
              </CardContent>
            </Card>
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Recommended Exams</CardTitle>
                <CardDescription>Based on your performance and goals</CardDescription>
              </CardHeader>
              <CardContent>
                <RecommendedExams examResults={examResults} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>Detailed analysis of your performance</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <PerformanceChart />
            </CardContent>
          </Card>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Subject-wise Trends</CardTitle>
                <CardDescription>Your progress over time by subject</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  {examResults.length > 0 ? (
                    <SubjectPerformance examResults={examResults} showTrends={true} />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center space-y-2">
                      <BarChart3 className="h-10 w-10 text-muted-foreground" />
                      <h3 className="text-lg font-medium">Subject Performance Trends</h3>
                      <p className="text-sm text-muted-foreground">
                        Complete more exams to see your performance trends by subject.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Weak Areas</CardTitle>
                <CardDescription>Topics that need improvement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Organic Chemistry</span>
                      <span className="text-sm text-muted-foreground">42% accuracy</span>
                    </div>
                    <Progress value={42} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Electromagnetism</span>
                      <span className="text-sm text-muted-foreground">48% accuracy</span>
                    </div>
                    <Progress value={48} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Calculus</span>
                      <span className="text-sm text-muted-foreground">55% accuracy</span>
                    </div>
                    <Progress value={55} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Schedule</CardTitle>
              <CardDescription>Your upcoming test schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <ExamCalendar />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
