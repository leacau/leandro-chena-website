'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CallToAction() {
	return (
		<section className='bg-primary'>
			<div className='mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8 lg:py-32'>
				<div className='mx-auto max-w-2xl text-center'>
					<h2 className='text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl'>
						¿Listo para transformar tu enfoque comercial?
					</h2>
					<p className='mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-foreground/80'>
						Descubrí cómo mis servicios de consultoría y capacitación pueden
						ayudarte a potenciar tus ventas y desarrollar líderes inspiradores.
					</p>
					<div className='mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6'>
						<Button
							size='lg'
							variant='secondary'
							asChild
							className='w-full sm:w-auto hover:bg-primary-foreground/20 py-3 px-3'
						>
							<Link href='/contacto'>Agendá una consulta</Link>
						</Button>
						<Button
							size='lg'
							variant='outline'
							className='w-full sm:w-auto bg-transparent text-white hover:bg-primary-foreground/20 border-primary-foreground/10 bg-green-900 py-3 px-3'
							asChild
						>
							<Link href='/recursos'>Explorá recursos gratuitos</Link>
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}

