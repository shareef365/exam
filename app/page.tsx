import Link from "next/link"
import { ArrowRight, BookOpen, Clock, FileCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import ExamCategories from "@/components/exam-categories"
import TestimonialSection from "@/components/testimonial-section"
import FeaturedExams from "@/components/featured-exams"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-50 to-white py-20 dark:from-gray-900 dark:to-gray-950">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl">
                  Experience Real Exam Conditions with Our Simulator
                </h1>
                <p className="max-w-[600px] text-gray-500 dark:text-gray-400 md:text-xl">
                  Practice for JEE, NEET, EAMCET and other competitive exams in an environment that perfectly mimics the
                  real test.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/exams">
                    Start Practicing <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-[350px] w-[350px] sm:h-[400px] sm:w-[400px] lg:h-[500px] lg:w-[500px]">
                <div className="absolute left-0 top-0 h-full w-full rounded-full bg-blue-100 dark:bg-blue-950"></div>
                <div className="absolute left-1/2 top-1/2 h-[90%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg dark:bg-gray-900">
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="rounded-full bg-blue-600 p-3 text-white">
                        <FileCheck className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-bold">Realistic Interface</h3>
                      <p className="max-w-[200px] text-sm text-gray-500 dark:text-gray-400">
                        Our simulator replicates the exact look and feel of actual exams
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 dark:bg-gray-950">
        <div className="container px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Why Choose Our Exam Simulator?
            </h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              Features that make our platform the best choice for your exam preparation
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
              <div className="mb-4 rounded-full bg-blue-100 p-3 text-blue-600 dark:bg-blue-950 dark:text-blue-400 w-fit">
                <FileCheck className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Exact Replica</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Our simulator perfectly mimics the interface, timing, and question patterns of real exams.
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
              <div className="mb-4 rounded-full bg-blue-100 p-3 text-blue-600 dark:bg-blue-950 dark:text-blue-400 w-fit">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Real-time Timing</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Experience the same time constraints as the actual exam with our accurate timer.
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
              <div className="mb-4 rounded-full bg-blue-100 p-3 text-blue-600 dark:bg-blue-950 dark:text-blue-400 w-fit">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Vast Question Bank</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Access thousands of questions covering all topics and difficulty levels for comprehensive preparation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Exam Categories */}
      <ExamCategories />

      {/* Featured Exams */}
      <FeaturedExams />

      {/* Testimonials */}
      <TestimonialSection />

      {/* CTA Section */}
      <section className="bg-blue-600 py-16 text-white dark:bg-blue-950">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Ready to Ace Your Exams?</h2>
            <p className="max-w-[600px] text-blue-100 md:text-xl">
              Start practicing with our realistic exam simulator today and boost your confidence for the real test.
            </p>
            <Button asChild size="lg" variant="secondary" className="mt-4">
              <Link href="/register">Create Free Account</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
