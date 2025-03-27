"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { loginUser, registerUser } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, userRole, loading } = useAuth()

  // Verificar si hay un mensaje de error en los parámetros de la URL
  const error = searchParams.get("error")

  useEffect(() => {
    if (!loading && user) {
      if (userRole === "admin") {
        router.push("/admin/dashboard")
      } else {
        toast({
          title: "Acceso denegado",
          description: "No tienes permisos para acceder al panel de administración.",
          variant: "destructive",
        })
      }
    }
  }, [user, userRole, loading, router])

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await loginUser(email, password)

      if (result.success) {
        // El redireccionamiento se manejará en el useEffect
      } else {
        toast({
          title: "Error de autenticación",
          description: "Credenciales incorrectas. Intente nuevamente.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al iniciar sesión. Intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const result = await registerUser(email, password)

      if (result.success) {
        toast({
          title: "Registro exitoso",
          description: "Se ha registrado correctamente. Ahora puede iniciar sesión.",
        })
        // Cambiar a la pestaña de inicio de sesión
        document.getElementById("login-tab").click()
      } else {
        toast({
          title: "Error de registro",
          description: result.error || "No se pudo completar el registro. Intente nuevamente.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al registrar:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al registrar. Intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/40">
        <p>Cargando...</p>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Panel de Administración</CardTitle>
          <CardDescription className="text-center">
            Ingrese sus credenciales para acceder al panel de administración
          </CardDescription>
        </CardHeader>

        {error === "access_denied" && (
          <div className="px-6 pb-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Acceso denegado</AlertTitle>
              <AlertDescription>No tienes permisos para acceder al panel de administración.</AlertDescription>
            </Alert>
          </div>
        )}

        {user && userRole !== "admin" && (
          <div className="px-6 pb-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Acceso denegado</AlertTitle>
              <AlertDescription>
                Tu cuenta no tiene permisos de administrador. Contacta al administrador del sistema.
              </AlertDescription>
            </Alert>
          </div>
        )}

        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" id="login-tab">
              Iniciar Sesión
            </TabsTrigger>
            <TabsTrigger value="register">Registrarse</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <CardContent className="pt-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
                </Button>
              </form>
            </CardContent>
          </TabsContent>

          <TabsContent value="register">
            <CardContent className="pt-4">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Contraseña</Label>
                  <Input
                    id="register-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Registrando..." : "Registrarse"}
                </Button>
              </form>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
      <Toaster />
    </div>
  )
}

