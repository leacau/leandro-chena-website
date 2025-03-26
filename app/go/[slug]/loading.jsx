import { RefreshCw } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <RefreshCw className="h-12 w-12 animate-spin text-primary mb-4" />
      <h1 className="text-2xl font-bold mb-2">Redirigiendo...</h1>
      <p className="text-muted-foreground">Serás redirigido en un momento</p>
    </div>
  )
}

