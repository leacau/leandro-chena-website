"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import dynamic from "next/dynamic"
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
import "quilljs/dist/quill.snow.css"

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })

export default function EventsManager() {
  const [events, setEvents] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentEvent, setCurrentEvent] = useState({
    id: null,
    title: "",
    description: "",
    longDescription: "",
    date: "",
    time: "",
    location: "",
    image: "/placeholder.svg?height=200&width=400",
    slug: "",
  })

  const imageFileRef = useRef(null)
  const quillModules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ align: [] }],
          ["blockquote", "code-block"],
          ["clean", "hr"],
        ],
        handlers: {
          hr: function () {
            const range = this.quill.getSelection(true)
            if (range) {
              this.quill.clipboard.dangerouslyPasteHTML(range.index, "<hr />")
              this.quill.setSelection(range.index + 1, 0)
            }
          },
        },
      },
      history: { delay: 500, maxStack: 100, userOnly: true },
    }),
    [],
  )

  useEffect(() => {
    // Cargar eventos de Firestore
    const loadEvents = async () => {
      try {
        setIsLoading(true)
        const querySnapshot = await getDocs(collection(db, "events"))
        const loadedEvents = []

        querySnapshot.forEach((doc) => {
          loadedEvents.push({
            id: doc.id,
            ...doc.data(),
          })
        })

        if (loadedEvents.length > 0) {
          setEvents(loadedEvents)
        } else {
          // Datos iniciales de ejemplo
          const initialEvents = []

          // Guardar eventos iniciales en Firestore
          for (const event of initialEvents) {
            await addDoc(collection(db, "events"), event)
          }

          // Cargar nuevamente los eventos
          const newQuerySnapshot = await getDocs(collection(db, "events"))
          const newLoadedEvents = []

          newQuerySnapshot.forEach((doc) => {
            newLoadedEvents.push({
              id: doc.id,
              ...doc.data(),
            })
          })

          setEvents(newLoadedEvents)
        }
      } catch (error) {
        console.error("Error loading events:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los eventos.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadEvents()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCurrentEvent({
      ...currentEvent,
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
        description: "Por favor, seleccioná un archivo de imagen válido.",
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
      const storageRef = ref(storage, `events/${file.name}`)
      await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(storageRef)

      setCurrentEvent((prev) => ({
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

      // Generar slug si no existe
      let slug = currentEvent.slug
      if (!slug) {
        slug = currentEvent.title
          .toLowerCase()
          .replace(/[^\w\s]/gi, "")
          .replace(/\s+/g, "-")
      }

      if (isEditing) {
        // Actualizar evento existente en Firestore
        const eventRef = doc(db, "events", currentEvent.id)
        await updateDoc(eventRef, {
          ...currentEvent,
          slug,
        })

        // Actualizar estado local
        const updatedEvents = events.map((event) => (event.id === currentEvent.id ? { ...currentEvent, slug } : event))
        setEvents(updatedEvents)

        toast({ title: "Evento actualizado correctamente" })
      } else {
        // Crear nuevo evento en Firestore
        const eventData = {
          ...currentEvent,
          slug,
        }
        delete eventData.id // Eliminar id nulo antes de guardar

        const docRef = await addDoc(collection(db, "events"), eventData)

        // Actualizar estado local
        const newEvent = {
          id: docRef.id,
          ...eventData,
        }
        setEvents([...events, newEvent])

        toast({ title: "Evento creado correctamente" })
      }

      // Resetear formulario
      resetForm()
    } catch (error) {
      console.error("Error saving event:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar el evento.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (event) => {
    setCurrentEvent(event)
    setIsEditing(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro que querés eliminar este evento?")) {
      try {
        setIsLoading(true)

        // Eliminar de Firestore
        await deleteDoc(doc(db, "events", id))

        // Actualizar estado local
        const updatedEvents = events.filter((event) => event.id !== id)
        setEvents(updatedEvents)

        toast({ title: "Evento eliminado correctamente" })
      } catch (error) {
        console.error("Error deleting event:", error)
        toast({
          title: "Error",
          description: "No se pudo eliminar el evento.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const resetForm = () => {
    setCurrentEvent({
      id: null,
      title: "",
      description: "",
      longDescription: "",
      date: "",
      time: "",
      location: "",
      image: "/placeholder.svg?height=200&width=400",
      slug: "",
    })
    setIsEditing(false)
  }

  if (isLoading && events.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Cargando eventos...</span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Editar Evento" : "Nuevo Evento"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input id="title" name="title" value={currentEvent.title} onChange={handleInputChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                value={currentEvent.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Fecha</Label>
                <Input id="date" name="date" value={currentEvent.date} onChange={handleInputChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Hora</Label>
                <Input id="time" name="time" value={currentEvent.time} onChange={handleInputChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Ubicación</Label>
                <Input
                  id="location"
                  name="location"
                  value={currentEvent.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="longDescription">Descripción larga (formato enriquecido)</Label>
              <div className="border rounded-md">
                <ReactQuill
                  id="longDescription"
                  theme="snow"
                  value={currentEvent.longDescription}
                  onChange={(value) =>
                    setCurrentEvent((prev) => ({
                      ...prev,
                      longDescription: value,
                    }))
                  }
                  modules={quillModules}
                  placeholder="Añadí más detalles sobre el evento (visible en el detalle)"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Imagen del evento</Label>
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
                  {currentEvent.image && currentEvent.image !== "/placeholder.svg?height=200&width=400"
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

              {currentEvent.image && (
                <div className="mt-2 p-2 border rounded-md">
                  <div className="h-40 flex items-center justify-center">
                    <img
                      src={currentEvent.image || "/placeholder.svg"}
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
                {isEditing ? "Actualizar" : "Crear"} Evento
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Eventos Programados</h2>

        {events.length === 0 ? (
          <p className="text-muted-foreground">No hay eventos programados.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((event) => (
              <Card key={event.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Fecha: {event.date}</p>
                    <p className="text-sm font-medium">Hora: {event.time}</p>
                    <p className="text-sm font-medium">Ubicación: {event.location}</p>
                    <p className="line-clamp-2 text-muted-foreground">{event.description}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(event)} disabled={isLoading}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(event.id)} disabled={isLoading}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
      <style jsx global>{`
        .ql-toolbar .ql-hr::before {
          content: "—";
          display: inline-block;
          font-weight: bold;
        }
      `}</style>
    </div>
  )
}
