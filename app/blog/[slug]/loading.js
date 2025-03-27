import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="container mx-auto py-12 flex justify-center items-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2">Cargando artículo...</span>
    </div>
  )
}

