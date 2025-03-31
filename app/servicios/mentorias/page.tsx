import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mentorias | Leandro Chena",
  description: "Acompañamiento personalizado para potenciar tu crecimiento y resultados.",
}

export default function MentoriasPage() {
  return (
    <div className="container mx-auto px-6 py-12 md:py-24">
      <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
            Mentorías 1:1
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            Acompañamiento personalizado para potenciar tu crecimiento y resultados.
          </p>
          <p className="mb-12">
            Las mentorías individuales están diseñadas para líderes, gerentes comerciales y vendedores que buscan mejorar su desempeño, fortalecer sus habilidades comerciales y alcanzar sus objetivos con estrategias efectivas y aplicables.
          </p>
          <div className="space-y-4">
          <div className="flex gap-3">
            <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
            <p>Mayor confianza y seguridad en tu proceso comercial.</p>
          </div>
          <div className="flex gap-3">
            <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
            <p>Técnicas efectivas para cerrar más ventas y mejorar negociaciones.</p>
          </div>
          <div className="flex gap-3">
            <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
            <p>Habilidades de liderazgo para gestionar y motivar equipos con éxito.</p>
          </div>
          <div className="flex gap-3">
            <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
            <p>Un plan de acción concreto para alcanzar tus objetivos comerciales.</p>
          </div>
        </div>
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

      <div className="bg-muted/40 mb-16 rounded-lg">
        <h2 className="text-3xl font-bold mb-6">¿Cómo trabajamos?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3">Diagnóstico Personalizado</h3>
            <p className="text-muted-foreground mb-4">
              Analizamos tu situación actual, desafíos y objetivos para diseñar un plan de acción a medida.
            </p>
            <p className="text-sm"></p>
          </div>
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3">Desarrollo de Estrategias</h3>
            <p className="text-muted-foreground mb-4">
              Te guiamos en la aplicación de técnicas de ventas, liderazgo y negociación efectivas.
            </p>
            <p className="text-sm"></p>
          </div>
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3">Acompañamiento en la Implementación</h3>
            <p className="text-muted-foreground mb-4">
              Sesiones prácticas donde aplicamos lo aprendido en situaciones reales de tu día a día.
            </p>
            <p className="text-sm"></p>
          </div>
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3">Evaluación y Seguimiento</h3>
            <p className="text-muted-foreground mb-4">
              Medimos avances y ajustamos estrategias para garantizar resultados sostenibles.
            </p>
            <p className="text-sm"></p>
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

