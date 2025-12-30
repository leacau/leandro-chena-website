import { ArrowLeft, Calendar, Clock, MapPin } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { notFound } from 'next/navigation';

// Forzar que la página sea dinámica para que se regenere en cada solicitud
export const dynamic = 'force-dynamic';

export default async function EventoPage({ params }) {
	const { id } = params;

	try {
		// Buscar el evento en Firestore
		const eventRef = doc(db, 'events', id);
		const eventSnap = await getDoc(eventRef);

		if (!eventSnap.exists()) {
			return notFound();
		}

		const eventData = {
			id: eventSnap.id,
			...eventSnap.data(),
		};

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

						{/* Contenido adicional del evento si existe */}
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
	} catch (error) {
		console.error('Error al cargar el evento:', error);
		return notFound();
	}
}
