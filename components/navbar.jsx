"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"

const navigation = [
  { name: "Inicio", href: "/" },
  { name: "Sobre Mí", href: "/sobre-mi" },
  { name: "Servicios", href: "/servicios" },
  { name: "Recursos", href: "/recursos" },
  { name: "Blog", href: "/blog" },
  { name: "Eventos", href: "/eventos" },
  { name: "Contacto", href: "/contacto" },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const [siteConfig, setSiteConfig] = useState({
    logo: {
      url: "",
      alt: "Leandro Chena",
    },
  })

  // Cargar configuración del sitio
  useEffect(() => {
    const loadSiteConfig = async () => {
      try {
        if (db) {
          const docRef = doc(db, "config", "siteConfig")
          const docSnap = await getDoc(docRef)

          if (docSnap.exists()) {
            const firestoreConfig = docSnap.data()
            setSiteConfig(firestoreConfig)
            localStorage.setItem("siteConfig", JSON.stringify(firestoreConfig))
            return
          }
        }

        const savedConfig = localStorage.getItem("siteConfig")
        if (savedConfig) {
          setSiteConfig(JSON.parse(savedConfig))
        }
      } catch (error) {
        console.error("Error al cargar la configuración:", error)
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
    window.addEventListener("siteConfigUpdated", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("siteConfigUpdated", handleStorageChange)
    }
  }, [])

  // Cerrar el menú cuando cambia la ruta
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Bloquear scroll cuando el menú está abierto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">{siteConfig.logo?.alt || "Leandro Chena"}</span>
              {siteConfig.logo?.url ? (
                <img
                  src={siteConfig.logo.url || "/placeholder.svg"}
                  alt={siteConfig.logo.alt || "Leandro Chena"}
                  className="h-8 w-auto"
                />
              ) : (
                <span className="text-xl font-bold">{siteConfig.logo?.alt || "Leandro Chena"}</span>
              )}
            </Link>
          </div>

          {/* Navegación de escritorio */}
          <div className="hidden lg:flex lg:gap-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-semibold leading-6 ${
                  pathname === item.href ? "text-primary" : "text-foreground/80 hover:text-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Acciones de escritorio */}
          <div className="hidden lg:flex lg:items-center lg:gap-x-4">
            <ModeToggle />
            <Button asChild>
              <Link href="/contacto">Contactar</Link>
            </Button>
          </div>

          {/* Botón de menú móvil */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">{mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil - Solución extremadamente simple */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background pt-16">
          <div className="container mx-auto px-4 py-6">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block py-2 text-base font-medium ${
                    pathname === item.href ? "text-primary" : "text-foreground"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 mt-4 border-t border-border">
                <div className="flex flex-col space-y-4">
                  <ModeToggle />
                  <Button asChild className="w-full">
                    <Link href="/contacto" onClick={() => setMobileMenuOpen(false)}>
                      Contactar
                    </Link>
                  </Button>
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

