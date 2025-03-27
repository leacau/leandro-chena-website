"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import MobileMenu from "@/components/mobile-menu"
import { useTheme } from "next-themes"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { theme } = useTheme()
  const logoSrc = theme === "dark" ? "/images/logo-white.png" : "/images/logo.png"

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-white dark:bg-gray-900 shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src={logoSrc || "/placeholder.svg"}
                alt="Leandro Chena"
                width={150}
                height={40}
                className="h-8 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/sobre-mi"
              className="px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Sobre Mí
            </Link>
            <Link
              href="/servicios"
              className="px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Servicios
            </Link>
            <Link
              href="/blog"
              className="px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Blog
            </Link>
            <Link
              href="/recursos"
              className="px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Recursos
            </Link>
            <Link
              href="/eventos"
              className="px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Eventos
            </Link>
            <Link href="/contacto" className="ml-2">
              <Button variant="default" size="sm">
                Contacto
              </Button>
            </Link>
            <ModeToggle />
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <ModeToggle />
            <MobileMenu logoSrc={logoSrc} />
          </div>
        </div>
      </div>
    </header>
  )
}

