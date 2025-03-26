"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"

export default function Footer() {
  const pathname = usePathname()
  const [siteConfig, setSiteConfig] = useState({
    logo: {
      url: "",
      alt: "Leandro Chena",
    },
  })

  useEffect(() => {
    // Cargar configuración de Firestore primero, luego localStorage como respaldo
    const loadSiteConfig = async () => {
      try {
        // Intentar cargar desde Firestore primero
        if (db) {
          const docRef = doc(db, "config", "siteConfig")
          const docSnap = await getDoc(docRef)

          if (docSnap.exists()) {
            const firestoreConfig = docSnap.data()
            setSiteConfig(firestoreConfig)
            return
          }
        }

        // Si no hay datos en Firestore o hay un error, usar localStorage
        const savedConfig = localStorage.getItem("siteConfig")
        if (savedConfig) {
          setSiteConfig(JSON.parse(savedConfig))
        }
      } catch (error) {
        console.error("Error al cargar la configuración:", error)
        // Intentar usar localStorage como respaldo
        try {
          const savedConfig = localStorage.getItem("siteConfig")
          if (savedConfig) {
            setSiteConfig(JSON.parse(savedConfig))
          }
        } catch (localError) {
          console.error("Error al cargar la configuración local:", localError)
        }
      }
    }

    loadSiteConfig()

    // Escuchar cambios en localStorage
    const handleStorageChange = () => {
      try {
        const savedConfig = localStorage.getItem("siteConfig")
        if (savedConfig) {
          setSiteConfig(JSON.parse(savedConfig))
        }
      } catch (error) {
        console.error("Error al procesar cambios en localStorage:", error)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    // También escuchar el evento personalizado para cambios de configuración
    window.addEventListener("siteConfigUpdated", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("siteConfigUpdated", handleStorageChange)
    }
  }, [])

  // Verificar si estamos en una página de administración
  const isAdminPage = pathname?.startsWith("/admin")
  if (isAdminPage) return null

  return (
    <footer className="bg-background border-t">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <Link href="/" className={pathname === "/" ? "text-primary" : "text-foreground/80 hover:text-foreground"}>
            Inicio
          </Link>
          <Link
            href="/sobre-mi"
            className={pathname === "/sobre-mi" ? "text-primary" : "text-foreground/80 hover:text-foreground"}
          >
            Sobre Mí
          </Link>
          <Link
            href="/servicios"
            className={pathname === "/servicios" ? "text-primary" : "text-foreground/80 hover:text-foreground"}
          >
            Servicios
          </Link>
          <Link
            href="/recursos"
            className={pathname === "/recursos" ? "text-primary" : "text-foreground/80 hover:text-foreground"}
          >
            Recursos
          </Link>
          <Link
            href="/blog"
            className={pathname === "/blog" ? "text-primary" : "text-foreground/80 hover:text-foreground"}
          >
            Blog
          </Link>
          <Link
            href="/eventos"
            className={pathname === "/eventos" ? "text-primary" : "text-foreground/80 hover:text-foreground"}
          >
            Eventos
          </Link>
          <Link
            href="/contacto"
            className={pathname === "/contacto" ? "text-primary" : "text-foreground/80 hover:text-foreground"}
          >
            Contacto
          </Link>
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <Link href="/" className="flex items-center justify-center">
            {siteConfig.logo?.url ? (
              <img
                src={siteConfig.logo.url || "/placeholder.svg"}
                alt={siteConfig.logo.alt || "Leandro Chena"}
                className="h-8 w-auto mr-2"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.style.display = "none"
                }}
              />
            ) : null}
            <p className="text-center text-xs leading-5 text-foreground/80">
              &copy; {new Date().getFullYear()} {siteConfig.logo?.alt || "Leandro Chena"}. Todos los derechos
              reservados.
            </p>
          </Link>
        </div>
      </div>
    </footer>
  )
}

