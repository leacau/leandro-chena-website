"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CallToAction() {
  const [ctaConfig, setCtaConfig] = useState({
    title: "¿Listo para transformar tu enfoque comercial?",
    subtitle:
      "Descubrí cómo mis servicios de consultoría y capacitación pueden ayudarte a potenciar tus ventas y desarrollar líderes inspiradores.",
  })

  useEffect(() => {
    // Cargar configuración del localStorage
    const loadCtaConfig = () => {
      try {
        const savedConfig = localStorage.getItem("siteConfig")
        if (savedConfig) {
          const config = JSON.parse(savedConfig)
          if (config.content?.cta) {
            setCtaConfig({
              title: config.content.cta.title || ctaConfig.title,
              subtitle: config.content.cta.subtitle || ctaConfig.subtitle,
            })
          }
        }
      } catch (error) {
        console.error("Error al cargar la configuración de CTA:", error)
      }
    }

    loadCtaConfig()

    // Escuchar cambios en la configuración
    const handleConfigUpdate = () => {
      loadCtaConfig()
    }

    window.addEventListener("siteConfigUpdated", handleConfigUpdate)
    window.addEventListener("storage", loadCtaConfig)

    return () => {
      window.removeEventListener("siteConfigUpdated", handleConfigUpdate)
      window.removeEventListener("storage", loadCtaConfig)
    }
  }, [])

  return (
    <section className="bg-primary">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">{ctaConfig.title}</h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-foreground/80">{ctaConfig.subtitle}</p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contacto">Agendá una consulta</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent text-primary-foreground hover:bg-primary-foreground/10 border-primary-foreground/20"
              asChild
            >
              <Link href="/recursos">Explorá recursos gratuitos</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

