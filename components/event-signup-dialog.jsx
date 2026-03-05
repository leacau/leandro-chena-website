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
import { toast } from "@/hooks/use-toast";

export function EventSignupDialog({
  eventId,
  eventTitle = "este evento",
  triggerLabel = "Inscribirme",
  triggerClassName = "",
  triggerVariant = "default",
  triggerSize = "lg",
  fullWidth = false,
  isLive = false, // NUEVO PROP: ¿Está en vivo?
  meetLink = "",  // NUEVO PROP: Link de la clase
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
    // Si el evento está en vivo, no hacemos validación de duplicados al salir del campo
    // porque queremos que los usuarios registrados puedan usar su correo para entrar.
    if (!value || value.trim() === "" || isLive) return;

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
          [field]: `Este ${field === 'email' ? 'correo' : 'número'} ya está registrado.`
        }));
      } else {
        setFieldErrors(prev => ({ ...prev, [field]: null }));
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
    
    // Si hay errores previos, avisamos con un cartel
    if (fieldErrors.email || fieldErrors.whatsapp) {
        toast({
            variant: "destructive",
            title: "Revisá los datos",
            description: "El correo o teléfono ya están registrados para este evento.",
        });
        return; 
    }

    setIsSubmitting(true);

    try {
      const [{ db }, { addDoc, collection, serverTimestamp, query, where, getDocs, doc, updateDoc }] = await Promise.all([
        import("@/lib/firebase"),
        import("firebase/firestore"),
      ]);

      // Verificación final de duplicados
      const signupsRef = collection(db, "eventSignups");
      const qEmail = query(signupsRef, where("eventId", "==", eventId), where("email", "==", formData.email.trim()));
      const emailSnapshot = await getDocs(qEmail);

      let existingDocId = null;

      if (!emailSnapshot.empty) {
        if (!isLive) {
          // Inscripción normal, rechazar duplicados
          toast({
            variant: "destructive",
            title: "Ya estás registrado",
            description: "Este correo ya se encuentra en la lista de este evento.",
          });
          setIsSubmitting(false);
          return;
        } else {
          // Evento en vivo, está intentando ingresar: obtenemos el id para actualizarlo
          existingDocId = emailSnapshot.docs[0].id;
        }
      }

      if (isLive && existingDocId) {
        // Si el usuario ya existía y está entrando en vivo, actualizamos su registro
        await updateDoc(doc(db, "eventSignups", existingDocId), {
            enteredLive: true
        });
      } else {
        // Inscripción normal O usuario nuevo entrando por primera vez al en vivo
        await addDoc(collection(db, "eventSignups"), {
            eventId,
            name: formData.name.trim(),
            email: formData.email.trim(),
            whatsapp: formData.whatsapp.trim(),
            createdAt: serverTimestamp(),
            notified1: false, 
            notified2: false, 
            enteredLive: isLive, // Lo marca automáticamente si se registra durante el vivo
        });
      }

      // ACCIONES POST GUARDADO SEGÚN MODO
      if (isLive && meetLink) {
         window.open(meetLink, "_blank");
         toast({
           title: "Ingresando...",
           description: "Abriendo la sala en una nueva pestaña.",
         });
      } else {
         toast({
           title: "¡Inscripción exitosa!",
           description: `Te registraste correctamente en ${eventTitle}.`,
         });
      }

      setIsDialogOpen(false);
      setFormData({ name: "", email: "", whatsapp: "" });

    } catch (err) {
      console.error("Error:", err);
      toast({
        variant: "destructive",
        title: "Error de registro",
        description: "No pudimos completar la operación. Intentá de nuevo más tarde.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Textos dinámicos dependiendo de si está en vivo o no
  const actualTriggerLabel = isLive ? "Ingresar" : triggerLabel;
  const dialogTitle = isLive ? "Ingresar a la clase" : "Inscribirme al evento";
  const dialogDesc = isLive 
      ? "Completá tus datos para ingresar directamente a la sala." 
      : "Completá tus datos para recibir el acceso y recordatorios.";
  const submitLabel = isSubmitting 
      ? "Procesando..." 
      : (isLive ? "Ingresar ahora" : "Enviar inscripción");

  return (
    <>
      <Button
        type="button"
        variant={triggerVariant}
        size={triggerSize}
        className={fullWidth ? `w-full ${triggerClassName}` : triggerClassName}
        onClick={() => setIsDialogOpen(true)}
      >
        {actualTriggerLabel}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{dialogTitle}</DialogTitle>
              <DialogDescription>
                {dialogDesc}
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
                className={fieldErrors.email ? "border-destructive" : ""}
              />
              {fieldErrors.email && <p className="text-sm text-destructive">{fieldErrors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp (opcional)</Label>
              <Input
                id="whatsapp"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder="54911XXXXXXXX"
                className={fieldErrors.whatsapp ? "border-destructive" : ""}
              />
               {fieldErrors.whatsapp && <p className="text-sm text-destructive">{fieldErrors.whatsapp}</p>}
            </div>

            <DialogFooter className="pt-2">
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {submitLabel}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
