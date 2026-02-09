"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

export function EventSignupDialog({
  eventId,
  eventTitle = "este evento", // Valor por defecto si no se pasa
  triggerLabel = "Inscribirme",
  triggerClassName = "",
  triggerVariant = "default",
  triggerSize = "lg",
  fullWidth = false,
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
  });
  
  // Estado para errores específicos de cada campo
  const [fieldErrors, setFieldErrors] = useState({
    email: null,
    whatsapp: null
  });
  const [submitError, setSubmitError] = useState("");

  // Función para validar disponibilidad en Firestore al perder el foco (Blur)
  const validateFieldAvailability = async (field, value) => {
    if (!value || value.trim() === "") return;

    try {
      const [{ db }, { collection, query, where, getDocs }] = await Promise.all([
        import("@/lib/firebase"),
        import("firebase/firestore"),
      ]);

      const signupsRef = collection(db, "eventSignups");
      const q = query(
        signupsRef,
        where("eventId", "==", eventId),
        where(field, "==", value.trim())
      );
      
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        setFieldErrors(prev => ({
          ...prev,
          [field]: `Este ${field === 'email' ? 'correo' : 'número'} ya está registrado para este evento.`
        }));
      } else {
         // Si no existe, limpiamos el error de ese campo
        setFieldErrors(prev => ({
          ...prev,
          [field]: null
        }));
      }
    } catch (err) {
      console.error(`Error validando ${field}:`, err);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === "email" || name === "whatsapp") {
      validateFieldAvailability(name, value);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Opcional: Limpiar error al modificar (para que el usuario pueda corregir)
    // O dejarlo hasta el próximo blur. Aquí lo limpiamos para mejor UX.
    if (fieldErrors[name]) {
       setFieldErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    
    // Bloquear si hay errores de validación pendientes visible
    if (fieldErrors.email || fieldErrors.whatsapp) {
        return; 
    }

    setIsSubmitting(true);

    try {
      const [{ db }, { addDoc, collection, serverTimestamp, query, where, getDocs }] = await Promise.all([
        import("@/lib/firebase"),
        import("firebase/firestore"),
      ]);

      // 1. Re-validación final de seguridad antes de guardar
      const signupsRef = collection(db, "eventSignups");
      
      // Chequear Email
      const qEmail = query(
        signupsRef, 
        where("eventId", "==", eventId),
        where("email", "==", formData.email.trim())
      );
      const emailSnapshot = await getDocs(qEmail);

      if (!emailSnapshot.empty) {
        setFieldErrors(prev => ({...prev, email: "Este correo ya está registrado."}));
        setIsSubmitting(false);
        return;
      }

      // Chequear WhatsApp (si existe)
      if (formData.whatsapp.trim()) {
        const qWhatsapp = query(
          signupsRef,
          where("eventId", "==", eventId),
          where("whatsapp", "==", formData.whatsapp.trim())
        );
        const whatsappSnapshot = await getDocs(qWhatsapp);

        if (!whatsappSnapshot.empty) {
          setFieldErrors(prev => ({...prev, whatsapp: "Este número ya está registrado."}));
          setIsSubmitting(false);
          return;
        }
      }

      // 2. Guardar inscripción
      await addDoc(collection(db, "eventSignups"), {
        eventId,
        name: formData.name.trim(),
        email: formData.email.trim(),
        whatsapp: formData.whatsapp.trim(),
        createdAt: serverTimestamp(),
        // Inicializamos las notificaciones básicas, aunque ahora sean dinámicas en admin
        notified1: false, 
        notified2: false, 
      });

      setIsDialogOpen(false);
      setFormData({ name: "", email: "", whatsapp: "" });
      
      // Mostrar mensaje de éxito personalizado
      toast({
        title: "¡Inscripción exitosa!",
        description: `Te has registrado con éxito en ${eventTitle}.`,
        duration: 5000,
      });

    } catch (err) {
      console.error("Error al registrar inscripción", err);
      setSubmitError("Ocurrió un problema al guardar tu inscripción. Intentá nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant={triggerVariant}
        size={triggerSize}
        className={fullWidth ? `w-full ${triggerClassName}` : triggerClassName}
        onClick={() => setIsDialogOpen(true)}
      >
        {triggerLabel}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Inscribirme al evento</DialogTitle>
              <DialogDescription>
                Usaremos estos datos para enviarte recordatorios de próximas fechas y novedades del evento.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ej: Juan Pérez"
                required
                autoComplete="name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur} // Validación al salir del campo
                placeholder="tu@correo.com"
                required
                autoComplete="email"
                className={fieldErrors.email ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {fieldErrors.email && (
                  <p className="text-sm text-destructive font-medium">{fieldErrors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp (opcional)</Label>
              <Input
                id="whatsapp"
                name="whatsapp"
                inputMode="tel"
                value={formData.whatsapp}
                onChange={handleInputChange}
                onBlur={handleBlur} // Validación al salir del campo
                placeholder="54911XXXXXXXX"
                autoComplete="tel"
                className={fieldErrors.whatsapp ? "border-destructive focus-visible:ring-destructive" : ""}
              />
               {fieldErrors.whatsapp && (
                  <p className="text-sm text-destructive font-medium">{fieldErrors.whatsapp}</p>
              )}
            </div>

            {submitError && <p className="text-sm text-destructive font-medium">{submitError}</p>}

            <DialogFooter className="pt-2">
              <Button type="submit" disabled={isSubmitting || fieldErrors.email || fieldErrors.whatsapp} className="w-full">
                {isSubmitting ? "Enviando..." : "Enviar inscripción"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
