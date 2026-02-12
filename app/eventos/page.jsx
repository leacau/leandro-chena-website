"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin } from "lucide-react"
import { EventSignupDialog } from "@/components/event-signup-dialog"
import { db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"
import { Loader2 } from "lucide-react"

export default function EventosPage() {
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true)
        const querySnapshot = await getDocs(collection(db, "events"))
        const loadedEvents = []

        querySnapshot.forEach((doc) => {
          loadedEvents.push({
            id: doc.id,
            ...doc.data(),
          })
        })

        setEvents(loadedEvents)
      } catch (error) {
        console.error("Error loading events:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadEvents()
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Cargando eventos...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">Próximos Eventos</h1>

      {events.length === 0 ? (
        <p className="text-muted-foreground">No hay eventos programados actualmente.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <div className="h-48 relative">
                <Image
                  src={event.image || "/placeholder.svg?height=200&width=400"}
                  alt={event.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = "/placeholder.svg?height=200&width=400"
                  }}
                />
              </div>
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>{event.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-2">
                <Button asChild className="w-full sm:w-auto">
                  <Link href={`/eventos/${event.id}`}>Ver detalles</Link>
                </Button>
              //  <EventSignupDialog
              //    eventId={event.id}
               //   triggerVariant="outline"
               //   triggerSize="default"
              //    triggerClassName="w-full sm:w-auto"
            //    />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
