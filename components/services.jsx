"use client"

import Link from "next/link"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Building, Presentation, UserPlus } from "lucide-react"

const serviceItems = [
  {
    title: "Capacitaciones para Equipos Comerciales",
    description: "Programas personalizados para potenciar las habilidades de venta y negociación de tu equipo.",
    icon: Users,
    href: "/servicios/capacitaciones",
  },
  {
    title: "Consultoría para Empresas",
    description: "Análisis y optimización de procesos comerciales para incrementar la efectividad y los resultados.",
    icon: Building,
    href: "/servicios/consultoria",
  },
  {
    title: "Charlas Motivacionales",
    description:
      "Conferencias inspiradoras sobre liderazgo sensible, motivación y desarrollo de equipos de alto rendimiento.",
    icon: Presentation,
    href: "/servicios/charlas",
  },
  {
    title: "Mentorías 1:1",
    description:
      "Acompañamiento personalizado para líderes y profesionales que buscan potenciar su desarrollo comercial.",
    icon: UserPlus,
    href: "/servicios/mentorias",
  },
]

export default function Services() {
  return (
    <section className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="mx-auto max-w-2xl lg:mx-0">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Servicios</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Soluciones personalizadas para potenciar tu negocio y equipo comercial.
        </p>
      </div>
      <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4">
        {serviceItems.map((service) => (
          <Card key={service.title} className="flex flex-col">
            <CardHeader>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <service.icon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>{service.title}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto pt-4">
              <Button variant="outline" asChild className="w-full">
                <Link href={service.href}>Conocé más</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}

