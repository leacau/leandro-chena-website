"use client";

import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Calendar, Clock, Loader2, MapPin } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { EventSignupDialog } from '@/components/event-signup-dialog';
import Image from 'next/image';
import Link from 'next/link';

export default function EventoPage({ params }) {
	const { id } = params;
	const [isLoading, setIsLoading] = useState(true);
	const [eventData, setEventData] = useState(null);
	const [error, setError] = useState(null);
	const safeEvent = useMemo(() => {
		if (!eventData) {
			return null;
		}

		return {
			id: eventData.id,
			title: eventData.title || 'Evento sin título',
			date: eventData.date || 'Fecha a confirmar',
			time: eventData.time || 'Horario a confirmar',
			location: eventData.location || 'Ubicación a confirmar',
			description: eventData.description || '',
			longDescription: eventData.longDescription || '',
			content: eventData.content || '',
			image: eventData.image || null,
		};
	}, [eventData]);

	useEffect(() => {
		const fetchEvent = async () => {
			try {
				const [{ db }, { doc, getDoc }] = await Promise.all([
					import('@/lib/firebase'),
					import('firebase/firestore'),
				]);
				const eventRef = doc(db, 'events', id);
				const eventSnap = await getDoc(eventRef);

				if (!eventSnap.exists()) {
					setError('Evento no encontrado.');
					return;
				}

				setEventData({
					id: eventSnap.id,
					...eventSnap.data(),
				});
			} catch (err) {
				console.error('Error al cargar el evento:', err);
				setError('Hubo un problema al cargar el evento.');
			} finally {
				setIsLoading(false);
			}
		};

		fetchEvent();
	}, [id]);

	if (isLoading) {
			return (
				<div className='container mx-auto py-12 flex justify-center items-center'>
					<Loader2 className='h-8 w-8 animate-spin text-primary' />
					<span className='ml-2'>Cargando evento...</span>
				</div>
		);
	}

	if (error || !eventData) {
		return (
			<div className='container mx-auto py-12 px-4 text-center'>
				<h1 className='text-2xl font-bold mb-4'>Error al cargar el evento</h1>
				<p className='mb-8'>
					{error || 'Lo sentimos, ha ocurrido un error al cargar este evento.'}
				</p>
				<Button asChild>
					<Link href='/eventos'>Volver a eventos</Link>
				</Button>
			</div>
		);
	}

	if (!safeEvent) {
		return null;
	}

	const hasRichContent = Boolean(
		(safeEvent.longDescription && safeEvent.longDescription.trim()) ||
			(safeEvent.content && safeEvent.content.trim())
	);

	return (
		<div className='container mx-auto py-12 px-4'>
			<div className='max-w-4xl mx-auto'>
				<Link
					href='/eventos'
					className='inline-flex items-center text-primary hover:underline mb-6'
				>
					<ArrowLeft className='mr-2 h-4 w-4' />
					Volver a eventos
				</Link>

					{safeEvent.image && (
						<div className='w-full mb-8 rounded-lg overflow-hidden border'>
							<div className='relative aspect-[16/9]'>
								<Image
									src={
										safeEvent.image || '/placeholder.svg?height=720&width=1280'
									}
									alt={safeEvent.title}
									fill
									className='object-cover'
									priority
									onError={(e) => {
										e.target.onerror = null;
										e.target.src = '/placeholder.svg?height=720&width=1280';
									}}
								/>
							</div>
						</div>
					)}

				<h1 className='text-3xl md:text-4xl font-bold mb-4'>
					{safeEvent.title}
				</h1>

				<div className='flex flex-wrap gap-4 mb-8 text-sm text-muted-foreground'>
					<div className='flex items-center'>
						<Calendar className='h-4 w-4 mr-2' />
						<span>{safeEvent.date}</span>
					</div>
					<div className='flex items-center'>
						<Clock className='h-4 w-4 mr-2' />
						<span>{safeEvent.time}</span>
					</div>
					<div className='flex items-center'>
						<MapPin className='h-4 w-4 mr-2' />
						<span>{safeEvent.location}</span>
					</div>
				</div>

				{safeEvent.description && (
					<div className='text-lg font-medium mb-8 text-muted-foreground'>
						{safeEvent.description}
					</div>
				)}

				{hasRichContent && (
					<div className='prose prose-lg max-w-none dark:prose-invert mb-8 event-content'>
						{safeEvent.longDescription && (
							<div
								dangerouslySetInnerHTML={{ __html: safeEvent.longDescription }}
							/>
						)}
						{safeEvent.content && (
							<div dangerouslySetInnerHTML={{ __html: safeEvent.content }} />
						)}
					</div>
				)}

				<div className='mt-12 pt-8 border-t flex flex-col sm:flex-row gap-4'>
					<EventSignupDialog
						eventId={safeEvent.id}
						triggerClassName='flex-1'
						triggerSize='lg'
						fullWidth
					/>
					<Button variant='outline' size='lg' asChild className='flex-1'>
						<Link href='/eventos'>Ver otros eventos</Link>
					</Button>
				</div>
			</div>
			<style jsx global>{styles}</style>
		</div>
	);
}

// Estilos para el contenido enriquecido (similar al blog)
const styles = `
.event-content blockquote {
  border-left: 4px solid var(--primary);
  padding-left: 1rem;
  margin-left: 0;
  margin-right: 0;
  font-style: italic;
  color: var(--muted-foreground);
}
	.event-content hr {
	  border: none;
	  border-top: 2px solid #000;
	  width: 60%;
	  margin: 2rem auto;
	}
	.event-content ul {
	  list-style: disc;
	  padding-left: 1.5rem;
	  margin: 1rem 0;
	}
	.event-content ol {
	  list-style: decimal;
	  padding-left: 1.5rem;
	  margin: 1rem 0;
	}
`;
