import Image from "next/image"

export default function TestimonialSection() {
  const testimonials = [
    {
      id: 1,
      content:
        "The exam simulator is exactly like the real JEE Main. The interface, timer, and question patterns are identical. It helped me get comfortable with the actual exam environment.",
      author: "Rahul Sharma",
      role: "JEE Main 2023 - AIR 342",
    },
    {
      id: 2,
      content:
        "I was so nervous about NEET, but after practicing with this simulator, I felt much more confident. The real exam felt familiar because I had already experienced the same environment here.",
      author: "Priya Patel",
      role: "NEET 2023 - AIR 512",
    },
    {
      id: 3,
      content:
        "The EAMCET simulator helped me manage my time better during the actual exam. The realistic interface and timer made all the difference in my preparation.",
      author: "Kiran Kumar",
      role: "AP EAMCET 2023 - Rank 78",
    },
  ]

  return (
    <section className="bg-gray-50 py-16 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">What Our Students Say</h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            Hear from students who achieved their dream ranks with our exam simulator
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex flex-col gap-4">
                <div className="flex-1">
                  <p className="text-muted-foreground">"{testimonial.content}"</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                    <Image
                      src={`/placeholder.svg?height=48&width=48`}
                      alt={testimonial.author}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
