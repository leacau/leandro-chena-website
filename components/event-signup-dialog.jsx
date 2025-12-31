"use client";

import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function EventSignupDialog({
	eventId,
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
	const [submitError, setSubmitError] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		setSubmitError("");
		try {
			const [{ db }, { addDoc, collection, serverTimestamp }] = await Promise.all([
				import("@/lib/firebase"),
				import("firebase/firestore"),
			]);

			await addDoc(collection(db, "eventSignups"), {
				eventId,
				name: formData.name.trim(),
				email: formData.email.trim(),
				whatsapp: formData.whatsapp.trim(),
				createdAt: serverTimestamp(),
			});

			setIsDialogOpen(false);
			setFormData({ name: "", email: "", whatsapp: "" });
		} catch (err) {
			console.error("Error al registrar inscripción", err);
			setSubmitError("Ocurrió un problema al guardar tu inscripción. Intentá nuevamente.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogTrigger asChild>
				<Button
					type="button"
					variant={triggerVariant}
					size={triggerSize}
					className={fullWidth ? `w-full ${triggerClassName}` : triggerClassName}
					onClick={() => console.log("CLICK trigger inscribirme", eventId)}
				>
					{triggerLabel}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<form className="space-y-4" onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Inscribirme al evento</DialogTitle>
						<DialogDescription>
							Usaremos estos datos para enviarte recordatorios de próximas fechas y
							novedades del evento.
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-2">
						<Label htmlFor="name">Nombre completo</Label>
						<Input
							id="name"
							name="name"
							value={formData.name}
							onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
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
							onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
							placeholder="tu@correo.com"
							required
							autoComplete="email"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="whatsapp">WhatsApp (opcional)</Label>
						<Input
							id="whatsapp"
							name="whatsapp"
							inputMode="tel"
							value={formData.whatsapp}
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									whatsapp: e.target.value,
								}))
							}
							placeholder="54911XXXXXXXX"
							autoComplete="tel"
						/>
					</div>

					{submitError && <p className="text-sm text-destructive">{submitError}</p>}

					<DialogFooter className="pt-2">
						<Button type="submit" disabled={isSubmitting} className="w-full">
							{isSubmitting ? "Enviando..." : "Enviar inscripción"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
