"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

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

  useEffect(() => {
    // Cargar configuración del localStorage
    const loadSiteConfig = () => {
      try {
        const savedConfig = localStorage.getItem("siteConfig")
        if (savedConfig) {
          setSiteConfig(JSON.parse(savedConfig))
        }
      } catch (error) {
        console.error("Error al cargar la configuración:", error)
      }
    }

    loadSiteConfig()

    // Escuchar cambios en localStorage
    window.addEventListener("storage", loadSiteConfig)
    return () => window.removeEventListener("storage", loadSiteConfig)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">{siteConfig.logo.alt}</span>
            {siteConfig.logo.url ? (
              <img
                src={siteConfig.logo.url || "/placeholder.svg"}
                alt={siteConfig.logo.alt}
                className="h-8 w-auto"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.style.display = "none"
                  e.target.nextSibling.style.display = "block"
                }}
              />
            ) : (
              <span className="text-xl font-bold">{siteConfig.logo.alt}</span>
            )}
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Abrir menú principal</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-8">
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
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          <ModeToggle />
          <Button asChild>
            <Link href="/contacto">Contactar</Link>
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`lg:hidden ${mobileMenuOpen ? "fixed inset-0 z-50" : "hidden"}`}>
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
        <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">{siteConfig.logo.alt}</span>
              {siteConfig.logo.url ? (
                <img
                  src={siteConfig.logo.url || "/placeholder.svg"}
                  alt={siteConfig.logo.alt}
                  className="h-8 w-auto"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.style.display = "none"
                    e.target.nextSibling.style.display = "block"
                  }}
                />
              ) : (
                <span className="text-xl font-bold">{siteConfig.logo.alt}</span>
              )}
            </Link>
            <button type="button" className="-m-2.5 rounded-md p-2.5" onClick={() => setMobileMenuOpen(false)}>
              <span className="sr-only">Cerrar menú</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-border">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 ${
                      pathname === item.href ? "text-primary" : "text-foreground/80 hover:text-foreground"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="flex items-center justify-between py-6">
                <ModeToggle />
                <Button asChild onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/contacto">Contactar</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

