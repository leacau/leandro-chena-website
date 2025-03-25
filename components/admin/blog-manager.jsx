"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Pencil, Trash2, Upload, Loader2 } from "lucide-react"
import { db, storage } from "@/lib/firebase"
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

export default function BlogManager() {
  const [posts, setPosts] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
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
        }
      } catch (error) {
        console.error("Error loading blog posts:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los artículos del blog.",
          variant: "destructive",
        })
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setIsLoading(true)

      // Validar que todos los campos requeridos estén presentes
      if (!currentPost.title.trim() || !currentPost.description.trim() || !currentPost.content.trim()) {
        toast({
          title: "Error",
          description: "Por favor completa todos los campos requeridos",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

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

      let result

      if (isEditing) {
        // Actualizar post existente en Firestore
        const postRef = doc(db, "blogPosts", currentPost.id)
        const updatedPost = {
          ...currentPost,
          slug,
          date,
        }

        result = await updateDoc(postRef, updatedPost)

        // Actualizar estado local después de confirmar el éxito de la operación
        if (result !== undefined) {
          const updatedPosts = posts.map((post) => (post.id === currentPost.id ? { ...updatedPost } : post))
          setPosts(updatedPosts)

          // Actualizar también la caché local
          localStorage.setItem("cachedBlogPosts", JSON.stringify(updatedPosts))

          toast({
            title: "Post actualizado correctamente",
            description: "Los cambios han sido guardados en la base de datos",
          })
        }
      } else {
        // Crear nuevo post en Firestore con retry
        const postData = {
          ...currentPost,
          slug,
          date,
        }
        delete postData.id // Eliminar id nulo antes de guardar

        let retryCount = 0
        let docRef

        while (retryCount < 3 && !docRef) {
          try {
            docRef = await addDoc(collection(db, "blogPosts"), postData)
          } catch (addError) {
            console.error(`Error en intento ${retryCount + 1} al crear post:`, addError)
            retryCount++

            if (retryCount >= 3) {
              throw addError // Propagar el error después de 3 intentos
            }

            // Esperar antes de reintentar
            await new Promise((resolve) => setTimeout(resolve, 1000))
          }
        }

        if (docRef) {
          // Actualizar estado local después de confirmar éxito
          const newPost = {
            id: docRef.id,
            ...postData,
          }

          const newPostsList = [...posts, newPost]
          setPosts(newPostsList)

          // Actualizar también la caché local
          localStorage.setItem("cachedBlogPosts", JSON.stringify(newPostsList))

          toast({
            title: "Post creado correctamente",
            description: "El nuevo post ha sido guardado en la base de datos",
          })
        }
      }

      // Resetear formulario solo si la operación fue exitosa
      resetForm()
    } catch (error) {
      console.error("Error saving blog post:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar el artículo. Intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
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

        // Eliminar de Firestore
        await deleteDoc(doc(db, "blogPosts", id))

        // Actualizar estado local
        const updatedPosts = posts.filter((post) => post.id !== id)
        setPosts(updatedPosts)

        toast({ title: "Post eliminado correctamente" })
      } catch (error) {
        console.error("Error deleting blog post:", error)
        toast({
          title: "Error",
          description: "No se pudo eliminar el artículo.",
          variant: "destructive",
        })
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
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
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
              <Card key={post.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{post.title}</CardTitle>
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

