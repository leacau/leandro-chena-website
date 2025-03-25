"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"

export default function Hero() {
  const [heroConfig, setHeroConfig] = useState({
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lea%20%282%29-ohqyC38OWMWc1aOOP7EHh8tm1PIUdd.png",
    title: "Potenciá tus ventas y liderá con propósito",
    subtitle:
      "Soy Leandro Chena, consultor comercial y capacitador especializado en transformar equipos de ventas y desarrollar líderes que inspiran resultados extraordinarios.",
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Cargar configuración de Firestore
    const loadHeroConfig = async () => {
      try {
        setIsLoading(true)

        // Primero intenta cargar desde localStorage como fuente de respaldo inmediata
        try {
          const savedConfig = localStorage.getItem("siteConfig")
          if (savedConfig) {
            const config = JSON.parse(savedConfig)
            const newConfig = {
              image: config.heroImage || heroConfig.image,
              title: config.content?.hero?.title || heroConfig.title,
              subtitle: config.content?.hero?.subtitle || heroConfig.subtitle,
            }
            setHeroConfig(newConfig)
          }
        } catch (localError) {
          console.error("Error al cargar desde localStorage:", localError)
        }

        // Luego intenta cargar desde Firestore para obtener los datos más actualizados
        try {
          const docRef = doc(db, "config", "siteConfig")
          const docSnap = await getDoc(docRef)

          if (docSnap.exists()) {
            const config = docSnap.data()
            const newConfig = {
              image: config.heroImage || heroConfig.image,
              title: config.content?.hero?.title || heroConfig.title,
              subtitle: config.content?.hero?.subtitle || heroConfig.subtitle,
            }
            setHeroConfig(newConfig)

            // Si se obtuvo con éxito, actualizar localStorage
            localStorage.setItem("siteConfig", JSON.stringify(config))
          }
        } catch (firestoreError) {
          console.error("Error al cargar desde Firestore:", firestoreError)
          // No fallar si Firestore no está disponible, ya tenemos datos de localStorage
        }
      } catch (error) {
        console.error("Error general al cargar la configuración del héroe:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadHeroConfig()

    // Escuchar cambios en la configuración
    const handleConfigUpdate = () => {
      loadHeroConfig()
    }

    window.addEventListener("siteConfigUpdated", handleConfigUpdate)

    return () => {
      window.removeEventListener("siteConfigUpdated", handleConfigUpdate)
    }
  }, [])

  return (
    <div className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,rgba(59,130,246,0.12),transparent)]" />
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
          <h1 className="max-w-lg text-4xl font-bold tracking-tight sm:text-6xl">{heroConfig.title}</h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">{heroConfig.subtitle}</p>
          <div className="mt-10 flex items-center gap-x-6">
            <Button size="lg" asChild>
              <Link href="/contacto">Descubrí cómo puedo ayudarte</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/servicios">Conocé mis servicios</Link>
            </Button>
          </div>
        </div>
        <div className="mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow">
          <div className="relative mx-auto h-80 w-80 overflow-hidden rounded-full md:h-96 md:w-96">
            <Image
              src={heroConfig.image || "/placeholder.svg"}
              alt="Leandro Chena"
              width={400}
              height={400}
              className="absolute h-full w-full object-cover"
              priority
              onError={(e) => {
                e.target.onerror = null
                e.target.src = "/placeholder.svg?height=400&width=400"
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

