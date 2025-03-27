"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Error({ error, reset }) {
  useEffect(() => {
    // Registrar el error en la consola
    console.error("Download error:", error)
  }, [error])

  return (
    <div className="container mx-auto py-12 px-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Error al cargar el archivo</h1>
      <p className="mb-8">Lo sentimos, ha ocurrido un error al procesar tu descarga.</p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button onClick={reset}>Intentar nuevamente</Button>
        <Button variant="outline" asChild>
          <Link href="/">Volver al inicio</Link>
        </Button>
      </div>
    </div>
  )
}

