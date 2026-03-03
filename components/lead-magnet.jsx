"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { DownloadCloud } from "lucide-react";

export default function LeadMagnet() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Importación dinámica de Firebase para no afectar la carga inicial de la web
      const [{ db }, { collection, addDoc, serverTimestamp }] = await Promise.all([
        import("@/lib/firebase"),
        import("firebase/firestore"),
      ]);

      // Guardamos el contacto en una colección llamada "leads"
      await addDoc(collection(db, "leads"), {
        name: name.trim(),
        email: email.trim(),
        source: "Home - Lead Magnet",
        createdAt: serverTimestamp(),
      });

      // Mostramos el cartel de éxito que arreglamos antes
      toast({
        title: "¡Material enviado!",
        description: "Revisá tu bandeja de entrada para acceder a la guía.",
      });

      // Limpiamos el formulario
      setName("");
      setEmail("");
    } catch (error) {
      console.error("Error al guardar el lead:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Hubo un problema al procesar tu solicitud. Intentá nuevamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-primary/5 py-16 border-y border-primary/10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/2">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-xl mb-6">
            <DownloadCloud className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Llevá tu proceso de ventas al siguiente nivel
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            Descargá gratis mi guía táctica con los pasos exactos para influir, persuadir y cerrar acuerdos sin presionar a tu cliente. Ideal para líderes comerciales y equipos de venta.
          </p>
        </div>
        
        <div className="lg:w-1/2 w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg border">
          <h3 className="text-xl font-semibold mb-6">Accedé al material gratuito</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input 
                placeholder="Tu nombre" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
            <div>
              <Input 
                type="email" 
                placeholder="tu@correo.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Descargar Guía Ahora"}
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-4">
              Tus datos están seguros. No enviamos spam.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
