import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="container mx-auto py-12 flex flex-col items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <h1 className="text-xl font-medium mb-2">Preparando archivo...</h1>
      <p className="text-muted-foreground">Tu descarga comenzará en un momento</p>
    </div>
  )
}

