'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
	return (
		<div className='relative isolate overflow-hidden'>
			<div className='absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,rgba(0,144,94,0.12),transparent)]' />
			<div className='mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:py-40'>
				<div className='mx-auto max-w-2xl lg:mx-0 lg:flex-auto'>
					<h1 className='max-w-lg text-4xl font-bold tracking-tight sm:text-6xl'>
						Potenciá tus ventas y liderá con propósito
					</h1>
					<p className='mt-6 text-lg leading-8 text-muted-foreground'>
						Soy Leandro Chena, consultor comercial y capacitador especializado
						en transformar equipos de ventas y desarrollar líderes que inspiran
						resultados extraordinarios.
					</p>
					<div className='mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-x-6'>
						<Button size='lg' asChild className='w-full sm:w-auto'>
							<Link href='/contacto'>Descubrí cómo puedo ayudarte</Link>
						</Button>
						<Button
							variant='outline'
							size='lg'
							asChild
							className='w-full sm:w-auto'
						>
							<Link href='/servicios'>Conocé mis servicios</Link>
						</Button>
					</div>
				</div>
				<div className='mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow'>
					<div className='relative mx-auto h-80 w-80 overflow-hidden rounded-full md:h-96 md:w-96'>
						<Image
							src='/images/hero-image.webp'
							alt='Leandro Chena'
							width={400}
							height={400}
							className='absolute h-full w-full object-cover'
							priority
							onError={(e) => {
								e.target.onerror = null;
								e.target.src = '/placeholder.svg?height=400&width=400';
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

