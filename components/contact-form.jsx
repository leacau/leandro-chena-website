'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';

export default function ContactForm() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		website: '',
		/* 		service: '',
		 */ message: '',
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	/* const handleSelectChange = (value) => {
		setFormData((prev) => ({ ...prev, service: value }));
	}; */

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			if (formData.website) {
				return;
			}

			// Enviar datos a Formspree
			const response = await fetch('https://formspree.io/f/xpwplepb', {
				// Reemplaza {form_id} con tu ID de formulario de Formspree
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: formData.name,
					email: formData.email,
					phone: formData.phone,
					/* 					service: formData.service,
					 */ message: formData.message,
					_subject: `Nuevo contacto de ${formData.name}`,
				}),
			});

			if (!response.ok) {
				throw new Error('Error al enviar el formulario');
			}

			toast({
				title: 'Formulario enviado',
				description: 'Gracias por contactarme. Te responderé a la brevedad.',
			});

			// Reset form
			setFormData({
				name: '',
				email: '',
				phone: '',
				website: '',
				/* 				service: '',
				 */ message: '',
			});
		} catch (error) {
			console.error('Error:', error);
			toast({
				title: 'Error',
				description:
					'Hubo un problema al enviar el formulario. Por favor, intenta nuevamente.',
				variant: 'destructive',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div>
			<div className='mx-auto max-w-7xl px-6 lg:px-8'>
				<form onSubmit={handleSubmit} className='space-y-6'>
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
							<Label htmlFor='name'>Nombre</Label>
							<Input
								id='name'
								name='name'
								value={formData.name}
								onChange={handleChange}
								required
							/>
						</div>
						<div>
							<Label htmlFor='email'>Email</Label>
							<Input
								id='email'
								name='email'
								type='email'
								value={formData.email}
								onChange={handleChange}
								required
							/>
						</div>
						<div>
							<Label htmlFor='phone'>Teléfono</Label>
							<Input
								id='phone'
								name='phone'
								type='tel'
								value={formData.phone}
								onChange={handleChange}
							/>
						</div>
						{/* <div>
							<Label htmlFor='service'>Servicio de interés</Label>
							<Select
								name='service'
								value={formData.service}
								onValueChange={handleSelectChange}
							>
								<SelectTrigger>
									<SelectValue placeholder='Selecciona un servicio' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='capacitaciones'>Capacitaciones</SelectItem>
									<SelectItem value='consultoria'>Consultoría</SelectItem>
									<SelectItem value='charlas'>
										Charlas Motivacionales
									</SelectItem>
									<SelectItem value='mentorias'>Mentorías 1:1</SelectItem>
									<SelectItem value='dudas'>No estoy seguro/a</SelectItem>
								</SelectContent>
							</Select>
						</div> */}
					</div>
					<div>
						<Label htmlFor='message'>Mensaje</Label>
						<Textarea
							id='message'
							name='message'
							rows={4}
							value={formData.message}
							onChange={handleChange}
							required
						/>
					</div>
					<Button type='submit' className='w-full' disabled={isSubmitting}>
						{isSubmitting ? (
							<>
								<Loader2 className='mr-2 h-4 w-4 animate-spin' />
								Enviando...
							</>
						) : (
							'Enviar mensaje'
						)}
					</Button>
				</form>
				<div className='mt-8'></div>
			</div>
		</div>
	);
}
