"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, doc, updateDoc, increment } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Download, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

export default function DownloadPage({ params }) {
  const { slug } = params
  const router = useRouter()
  const [fileData, setFileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadFile() {
      try {
        setLoading(true)
        setError(null)

        // Buscar el archivo en Firestore por slug
        const filesCollection = collection(db, "files")
        const fileQuery = query(filesCollection, where("slug", "==", slug))
        const querySnapshot = await getDocs(fileQuery)

        if (querySnapshot.empty) {
          setError("Archivo no encontrado")
          setLoading(false)
          return
        }

        // Usar el primer documento que coincida
        const fileDoc = querySnapshot.docs[0]
        const file = {
          id: fileDoc.id,
          ...fileDoc.data(),
        }

        setFileData(file)

        // Incrementar el contador de descargas
        try {
          const fileDocRef = doc(db, "files", fileDoc.id)
          await updateDoc(fileDocRef, {
            downloads: increment(1),
          })
        } catch (updateError) {
          console.error("Error al actualizar contador de descargas:", updateError)
          // Continuar aunque falle el contador
        }
      } catch (error) {
        console.error("Error al cargar el archivo:", error)
        setError("Error al cargar la información del archivo")
      } finally {
        setLoading(false)
      }
    }

    loadFile()
  }, [slug])

  // Preparar la URL para la descarga con el nombre de archivo correcto
  const getDownloadUrl = () => {
    if (!fileData) return "#"

    // Intentar añadir el Content-Disposition para que se descargue con el nombre correcto
    try {
      const url = new URL(fileData.storageURL)
      url.searchParams.append(
        "response-content-disposition",
        `attachment; filename="${encodeURIComponent(fileData.name + "." + fileData.fileType)}"`,
      )
      return url.toString()
    } catch (e) {
      // Si hay error al manipular la URL, devolver la original
      return fileData.storageURL
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-12 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <span>Preparando archivo para descargar...</span>
      </div>
    )
  }

  if (error || !fileData) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Archivo no encontrado</h1>
          <p className="mb-6 text-muted-foreground">
            Lo sentimos, el archivo que estás buscando no existe o ha sido eliminado.
          </p>
          <Button asChild>
            <Link href="/">Volver al inicio</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <Link href="/" className="inline-flex items-center text-primary hover:underline mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver al inicio
      </Link>

      <div className="max-w-lg mx-auto">
        <div className="bg-card rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-2">{fileData.name}</h1>
            {fileData.description && <p className="text-muted-foreground mb-6">{fileData.description}</p>}
            <div className="flex flex-col space-y-2">
              <p className="text-sm">
                <span className="font-medium">Tipo:</span> {fileData.fileType?.toUpperCase() || "Desconocido"}
              </p>
              <p className="text-sm">
                <span className="font-medium">Descargas:</span> {fileData.downloads || 0}
              </p>
              <p className="text-sm">
                <span className="font-medium">Nombre original:</span> {fileData.originalName || fileData.name}
              </p>
            </div>
            <div className="mt-8">
              <Button asChild size="lg" className="w-full">
                <a href={getDownloadUrl()} download={`${fileData.name}.${fileData.fileType}`}>
                  <Download className="mr-2 h-5 w-5" />
                  Descargar Archivo
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

