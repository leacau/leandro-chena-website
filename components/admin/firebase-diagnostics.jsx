"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { app, db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"

export default function FirebaseDiagnostics() {
  const [status, setStatus] = useState("loading") // loading, success, error
  const [message, setMessage] = useState("Verificando conexión a Firebase...")
  const [envVars, setEnvVars] = useState({})
  const [testResult, setTestResult] = useState(null)

  useEffect(() => {
    // Verificar variables de entorno
    const vars = {
      apiKey: process.env.NEXT_PUBLIC_APIKEY || "",
      authDomain: process.env.NEXT_PUBLIC_AUTHDOMAIN || "",
      projectId: process.env.NEXT_PUBLIC_PROJECTID || "",
      storageBucket: process.env.NEXT_PUBLIC_STORAGEBUCKET || "",
      messagingSenderId: process.env.NEXT_PUBLIC_MESSAGINGSENDERID || "",
      appId: process.env.NEXT_PUBLIC_APPID || "",
      measurementId: process.env.NEXT_PUBLIC_MEASUREMENTID || "",
    }

    setEnvVars(vars)

    const missingVars = Object.entries(vars)
      .filter(([_, value]) => !value)
      .map(([key]) => key)

    if (missingVars.length > 0) {
      setStatus("warning")
      setMessage(`Faltan algunas variables de entorno: ${missingVars.join(", ")}`)
    } else {
      setStatus("success")
      setMessage("Variables de entorno configuradas correctamente")
    }
  }, [])

  const runConnectionTest = async () => {
    setTestResult({
      status: "loading",
      message: "Probando inicialización de Firebase...",
    })

    try {
      if (!app || !db) {
        throw new Error("Firebase no está inicializado")
      }

      try {
        await getDoc(doc(db, "config", "siteConfig"))
        setTestResult({
          status: "success",
          message: "Firebase está inicializado y Firestore respondió correctamente.",
        })
      } catch (error) {
        if (error.code === "permission-denied") {
          setTestResult({
            status: "warning",
            message:
              "Firebase está inicializado, pero las reglas actuales no permiten leer el documento de prueba.",
          })
          return
        }

        throw error
      }
    } catch (error) {
      console.error("Error en prueba de conexión:", error)
      setTestResult({
        status: "error",
        message: `Error de conexión: ${error.message}`,
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {status === "loading" && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
          {status === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
          {status === "warning" && <AlertCircle className="h-5 w-5 text-yellow-500" />}
          {status === "error" && <AlertCircle className="h-5 w-5 text-red-500" />}
          Diagnóstico de Firebase
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Estado de las variables de entorno:</h3>
          <div className="text-sm text-muted-foreground">{message}</div>

          <div className="mt-4 space-y-2">
            {Object.entries(envVars).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="font-mono text-xs">{key}:</span>
                {value ? (
                  <span className="text-xs text-green-500 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Configurada
                  </span>
                ) : (
                  <span className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    No configurada
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <Button onClick={runConnectionTest} variant="outline" size="sm">
            Probar conexión a Firestore
          </Button>

          {testResult && (
            <div className="mt-2">
              {testResult.status === "loading" && (
                <div className="flex items-center gap-2 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {testResult.message}
                </div>
              )}

              {testResult.status === "success" && (
                <div className="flex items-center gap-2 text-sm text-green-500">
                  <CheckCircle className="h-4 w-4" />
                  {testResult.message}
                </div>
              )}

              {testResult.status === "error" && (
                <div className="flex items-center gap-2 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  {testResult.message}
                </div>
              )}

              {testResult.status === "warning" && (
                <div className="flex items-center gap-2 text-sm text-yellow-600">
                  <AlertCircle className="h-4 w-4" />
                  {testResult.message}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
