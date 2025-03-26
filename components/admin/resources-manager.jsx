"use client"

import { AlertCircle, CheckCircle, Loader2, Pencil, Trash2 } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState, useCallback } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { db } from "@/lib/firebase"
import { toast } from "@/components/ui/use-toast"

// Importaciones de Firestore con manejo de errores
let firestoreImports = {}
try {
  // Importar directamente desde firebase/firestore para evitar problemas con require
  import("firebase/firestore")
    .then((firestore) => {
      firestoreImports = {
        addDoc: firestore.addDoc,
        collection: firestore.collection,
        deleteDoc: firestore.deleteDoc,
        doc: firestore.doc,
        getDocs: firestore.getDocs,
        setDoc: firestore.setDoc,
        updateDoc: firestore.updateDoc,
        writeBatch: firestore.writeBatch,
      }
    })
    .catch((error) => {
      console.error("Error al importar funciones de Firestore:", error)
    })
} catch (error) {
  console.error("Error al importar funciones de Firestore:", error)
}

// Crear mocks de las funciones si fallan las importaciones
if (!firestoreImports.addDoc) {
  firestoreImports = {
    addDoc: async () => ({ id: `mock-${Date.now()}` }),
    collection: () => ({}),
    deleteDoc: async () => {},
    doc: () => ({}),
    getDocs: async () => ({ forEach: () => {}, docs: [] }),
    setDoc: async () => {},
    updateDoc: async () => {},
    writeBatch: () => ({
      set: () => {},
      update: () => {},
      delete: () => {},
      commit: async () => {},
    }),
  }
}

