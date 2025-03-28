import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Consultoría para Empresas | Leandro Chena",
  description: "Optimizamos tu estrategia comercial para mejorar resultados y aumentar ventas.",
}

export default function ConsultoriaPage() {
  return (
    <div className="container mx-auto px-6 py-12 md:py-24">
      <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
            Consultoría para Empresas
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            El programa de consultoría está diseñado para detectar puntos de mejora en tus procesos comerciales y potenciar el rendimiento de tu equipo de ventas.
          </p>
          <div className="space-y-4">
            <div className="flex gap-3">
              <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
              <p> Aumentar la conversión de prospectos en clientes.</p>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
              <p>Mejorar la productividad y organización del equipo de ventas.</p>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
              <p>Implementar estrategias efectivas de captación y fidelización de clientes.</p>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
              <p>Optimizar el uso de herramientas y metodologías comerciales.</p>
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
            alt="Consultoría para Empresas"
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="bg-muted/40 mb-16 rounded-lg pt-8 pb-8 w-100">
        <h2 className="text-3xl font-bold mb-6">¿Cómo lo hacemos?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-8">
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3">Diagnóstico Comercial</h3>
            <p className="text-muted-foreground mb-4">
              Analizamos el estado actual de tu equipo y procesos de ventas para identificar oportunidades de optimización.
            </p>
            <p className="text-sm"></p>
          </div>
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3">Diseño de Estrategias</h3>
            <p className="text-muted-foreground mb-4">
              Desarrollamos planes de acción a medida, alineados con los objetivos de tu empresa y sector.
            </p>
            <p className="text-sm"></p>
          </div>
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3">Implementación Práctica</h3>
            <p className="text-muted-foreground mb-4">
              Acompañamos la ejecución de las estrategias, asegurando su correcta aplicación en el día a día.
            </p>
            <p className="text-sm"></p>
          </div>
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3">Seguimiento y Medición</h3>
            <p className="text-muted-foreground mb-4">
              Evaluamos los resultados y realizamos ajustes para garantizar un impacto real en la efectividad comercial.
            </p>
            <p className="text-sm"></p>
          </div>
        </div>
      </div>
      <div className="text-center mt-8">
        <h2 className="text-3xl font-bold mb-6">¿Listo para potenciar tu equipo comercial?</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto pb-12 mb-12">
          Contactá conmigo y diseñemos juntos la mejor estrategia para potenciar tu equipo comercial.
        </p>
        <Button size="lg" asChild>
          <Link href="/contacto">Solicitar información</Link>
        </Button>
      </div>
    </div>
  )
}

