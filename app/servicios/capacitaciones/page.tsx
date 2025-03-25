import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Capacitaciones para Equipos Comerciales | Leandro Chena",
  description: "Programas personalizados para potenciar las habilidades de venta y negociación de tu equipo comercial.",
}

export default function CapacitacionesPage() {
  return (
    <div className="container mx-auto px-6 py-12 md:py-24">
      <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
            Capacitaciones para Equipos Comerciales
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            Programas personalizados para potenciar las habilidades de venta y negociación de tu equipo comercial.
          </p>
          <div className="space-y-4">
            <div className="flex gap-3">
              <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
              <p>Incremento de la efectividad y los resultados de tu equipo de ventas.</p>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
              <p>Desarrolo de habilidades de comunicación, negociación y cierre.</p>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
              <p>Metodología práctica con casos reales y ejercicios aplicados.</p>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
              <p>Programas adaptados a las necesidades específicas de tu empresa.</p>
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

      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-6">Programas de capacitación</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3">Ventas Consultivas</h3>
            <p className="text-muted-foreground mb-4">
              Aprendé a vender soluciones, no productos. Enfoque centrado en las necesidades del cliente.
            </p>
            <p className="text-sm"></p>
          </div>
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3">Negociación Avanzada</h3>
            <p className="text-muted-foreground mb-4">
              Técnicas y estrategias para negociar con éxito en situaciones complejas y con clientes exigentes.
            </p>
            <p className="text-sm"></p>
          </div>
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3">Manejo de Objeciones</h3>
            <p className="text-muted-foreground mb-4">
              Aprendé a identificar, entender y superar las objeciones más comunes en el proceso de venta.
            </p>
            <p className="text-sm"></p>
          </div>
        </div>
      </div>

      <div className="bg-muted/40 p-8 rounded-lg px-8">
        <h2 className="text-3xl font-bold mb-6">Metodología</h2>
        <p className="mb-6">
          Nuestras capacitaciones combinan teoría y práctica en un formato dinámico y participativo
        </p>
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-3">Diagnóstico</h3>
            <p className="text-muted-foreground">
              Evaluamos las necesidades específicas de tu equipo para adaptar el contenido y los ejercicios.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-3">Formación</h3>
            <p className="text-muted-foreground">
              Sesiones teórico-prácticas con casos reales y ejercicios aplicados a tu sector.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-3">Implementación</h3>
            <p className="text-muted-foreground">
              Herramientas y planes de acción para aplicar lo aprendido en el día a día.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-3">Seguimiento</h3>
            <p className="text-muted-foreground">
              Sesiones de refuerzo y evaluación para asegurar la aplicación efectiva de lo aprendido.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center mt-8">
        <h2 className="text-3xl font-bold mb-6">¿Listo para potenciar tu equipo comercial?</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto pb-12">
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

