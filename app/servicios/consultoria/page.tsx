import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import BookMeetingDialog from '@/components/book-meeting-dialog';

export const metadata: Metadata = {
	title: 'Consultoría para Empresas | Leandro Chena',
	description:
		'Optimizamos tu estrategia comercial para mejorar resultados y aumentar ventas.',
};

export default function ConsultoriaPage() {
	return (
		<div className='container mx-auto px-6 py-12 md:py-24'>
			<div className='grid lg:grid-cols-2 gap-12 items-center mb-16'>
				<div>
					<h1 className='text-4xl font-bold tracking-tight sm:text-5xl mb-6'>
						Consultoría para Empresas
					</h1>
					<p className='text-xl text-muted-foreground mb-8'>
						El programa de consultoría está diseñado para detectar puntos de
						mejora en tus procesos comerciales y potenciar el rendimiento de tu
						equipo de ventas.
					</p>
					<div className='space-y-4 mb-8'>
						<div className='flex gap-3'>
							<CheckCircle2 className='h-6 w-6 text-primary flex-shrink-0' />
							<p>Aumentar la conversión de prospectos en clientes.</p>
						</div>
						<div className='flex gap-3'>
							<CheckCircle2 className='h-6 w-6 text-primary flex-shrink-0' />
							<p>Mejorar la productividad y organización del equipo de ventas.</p>
						</div>
						<div className='flex gap-3'>
							<CheckCircle2 className='h-6 w-6 text-primary flex-shrink-0' />
							<p>
								Implementar estrategias efectivas de captación y fidelización de
								clientes.
							</p>
						</div>
						<div className='flex gap-3'>
							<CheckCircle2 className='h-6 w-6 text-primary flex-shrink-0' />
							<p>Optimizar el uso de herramientas y metodologías comerciales.</p>
						</div>
					</div>
					<div className='flex flex-col sm:flex-row gap-4'>
						<BookMeetingDialog
							triggerText='Agendar llamada de diagnóstico'
							triggerSize='lg'
							source='servicio_consultoria_hero'
						/>
						<Button size='lg' variant='outline' asChild>
							<Link href='/contacto?servicio=consultoria'>
								Solicitar información por formulario
							</Link>
						</Button>
					</div>
				</div>
				<div className='relative h-[400px] rounded-lg overflow-hidden shadow-lg border'>
					<Image
						src='/placeholder.svg?height=400&width=600'
						alt='Consultoría para Empresas'
						fill
						className='object-cover'
					/>
				</div>
			</div>

			<div className='bg-muted/40 mb-16 rounded-2xl p-8 md:p-12 border'>
				<h2 className='text-3xl font-bold mb-6'>¿Cómo lo hacemos?</h2>
				<div className='grid md:grid-cols-2 lg:grid-cols-2 gap-8'>
					<div className='border bg-background rounded-xl p-6 shadow-sm'>
						<h3 className='text-xl font-bold mb-3'>1. Diagnóstico Comercial</h3>
						<p className='text-muted-foreground'>
							Analizamos el estado actual de tu equipo y procesos de ventas para
							identificar oportunidades de optimización y fugas de conversión.
						</p>
					</div>
					<div className='border bg-background rounded-xl p-6 shadow-sm'>
						<h3 className='text-xl font-bold mb-3'>2. Diseño de Estrategias</h3>
						<p className='text-muted-foreground'>
							Desarrollamos planes de acción a medida, alineados con los objetivos
							de tu empresa y la realidad de tu sector.
						</p>
					</div>
					<div className='border bg-background rounded-xl p-6 shadow-sm'>
						<h3 className='text-xl font-bold mb-3'>3. Implementación Práctica</h3>
						<p className='text-muted-foreground'>
							Acompañamos la ejecución de las estrategias, asegurando su
							correcta aplicación en el día a día del equipo.
						</p>
					</div>
					<div className='border bg-background rounded-xl p-6 shadow-sm'>
						<h3 className='text-xl font-bold mb-3'>4. Seguimiento y Medición</h3>
						<p className='text-muted-foreground'>
							Evaluamos los resultados y realizamos ajustes para garantizar un
							impacto real y sostenible en la efectividad comercial.
						</p>
					</div>
				</div>
			</div>

			<div className='text-center mt-12 bg-primary/5 py-16 px-6 rounded-2xl border border-primary/10 max-w-4xl mx-auto'>
				<h2 className='text-3xl font-bold mb-4'>
					¿Listo para potenciar tu equipo comercial?
				</h2>
				<p className='text-lg text-muted-foreground max-w-2xl mx-auto mb-8'>
					Coordinemos una llamada de diagnóstico de 30 minutos para entender tu caso y
					analizar juntos la mejor alternativa.
				</p>
				<div className='flex flex-col sm:flex-row justify-center gap-4'>
					<BookMeetingDialog
						triggerText='Reservar mi espacio en agenda'
						triggerSize='lg'
						source='servicio_consultoria_footer'
					/>
					<Button size='lg' variant='outline' asChild>
						<Link href='/contacto?servicio=consultoria'>
							Completar formulario
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
