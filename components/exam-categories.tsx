import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ExamCategories() {
  return (
    <section className="bg-gray-50 py-16 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Explore Exam Categories</h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            We offer simulators for a wide range of competitive exams
          </p>
        </div>

        <Tabs defaultValue="engineering" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-5">
            <TabsTrigger value="engineering">Engineering</TabsTrigger>
            <TabsTrigger value="medical">Medical</TabsTrigger>
            <TabsTrigger value="management">Management</TabsTrigger>
            <TabsTrigger value="government">Government</TabsTrigger>
            <TabsTrigger value="others">Others</TabsTrigger>
          </TabsList>

          <TabsContent value="engineering" className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Link href="/exams/jee-main">
                <Card className="h-full transition-all hover:shadow-md">
                  <CardHeader>
                    <CardTitle>JEE Main</CardTitle>
                    <CardDescription>Joint Entrance Examination for engineering admissions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Practice with our simulator that perfectly replicates the JEE Main exam pattern, timing, and
                      interface.
                    </p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/exams/jee-advanced">
                <Card className="h-full transition-all hover:shadow-md">
                  <CardHeader>
                    <CardTitle>JEE Advanced</CardTitle>
                    <CardDescription>For admission to IITs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Experience the exact same environment as the real JEE Advanced exam with our simulator.
                    </p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/exams/eamcet-ap">
                <Card className="h-full transition-all hover:shadow-md">
                  <CardHeader>
                    <CardTitle>EAMCET (AP)</CardTitle>
                    <CardDescription>Engineering, Agriculture and Medical Common Entrance Test</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Prepare for Andhra Pradesh EAMCET with our realistic simulator.
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="medical" className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Link href="/exams/neet">
                <Card className="h-full transition-all hover:shadow-md">
                  <CardHeader>
                    <CardTitle>NEET</CardTitle>
                    <CardDescription>National Eligibility cum Entrance Test</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Practice with our NEET simulator that replicates the exact exam pattern and timing.
                    </p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/exams/aiims">
                <Card className="h-full transition-all hover:shadow-md">
                  <CardHeader>
                    <CardTitle>AIIMS</CardTitle>
                    <CardDescription>All India Institute of Medical Sciences Entrance Exam</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Prepare for AIIMS entrance with our realistic simulator.
                    </p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/exams/jipmer">
                <Card className="h-full transition-all hover:shadow-md">
                  <CardHeader>
                    <CardTitle>JIPMER</CardTitle>
                    <CardDescription>Jawaharlal Institute of Postgraduate Medical Education & Research</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Practice for JIPMER entrance exam with our simulator.
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="management" className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Link href="/exams/cat">
                <Card className="h-full transition-all hover:shadow-md">
                  <CardHeader>
                    <CardTitle>CAT</CardTitle>
                    <CardDescription>Common Admission Test</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Practice with our CAT simulator that replicates the exact exam pattern and timing.
                    </p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/exams/xat">
                <Card className="h-full transition-all hover:shadow-md">
                  <CardHeader>
                    <CardTitle>XAT</CardTitle>
                    <CardDescription>Xavier Aptitude Test</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Prepare for XAT with our realistic simulator.</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/exams/mat">
                <Card className="h-full transition-all hover:shadow-md">
                  <CardHeader>
                    <CardTitle>MAT</CardTitle>
                    <CardDescription>Management Aptitude Test</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Practice for MAT with our simulator that mimics the real exam.
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="government" className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Link href="/exams/upsc">
                <Card className="h-full transition-all hover:shadow-md">
                  <CardHeader>
                    <CardTitle>UPSC CSE</CardTitle>
                    <CardDescription>Civil Services Examination</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Practice with our UPSC simulator that replicates the exact exam pattern and timing.
                    </p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/exams/ssc-cgl">
                <Card className="h-full transition-all hover:shadow-md">
                  <CardHeader>
                    <CardTitle>SSC CGL</CardTitle>
                    <CardDescription>Staff Selection Commission Combined Graduate Level</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Prepare for SSC CGL with our realistic simulator.</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/exams/bank-po">
                <Card className="h-full transition-all hover:shadow-md">
                  <CardHeader>
                    <CardTitle>Bank PO</CardTitle>
                    <CardDescription>Bank Probationary Officer Exams</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Practice for Bank PO exams with our simulator that mimics the real exam.
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="others" className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Link href="/exams/gate">
                <Card className="h-full transition-all hover:shadow-md">
                  <CardHeader>
                    <CardTitle>GATE</CardTitle>
                    <CardDescription>Graduate Aptitude Test in Engineering</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Practice with our GATE simulator that replicates the exact exam pattern and timing.
                    </p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/exams/clat">
                <Card className="h-full transition-all hover:shadow-md">
                  <CardHeader>
                    <CardTitle>CLAT</CardTitle>
                    <CardDescription>Common Law Admission Test</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Prepare for CLAT with our realistic simulator.</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/exams/gre">
                <Card className="h-full transition-all hover:shadow-md">
                  <CardHeader>
                    <CardTitle>GRE</CardTitle>
                    <CardDescription>Graduate Record Examination</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Practice for GRE with our simulator that mimics the real exam.
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
