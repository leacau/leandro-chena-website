"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Pencil, Trash2, Upload, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { db, storage } from "@/lib/firebase"
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc, writeBatch } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

export default function BlogManager() {
  const [posts, setPosts] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null) // null, 'saving', 'success', 'error'
  const [currentPost, setCurrentPost] = useState({
    id: null,
    title: "",
    description: "",
    content: "",
    date: "",
    category: "",
    image: "/placeholder.svg?height=200&width=400",
    slug: "",
  })

  const imageFileRef = useRef(null)

  useEffect(() => {
    // Cargar posts de Firestore
    const loadPosts = async () => {
      try {
        setIsLoading(true)

        // Intentar cargar desde localStorage primero para mostrar algo rápido
        try {
          const cachedPosts = localStorage.getItem("cachedBlogPosts")
          if (cachedPosts) {
            const parsed = JSON.parse(cachedPosts)
            if (Array.isArray(parsed) && parsed.length > 0) {
              setPosts(parsed)
            }
          }
        } catch (cacheError) {
          console.error("Error loading from cache:", cacheError)
        }

        // Luego intentar cargar desde Firestore
        try {
          const querySnapshot = await getDocs(collection(db, "blogPosts"))
          const loadedPosts = []

          querySnapshot.forEach((doc) => {
            loadedPosts.push({
              id: doc.id,
              ...doc.data(),
            })
          })

          if (loadedPosts.length > 0) {
            setPosts(loadedPosts)
            // Actualizar caché
            localStorage.setItem("cachedBlogPosts", JSON.stringify(loadedPosts))
          } else {
            // Datos iniciales de ejemplo
            const initialPosts = [
              {
                title: "Cómo desarrollar un equipo comercial de alto rendimiento",
                description:
                  "Estrategias probadas para formar y liderar equipos de ventas que superan consistentemente sus objetivos.",
                content: "Contenido completo del artículo...",
                date: "10 de marzo de 2023",
                category: "Liderazgo",
                image: "/placeholder.svg?height=200&width=400",
                slug: "como-desarrollar-equipo-comercial-alto-rendimiento",
              },
              {
                title: "5 errores comunes en el proceso de venta y cómo evitarlos",
                description:
                  "Identifica y corrige los errores más frecuentes que cometen los vendedores y que afectan negativamente los resultados.",
                content: "Contenido completo del artículo...",
                date: "25 de febrero de 2023",
                category: "Ventas",
                image: "/placeholder.svg?height=200&width=400",
                slug: "5-errores-comunes-proceso-venta",
              },
            ]

            // Guardar posts iniciales en Firestore
            for (const post of initialPosts) {
              await addDoc(collection(db, "blogPosts"), post)
            }

            // Cargar nuevamente los posts
            const newQuerySnapshot = await getDocs(collection(db, "blogPosts"))
            const newLoadedPosts = []

            newQuerySnapshot.forEach((doc) => {
              newLoadedPosts.push({
                id: doc.id,
                ...doc.data(),
              })
            })

            setPosts(newLoadedPosts)
            localStorage.setItem("cachedBlogPosts", JSON.stringify(newLoadedPosts))
          }
        } catch (firestoreError) {
          console.error("Error loading from Firestore:", firestoreError)
          toast({
            title: "Error de conexión",
            description:
              "No se pudieron cargar los artículos desde la base de datos. Se mostrarán datos en caché si están disponibles.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("General error loading blog posts:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPosts()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCurrentPost({
      ...currentPost,
      [name]: value,
    })
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Por favor, selecciona un archivo de imagen válido.",
        variant: "destructive",
      })
      return
    }

    // Validar tamaño (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "La imagen es demasiado grande. El tamaño máximo es 2MB.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)

      // Subir a Firebase Storage
      const storageRef = ref(storage, `blog/${file.name}`)
      await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(storageRef)

      setCurrentPost((prev) => ({
        ...prev,
        image: downloadURL,
      }))

      toast({
        title: "Imagen subida",
        description: "La imagen se ha subido correctamente.",
      })
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Error",
        description: "No se pudo subir la imagen.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Función para guardar directamente en localStorage
  const saveToLocalStorage = (newPosts) => {
    try {
      localStorage.setItem("cachedBlogPosts", JSON.stringify(newPosts))
      console.log("Saved to localStorage successfully")
      return true
    } catch (error) {
      console.error("Error saving to localStorage:", error)
      return false
    }
  }

  // Función para guardar en Firestore con reintentos
  const saveToFirestore = async (postData, isUpdate = false) => {
    let retryCount = 0
    const maxRetries = 3
    let success = false
    let docRef = null
    let error = null

    while (retryCount < maxRetries && !success) {
      try {
        if (isUpdate) {
          // Actualizar documento existente
          const postRef = doc(db, "blogPosts", postData.id)
          await updateDoc(postRef, postData)
          success = true
        } else {
          // Crear nuevo documento
          const dataToSave = { ...postData }
          delete dataToSave.id // Eliminar id nulo antes de guardar

          // Intentar usar setDoc con ID generado manualmente si addDoc falla
          if (retryCount > 0) {
            const newId = `post_${Date.now()}_${Math.floor(Math.random() * 1000)}`
            const postRef = doc(db, "blogPosts", newId)
            await setDoc(postRef, dataToSave)
            docRef = { id: newId }
          } else {
            docRef = await addDoc(collection(db, "blogPosts"), dataToSave)
          }
          success = true
        }
      } catch (err) {
        error = err
        console.error(`Error en intento ${retryCount + 1}:`, err)
        retryCount++

        // Esperar antes de reintentar (backoff exponencial)
        await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, retryCount)))
      }
    }

    return { success, docRef, error }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validar que todos los campos requeridos estén presentes
    if (!currentPost.title.trim() || !currentPost.description.trim() || !currentPost.content.trim()) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      setSaveStatus("saving")

      // Generar slug si no existe
      let slug = currentPost.slug
      if (!slug) {
        slug = currentPost.title
          .toLowerCase()
          .replace(/[^\w\s]/gi, "")
          .replace(/\s+/g, "-")
      }

      // Generar fecha actual si no existe
      let date = currentPost.date
      if (!date) {
        const now = new Date()
        date = `${now.getDate()} de ${getMonthName(now.getMonth())} de ${now.getFullYear()}`
      }

      const postToSave = {
        ...currentPost,
        slug,
        date,
      }

      // Primero actualizar la UI optimistamente
      let updatedPosts

      if (isEditing) {
        // Actualizar post existente en la UI
        updatedPosts = posts.map((post) => (post.id === currentPost.id ? { ...postToSave } : post))
      } else {
        // Crear un ID temporal para el nuevo post
        const tempId = `temp_${Date.now()}`
        const newPost = {
          ...postToSave,
          id: tempId,
          _isTemp: true, // Marcar como temporal
        }
        updatedPosts = [...posts, newPost]
      }

      // Actualizar la UI inmediatamente
      setPosts(updatedPosts)

      // Guardar en localStorage como respaldo
      saveToLocalStorage(updatedPosts)

      // Intentar guardar en Firestore
      const { success, docRef, error } = await saveToFirestore(postToSave, isEditing)

      if (success) {
        // Si fue exitoso, actualizar la UI con el ID real si es un nuevo post
        if (!isEditing && docRef) {
          const finalPosts = updatedPosts.map((post) =>
            post._isTemp ? { ...post, id: docRef.id, _isTemp: undefined } : post,
          )
          setPosts(finalPosts)
          saveToLocalStorage(finalPosts)
        }

        setSaveStatus("success")
        toast({
          title: isEditing ? "Artículo actualizado" : "Artículo creado",
          description: "Los cambios se han guardado correctamente",
        })

        // Resetear formulario
        resetForm()
      } else {
        // Si falló, mantener los datos en localStorage pero mostrar error
        setSaveStatus("error")
        throw error || new Error("Error desconocido al guardar")
      }
    } catch (error) {
      console.error("Error saving blog post:", error)
      setSaveStatus("error")
      toast({
        title: "Error al guardar",
        description:
          "Los cambios se han guardado localmente, pero hubo un problema al sincronizar con la base de datos. Se intentará sincronizar más tarde.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      // Resetear el estado de guardado después de un tiempo
      setTimeout(() => setSaveStatus(null), 3000)
    }
  }

  const handleEdit = (post) => {
    setCurrentPost(post)
    setIsEditing(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro que desea eliminar este post?")) {
      try {
        setIsLoading(true)

        // Actualizar UI optimistamente
        const updatedPosts = posts.filter((post) => post.id !== id)
        setPosts(updatedPosts)
        saveToLocalStorage(updatedPosts)

        // Intentar eliminar de Firestore
        try {
          await deleteDoc(doc(db, "blogPosts", id))
          toast({ title: "Artículo eliminado correctamente" })
        } catch (error) {
          console.error("Error deleting from Firestore:", error)
          toast({
            title: "Error de sincronización",
            description:
              "El artículo se ha eliminado localmente, pero hubo un problema al sincronizar con la base de datos.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("General error deleting blog post:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const resetForm = () => {
    setCurrentPost({
      id: null,
      title: "",
      description: "",
      content: "",
      date: "",
      category: "",
      image: "/placeholder.svg?height=200&width=400",
      slug: "",
    })
    setIsEditing(false)
  }

  const getMonthName = (month) => {
    const months = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ]
    return months[month]
  }

  // Función para sincronizar manualmente con la base de datos
  const syncWithDatabase = async () => {
    try {
      setIsLoading(true)
      toast({
        title: "Sincronizando",
        description: "Intentando sincronizar con la base de datos...",
      })

      // Obtener posts actuales de Firestore
      const querySnapshot = await getDocs(collection(db, "blogPosts"))
      const serverPosts = {}

      // Crear un mapa de posts del servidor
      querySnapshot.forEach((doc) => {
        serverPosts[doc.id] = {
          id: doc.id,
          ...doc.data(),
        }
      })

      // Identificar posts que necesitan ser creados o actualizados
      const batch = writeBatch(db)
      let changesMade = false

      // Procesar posts locales
      for (const localPost of posts) {
        // Ignorar posts temporales o sin ID
        if (localPost._isTemp || !localPost.id || localPost.id.startsWith("temp_")) {
          // Crear nuevo documento para posts temporales
          const newData = { ...localPost }
          delete newData.id
          delete newData._isTemp

          const newDocRef = doc(collection(db, "blogPosts"))
          batch.set(newDocRef, newData)
          changesMade = true
          continue
        }

        // Si el post existe en el servidor, verificar si necesita actualización
        if (serverPosts[localPost.id]) {
          // Comparar para ver si hay diferencias
          const serverPost = serverPosts[localPost.id]
          if (JSON.stringify(serverPost) !== JSON.stringify(localPost)) {
            // Hay diferencias, actualizar en el servidor
            const postRef = doc(db, "blogPosts", localPost.id)
            const dataToUpdate = { ...localPost }
            delete dataToUpdate.id // No necesitamos el ID en los datos

            batch.update(postRef, dataToUpdate)
            changesMade = true
          }

          // Marcar como procesado
          delete serverPosts[localPost.id]
        } else {
          // El post no existe en el servidor, crearlo
          const postRef = doc(db, "blogPosts", localPost.id)
          const dataToCreate = { ...localPost }
          delete dataToCreate.id

          batch.set(postRef, dataToCreate)
          changesMade = true
        }
      }

      if (changesMade) {
        // Ejecutar el batch
        await batch.commit()

        // Recargar posts desde el servidor
        const newQuerySnapshot = await getDocs(collection(db, "blogPosts"))
        const freshPosts = []

        newQuerySnapshot.forEach((doc) => {
          freshPosts.push({
            id: doc.id,
            ...doc.data(),
          })
        })

        setPosts(freshPosts)
        saveToLocalStorage(freshPosts)

        toast({
          title: "Sincronización completada",
          description: "Los artículos se han sincronizado correctamente con la base de datos.",
        })
      } else {
        toast({
          title: "Sincronización completada",
          description: "No se detectaron cambios que sincronizar.",
        })
      }
    } catch (error) {
      console.error("Error syncing with database:", error)
      toast({
        title: "Error de sincronización",
        description: "No se pudieron sincronizar los artículos con la base de datos.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && posts.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Cargando artículos...</span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Administrador de Blog</h2>
        <Button onClick={syncWithDatabase} variant="outline" disabled={isLoading} className="flex items-center gap-2">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Sincronizar con base de datos
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Editar Artículo" : "Nuevo Artículo"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input id="title" name="title" value={currentPost.title} onChange={handleInputChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                value={currentPost.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Contenido</Label>
              <Textarea
                id="content"
                name="content"
                value={currentPost.content}
                onChange={handleInputChange}
                rows={6}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Input
                  id="category"
                  name="category"
                  value={currentPost.category}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Fecha</Label>
                <Input
                  id="date"
                  name="date"
                  value={currentPost.date}
                  onChange={handleInputChange}
                  placeholder="Dejar en blanco para fecha actual"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Imagen del artículo</Label>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => imageFileRef.current.click()}
                  className="flex items-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  Subir imagen
                </Button>
                <span className="text-sm text-muted-foreground">
                  {currentPost.image && currentPost.image !== "/placeholder.svg?height=200&width=400"
                    ? "Imagen seleccionada"
                    : "Ninguna imagen seleccionada"}
                </span>
                <input
                  type="file"
                  ref={imageFileRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>

              {currentPost.image && (
                <div className="mt-2 p-2 border rounded-md">
                  <div className="h-40 flex items-center justify-center">
                    <img
                      src={currentPost.image || "/placeholder.svg"}
                      alt="Vista previa"
                      className="max-h-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = "/placeholder.svg?height=200&width=400"
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              {isEditing && (
                <Button type="button" variant="outline" onClick={resetForm} disabled={isLoading}>
                  Cancelar
                </Button>
              )}
              <Button type="submit" disabled={isLoading} className="relative">
                {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {saveStatus === "success" && (
                  <span className="absolute right-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </span>
                )}
                {saveStatus === "error" && (
                  <span className="absolute right-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  </span>
                )}
                {isEditing ? "Actualizar" : "Crear"} Artículo
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Artículos Publicados</h2>

        {posts.length === 0 ? (
          <p className="text-muted-foreground">No hay artículos publicados.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.map((post) => (
              <Card key={post.id} className={post._isTemp ? "border-dashed border-yellow-500" : ""}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {post.title}
                    {post._isTemp && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        Pendiente de sincronización
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    {post.date} | {post.category}
                  </p>
                  <p className="line-clamp-2">{post.description}</p>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(post)} disabled={isLoading}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(post.id)} disabled={isLoading}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

