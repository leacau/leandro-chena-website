"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Pencil, Trash2, Upload, Loader2, Copy, Check, X, Save, Plus, Users } from "lucide-react"
import { db, storage } from "@/lib/firebase"
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, where, writeBatch } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import { Checkbox } from "@/components/ui/checkbox"

export default function EventsManager() {
  const [events, setEvents] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [signupsByEvent, setSignupsByEvent] = useState({})
  
  // Estado para editar inscripciones
  const [editingSignupId, setEditingSignupId] = useState(null)
  const [editingSignupData, setEditingSignupData] = useState({})
  
  // Estado para expandir la lista de inscriptos de un evento
  const [expandedEventId, setExpandedEventId] = useState(null)

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
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        horizontalRule: true,
        bulletList: { keepAttributes: true, keepMarks: true },
        orderedList: { keepAttributes: true, keepMarks: true },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: currentEvent.longDescription || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      setCurrentEvent((prev) => ({ ...prev, longDescription: html }))
    },
    editorProps: {
      attributes: {
        class: "min-h-[200px] px-3 py-2 focus:outline-none",
      },
    },
  })

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
           setEvents([])
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
    loadSignups()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCurrentEvent({
      ...currentEvent,
      [name]: value,
    })
  }

  const loadSignups = async () => {
    try {
      const signupsSnapshot = await getDocs(query(collection(db, "eventSignups"), orderBy("createdAt", "desc")))
      const grouped = {}
      signupsSnapshot.forEach((doc) => {
        const data = doc.data()
        const eventId = data.eventId || "sin-evento"
        if (!grouped[eventId]) grouped[eventId] = []
        grouped[eventId].push({ id: doc.id, ...data })
      })
      setSignupsByEvent(grouped)
    } catch (error) {
      console.error("Error loading signups:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las inscripciones.",
        variant: "destructive",
      })
    }
  }

  const toggleSignups = (id) => {
    setExpandedEventId(prev => prev === id ? null : id)
  }

  // --- FUNCIONES PARA GESTIÓN DE INSCRIPCIONES Y NOTIFICACIONES DINÁMICAS ---

  const handleAddNotificationColumn = async (event) => {
    const currentCount = event.notificationCount || 2;
    const newCount = currentCount + 1;

    try {
        await updateDoc(doc(db, "events", event.id), {
            notificationCount: newCount
        });

        setEvents(prev => prev.map(e => e.id === event.id ? { ...e, notificationCount: newCount } : e));
        toast({ title: "Columna de notificación agregada" });
    } catch (error) {
        console.error("Error adding notification column:", error);
        toast({ title: "Error", description: "No se pudo agregar la columna.", variant: "destructive" });
    }
  }

  const handleCopyEmails = (eventId) => {
    const signups = signupsByEvent[eventId] || []
    const emails = signups.map(s => s.email).filter(Boolean).join('; ')
    
    navigator.clipboard.writeText(emails).then(() => {
      toast({
        title: "Emails copiados",
        description: `${signups.length} direcciones copiadas al portapapeles.`,
      })
    }).catch(err => {
      toast({
        title: "Error",
        description: "No se pudo copiar al portapapeles.",
        variant: "destructive",
      })
    })
  }

  const handleDeleteSignup = async (signupId, eventId) => {
    if (!window.confirm("¿Seguro que querés eliminar esta inscripción?")) return

    try {
      await deleteDoc(doc(db, "eventSignups", signupId))
      
      setSignupsByEvent(prev => ({
        ...prev,
        [eventId]: prev[eventId].filter(s => s.id !== signupId)
      }))
      
      toast({ title: "Inscripción eliminada" })
    } catch (error) {
      console.error("Error deleting signup:", error)
      toast({ title: "Error", description: "No se pudo eliminar.", variant: "destructive" })
    }
  }

  const startEditingSignup = (signup) => {
    setEditingSignupId(signup.id)
    setEditingSignupData({ ...signup })
  }

  const cancelEditingSignup = () => {
    setEditingSignupId(null)
    setEditingSignupData({})
  }

  const saveSignup = async (eventId) => {
    try {
      await updateDoc(doc(db, "eventSignups", editingSignupId), editingSignupData)
      
      setSignupsByEvent(prev => ({
        ...prev,
        [eventId]: prev[eventId].map(s => s.id === editingSignupId ? editingSignupData : s)
      }))
      
      setEditingSignupId(null)
      toast({ title: "Datos actualizados" })
    } catch (error) {
      console.error("Error updating signup:", error)
      toast({ title: "Error", description: "No se pudo actualizar.", variant: "destructive" })
    }
  }

  const toggleNotification = async (signupId, eventId, notifNum, currentValue) => {
    const fieldName = `notified${notifNum}` 
    const dateFieldName = `notified${notifNum}At`
    const newValue = !currentValue
    const now = new Date()

    try {
      const updateData = {
        [fieldName]: newValue
      }
      if (newValue) {
        updateData[dateFieldName] = now.toISOString()
      } else {
        updateData[dateFieldName] = null
      }

      await updateDoc(doc(db, "eventSignups", signupId), updateData)

      setSignupsByEvent(prev => ({
        ...prev,
        [eventId]: prev[eventId].map(s => 
          s.id === signupId ? { ...s, ...updateData } : s
        )
      }))

    } catch (error) {
      console.error("Error toggling notification:", error)
      toast({ title: "Error", description: "No se pudo actualizar el estado.", variant: "destructive" })
    }
  }

  const toggleAllNotifications = async (eventId, notifNum, checkAll) => {
    const signups = signupsByEvent[eventId] || []
    const batch = writeBatch(db)
    const now = new Date().toISOString()
    const fieldName = `notified${notifNum}`
    const dateFieldName = `notified${notifNum}At`

    signups.forEach(signup => {
      const ref = doc(db, "eventSignups", signup.id)
      const updateData = { [fieldName]: checkAll }
      if (checkAll) updateData[dateFieldName] = now
      else updateData[dateFieldName] = null
      batch.update(ref, updateData)
    })

    try {
      await batch.commit()
      
      setSignupsByEvent(prev => ({
        ...prev,
        [eventId]: prev[eventId].map(s => ({
            ...s,
            [fieldName]: checkAll,
            [dateFieldName]: checkAll ? now : null
        }))
      }))
      
      toast({ title: checkAll ? `Todos marcados como Notificación ${notifNum}` : `Desmarcados Notificación ${notifNum}` })
    } catch (error) {
      console.error("Error bulk updating:", error)
      toast({ title: "Error", description: "Falló la actualización masiva.", variant: "destructive" })
    }
  }

  // --- FIN FUNCIONES INSCRIPCIONES ---

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast({ title: "Error", description: "Por favor, seleccioná un archivo de imagen válido.", variant: "destructive" })
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "Error", description: "La imagen es demasiado grande. El tamaño máximo es 2MB.", variant: "destructive" })
      return
    }

    try {
      setIsLoading(true)
      const storageRef = ref(storage, `events/${file.name}`)
      await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(storageRef)

      setCurrentEvent((prev) => ({ ...prev, image: downloadURL }))
      toast({ title: "Imagen subida", description: "La imagen se ha subido correctamente." })
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({ title: "Error", description: "No se pudo subir la imagen.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setIsLoading(true)

      let slug = currentEvent.slug
      if (!slug) {
        slug = currentEvent.title.toLowerCase().replace(/[^\w\s]/gi, "").replace(/\s+/g, "-")
      }

      if (isEditing) {
        const eventRef = doc(db, "events", currentEvent.id)
        await updateDoc(eventRef, { ...currentEvent, slug })
        const updatedEvents = events.map((event) => (event.id === currentEvent.id ? { ...currentEvent, slug } : event))
        setEvents(updatedEvents)
        toast({ title: "Evento actualizado correctamente" })
      } else {
        const eventData = { ...currentEvent, slug, notificationCount: 2 }
        delete eventData.id

        const docRef = await addDoc(collection(db, "events"), eventData)
        const newEvent = { id: docRef.id, ...eventData }
        setEvents([...events, newEvent])
        toast({ title: "Evento creado correctamente" })
      }
      resetForm()
    } catch (error) {
      console.error("Error saving event:", error)
      toast({ title: "Error", description: "No se pudo guardar el evento.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (event) => {
    setCurrentEvent(event)
    setIsEditing(true)
    // Nos aseguramos que al editar cierre la lista de inscriptos para que la vista quede más limpia
    setExpandedEventId(null)
  }

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro que querés eliminar este evento?")) {
      try {
        setIsLoading(true)
        await deleteDoc(doc(db, "events", id))
        const updatedEvents = events.filter((event) => event.id !== id)
        setEvents(updatedEvents)
        toast({ title: "Evento eliminado correctamente" })
      } catch (error) {
        console.error("Error deleting event:", error)
        toast({ title: "Error", description: "No se pudo eliminar el evento.", variant: "destructive" })
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

  useEffect(() => {
    if (editor && currentEvent.longDescription !== editor.getHTML()) {
      editor.commands.setContent(currentEvent.longDescription || "")
    }
  }, [currentEvent.id, currentEvent.longDescription, editor])

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
                <div className="flex flex-wrap gap-2 border-b px-2 py-2 bg-muted/60">
                  <Button type="button" variant="outline" size="sm" onClick={() => editor?.chain().focus().toggleBold().run()} disabled={!editor}>Negrita</Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => editor?.chain().focus().toggleItalic().run()} disabled={!editor}>Itálica</Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => editor?.chain().focus().toggleUnderline().run()} disabled={!editor}>Subrayado</Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => editor?.chain().focus().toggleStrike().run()} disabled={!editor}>Tachado</Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => editor?.chain().focus().toggleBulletList().run()} disabled={!editor}>Lista</Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => editor?.chain().focus().toggleOrderedList().run()} disabled={!editor}>Lista ordenada</Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => editor?.chain().focus().setHorizontalRule().run()} disabled={!editor}>Línea</Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => editor?.chain().focus().toggleBlockquote().run()} disabled={!editor}>Cita</Button>
                </div>
                <EditorContent editor={editor} className="prose prose-sm max-w-none" />
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
          <div className="flex flex-col gap-4">
            {events.map((event) => {
                const signups = signupsByEvent[event.id] || []
                const notificationCount = event.notificationCount || 2;
                const notificationIndices = Array.from({ length: notificationCount }, (_, i) => i + 1);
                const isExpanded = expandedEventId === event.id;

                return (
                    <Card key={event.id} className="overflow-hidden">
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
                        
                        <CardFooter className="flex justify-between items-center flex-wrap gap-2">
                            {/* Botón de inscriptos */}
                            <div className="flex space-x-2">
                                <Button 
                                    variant={isExpanded ? "default" : "secondary"} 
                                    size="sm" 
                                    onClick={() => toggleSignups(event.id)}
                                >
                                    <Users className="h-4 w-4 mr-2" />
                                    Inscriptos ({signups.length})
                                </Button>
                            </div>
                            
                            {/* Acciones del evento */}
                            <div className="flex justify-end space-x-2">
                                <Button variant="outline" size="sm" onClick={() => handleEdit(event)} disabled={isLoading}>
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Editar
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(event.id)} disabled={isLoading}>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Eliminar
                                </Button>
                            </div>
                        </CardFooter>

                        {/* SECCIÓN DESPLEGABLE DE INSCRIPTOS DENTRO DE LA TARJETA */}
                        {isExpanded && (
                            <div className="border-t bg-slate-50 dark:bg-slate-900/20 p-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-sm md:text-base">
                                        Gestión de Inscriptos
                                    </h3>
                                    <div className="flex gap-2 flex-wrap justify-end">
                                        <Button variant="outline" size="sm" onClick={() => handleAddNotificationColumn(event)}>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Nueva Notif.
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => handleCopyEmails(event.id)}>
                                            <Copy className="h-4 w-4 mr-2" />
                                            Copiar Emails
                                        </Button>
                                    </div>
                                </div>

                                {signups.length === 0 ? (
                                    <p className="text-sm text-muted-foreground bg-white dark:bg-slate-950 p-4 rounded-md border text-center">
                                        Aún no hay inscriptos.
                                    </p>
                                ) : (
                                    <div className="w-full overflow-x-auto bg-white dark:bg-slate-950 rounded-md border p-3">
                                        <div className="min-w-[800px]">
                                            <div className="flex gap-2 pb-2 mb-2 border-b text-sm font-bold text-muted-foreground items-center">
                                                <div className="w-[300px] flex-shrink-0">Usuario</div>
                                                
                                                {/* Columnas dinámicas de notificación (Headers) */}
                                                {notificationIndices.map(index => {
                                                    const allChecked = signups.length > 0 && signups.every(s => s[`notified${index}`]);
                                                    return (
                                                        <div key={index} className="w-[100px] flex-shrink-0 flex items-center justify-center gap-1 flex-col sm:flex-row">
                                                            <Checkbox 
                                                                checked={allChecked} 
                                                                onCheckedChange={(checked) => toggleAllNotifications(event.id, index, checked)}
                                                            /> 
                                                            <span className="text-xs">Notif {index}</span>
                                                        </div>
                                                    );
                                                })}

                                                <div className="flex-grow text-right">Acciones</div>
                                            </div>

                                            {signups.map((signup) => (
                                                <div key={signup.id} className="flex gap-2 items-center border rounded-md p-3 mb-2 last:mb-0">
                                                    {/* Datos del Usuario / Modo Edición */}
                                                    <div className="w-[300px] flex-shrink-0">
                                                        {editingSignupId === signup.id ? (
                                                            <div className="space-y-2">
                                                                <Input 
                                                                    value={editingSignupData.name} 
                                                                    onChange={(e) => setEditingSignupData({...editingSignupData, name: e.target.value})} 
                                                                    placeholder="Nombre"
                                                                    className="h-8"
                                                                />
                                                                <Input 
                                                                    value={editingSignupData.email} 
                                                                    onChange={(e) => setEditingSignupData({...editingSignupData, email: e.target.value})} 
                                                                    placeholder="Email"
                                                                    className="h-8"
                                                                />
                                                                <Input 
                                                                    value={editingSignupData.whatsapp} 
                                                                    onChange={(e) => setEditingSignupData({...editingSignupData, whatsapp: e.target.value})} 
                                                                    placeholder="WhatsApp"
                                                                    className="h-8"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <p className="font-medium">{signup.name || "Sin nombre"}</p>
                                                                <p className="text-sm text-muted-foreground break-all">{signup.email}</p>
                                                                {signup.whatsapp && (
                                                                    <p className="text-sm text-muted-foreground">WP: {signup.whatsapp}</p>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>

                                                    {/* Checkboxes Dinámicos */}
                                                    {notificationIndices.map(index => {
                                                        const fieldName = `notified${index}`;
                                                        const dateFieldName = `notified${index}At`;
                                                        return (
                                                            <div key={index} className="w-[100px] flex-shrink-0 flex flex-col items-center justify-center">
                                                                <Checkbox 
                                                                    checked={signup[fieldName]} 
                                                                    onCheckedChange={() => toggleNotification(signup.id, event.id, index, signup[fieldName])}
                                                                />
                                                                {signup[dateFieldName] && (
                                                                    <span className="text-[10px] text-muted-foreground mt-1 text-center leading-tight">
                                                                        {new Date(signup[dateFieldName]).toLocaleDateString()}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                    
                                                    {/* Botones de Acción */}
                                                    <div className="flex-grow flex gap-2 justify-end items-center">
                                                        {editingSignupId === signup.id ? (
                                                            <>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600" onClick={() => saveSignup(event.id)}>
                                                                    <Save className="h-4 w-4" />
                                                                </Button>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={cancelEditingSignup}>
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEditingSignup(signup)}>
                                                                    <Pencil className="h-4 w-4" />
                                                                </Button>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteSignup(signup.id, event.id)}>
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </Card>
                )
            })}
          </div>
        )}
      </div>
      <style jsx global>{`
        .ProseMirror {
          outline: none;
        }
        .ProseMirror ul {
          list-style: disc;
          padding-left: 1.5rem;
          margin: 0.75rem 0;
        }
        .ProseMirror ol {
          list-style: decimal;
          padding-left: 1.5rem;
          margin: 0.75rem 0;
        }
        .ProseMirror hr {
          border: none;
          border-top: 2px solid #000;
          width: 60%;
          margin: 1.5rem auto;
        }
        .ProseMirror blockquote {
          border-left: 4px solid var(--primary);
          padding-left: 1rem;
          color: var(--muted-foreground);
        }
      `}</style>
    </div>
  )
}
