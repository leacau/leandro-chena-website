"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, doc, updateDoc, increment } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, FileText, RefreshCw } from "lucide-react"

export default function DownloadPage({ params }) {
  const { slug } = params
  const router = useRouter()
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFile = async () => {
      try {
        setLoading(true)

        // Buscar el archivo en Firestore
        const q = query(collection(db, "files"), where("slug", "==", slug))
        const querySnapshot = await getDocs(q)

        if (querySnapshot.empty) {
          setError("Archivo no encontrado")
          setLoading(false)
          return
        }

        // Obtener datos del archivo
        const fileDoc = querySnapshot.docs[0]
        const fileData = {
          id: fileDoc.id,
          ...fileDoc.data(),
        }

        setFile(fileData)
      } catch (error) {
        console.error("Error al cargar el archivo:", error)
        setError("Error al cargar el archivo")
      } finally {
        setLoading(false)
      }
    }

    fetchFile()
  }, [slug])

  // Incrementar contador de descargas y redirigir a la URL de descarga
  const handleDownload = async () => {
    try {
      // Incrementar contador
      await updateDoc(doc(db, "files", file.id), {
        downloads: increment(1),
      })

      // Redirigir a la URL de descarga
      window.location.href = file.storageURL
    } catch (error) {
      console.error("Error al descargar:", error)
      // Si falla, redirigir directamente
      window.location.href = file.storageURL
    }
  }

  // Obtener icono según tipo de archivo
  const getFileIcon = (fileType) => {
    if (!fileType) return <FileText className="h-12 w-12" />

    const type = fileType.toLowerCase()
    if (["pdf"].includes(type)) return <FileText className="h-12 w-12" />
    if (["doc", "docx", "txt"].includes(type)) return <FileText className="h-12 w-12" />
    if (["xls", "xlsx", "csv"].includes(type)) return <FileText className="h-12 w-12" />
    if (["jpg", "jpeg", "png", "gif", "svg"].includes(type)) return <FileText className="h-12 w-12" />
    return <FileText className="h-12 w-12" />
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[60vh]">
        <RefreshCw className="h-12 w-12 animate-spin text-primary mb-4" />
        <h1 className="text-2xl font-bold">Cargando archivo...</h1>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-destructive mb-4">
          <FileText className="h-12 w-12" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Archivo no encontrado</h1>
        <p className="text-muted-foreground mb-6">El archivo que estás buscando no existe o ha sido eliminado.</p>
        <Button onClick={() => router.push("/")}>Volver al inicio</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4 text-primary">{getFileIcon(file?.fileType)}</div>
          <CardTitle className="text-2xl">{file?.name}</CardTitle>
          {file?.description && <CardDescription className="mt-2">{file.description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Nombre original: {file?.originalName}</p>
            <p className="text-sm text-muted-foreground">{file?.downloads || 0} descargas</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" size="lg" onClick={handleDownload}>
            <Download className="mr-2 h-5 w-5" />
            Descargar Archivo
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

