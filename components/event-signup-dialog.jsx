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
import { toast } from "@/components/ui/use-toast"; //

export function EventSignupDialog({
  eventId,
  eventTitle = "este evento", 
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
  
  const [fieldErrors, setFieldErrors] = useState({
    email: null,
    whatsapp: null
  });
  const [submitError, setSubmitError] = useState("");

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
    if (fieldErrors[name]) {
       setFieldErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    
    // Si hay errores de validación, disparamos un toast de error explícito
    if (fieldErrors.email || fieldErrors.whatsapp) {
        toast({
            variant: "destructive",
            title: "Error en los datos",
            description: "Por favor, revisá los campos marcados antes de enviar.",
        });
        return; 
    }

    setIsSubmitting(true);

    try {
      const [{ db }, { addDoc, collection, serverTimestamp, query, where, getDocs }] = await Promise.all([
        import("@/lib/firebase"),
        import("firebase/firestore"),
      ]);

      const signupsRef = collection(db, "eventSignups");
      
      const qEmail = query(
        signupsRef, 
        where("eventId", "==", eventId),
        where("email", "==", formData.email.trim())
      );
      const emailSnapshot = await getDocs(qEmail);

      if (!emailSnapshot.empty) {
        setFieldErrors(prev => ({...prev, email: "Este correo ya está registrado."}));
        toast({
          variant: "destructive",
          title: "Registro duplicado",
          description: "Este correo electrónico ya está inscrito en este evento.",
        });
        setIsSubmitting(false);
        return;
      }

      await addDoc(collection(db, "eventSignups"), {
        eventId,
        name: formData.name.trim(),
        email: formData.email.trim(),
        whatsapp: formData.whatsapp.trim(),
        createdAt: serverTimestamp(),
        notified1: false, 
        notified2: false, 
      });

      // Éxito: Disparar mensaje y cerrar diálogo
      toast({
        title: "¡Inscripción exitosa!",
        description: `Te has registrado correctamente en ${eventTitle}.`,
      });

      setIsDialogOpen(false);
      setFormData({ name: "", email: "", whatsapp: "" });

    } catch (err) {
      console.error("Error al registrar inscripción", err);
      const msg = "Hubo un problema al guardar tu inscripción. Intentá nuevamente.";
      setSubmitError(msg);
      toast({
        variant: "destructive",
        title: "Error de servidor",
        description: msg,
      });
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
                Usaremos estos datos para enviarte recordatorios y novedades del evento.
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
                onBlur={handleBlur}
                placeholder="tu@correo.com"
                required
                autoComplete="email"
                className={fieldErrors.email ? "border-destructive" : ""}
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
                onBlur={handleBlur}
                placeholder="54911XXXXXXXX"
                autoComplete="tel"
                className={fieldErrors.whatsapp ? "border-destructive" : ""}
              />
               {fieldErrors.whatsapp && (
                  <p className="text-sm text-destructive font-medium">{fieldErrors.whatsapp}</p>
              )}
            </div>

            {submitError && <p className="text-sm text-destructive font-medium">{submitError}</p>}

            <DialogFooter className="pt-2">
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Enviando..." : "Enviar inscripción"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
