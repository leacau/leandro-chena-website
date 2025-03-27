"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Error({ error, reset }) {
  useEffect(() => {
    // Registrar el error en la consola
    console.error("Blog error:", error)
  }, [error])

  return (
    <div className="container mx-auto py-12 px-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Error al cargar el artículo</h1>
      <p className="mb-8">Lo sentimos, ha ocurrido un error al cargar este artículo.</p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button onClick={reset}>Intentar nuevamente</Button>
        <Button variant="outline" asChild>
          <Link href="/blog">Volver al blog</Link>
        </Button>
      </div>
    </div>
  )
}

