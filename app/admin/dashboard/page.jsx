"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/toaster"
import { toast } from "@/components/ui/use-toast"
import AdminNavbar from "@/components/admin/navbar"
import BlogManager from "@/components/admin/blog-manager"
import EventsManager from "@/components/admin/events-manager"
import ResourcesManager from "@/components/admin/resources-manager"
import UrlShortener from "@/components/admin/url-shortener"
import FileManager from "@/components/admin/file-manager"
import FirebaseStatus from "@/components/admin/firebase-status"
import { useAuth } from "@/lib/auth-context"
import { logoutUser } from "@/lib/firebase"

export default function AdminDashboardPage() {
  const router = useRouter()
  const { user, userRole, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/admin")
      } else if (userRole !== "admin") {
        toast({
          title: "Acceso denegado",
          description: "No tienes permisos para acceder al panel de administración.",
          variant: "destructive",
        })
        router.push("/")
      }
    }
  }, [user, userRole, loading, router])

  const handleLogout = async () => {
    try {
      const result = await logoutUser()
      if (result.success) {
        router.push("/admin")
      } else {
        toast({
          title: "Error",
          description: "No se pudo cerrar sesión. Intente nuevamente.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al cerrar sesión. Intente nuevamente.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/40">
        <p>Cargando...</p>
      </div>
    )
  }

  if (!user || userRole !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-muted/10">
      <AdminNavbar onLogout={handleLogout} />

      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>

        <FirebaseStatus />

        <Tabs defaultValue="blog">
          <TabsList className="mb-6">
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="events">Eventos</TabsTrigger>
            <TabsTrigger value="resources">Recursos</TabsTrigger>
            <TabsTrigger value="urls">Acortador URL</TabsTrigger>
            <TabsTrigger value="manager">File Manager</TabsTrigger>
          </TabsList>

          <TabsContent value="blog">
            <BlogManager />
          </TabsContent>

          <TabsContent value="events">
            <EventsManager />
          </TabsContent>

          <TabsContent value="resources">
            <ResourcesManager />
          </TabsContent>

          <TabsContent value="urls">
            <UrlShortener />
          </TabsContent>

          <TabsContent value="manager">
            <FileManager />
          </TabsContent>
        </Tabs>
      </div>

      <Toaster />
    </div>
  )
}

