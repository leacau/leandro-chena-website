"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Video, Download, ExternalLink } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"
import { Loader2 } from "lucide-react"

export default function RecursosPage() {
  const [resources, setResources] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadResources = async () => {
      try {
        setIsLoading(true)

        // Intentar obtener datos de caché primero
        const cachedResources = localStorage.getItem("cachedResources")
        if (cachedResources) {
          setResources(JSON.parse(cachedResources))
          // Reducimos el tiempo de carga si hay datos en caché
          setIsLoading(false)
        }

        // Establecer un timeout para la consulta de Firestore
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Tiempo de espera excedido")), 5000),
        )

        // Realizar la consulta a Firestore con límite de tiempo
        const queryPromise = async () => {
          try {
            const querySnapshot = await getDocs(collection(db, "resources"))
            const loadedResources = []

            querySnapshot.forEach((doc) => {
              loadedResources.push({
                id: doc.id,
                ...doc.data(),
              })
            })

            // Actualizar estados y caché solo si se obtuvieron datos
            if (loadedResources.length > 0) {
              setResources(loadedResources)
              localStorage.setItem("cachedResources", JSON.stringify(loadedResources))
            }

            return true
          } catch (err) {
            console.error("Error en la consulta a Firestore:", err)
            return false
          }
        }

        // Ejecutar la consulta con timeout
        try {
          await Promise.race([queryPromise(), timeoutPromise])
        } catch (raceError) {
          console.log("Se usaron datos en caché debido a timeout o error:", raceError)
          // Si ya teníamos datos en caché, no mostramos error al usuario
          if (!cachedResources) {
            console.error("No hay datos disponibles:", raceError)
          }
        }
      } catch (error) {
        console.error("Error loading resources:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadResources()
  }, [])

  const getIcon = (type) => {
    switch (type) {
      case "PDF":
        return <FileText className="h-10 w-10 text-primary" />
      case "Video":
        return <Video className="h-10 w-10 text-primary" />
      case "Excel":
      case "Plantilla":
        return <Download className="h-10 w-10 text-primary" />
      default:
        return <FileText className="h-10 w-10 text-primary" />
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Cargando recursos...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">Recursos</h1>

      {resources.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No hay recursos disponibles actualmente.</p>
          <p className="text-sm">Puedes crear nuevos recursos desde el panel de administración.</p>
          <Button asChild className="mt-4">
            <Link href="/admin/dashboard">Ir al panel de administración</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <Card key={resource.id}>
              <CardHeader className="flex flex-row items-center gap-4">
                {getIcon(resource.type)}
                <div>
                  <CardTitle>{resource.title}</CardTitle>
                  <CardDescription>{resource.type}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{resource.description}</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href={resource.href} target="_blank" rel="noopener noreferrer" className="flex items-center">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Descargar recurso
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

