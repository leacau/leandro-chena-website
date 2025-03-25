"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { useEffect } from "react"

export function ThemeProvider({ children, ...props }) {
  // Aplicar configuración personalizada al cargar
  useEffect(() => {
    const applySiteConfig = () => {
      try {
        const siteConfig = localStorage.getItem("siteConfig")
        if (siteConfig) {
          const { colors } = JSON.parse(siteConfig)

          // Aplicar colores directamente como variables CSS
          if (colors) {
            const root = document.documentElement

            if (colors.primary) {
              root.style.setProperty("--primary-color", colors.primary)
            }

            if (colors.secondary) {
              root.style.setProperty("--secondary-color", colors.secondary)
            }

            if (colors.text) {
              root.style.setProperty("--text-color", colors.text)
            }

            if (colors.background) {
              root.style.setProperty("--background-color", colors.background)
            }
          }
        }
      } catch (error) {
        console.error("Error al aplicar la configuración del sitio:", error)
      }
    }

    // Aplicar al cargar
    applySiteConfig()

    // Escuchar cambios en la configuración
    const handleConfigUpdate = () => {
      applySiteConfig()
    }

    window.addEventListener("siteConfigUpdated", handleConfigUpdate)
    window.addEventListener("storage", applySiteConfig)

    return () => {
      window.removeEventListener("siteConfigUpdated", handleConfigUpdate)
      window.removeEventListener("storage", applySiteConfig)
    }
  }, [])

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