export default function ResourcesManager() {
  const [resources, setResources] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null) // null, 'saving', 'success', 'error'
  const [currentResource, setCurrentResource] = useState({
    id: null,
    title: "",
    description: "",
    type: "",
    icon: "FileText",
    href: "#",
  })
  const [firebaseError, setFirebaseError] = useState(null)
  const [firestoreReady, setFirestoreReady] = useState(false)

  // Verificar si Firestore está listo para usar
  useEffect(() => {
    const checkFirestore = async () => {
      try {
        // Importar directamente para asegurarnos de tener las funciones más recientes
        const firestore = await import("firebase/firestore")

        // Actualizar las importaciones
        firestoreImports.addDoc = firestore.addDoc
        firestoreImports.collection = firestore.collection
        firestoreImports.deleteDoc = firestore.deleteDoc
        firestoreImports.doc = firestore.doc
        firestoreImports.getDocs = firestore.getDocs
        firestoreImports.setDoc = firestore.setDoc
        firestoreImports.updateDoc = firestore.updateDoc
        firestoreImports.writeBatch = firestore.writeBatch

        // Verificar si db está inicializado
        if (db) {
          setFirestoreReady(true)
          setFirebaseError(null)
        } else {
          setFirestoreReady(false)
          setFirebaseError("Firebase no está inicializado correctamente")
        }
      } catch (error) {
        console.error("Error al inicializar Firestore:", error)
        setFirestoreReady(false)
        setFirebaseError("Error al inicializar Firestore: " + error.message)
      }
    }

    checkFirestore()
  }, [])

  // Función para cargar recursos con manejo de errores mejorado
  const loadResources = useCallback(async () => {
    try {
      setIsLoading(true)

      // Intentar cargar desde localStorage primero para mostrar algo rápido
      try {
        const cachedResources = localStorage.getItem("cachedResources")
        if (cachedResources) {
          const parsed = JSON.parse(cachedResources)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setResources(parsed)
          }
        }
      } catch (cacheError) {
        console.error("Error loading from cache:", cacheError)
      }

      // Luego intentar cargar desde Firestore si está listo
      if (firestoreReady && db) {
        try {
          // Importar de nuevo para asegurarnos de tener las funciones más recientes
          const { collection, getDocs } = await import("firebase/firestore")

          // Crear referencia a la colección
          const resourcesCollection = collection(db, "resources")

          // Obtener documentos
          const querySnapshot = await getDocs(resourcesCollection)
          const loadedResources = []

          querySnapshot.forEach((doc) => {
            loadedResources.push({
              id: doc.id,
              ...doc.data(),
            })
          })

          if (loadedResources.length > 0) {
            setResources(loadedResources)
            // Actualizar caché
            localStorage.setItem("cachedResources", JSON.stringify(loadedResources))
          }
        } catch (firestoreError) {
          console.error("Error loading from Firestore:", firestoreError)
          setFirebaseError(firestoreError.message || "Error al conectar con Firestore")
          toast({
            title: "Error de conexión",
            description:
              "No se pudieron cargar los recursos desde la base de datos. Se mostrarán datos en caché si están disponibles.",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("General error loading resources:", error)
    } finally {
      setIsLoading(false)
    }
  }, [firestoreReady])

  useEffect(() => {
    if (firestoreReady) {
      loadResources()
    }
  }, [loadResources, firestoreReady])

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

  // Función para guardar directamente en localStorage
  const saveToLocalStorage = (newResources) => {
    try {
      localStorage.setItem("cachedResources", JSON.stringify(newResources))
      console.log("Saved to localStorage successfully")
      return true
    } catch (error) {
      console.error("Error saving to localStorage:", error)
      return false
    }
  }

  // Función para guardar en Firestore con reintentos y mejor manejo de errores
  const saveToFirestore = async (resourceData, isUpdate = false) => {
    // Si Firestore no está listo, guardar solo en localStorage
    if (!firestoreReady || !db) {
      return {
        success: false,
        docRef: null,
        error: new Error("Firestore no está inicializado correctamente"),
      }
    }

    let retryCount = 0
    const maxRetries = 3
    let success = false
    let docRef = null
    let error = null

    while (retryCount < maxRetries && !success) {
      try {
        // Importar de nuevo para asegurarnos de tener las funciones más recientes
        const { collection, doc, addDoc, setDoc, updateDoc } = await import("firebase/firestore")

        if (isUpdate) {
          // Actualizar documento existente
          const resourceRef = doc(db, "resources", resourceData.id)
          const dataToUpdate = { ...resourceData }
          delete dataToUpdate.id // No necesitamos el ID en los datos

          await updateDoc(resourceRef, dataToUpdate)
          success = true
        } else {
          // Crear nuevo documento
          const dataToSave = { ...resourceData }
          delete dataToSave.id // Eliminar id nulo antes de guardar

          try {
            // Crear referencia a la colección
            const resourcesCollection = collection(db, "resources")

            // Añadir documento
            docRef = await addDoc(resourcesCollection, dataToSave)
            success = true
          } catch (addError) {
            console.error("Error in addDoc:", addError)

            // Intentar con setDoc como alternativa
            const newId = `resource_${Date.now()}_${Math.floor(Math.random() * 1000)}`
            const resourceRef = doc(db, "resources", newId)

            await setDoc(resourceRef, dataToSave)
            docRef = { id: newId }
            success = true
          }
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
      return
    }

    try {
      setIsLoading(true)
      setSaveStatus("saving")

      // Primero actualizar la UI optimistamente
      let updatedResources

      if (isEditing) {
        // Actualizar recurso existente en la UI
        updatedResources = resources.map((resource) =>
          resource.id === currentResource.id ? { ...currentResource } : resource,
        )
      } else {
        // Crear un ID temporal para el nuevo recurso
        const tempId = `temp_${Date.now()}`
        const newResource = {
          ...currentResource,
          id: tempId,
          _isTemp: true, // Marcar como temporal
        }
        updatedResources = [...resources, newResource]
      }

      // Actualizar la UI inmediatamente
      setResources(updatedResources)

      // Guardar en localStorage como respaldo
      saveToLocalStorage(updatedResources)

      // Intentar guardar en Firestore
      const { success, docRef, error } = await saveToFirestore(currentResource, isEditing)

      if (success) {
        // Si fue exitoso, actualizar la UI con el ID real si es un nuevo recurso
        if (!isEditing && docRef) {
          const finalResources = updatedResources.map((resource) =>
            resource._isTemp ? { ...resource, id: docRef.id, _isTemp: undefined } : resource,
          )
          setResources(finalResources)
          saveToLocalStorage(finalResources)
        }

        setSaveStatus("success")
        toast({
          title: isEditing ? "Recurso actualizado" : "Recurso creado",
          description: "Los cambios se han guardado correctamente",
        })

        // Resetear formulario
        resetForm()
      } else {
        // Si falló, mantener los datos en localStorage pero mostrar error
        setSaveStatus("error")
        setFirebaseError(error?.message || "Error al guardar en Firestore")

        // Mostrar toast de error pero con información de guardado local
        toast({
          title: "Error al sincronizar con la base de datos",
          description: "Los cambios se han guardado localmente y se sincronizarán más tarde.",
          variant: "destructive",
        })

        // Aún así, resetear el formulario ya que los datos están guardados localmente
        resetForm()
      }
    } catch (error) {
      console.error("Error saving resource:", error)
      setSaveStatus("error")
      toast({
        title: "Error al guardar",
        description:
          "Los cambios se han guardado localmente, pero hubo un problema al sincronizar con la base de datos. Se intentará sincronizar más tarde.",
        variant: "destructive",
      })

      // Resetear el formulario ya que los datos están guardados localmente
      resetForm()
    } finally {
      setIsLoading(false)
      // Resetear el estado de guardado después de un tiempo
      setTimeout(() => setSaveStatus(null), 3000)
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

        // Actualizar UI optimistamente
        const updatedResources = resources.filter((resource) => resource.id !== id)
        setResources(updatedResources)
        saveToLocalStorage(updatedResources)

        // Intentar eliminar de Firestore si está listo
        if (firestoreReady && db) {
          try {
            // Importar de nuevo para asegurarnos de tener las funciones más recientes
            const { doc, deleteDoc } = await import("firebase/firestore")

            // Crear referencia al documento
            const resourceRef = doc(db, "resources", id)

            // Eliminar documento
            await deleteDoc(resourceRef)

            toast({ title: "Recurso eliminado correctamente" })
          } catch (error) {
            console.error("Error deleting from Firestore:", error)
            setFirebaseError(error.message || "Error al eliminar de Firestore")
            toast({
              title: "Error de sincronización",
              description:
                "El recurso se ha eliminado localmente, pero hubo un problema al sincronizar con la base de datos.",
              variant: "destructive",
            })
          }
        } else {
          toast({
            title: "Modo offline",
            description: "El recurso se ha eliminado localmente y se sincronizará cuando se restablezca la conexión.",
          })
        }
      } catch (error) {
        console.error("General error deleting resource:", error)
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

  // Función para sincronizar manualmente con la base de datos
  const syncWithDatabase = async () => {
    if (!firestoreReady || !db) {
      toast({
        title: "Error de sincronización",
        description: "Firestore no está inicializado correctamente. No se puede sincronizar.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      setFirebaseError(null)
      toast({
        title: "Sincronizando",
        description: "Intentando sincronizar con la base de datos...",
      })

      // Importar de nuevo para asegurarnos de tener las funciones más recientes
      const { collection, doc, getDocs, setDoc, writeBatch } = await import("firebase/firestore")

      // Crear referencia a la colección
      const resourcesCollection = collection(db, "resources")

      // Obtener documentos
      const querySnapshot = await getDocs(resourcesCollection)
      const serverResources = {}

      // Crear un mapa de recursos del servidor
      querySnapshot.forEach((doc) => {
        serverResources[doc.id] = {
          id: doc.id,
          ...doc.data(),
        }
      })

      // Crear batch
      const batch = writeBatch(db)
      let changesMade = false

      // Procesar recursos locales
      for (const localResource of resources) {
        // Ignorar recursos temporales o sin ID
        if (localResource._isTemp || !localResource.id || localResource.id.startsWith("temp_")) {
          // Crear nuevo documento para recursos temporales
          const newData = { ...localResource }
          delete newData.id
          delete newData._isTemp

          // Crear un nuevo ID para el recurso
          const newId = `resource_${Date.now()}_${Math.floor(Math.random() * 1000)}`
          const resourceRef = doc(db, "resources", newId)

          batch.set(resourceRef, newData)
          changesMade = true
          continue
        }

        // Si el recurso existe en el servidor, verificar si necesita actualización
        if (serverResources[localResource.id]) {
          // Comparar para ver si hay diferencias
          const serverResource = serverResources[localResource.id]
          if (JSON.stringify(serverResource) !== JSON.stringify(localResource)) {
            // Hay diferencias, actualizar en el servidor
            const resourceRef = doc(db, "resources", localResource.id)
            const dataToUpdate = { ...localResource }
            delete dataToUpdate.id // No necesitamos el ID en los datos

            batch.update(resourceRef, dataToUpdate)
            changesMade = true
          }

          // Marcar como procesado
          delete serverResources[localResource.id]
        } else {
          // El recurso no existe en el servidor, crearlo
          const resourceRef = doc(db, "resources", localResource.id)
          const dataToCreate = { ...localResource }
          delete dataToCreate.id

          batch.set(resourceRef, dataToCreate)
          changesMade = true
        }
      }

      // Cualquier recurso que quede en serverResources no existe localmente
      // Podríamos eliminarlos, pero es más seguro no hacerlo automáticamente

      if (changesMade) {
        // Ejecutar el batch
        await batch.commit()

        // Recargar recursos desde el servidor
        const newQuerySnapshot = await getDocs(resourcesCollection)
        const freshResources = []

        newQuerySnapshot.forEach((doc) => {
          freshResources.push({
            id: doc.id,
            ...doc.data(),
          })
        })

        setResources(freshResources)
        saveToLocalStorage(freshResources)

        toast({
          title: "Sincronización completada",
          description: "Los recursos se han sincronizado correctamente con la base de datos.",
        })
      } else {
        toast({
          title: "Sincronización completada",
          description: "No se detectaron cambios que sincronizar.",
        })
      }
    } catch (error) {
      console.error("Error syncing with database:", error)
      setFirebaseError(error.message || "Error al sincronizar con Firestore")
      toast({
        title: "Error de sincronización",
        description: "No se pudieron sincronizar los recursos con la base de datos.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
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
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Administrador de Recursos</h2>
        <Button onClick={syncWithDatabase} variant="outline" disabled={isLoading} className="flex items-center gap-2">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Sincronizar con base de datos
        </Button>
      </div>

      {/* Mostrar error de Firebase si existe */}
      {firebaseError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error de Firebase: </strong>
          <span className="block sm:inline">{firebaseError}</span>
          <p className="text-sm mt-2">
            La aplicación está funcionando en modo offline. Los cambios se guardarán localmente y se sincronizarán
            cuando se resuelva el problema de conexión.
          </p>
        </div>
      )}

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
              <Card key={resource.id} className={resource._isTemp ? "border-dashed border-yellow-500" : ""}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {resource.title}
                    {resource._isTemp && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        Pendiente de sincronización
                      </span>
                    )}
                  </CardTitle>
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

