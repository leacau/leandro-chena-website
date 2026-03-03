"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function AboutPreview() {
  return (
    <section className="bg-primary/5 py-16 border-y border-primary/10"{/* "bg-muted/40 py-16" */}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Sobre Mí</h2>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Con más de 15 años de experiencia en el mundo comercial, he ayudado a equipos a transformar su enfoque de
          ventas y liderazgo, logrando resultados extraordinarios.
        </p>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Mi metodología combina estrategias probadas con un enfoque humano y sensible, adaptado a las necesidades
          específicas de cada organización y equipo.
        </p>
        <div className="mt-8">
          <Button variant="ghost" asChild>
            <Link href="/sobre-mi" className="flex items-center gap-2">
              Conocé más sobre mi trayectoria
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

