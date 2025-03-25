"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Paintbrush, ImageIcon, FileImage, Type, Upload, Loader2 } from "lucide-react"
import { db, storage } from "@/lib/firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

export default function AppearanceManager() {
  const [siteConfig, setSiteConfig] = useState({
    logo: {
      url: "",
      alt: "Leandro Chena",
    },
    heroImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lea%20%282%29-ohqyC38OWMWc1aOOP7EHh8tm1PIUdd.png",
    colors: {
      primary: "#3b82f6", // Default blue
      secondary: "#f3f4f6",
      accent: "#f3f4f6",
      text: "#111827",
      background: "#ffffff",
    },
    content: {
      hero: {
        title: "Potenciá tus ventas y liderá con propósito",
        subtitle:
          "Soy Leandro Chena, consultor comercial y capacitador especializado en transformar equipos de ventas y desarrollar líderes que inspiran resultados extraordinarios.",
      },
      about: {
        title: "Sobre Mí",
        content:
          "Con más de 15 años de experiencia en el mundo comercial, he ayudado a equipos a transformar su enfoque de ventas y liderazgo, logrando resultados extraordinarios.\n\nMi metodología combina estrategias probadas con un enfoque humano y sensible, adaptado a las necesidades específicas de cada organización y equipo.",
      },
      services: {
        title: "Servicios",
        subtitle: "Soluciones personalizadas para potenciar tu negocio y equipo comercial",
      },
      cta: {
        title: "¿Listo para transformar tu enfoque comercial?",
        subtitle:
          "Descubrí cómo mis servicios de consultoría y capacitación pueden ayudarte a potenciar tus ventas y desarrollar líderes inspiradores.",
      },
    },
  })

  const [isLoading, setIsLoading] = useState(false)
  const logoFileRef = useRef(null)
  const heroFileRef = useRef(null)

  useEffect(() => {
    // Cargar configuración de Firestore
    const loadConfig = async () => {
      try {
        setIsLoading(true)
        const docRef = doc(db, "config", "siteConfig")
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const data = docSnap.data()

          // Asegurarse de que todas las propiedades existan
          const mergedConfig = {
            ...siteConfig,
            ...data,
            colors: { ...siteConfig.colors, ...(data.colors || {}) },
            content: {
              ...siteConfig.content,
              ...(data.content || {}),
              hero: { ...siteConfig.content.hero, ...(data.content?.hero || {}) },
              about: { ...siteConfig.content.about, ...(data.content?.about || {}) },
              services: { ...siteConfig.content.services, ...(data.content?.services || {}) },
              cta: { ...siteConfig.content.cta, ...(data.content?.cta || {}) },
            },
          }

          setSiteConfig(mergedConfig)

          // Aplicar los colores inmediatamente
          applyColors(mergedConfig.colors)
        } else {
          // Si no existe, crear el documento con los valores por defecto
          await setDoc(doc(db, "config", "siteConfig"), siteConfig)
        }
      } catch (error) {
        console.error("Error loading site config:", error)
        toast({
          title: "Error",
          description: "No se pudo cargar la configuración del sitio.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadConfig()
  }, [])

  const handleInputChange = (section, field, value) => {
    setSiteConfig((prev) => {
      if (section === "colors") {
        return { ...prev, colors: { ...prev.colors, [field]: value } }
      } else if (section === "content") {
        const [subsection, subfield] = field.split(".")
        return {
          ...prev,
          content: {
            ...prev.content,
            [subsection]: {
              ...prev.content[subsection],
              [subfield]: value,
            },
          },
        }
      } else if (field) {
        return { ...prev, [section]: { ...prev[section], [field]: value } }
      } else {
        return { ...prev, [section]: value }
      }
    })
  }

  const handleFileUpload = async (event, type) => {
    const file = event.target.files[0]
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
      const storageRef = ref(storage, `images/${type}/${file.name}`)
      await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(storageRef)

      if (type === "logo") {
        setSiteConfig((prev) => ({
          ...prev,
          logo: { ...prev.logo, url: downloadURL },
        }))
      } else if (type === "hero") {
        setSiteConfig((prev) => ({
          ...prev,
          heroImage: downloadURL,
        }))
      }

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

  const applyColors = (colors) => {
    document.documentElement.style.setProperty("--primary-color", colors.primary)
    document.documentElement.style.setProperty("--secondary-color", colors.secondary)
    document.documentElement.style.setProperty("--text-color", colors.text)
    document.documentElement.style.setProperty("--background-color", colors.background)
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)

      // Guardar en Firestore
      await setDoc(doc(db, "config", "siteConfig"), siteConfig)

      // Aplicar los colores inmediatamente
      applyColors(siteConfig.colors)

      // Guardar también en localStorage para acceso rápido
      localStorage.setItem("siteConfig", JSON.stringify(siteConfig))

      // Disparar un evento para que otros componentes sepan que la configuración ha cambiado
      window.dispatchEvent(new Event("siteConfigUpdated"))

      toast({
        title: "Configuración guardada",
        description: "Los cambios han sido aplicados correctamente.",
      })
    } catch (error) {
      console.error("Error saving site config:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = async () => {
    const defaultConfig = {
      logo: {
        url: "",
        alt: "Leandro Chena",
      },
      heroImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lea%20%282%29-ohqyC38OWMWc1aOOP7EHh8tm1PIUdd.png",
      colors: {
        primary: "#3b82f6", // Default blue
        secondary: "#f3f4f6",
        accent: "#f3f4f6",
        text: "#111827",
        background: "#ffffff",
      },
      content: {
        hero: {
          title: "Potenciá tus ventas y liderá con propósito",
          subtitle:
            "Soy Leandro Chena, consultor comercial y capacitador especializado en transformar equipos de ventas y desarrollar líderes que inspiran resultados extraordinarios.",
        },
        about: {
          title: "Sobre Mí",
          content:
            "Con más de 15 años de experiencia en el mundo comercial, he ayudado a equipos a transformar su enfoque de ventas y liderazgo, logrando resultados extraordinarios.\n\nMi metodología combina estrategias probadas con un enfoque humano y sensible, adaptado a las necesidades específicas de cada organización y equipo.",
        },
        services: {
          title: "Servicios",
          subtitle: "Soluciones personalizadas para potenciar tu negocio y equipo comercial",
        },
        cta: {
          title: "¿Listo para transformar tu enfoque comercial?",
          subtitle:
            "Descubrí cómo mis servicios de consultoría y capacitación pueden ayudarte a potenciar tus ventas y desarrollar líderes inspiradores.",
        },
      },
    }

    try {
      setIsLoading(true)

      // Actualizar estado
      setSiteConfig(defaultConfig)

      // Guardar en Firestore
      await setDoc(doc(db, "config", "siteConfig"), defaultConfig)

      // Guardar en localStorage
      localStorage.setItem("siteConfig", JSON.stringify(defaultConfig))

      // Restablecer los colores
      applyColors(defaultConfig.colors)

      // Disparar evento
      window.dispatchEvent(new Event("siteConfigUpdated"))

      toast({
        title: "Configuración restablecida",
        description: "Se han restaurado los valores predeterminados.",
      })
    } catch (error) {
      console.error("Error resetting site config:", error)
      toast({
        title: "Error",
        description: "No se pudo restablecer la configuración.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && !siteConfig) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Cargando configuración...</span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue="general">
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="colors">Colores</TabsTrigger>
          <TabsTrigger value="content">Contenido</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileImage className="h-5 w-5" />
                Logo del sitio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Subir logo</Label>
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => logoFileRef.current.click()}
                      className="flex items-center gap-2"
                      disabled={isLoading}
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      Seleccionar archivo
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {siteConfig.logo.url ? "Imagen seleccionada" : "Ningún archivo seleccionado"}
                    </span>
                    <input
                      type="file"
                      ref={logoFileRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "logo")}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Formatos aceptados: JPG, PNG, SVG. Tamaño máximo: 2MB.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logoAlt">Texto alternativo</Label>
                  <Input
                    id="logoAlt"
                    value={siteConfig.logo.alt}
                    onChange={(e) => handleInputChange("logo", "alt", e.target.value)}
                  />
                </div>

                {siteConfig.logo.url && (
                  <div className="mt-4 p-4 border rounded-md">
                    <p className="text-sm font-medium mb-2">Vista previa:</p>
                    <div className="h-16 flex items-center">
                      <img
                        src={siteConfig.logo.url || "/placeholder.svg"}
                        alt={siteConfig.logo.alt}
                        className="max-h-full"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = "/placeholder.svg?height=50&width=150"
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Imagen del héroe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Subir imagen</Label>
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => heroFileRef.current.click()}
                      className="flex items-center gap-2"
                      disabled={isLoading}
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      Seleccionar archivo
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {siteConfig.heroImage ? "Imagen seleccionada" : "Ningún archivo seleccionado"}
                    </span>
                    <input
                      type="file"
                      ref={heroFileRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "hero")}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Formatos aceptados: JPG, PNG. Tamaño máximo: 2MB. Recomendado: imagen cuadrada.
                  </p>
                </div>

                <div className="mt-4 p-4 border rounded-md">
                  <p className="text-sm font-medium mb-2">Vista previa:</p>
                  <div className="h-40 flex items-center justify-center">
                    <img
                      src={siteConfig.heroImage || "/placeholder.svg"}
                      alt="Imagen del héroe"
                      className="max-h-full rounded-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = "/placeholder.svg?height=150&width=150"
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="colors">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Paintbrush className="h-5 w-5" />
                Personalización de colores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor" className="flex items-center justify-between">
                      Color primario
                      <span
                        className="inline-block w-5 h-5 rounded-full border"
                        style={{ backgroundColor: siteConfig.colors.primary }}
                      ></span>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={siteConfig.colors.primary}
                        onChange={(e) => handleInputChange("colors", "primary", e.target.value)}
                        className="w-12 p-1 h-10"
                      />
                      <Input
                        value={siteConfig.colors.primary}
                        onChange={(e) => handleInputChange("colors", "primary", e.target.value)}
                        className="flex-1"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Usado en botones principales, enlaces y elementos destacados
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor" className="flex items-center justify-between">
                      Color secundario
                      <span
                        className="inline-block w-5 h-5 rounded-full border"
                        style={{ backgroundColor: siteConfig.colors.secondary }}
                      ></span>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={siteConfig.colors.secondary}
                        onChange={(e) => handleInputChange("colors", "secondary", e.target.value)}
                        className="w-12 p-1 h-10"
                      />
                      <Input
                        value={siteConfig.colors.secondary}
                        onChange={(e) => handleInputChange("colors", "secondary", e.target.value)}
                        className="flex-1"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Usado en botones secundarios y elementos de fondo alternativo
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="textColor" className="flex items-center justify-between">
                      Color de texto
                      <span
                        className="inline-block w-5 h-5 rounded-full border"
                        style={{ backgroundColor: siteConfig.colors.text }}
                      ></span>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="textColor"
                        type="color"
                        value={siteConfig.colors.text}
                        onChange={(e) => handleInputChange("colors", "text", e.target.value)}
                        className="w-12 p-1 h-10"
                      />
                      <Input
                        value={siteConfig.colors.text}
                        onChange={(e) => handleInputChange("colors", "text", e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="backgroundColor" className="flex items-center justify-between">
                      Color de fondo
                      <span
                        className="inline-block w-5 h-5 rounded-full border"
                        style={{ backgroundColor: siteConfig.colors.background }}
                      ></span>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="backgroundColor"
                        type="color"
                        value={siteConfig.colors.background}
                        onChange={(e) => handleInputChange("colors", "background", e.target.value)}
                        className="w-12 p-1 h-10"
                      />
                      <Input
                        value={siteConfig.colors.background}
                        onChange={(e) => handleInputChange("colors", "background", e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="mt-8 p-6 rounded-lg"
                style={{
                  backgroundColor: siteConfig.colors.background,
                  border: "1px solid #e5e7eb",
                }}
              >
                <h3 className="text-lg font-medium mb-4" style={{ color: siteConfig.colors.text }}>
                  Vista previa
                </h3>
                <div
                  className="p-4 rounded-lg border"
                  style={{
                    backgroundColor: siteConfig.colors.background,
                    color: siteConfig.colors.text,
                    borderColor: "#e5e7eb",
                  }}
                >
                  <h4 className="text-xl font-bold mb-2" style={{ color: siteConfig.colors.text }}>
                    Título de ejemplo
                  </h4>
                  <p className="mb-4" style={{ color: siteConfig.colors.text }}>
                    Este es un texto de ejemplo para visualizar cómo se verán los colores en tu sitio web.
                  </p>
                  <div className="flex gap-3">
                    <button
                      className="px-4 py-2 rounded-md text-white"
                      style={{ backgroundColor: siteConfig.colors.primary }}
                    >
                      Botón primario
                    </button>
                    <button
                      className="px-4 py-2 rounded-md border"
                      style={{
                        backgroundColor: siteConfig.colors.secondary,
                        color: siteConfig.colors.text,
                        borderColor: "#e5e7eb",
                      }}
                    >
                      Botón secundario
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                Sección Hero (Inicio)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="heroTitle">Título principal</Label>
                  <Input
                    id="heroTitle"
                    value={siteConfig.content.hero.title}
                    onChange={(e) => handleInputChange("content", "hero.title", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="heroSubtitle">Subtítulo</Label>
                  <Textarea
                    id="heroSubtitle"
                    value={siteConfig.content.hero.subtitle}
                    onChange={(e) => handleInputChange("content", "hero.subtitle", e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                Sección Sobre Mí
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="aboutTitle">Título</Label>
                  <Input
                    id="aboutTitle"
                    value={siteConfig.content.about.title}
                    onChange={(e) => handleInputChange("content", "about.title", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aboutContent">Contenido</Label>
                  <Textarea
                    id="aboutContent"
                    value={siteConfig.content.about.content}
                    onChange={(e) => handleInputChange("content", "about.content", e.target.value)}
                    rows={6}
                  />
                  <p className="text-xs text-muted-foreground">
                    Usa doble salto de línea para crear párrafos separados.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                Sección Servicios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="servicesTitle">Título</Label>
                  <Input
                    id="servicesTitle"
                    value={siteConfig.content.services.title}
                    onChange={(e) => handleInputChange("content", "services.title", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="servicesSubtitle">Subtítulo</Label>
                  <Input
                    id="servicesSubtitle"
                    value={siteConfig.content.services.subtitle}
                    onChange={(e) => handleInputChange("content", "services.subtitle", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                Sección Call to Action
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ctaTitle">Título</Label>
                  <Input
                    id="ctaTitle"
                    value={siteConfig.content.cta.title}
                    onChange={(e) => handleInputChange("content", "cta.title", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ctaSubtitle">Subtítulo</Label>
                  <Textarea
                    id="ctaSubtitle"
                    value={siteConfig.content.cta.subtitle}
                    onChange={(e) => handleInputChange("content", "cta.subtitle", e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={handleReset} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Restablecer valores predeterminados
        </Button>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Guardar cambios
        </Button>
      </div>
    </div>
  )
}

