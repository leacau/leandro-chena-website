"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Pencil, Trash2, Loader2 } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore"

export default function ResourcesManager() {
  const [resources, setResources] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentResource, setCurrentResource] = useState({
    id: null,
    title: "",
    description: "",
    type: "",
    icon: "FileText",
    href: "#",
  })

  useEffect(() => {
    // Cargar recursos de Firestore
    const loadResources = async () => {
      try {
        setIsLoading(true)
        const querySnapshot = await getDocs(collection(db, "resources"))
        const loadedResources = []

        querySnapshot.forEach((doc) => {
          loadedResources.push({
            id: doc.id,
            ...doc.data(),
          })
        })

        if (loadedResources.length > 0) {
          setResources(loadedResources)
          // Actualizar también la caché local
          localStorage.setItem("cachedResources", JSON.stringify(loadedResources))
        } else {
          // Datos iniciales de ejemplo
          const initialResources = []

          // Guardar recursos iniciales en Firestore
          for (const resource of initialResources) {
            await addDoc(collection(db, "resources"), resource)
          }

          // Cargar nuevamente los recursos
          const newQuerySnapshot = await getDocs(collection(db, "resources"))
          const newLoadedResources = []

          newQuerySnapshot.forEach((doc) => {
            newLoadedResources.push({
              id: doc.id,
              ...doc.data(),
            })
          })

          setResources(newLoadedResources)
          // Actualizar también la caché local
          localStorage.setItem("cachedResources", JSON.stringify(newLoadedResources))
        }
      } catch (error) {
        console.error("Error loading resources:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los recursos.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadResources()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCurrentResource({
      ...currentResource,
      [name]: value,
    })
  }

  const handleSelectChange = (name, value) => {
    setCurrentResource({
      ...currentResource,
      [name]: value,
    })

    // Actualizar el icono según el tipo seleccionado
    if (name === "type") {
      let icon = "FileText"
      if (value === "Video") icon = "Video"
      if (value === "Excel" || value === "Plantilla") icon = "Download"

      setCurrentResource((prev) => ({
        ...prev,
        icon,
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setIsLoading(true)

      // Validar que todos los campos requeridos estén presentes
      if (
        !currentResource.title.trim() ||
        !currentResource.description.trim() ||
        !currentResource.type ||
        !currentResource.href
      ) {
        toast({
          title: "Error",
          description: "Por favor completa todos los campos requeridos",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      let result

      if (isEditing) {
        // Actualizar recurso existente en Firestore
        const resourceRef = doc(db, "resources", currentResource.id)
        result = await updateDoc(resourceRef, currentResource)

        // Actualizar estado local después de confirmar el éxito de la operación
        if (result !== undefined) {
          const updatedResources = resources.map((resource) =>
            resource.id === currentResource.id ? currentResource : resource,
          )
          setResources(updatedResources)

          // Actualizar también la caché local
          localStorage.setItem("cachedResources", JSON.stringify(updatedResources))

          toast({
            title: "Recurso actualizado correctamente",
            description: "Los cambios han sido guardados en la base de datos",
          })
        }
      } else {
        // Crear nuevo recurso en Firestore con retry
        const resourceData = { ...currentResource }
        delete resourceData.id // Eliminar id nulo antes de guardar

        let retryCount = 0
        let docRef

        while (retryCount < 3 && !docRef) {
          try {
            docRef = await addDoc(collection(db, "resources"), resourceData)
          } catch (addError) {
            console.error(`Error en intento ${retryCount + 1} al crear recurso:`, addError)
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
          const newResource = {
            id: docRef.id,
            ...resourceData,
          }

          const newResourcesList = [...resources, newResource]
          setResources(newResourcesList)

          // Actualizar también la caché local
          localStorage.setItem("cachedResources", JSON.stringify(newResourcesList))

          toast({
            title: "Recurso creado correctamente",
            description: "El nuevo recurso ha sido guardado en la base de datos",
          })
        }
      }

      // Resetear formulario solo si la operación fue exitosa
      resetForm()
    } catch (error) {
      console.error("Error saving resource:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar el recurso. Intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (resource) => {
    setCurrentResource(resource)
    setIsEditing(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro que querés eliminar este recurso?")) {
      try {
        setIsLoading(true)

        // Eliminar de Firestore
        await deleteDoc(doc(db, "resources", id))

        // Actualizar estado local
        const updatedResources = resources.filter((resource) => resource.id !== id)
        setResources(updatedResources)
        // Actualizar también la caché local
        localStorage.setItem("cachedResources", JSON.stringify(updatedResources))

        toast({ title: "Recurso eliminado correctamente" })
      } catch (error) {
        console.error("Error deleting resource:", error)
        toast({
          title: "Error",
          description: "No se pudo eliminar el recurso.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const resetForm = () => {
    setCurrentResource({
      id: null,
      title: "",
      description: "",
      type: "",
      icon: "FileText",
      href: "#",
    })
    setIsEditing(false)
  }

  if (isLoading && resources.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Cargando recursos...</span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Editar Recurso" : "Nuevo Recurso"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input id="title" name="title" value={currentResource.title} onChange={handleInputChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                value={currentResource.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de recurso</Label>
                <Select value={currentResource.type} onValueChange={(value) => handleSelectChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="Video">Video</SelectItem>
                    <SelectItem value="Excel">Excel</SelectItem>
                    <SelectItem value="Plantilla">Plantilla</SelectItem>
                    <SelectItem value="Otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="href">URL del recurso</Label>
                <Input
                  id="href"
                  name="href"
                  value={currentResource.href}
                  onChange={handleInputChange}
                  placeholder="#"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              {isEditing && (
                <Button type="button" variant="outline" onClick={resetForm} disabled={isLoading}>
                  Cancelar
                </Button>
              )}
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {isEditing ? "Actualizar" : "Crear"} Recurso
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Recursos Disponibles</h2>

        {resources.length === 0 ? (
          <p className="text-muted-foreground">No hay recursos disponibles.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map((resource) => (
              <Card key={resource.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium mb-2">Tipo: {resource.type}</p>
                  <p className="line-clamp-2 text-muted-foreground">{resource.description}</p>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(resource)} disabled={isLoading}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(resource.id)}
                    disabled={isLoading}
                  >
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

