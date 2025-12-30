"use client";

import { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, Clock, MapPin } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/firebase';

export default function EventoPage({ params }) {
	const { id } = params;
	const [isLoading, setIsLoading] = useState(true);
	const [eventData, setEventData] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchEvent = async () => {
			try {
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
			<div className='container mx-auto py-12 px-4'>
				<p className='text-center text-muted-foreground'>Cargando evento...</p>
			</div>
		);
	}

	if (error || !eventData) {
		return (
			<div className='container mx-auto py-12 px-4 text-center space-y-4'>
				<p className='text-destructive font-semibold'>
					{error || 'Evento no encontrado.'}
				</p>
				<Button asChild variant='outline'>
					<Link href='/eventos'>Volver a eventos</Link>
				</Button>
			</div>
		);
	}

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

				{eventData.image && (
					<div className='relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden'>
						<Image
							src={eventData.image || '/placeholder.svg?height=400&width=800'}
							alt={eventData.title}
							fill
							className='object-cover'
							priority
							onError={(e) => {
								e.target.onerror = null;
								e.target.src = '/placeholder.svg?height=400&width=800';
							}}
						/>
					</div>
				)}

				<h1 className='text-3xl md:text-4xl font-bold mb-4'>
					{eventData.title}
				</h1>

				<div className='flex flex-col md:flex-row md:items-center gap-4 mb-8'>
					<div className='flex items-center text-sm'>
						<Calendar className='h-5 w-5 mr-2 text-muted-foreground' />
						<span>{eventData.date}</span>
					</div>
					<div className='flex items-center text-sm'>
						<Clock className='h-5 w-5 mr-2 text-muted-foreground' />
						<span>{eventData.time}</span>
					</div>
					<div className='flex items-center text-sm'>
						<MapPin className='h-5 w-5 mr-2 text-muted-foreground' />
						<span>{eventData.location}</span>
					</div>
				</div>

				<div className='prose prose-lg max-w-none dark:prose-invert mb-8'>
					<p>{eventData.description}</p>

					{eventData.content && (
						<div dangerouslySetInnerHTML={{ __html: eventData.content }} />
					)}
				</div>

				<div className='flex flex-col sm:flex-row gap-4 mt-8'>
					<Button size='lg' className='flex-1'>
						Inscribirme
					</Button>
					<Button variant='outline' size='lg' asChild className='flex-1'>
						<Link href='/eventos'>Ver otros eventos</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
