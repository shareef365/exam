import Link from "next/link"
import { ArrowRight, BarChart3, BookOpen, Calendar, Clock, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RecentExams from "@/components/dashboard/recent-exams"
import UpcomingTests from "@/components/dashboard/upcoming-tests"
import SubjectPerformance from "@/components/dashboard/subject-performance"
import RecommendedExams from "@/components/dashboard/recommended-exams"

export default function DashboardPage() {
  return (
    <div className="container px-4 py-6 md:px-6 md:py-10">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Rahul! Track your progress and prepare for your exams.</p>
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
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+3 from last week</p>
            <Progress value={80} className="mt-3 h-1" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">72%</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
            <Progress value={72} className="mt-3 h-1" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Study Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48h</div>
            <p className="text-xs text-muted-foreground">This month</p>
            <Progress value={65} className="mt-3 h-1" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rank Prediction</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,240</div>
            <p className="text-xs text-muted-foreground">Based on current performance</p>
            <Progress value={85} className="mt-3 h-1" />
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
                <RecentExams />
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
                <SubjectPerformance />
              </CardContent>
            </Card>
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Recommended Exams</CardTitle>
                <CardDescription>Based on your performance and goals</CardDescription>
              </CardHeader>
              <CardContent>
                <RecommendedExams />
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
            <CardContent>
              <div className="h-[300px] w-full rounded-md border border-dashed p-10 text-center">
                <div className="flex h-full flex-col items-center justify-center space-y-2">
                  <Calendar className="h-10 w-10 text-muted-foreground" />
                  <h3 className="text-lg font-medium">Performance Analytics</h3>
                  <p className="text-sm text-muted-foreground">
                    Detailed charts and analytics about your performance will appear here.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Schedule</CardTitle>
              <CardDescription>Your upcoming test schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full rounded-md border border-dashed p-10 text-center">
                <div className="flex h-full flex-col items-center justify-center space-y-2">
                  <Calendar className="h-10 w-10 text-muted-foreground" />
                  <h3 className="text-lg font-medium">Test Calendar</h3>
                  <p className="text-sm text-muted-foreground">Your scheduled tests and study plan will appear here.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
