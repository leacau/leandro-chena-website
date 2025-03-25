"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function AboutPreview() {
  const [aboutConfig, setAboutConfig] = useState({
    title: "Sobre Mí",
    content:
      "Con más de 15 años de experiencia en el mundo comercial, he ayudado a equipos a transformar su enfoque de ventas y liderazgo, logrando resultados extraordinarios.\n\nMi metodología combina estrategias probadas con un enfoque humano y sensible, adaptado a las necesidades específicas de cada organización y equipo.",
  })

  useEffect(() => {
    // Cargar configuración del localStorage
    const loadAboutConfig = () => {
      try {
        const savedConfig = localStorage.getItem("siteConfig")
        if (savedConfig) {
          const config = JSON.parse(savedConfig)
          if (config.content?.about) {
            setAboutConfig({
              title: config.content.about.title || aboutConfig.title,
              content: config.content.about.content || aboutConfig.content,
            })
          }
        }
      } catch (error) {
        console.error("Error al cargar la configuración de Sobre Mí:", error)
      }
    }

    loadAboutConfig()

    // Escuchar cambios en la configuración
    const handleConfigUpdate = () => {
      loadAboutConfig()
    }

    window.addEventListener("siteConfigUpdated", handleConfigUpdate)
    window.addEventListener("storage", loadAboutConfig)

    return () => {
      window.removeEventListener("siteConfigUpdated", handleConfigUpdate)
      window.removeEventListener("storage", loadAboutConfig)
    }
  }, [])

  // Dividir el contenido en párrafos
  const paragraphs = aboutConfig.content.split("\n\n")

  return (
    <section className="bg-muted/40 py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{aboutConfig.title}</h2>
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="mt-6 text-lg leading-8 text-muted-foreground">
            {paragraph}
          </p>
        ))}
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

