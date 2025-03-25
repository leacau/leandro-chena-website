import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Quote } from "lucide-react"

const testimonials = []

export default function Testimonials() {
  return (
    <section className="bg-muted/40 py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Lo que dicen mis clientes</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Descubrí cómo ayudadé a equipos a alcanzar sus objetivos
          </p>
        </div>
        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="h-full">
              <CardContent className="pt-6">
                <Quote className="h-8 w-8 text-primary/40" />
                <p className="mt-4 text-lg font-medium leading-relaxed">"{testimonial.content}"</p>
              </CardContent>
              <CardFooter className="flex items-center gap-4 border-t pt-6">
                <Image
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.author}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <p className="font-medium">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

