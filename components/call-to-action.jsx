'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import BookMeetingDialog from '@/components/book-meeting-dialog';

export default function CallToAction() {
	return (
		<section className='bg-[#00905E] text-white'>
			<div className='mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8'>
				<div className='mx-auto max-w-2xl text-center'>
					<h2 className='text-3xl font-extrabold tracking-tight sm:text-4xl text-white'>
						¿Listo para transformar tu enfoque comercial?
					</h2>
					<p className='mx-auto mt-6 max-w-xl text-lg leading-8 text-white/90'>
						Descubrí cómo mis servicios de consultoría y capacitación pueden
						ayudarte a potenciar tus ventas y desarrollar líderes inspiradores.
					</p>
					<div className='mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4'>
						<BookMeetingDialog
							triggerText='Agendar llamada de diagnóstico (15 min)'
							triggerVariant='secondary'
							triggerSize='lg'
							source='cta_section'
							className='shadow-lg text-[#00905E] hover:text-[#00784e]'
						/>
						<Button
							size='lg'
							variant='outline'
							className='border-2 border-white/60 bg-transparent text-white hover:bg-white/10 hover:text-white hover:border-white shadow-none'
							asChild
						>
							<Link href='/contacto'>Enviar consulta por formulario</Link>
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
