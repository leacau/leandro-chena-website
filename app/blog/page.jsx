"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function BlogPage() {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true)

        // Intentar obtener datos de caché primero
        const cachedPosts = localStorage.getItem("cachedBlogPosts")
        if (cachedPosts) {
          setPosts(JSON.parse(cachedPosts))
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
            const querySnapshot = await getDocs(collection(db, "blogPosts"))
            const loadedPosts = []

            querySnapshot.forEach((doc) => {
              loadedPosts.push({
                id: doc.id,
                ...doc.data(),
              })
            })

            // Actualizar estados y caché solo si se obtuvieron datos
            if (loadedPosts.length > 0) {
              setPosts(loadedPosts)
              localStorage.setItem("cachedBlogPosts", JSON.stringify(loadedPosts))
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
          if (!cachedPosts) {
            console.error("No hay datos disponibles:", raceError)
          }
        }
      } catch (error) {
        console.error("Error loading blog posts:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPosts()
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Cargando artículos...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No hay artículos publicados aún.</p>
          <p className="text-sm">Puedes crear nuevos artículos desde el panel de administración.</p>
          <Button asChild className="mt-4">
            <Link href="/admin/dashboard">Ir al panel de administración</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden flex flex-col">
              <div className="h-48 relative">
                <Image
                  src={post.image || "/placeholder.svg?height=200&width=400"}
                  alt={post.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = "/placeholder.svg?height=200&width=400"
                  }}
                />
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                <CardDescription>
                  {post.date} | {post.category}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3">{post.description}</p>
              </CardContent>
              <CardFooter className="mt-auto">
                <Link href={`/blog/${post.slug}`} className="text-primary hover:underline">
                  Leer más
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

