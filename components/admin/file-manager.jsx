"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { collection, addDoc, getDocs, doc, deleteDoc, query, orderBy } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Clipboard, ExternalLink, Trash2, RefreshCw, Upload, FileText, Download } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function FileManager() {
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState("")
  const [fileDescription, setFileDescription] = useState("")
  const [files, setFiles] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingFiles, setIsLoadingFiles] = useState(true)
  const { toast } = useToast()
  const baseUrl = typeof window !== "undefined" ? `${window.location.origin}/descargar/` : ""
  const storage = getStorage()

  // Cargar archivos existentes
  const loadFiles = async () => {
    setIsLoadingFiles(true)
    try {
      const filesQuery = query(collection(db, "files"), orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(filesQuery)
      const loadedFiles = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setFiles(loadedFiles)
    } catch (error) {
      console.error("Error al cargar archivos:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los archivos",
        variant: "destructive",
      })
    } finally {
      setIsLoadingFiles(false)
    }
  }

  useEffect(() => {
    loadFiles()
  }, [])

  // Generar slug aleatorio
  const generateRandomSlug = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let result = ""
    const length = 8
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
  }

  // Manejar cambio de archivo
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0])
      if (!fileName) {
        setFileName(e.target.files[0].name.split(".")[0])
      }
    }
  }

  // Subir archivo
  const uploadFile = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Por favor, selecciona un archivo",
        variant: "destructive",
      })
      return
    }

    if (!fileName.trim()) {
      toast({
        title: "Error",
        description: "Por favor, ingresa un nombre para el archivo",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Generar un slug único
      const slug = generateRandomSlug()

      // Crear referencia al archivo en Storage
      const fileExtension = file.name.split(".").pop()
      const storageRef = ref(storage, `files/${slug}.${fileExtension}`)

      // Subir archivo
      await uploadBytes(storageRef, file)

      // Obtener URL de descarga
      const downloadURL = await getDownloadURL(storageRef)

      // Guardar información en Firestore
      await addDoc(collection(db, "files"), {
        name: fileName,
        description: fileDescription,
        slug: slug,
        originalName: file.name,
        fileType: fileExtension,
        storageURL: downloadURL,
        createdAt: new Date().toISOString(),
        downloads: 0,
      })

      toast({
        title: "¡Archivo subido!",
        description: `El archivo se ha subido correctamente.`,
      })

      // Limpiar formulario y recargar lista
      setFile(null)
      setFileName("")
      setFileDescription("")
      document.getElementById("file-input").value = ""
      loadFiles()
    } catch (error) {
      console.error("Error al subir archivo:", error)
      toast({
        title: "Error",
        description: "No se pudo subir el archivo",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Copiar URL al portapapeles
  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          title: "¡Copiado!",
          description: "URL copiada al portapapeles",
        })
      })
      .catch((err) => {
        console.error("Error al copiar:", err)
        toast({
          title: "Error",
          description: "No se pudo copiar la URL",
          variant: "destructive",
        })
      })
  }

  // Eliminar archivo
  const deleteFile = async (id, storageURL) => {
    if (confirm("¿Estás seguro de que deseas eliminar este archivo?")) {
      try {
        setIsLoading(true)

        // Eliminar de Firestore
        await deleteDoc(doc(db, "files", id))

        // Intentar eliminar de Storage
        try {
          // Extraer la ruta del archivo de la URL
          const fileRef = ref(storage, storageURL)
          await deleteObject(fileRef)
        } catch (storageError) {
          console.error("Error al eliminar archivo de Storage:", storageError)
          // Continuamos aunque falle la eliminación del Storage
        }

        toast({
          title: "Eliminado",
          description: "El archivo ha sido eliminado",
        })

        loadFiles()
      } catch (error) {
        console.error("Error al eliminar archivo:", error)
        toast({
          title: "Error",
          description: "No se pudo eliminar el archivo",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  // Obtener icono según tipo de archivo
  const getFileIcon = (fileType) => {
    const type = fileType.toLowerCase()
    if (["pdf"].includes(type)) return <FileText className="h-5 w-5" />
    if (["doc", "docx", "txt"].includes(type)) return <FileText className="h-5 w-5" />
    if (["xls", "xlsx", "csv"].includes(type)) return <FileText className="h-5 w-5" />
    if (["jpg", "jpeg", "png", "gif", "svg"].includes(type)) return <FileText className="h-5 w-5" />
    return <FileText className="h-5 w-5" />
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestor de Archivos</CardTitle>
          <CardDescription>Sube archivos y comparte enlaces de descarga amigables</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file-input">Archivo</Label>
            <Input id="file-input" type="file" onChange={handleFileChange} className="cursor-pointer" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="file-name">Nombre del archivo</Label>
            <Input
              id="file-name"
              placeholder="Nombre para mostrar"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="file-description">Descripción (opcional)</Label>
            <Textarea
              id="file-description"
              placeholder="Descripción del archivo"
              value={fileDescription}
              onChange={(e) => setFileDescription(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={uploadFile} disabled={isLoading || !file} className="w-full">
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Subiendo...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Subir Archivo
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Archivos Subidos</CardTitle>
            <CardDescription>Gestiona tus archivos y enlaces de descarga</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={loadFiles} disabled={isLoadingFiles}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingFiles ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
        </CardHeader>
        <CardContent>
          {isLoadingFiles ? (
            <div className="flex justify-center py-6">
              <RefreshCw className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : files.length === 0 ? (
            <p className="text-center py-6 text-muted-foreground">No hay archivos subidos todavía</p>
          ) : (
            <div className="space-y-4">
              {files.map((file) => (
                <div key={file.id} className="flex flex-col space-y-3 p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="mt-1">{getFileIcon(file.fileType)}</div>
                      <div>
                        <h3 className="font-medium">{file.name}</h3>
                        <p className="text-sm text-muted-foreground">{file.description || file.originalName}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(file.createdAt).toLocaleDateString()} • {file.downloads || 0} descargas
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-primary font-medium mb-2">
                      {baseUrl}
                      {file.slug}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(`${baseUrl}${file.slug}`)}>
                        <Clipboard className="h-4 w-4 mr-2" />
                        Copiar URL
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`${baseUrl}${file.slug}`, "_blank")}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Ver página
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => window.open(file.storageURL, "_blank")}>
                        <Download className="h-4 w-4 mr-2" />
                        Descargar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => deleteFile(file.id, file.storageURL)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

