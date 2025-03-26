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

export default function MobileMenu({ logo }) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Cerrar el menú cuando cambia la ruta
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Bloquear scroll cuando el menú está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden")
    } else {
      document.body.classList.remove("overflow-hidden")
    }

    return () => {
      document.body.classList.remove("overflow-hidden")
    }
  }, [isOpen])

  return (
    <div className="lg:hidden">
      {/* Botón para abrir el menú */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center p-2 rounded-md text-foreground"
        aria-expanded={isOpen}
      >
        <span className="sr-only">Abrir menú</span>
        <Menu className="h-6 w-6" />
      </button>

      {/* Menú móvil */}
      {isOpen && (
        <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
          <div className="p-4">
            {/* Cabecera del menú */}
            <div className="flex items-center justify-between">
              <Link href="/" onClick={() => setIsOpen(false)}>
                <span className="sr-only">{logo?.alt || "Leandro Chena"}</span>
                {logo?.url ? (
                  <img src={logo.url || "/placeholder.svg"} alt={logo.alt || "Leandro Chena"} className="h-8 w-auto" />
                ) : (
                  <span className="text-xl font-bold">{logo?.alt || "Leandro Chena"}</span>
                )}
              </Link>

              {/* Botón para cerrar */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center justify-center p-2 rounded-md text-foreground"
              >
                <span className="sr-only">Cerrar menú</span>
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Enlaces de navegación */}
            <div className="mt-8">
              <div className="grid gap-4 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block px-3 py-2 text-base font-medium rounded-md ${
                      pathname === item.href ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Acciones */}
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex flex-col space-y-4">
                <ModeToggle />
                <Button asChild>
                  <Link href="/contacto" onClick={() => setIsOpen(false)}>
                    Contactar
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

