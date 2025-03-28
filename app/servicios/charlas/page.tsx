import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Charlas Motivacionales | Leandro Chena",
  description: "Inspiración y liderazgo para potenciar equipos y transformar resultados.",
}

export default function CharlasPage() {
  return (
    <div className="container mx-auto px-6 py-12 md:py-24">
      <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
            Charlas Motivacionales
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            Inspiración y liderazgo para potenciar equipos y transformar resultados.
          </p>
          <p className="">
            Las conferencias están diseñadas para impactar, inspirar y generar un cambio positivo en la mentalidad y desempeño de las personas. A través de experiencias reales, reflexiones profundas y herramientas prácticas, ayudamos a fortalecer el liderazgo, la resiliencia y el trabajo en equipo.
          </p>
          <div className="mt-8">
            <Button size="lg" asChild>
              <Link href="/contacto">Solicitar información</Link>
            </Button>
          </div>
        </div>
        <div className="relative h-[400px] rounded-lg overflow-hidden">
          <Image
            src="/placeholder.svg?height=400&width=600"
            alt="Capacitaciones para Equipos Comerciales"
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-6">Temáticas clave</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-8">
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3">Liderazgo Sensible</h3>
            <p className="text-muted-foreground mb-4">
              Cómo liderar con empatía, conexión y propósito para lograr equipos más comprometidos y productivos.
            </p>
            <p className="text-sm"></p>
          </div>
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3">Motivación y Alto Rendimiento</h3>
            <p className="text-muted-foreground mb-4">
              Estrategias para potenciar la automotivación, superar desafíos y alcanzar resultados extraordinarios.
            </p>
            <p className="text-sm"></p>
          </div>
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3">Gestión del Cambio y Resiliencia</h3>
            <p className="text-muted-foreground mb-4">
              Cómo adaptarse a los cambios y transformar los desafíos en oportunidades de crecimiento.
            </p>
            <p className="text-sm"></p>
          </div>
           <div className="border rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3">Trabajo en Equipo y Comunicación Efectiva</h3>
            <p className="text-muted-foreground mb-4">
              Claves para fortalecer la colaboración, la confianza y la sinergia en los equipos.
            </p>
            <p className="text-sm"></p>
          </div>
        </div>
      </div>

      <div className="bg-muted/40 p-8 rounded-lg">
        <h2 className="text-3xl font-bold mb-6 pt-8">¿Por qué elegir mis charlas?</h2>
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-3">Enfoque dinámico y participativo</h3>
            <p className="text-muted-foreground">
              Contenidos prácticos y aplicables a la vida real.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-3">Inspiración con impacto</h3>
            <p className="text-muted-foreground">
              Historias, experiencias y herramientas que generan transformación.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-3">Adaptadas a cada audiencia</h3>
            <p className="text-muted-foreground">
              Contenidos personalizados según los objetivos de tu empresa o evento.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center mt-8">
        <h2 className="text-3xl font-bold mb-6">¿Listo para potenciar tu equipo comercial?</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto pb-12 mb-12">
          Contactá conmigo para diseñar un programa de capacitación adaptado a las necesidades específicas de tu
          empresa.
        </p>
        <Button size="lg" asChild>
          <Link href="/contacto">Solicitar información</Link>
        </Button>
      </div>
    </div>
  )
}

