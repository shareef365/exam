import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock, Trophy } from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative h-24 w-24 overflow-hidden rounded-full md:h-32 md:w-32">
            <Image
              src="/placeholder.svg?height=128&width=128"
              alt="Profile picture"
              width={128}
              height={128}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Rahul Sharma</h1>
            <p className="text-muted-foreground">JEE Aspirant • Joined January 2023</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="secondary">Physics Enthusiast</Badge>
              <Badge variant="secondary">Math Wizard</Badge>
              <Badge variant="secondary">Chemistry Explorer</Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/settings">Edit Profile</Link>
          </Button>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </div>

      {/* <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6 pt-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Stats</CardTitle>
                <CardDescription>Your exam statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tests Completed</span>
                    <span className="font-medium">24</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Score</span>
                    <span className="font-medium">72%</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Study Hours</span>
                    <span className="font-medium">148</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Best Subject</span>
                    <span className="font-medium">Mathematics</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your recent exam activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Completed JEE Main Mock Test</p>
                      <p className="text-sm text-muted-foreground">2 days ago • Score: 78%</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                      <Trophy className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Earned "Physics Master" badge</p>
                      <p className="text-sm text-muted-foreground">5 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                      <CalendarDays className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Scheduled NEET Mock Test</p>
                      <p className="text-sm text-muted-foreground">1 week ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Tests</CardTitle>
                <CardDescription>Your scheduled mock tests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border p-3">
                    <p className="font-medium">JEE Main Full Mock Test</p>
                    <p className="text-sm text-muted-foreground">Tomorrow, 10:00 AM</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs">3 hours</span>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs">Full Length</span>
                    </div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="font-medium">Physics - Electromagnetism</p>
                    <p className="text-sm text-muted-foreground">Wed, 2:00 PM</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs">1 hour</span>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs">Subject Test</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Trend</CardTitle>
              <CardDescription>Your score trend over the last 10 tests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full rounded-md border border-dashed p-10 text-center">
                <div className="flex >
                 */}

</div>)
}