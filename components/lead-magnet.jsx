'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { DownloadCloud, CheckCircle2 } from 'lucide-react';
import {
	captureUrlParams,
	getMetaCookies,
	getStoredAttribution,
	normalizePhone,
	sha256,
	trackEvent,
} from '@/lib/tracking';

export default function LeadMagnet() {
	const [email, setEmail] = useState('');
	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');
	const [website, setWebsite] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			if (website) {
				setIsSubmitting(false);
				return;
			}

			captureUrlParams();
			const attribution = getStoredAttribution();
			const metaCookies = getMetaCookies();
			const normalizedPhone = normalizePhone(phone);

			const [emailHash, phoneHash] = await Promise.all([
				sha256(email),
				sha256(normalizedPhone),
			]);

			const [{ db }, { collection, addDoc, serverTimestamp }] =
				await Promise.all([
					import('@/lib/firebase'),
					import('firebase/firestore'),
				]);

			await addDoc(collection(db, 'leads'), {
				name: name.trim(),
				email: email.trim().toLowerCase(),
				phone: normalizedPhone,
				source: 'Home - Lead Magnet Guía Comercial',
				lead_stage: 'nuevo',
				attribution: {
					...attribution,
					fbp: metaCookies.fbp || '',
					fbc: metaCookies.fbc || '',
				},
				hashed_data: {
					em: emailHash,
					ph: phoneHash,
				},
				createdAt: serverTimestamp(),
			});

			trackEvent('diagnostic_submit', {
				form_name: 'lead_magnet_home',
				resource: 'guia_tactica_ventas',
			});

			toast({
				title: '¡Acceso concedido!',
				description: 'Redirigiendo a tus recursos y herramientas gratuitas...',
			});

			router.push('/recursos');
		} catch (error) {
			console.error('Error al guardar el lead:', error);
			toast({
				variant: 'destructive',
				title: 'Error',
				description:
					'Hubo un problema al procesar tu solicitud. Intentá nuevamente.',
			});
			setIsSubmitting(false);
		}
	};

	return (
		<section className='bg-primary/5 py-16 border-y border-primary/10'>
			<div className='mx-auto max-w-7xl px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12'>
				<div className='lg:w-1/2'>
					<div className='inline-flex items-center justify-center p-3 bg-primary/10 rounded-xl mb-6'>
						<DownloadCloud className='h-8 w-8 text-primary' />
					</div>
					<h2 className='text-3xl font-bold tracking-tight sm:text-4xl mb-4'>
						Llevá tu proceso de ventas al siguiente nivel
					</h2>
					<p className='text-lg text-muted-foreground mb-6'>
						Descargá gratis mi guía táctica con los pasos exactos para influir,
						persuadir y cerrar acuerdos sin presionar a tu cliente. Ideal para
						dueños de empresa, directores y equipos comerciales.
					</p>
					<ul className='space-y-3 text-sm text-muted-foreground'>
						<li className='flex items-center gap-2'>
							<CheckCircle2 className='h-4 w-4 text-primary flex-shrink-0' />
							Estructura de conversación comercial consultiva paso a paso.
						</li>
						<li className='flex items-center gap-2'>
							<CheckCircle2 className='h-4 w-4 text-primary flex-shrink-0' />
							Respuestas tácticas a las 5 objeciones más habituales de precio.
						</li>
						<li className='flex items-center gap-2'>
							<CheckCircle2 className='h-4 w-4 text-primary flex-shrink-0' />
							Acceso inmediato a plantillas y recursos complementarios.
						</li>
					</ul>
				</div>

				<div className='lg:w-1/2 w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border'>
					<h3 className='text-xl font-semibold mb-2'>
						Accedé al material gratuito
					</h3>
					<p className='text-sm text-muted-foreground mb-6'>
						Completá tus datos para recibir la guía al instante:
					</p>
					<form onSubmit={handleSubmit} className='space-y-4'>
						<div className='hidden' aria-hidden='true'>
							<Input
								tabIndex={-1}
								autoComplete='off'
								value={website}
								onChange={(e) => setWebsite(e.target.value)}
							/>
						</div>
						<div>
							<Input
								placeholder='Tu nombre completo'
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</div>
						<div>
							<Input
								type='email'
								placeholder='tu@correo.com'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						<div>
							<Input
								type='tel'
								placeholder='WhatsApp (opcional, para avisos)'
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
							/>
						</div>
						<Button type='submit' className='w-full py-3' disabled={isSubmitting}>
							{isSubmitting ? 'Preparando descarga...' : 'Descargar Guía Ahora'}
						</Button>
						<p className='text-xs text-center text-muted-foreground mt-4'>
							Tus datos están protegidos. Sin spam ni mensajes indeseados.
						</p>
					</form>
				</div>
			</div>
		</section>
	);
}
