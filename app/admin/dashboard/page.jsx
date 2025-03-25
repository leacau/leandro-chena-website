"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/toaster"
import AdminNavbar from "@/components/admin/navbar"
import BlogManager from "@/components/admin/blog-manager"
import EventsManager from "@/components/admin/events-manager"
import ResourcesManager from "@/components/admin/resources-manager"
import AppearanceManager from "@/components/admin/appearance-manager"

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Verificar autenticación
    const auth = localStorage.getItem("adminAuthenticated")
    if (auth !== "true") {
      router.push("/admin")
      return
    }
    setIsAuthenticated(true)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated")
    router.push("/admin")
  }

  if (!isAuthenticated) {
    return <div className="flex justify-center items-center min-h-screen">Verificando autenticación...</div>
  }

  return (
    <div className="min-h-screen bg-muted/10">
      <AdminNavbar onLogout={handleLogout} />

      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>

        <Tabs defaultValue="blog">
          <TabsList className="mb-6">
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="events">Eventos</TabsTrigger>
            <TabsTrigger value="resources">Recursos</TabsTrigger>
            <TabsTrigger value="appearance">Apariencia</TabsTrigger>
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

          <TabsContent value="appearance">
            <AppearanceManager />
          </TabsContent>
        </Tabs>
      </div>

      <Toaster />
    </div>
  )
}

