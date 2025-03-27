"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export default function MobileMenu({ logoSrc }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
    // Bloquear el scroll cuando el menú está abierto
    if (!isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
  }

  const closeMenu = () => {
    setIsOpen(false)
    document.body.style.overflow = "auto"
  }

  return (
    <>
      <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Menu">
        <Menu className="h-6 w-6" />
      </Button>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={closeMenu}></div>}

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white dark:bg-gray-900 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } overflow-y-auto`}
      >
        <div className="p-5">
          <div className="flex justify-between items-center mb-8">
            <Link href="/" onClick={closeMenu}>
              <Image
                src={logoSrc || "/placeholder.svg"}
                alt="Leandro Chena"
                width={120}
                height={30}
                className="h-7 w-auto"
              />
            </Link>
            <Button variant="ghost" size="icon" onClick={closeMenu} aria-label="Cerrar menú">
              <X className="h-6 w-6" />
            </Button>
          </div>

          <nav className="flex flex-col space-y-4">
            <Link
              href="/sobre-mi"
              className="px-3 py-2 text-base font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={closeMenu}
            >
              Sobre Mí
            </Link>
            <Link
              href="/servicios"
              className="px-3 py-2 text-base font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={closeMenu}
            >
              Servicios
            </Link>
            <Link
              href="/blog"
              className="px-3 py-2 text-base font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={closeMenu}
            >
              Blog
            </Link>
            <Link
              href="/recursos"
              className="px-3 py-2 text-base font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={closeMenu}
            >
              Recursos
            </Link>
            <Link
              href="/eventos"
              className="px-3 py-2 text-base font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={closeMenu}
            >
              Eventos
            </Link>
            <Link href="/contacto" onClick={closeMenu}>
              <Button variant="default" className="w-full">
                Contacto
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </>
  )
}

