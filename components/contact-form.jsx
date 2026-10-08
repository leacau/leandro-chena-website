'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import {
	captureUrlParams,
	getMetaCookies,
	getStoredAttribution,
	normalizePhone,
	sha256,
	trackEvent,
} from '@/lib/tracking';

function ContactFormInner() {
	const searchParams = useSearchParams();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [hasStarted, setHasStarted] = useState(false);

	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		company: '',
		service: '',
		message: '',
		website: '', // honeypot antispam
	});

	// Pre-seleccionar servicio según query param ?servicio=...
	useEffect(() => {
		const paramService = searchParams.get('servicio');
		if (paramService) {
			const validServices = ['capacitaciones', 'consultoria', 'charlas', 'mentorias'];
			if (validServices.includes(paramService)) {
				setFormData((prev) => ({ ...prev, service: paramService }));
			}
		}
	}, [searchParams]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		if (!hasStarted) {
			setHasStarted(true);
			trackEvent('diagnostic_start', {
				form_name: 'contact_form',
				service: formData.service || 'no_seleccionado',
			});
		}
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			// Protección honeypot
			if (formData.website) {
				setIsSubmitting(false);
				return;
			}

			// 1. Obtener parámetros de atribución y cookies
			captureUrlParams();
			const attribution = getStoredAttribution();
			const metaCookies = getMetaCookies();
			const normalizedPhone = normalizePhone(formData.phone);

			// Hashes para Enhanced Conversions y CAPI
			const [emailHash, phoneHash] = await Promise.all([
				sha256(formData.email),
				sha256(normalizedPhone),
			]);

			// 2. Guardar en Firestore para Closed-Loop Tracking (Pipeline de ventas)
			try {
				const [{ db }, { collection, addDoc, serverTimestamp }] =
					await Promise.all([
						import('@/lib/firebase'),
						import('firebase/firestore'),
					]);

				await addDoc(collection(db, 'leads'), {
					name: formData.name.trim(),
					email: formData.email.trim().toLowerCase(),
					phone: normalizedPhone,
					company: formData.company.trim(),
					service: formData.service || 'general',
					message: formData.message.trim(),
					source: 'Formulario de Contacto Web',
					lead_stage: 'nuevo', // nuevo -> qualified_lead -> proposal_sent -> client_won
					// Atribución de campaña
					attribution: {
						utm_source: attribution.utm_source || '',
						utm_medium: attribution.utm_medium || '',
						utm_campaign: attribution.utm_campaign || '',
						utm_content: attribution.utm_content || '',
						utm_term: attribution.utm_term || '',
						gclid: attribution.gclid || '',
						wbraid: attribution.wbraid || '',
						gbraid: attribution.gbraid || '',
						fbclid: attribution.fbclid || '',
						referrer: attribution.referrer || '',
						first_landing_page: attribution.first_landing_page || '',
						fbp: metaCookies.fbp || '',
						fbc: metaCookies.fbc || '',
					},
					// Hashes de primera parte
					hashed_data: {
						em: emailHash,
						ph: phoneHash,
					},
					createdAt: serverTimestamp(),
				});
			} catch (firestoreErr) {
				console.error('Error guardando lead en Firestore:', firestoreErr);
			}

			// 3. Enviar notificación por Formspree
			try {
				await fetch('https://formspree.io/f/xpwplepb', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						name: formData.name,
						email: formData.email,
						phone: formData.phone,
						company: formData.company,
						service: formData.service,
						message: formData.message,
						_subject: `Nuevo contacto comercial de ${formData.name} (${
							formData.service || 'General'
						})`,
					}),
				});
			} catch (formspreeErr) {
				console.warn('Error enviando a Formspree:', formspreeErr);
			}

			// 4. Disparar eventos al Data Layer
			trackEvent('diagnostic_submit', {
				form_name: 'contact_form',
				service: formData.service || 'general',
				has_company: !!formData.company,
			});

			toast({
				title: '¡Mensaje recibido con éxito!',
				description:
					'Gracias por contactarme. Analizaremos tu consulta y nos comunicaremos a la brevedad.',
			});

			// Resetear formulario
			setFormData({
				name: '',
				email: '',
				phone: '',
				company: '',
				service: '',
				message: '',
				website: '',
			});
			setHasStarted(false);
		} catch (error) {
			console.error('Error al enviar formulario:', error);
			toast({
				title: 'Error',
				description:
					'Hubo un problema al enviar tu mensaje. Por favor intentá nuevamente o contactame por WhatsApp.',
				variant: 'destructive',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div>
			<div className='mx-auto max-w-7xl px-0'>
				<form onSubmit={handleSubmit} className='space-y-6'>
					{/* Honeypot antispam */}
					<div className='hidden' aria-hidden='true'>
						<Label htmlFor='website'>Sitio web</Label>
						<Input
							id='website'
							name='website'
							tabIndex={-1}
							autoComplete='off'
							value={formData.website}
							onChange={handleChange}
						/>
					</div>

					<div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
						<div>
							<Label htmlFor='name'>Nombre y Apellido *</Label>
							<Input
								id='name'
								name='name'
								value={formData.name}
								onChange={handleChange}
								placeholder='Ej. Juan Pérez'
								required
							/>
						</div>
						<div>
							<Label htmlFor='email'>Email corporativo / personal *</Label>
							<Input
								id='email'
								name='email'
								type='email'
								value={formData.email}
								onChange={handleChange}
								placeholder='juan@empresa.com'
								required
							/>
						</div>
						<div>
							<Label htmlFor='phone'>Teléfono / WhatsApp *</Label>
							<Input
								id='phone'
								name='phone'
								type='tel'
								value={formData.phone}
								onChange={handleChange}
								placeholder='+54 9 342...'
								required
							/>
						</div>
						<div>
							<Label htmlFor='company'>Empresa u Organización</Label>
							<Input
								id='company'
								name='company'
								value={formData.company}
								onChange={handleChange}
								placeholder='Nombre de tu empresa o rubro'
							/>
						</div>
					</div>

					<div>
						<Label htmlFor='message'>¿En qué puedo ayudarte? *</Label>
						<Textarea
							id='message'
							name='message'
							rows={4}
							value={formData.message}
							onChange={handleChange}
							placeholder='Contame brevemente sobre tu equipo comercial, tus objetivos o el desafío actual...'
							required
						/>
					</div>

					<Button
						type='submit'
						size='lg'
						className='w-full py-3 text-base'
						disabled={isSubmitting}
					>
						{isSubmitting ? (
							<>
								<Loader2 className='mr-2 h-5 w-5 animate-spin' />
								Enviando consulta...
							</>
						) : (
							'Enviar consulta'
						)}
					</Button>
				</form>
			</div>
		</div>
	);
}

export default function ContactForm() {
	return (
		<Suspense fallback={<div className='p-8 text-center text-muted-foreground'>Cargando formulario...</div>}>
			<ContactFormInner />
		</Suspense>
	);
}
