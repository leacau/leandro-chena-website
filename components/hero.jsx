'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import BookMeetingDialog from '@/components/book-meeting-dialog';

export default function Hero() {
	return (
		<div className='relative isolate overflow-hidden'>
			<div className='absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,rgba(0,144,94,0.12),transparent)]' />
			<div className='mx-auto max-w-7xl px-6 py-20 sm:py-28 lg:flex lg:items-center lg:gap-x-12 lg:px-8 lg:py-36'>
				<div className='mx-auto max-w-2xl lg:mx-0 lg:flex-auto'>
					<h1 className='max-w-xl text-4xl font-extrabold tracking-tight sm:text-6xl text-foreground leading-tight'>
						Potenciá tus ventas y liderá con propósito
					</h1>
					<p className='mt-6 text-lg leading-8 text-muted-foreground max-w-xl'>
						Soy Leandro Chena, consultor comercial y capacitador especializado
						en transformar equipos de ventas y desarrollar líderes que inspiran
						resultados extraordinarios.
					</p>
					<div className='mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4'>
						<BookMeetingDialog
							triggerText='Agendar llamada de diagnóstico'
							triggerSize='lg'
							source='hero_home'
							className='shadow-md'
						/>
						<Button
							variant='outline'
							size='lg'
							asChild
						>
							<Link href='/servicios'>Conocé mis servicios</Link>
						</Button>
					</div>
				</div>	
				<div className='mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow'>
					<div className='relative mx-auto h-80 w-80 overflow-hidden rounded-full md:h-96 md:w-96 shadow-2xl'>
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
