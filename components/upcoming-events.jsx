"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin } from "lucide-react";

export default function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const [{ db }, { collection, getDocs, query, limit }] = await Promise.all([
          import("@/lib/firebase"),
          import("firebase/firestore"),
        ]);

        // Traemos los eventos (limitado a 2 para no ocupar toda la pantalla)
        const q = query(collection(db, "events"), limit(2));
        const eventsSnapshot = await getDocs(q);
        
        const eventsList = eventsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setEvents(eventsList);
      } catch (error) {
        console.error("Error al cargar eventos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Si está cargando o no hay eventos, devolvemos null para que la sección desaparezca de la web
  if (isLoading || events.length === 0) {
    return null; 
  }

  return (
    <section className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Próximos Eventos</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Anotate en las próximas masterclasses y capacitaciones.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/eventos">Ver todos</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
        {events.map((event) => (
          <Card key={event.id} className="flex flex-col overflow-hidden border-primary/20 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-primary/5 pb-4">
              <CardTitle className="text-xl">{event.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 flex-1">
              <div className="space-y-3 text-sm text-muted-foreground mb-4">
                <div className="flex items-center"><Calendar className="mr-2 h-4 w-4 text-primary" /> {event.date}</div>
                <div className="flex items-center"><Clock className="mr-2 h-4 w-4 text-primary" /> {event.time}</div>
                <div className="flex items-center"><MapPin className="mr-2 h-4 w-4 text-primary" /> {event.location || "A confirmar"}</div>
              </div>
              <p className="line-clamp-2 text-sm">{event.description}</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button asChild className="w-full">
                <Link href={`/eventos/${event.id}`}>Ver detalles e Inscribirme</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
