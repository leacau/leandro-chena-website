import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import BookMeetingDialog from '@/components/book-meeting-dialog';

export const metadata: Metadata = {
	title: 'Capacitaciones para Equipos Comerciales | Leandro Chena',
	description:
		'Programas personalizados para potenciar las habilidades de venta y negociación de tu equipo comercial.',
};

export default function CapacitacionesPage() {
	return (
		<div className='container mx-auto px-6 py-12 md:py-24'>
			<div className='grid lg:grid-cols-2 gap-12 items-center mb-16'>
				<div>
					<h1 className='text-4xl font-bold tracking-tight sm:text-5xl mb-6'>
						Capacitaciones para Equipos Comerciales
					</h1>
					<p className='text-xl text-muted-foreground mb-8'>
						Programas personalizados para potenciar las habilidades de venta y
						negociación de tu equipo comercial.
					</p>
					<div className='space-y-4 mb-8'>
						<div className='flex gap-3'>
							<CheckCircle2 className='h-6 w-6 text-primary flex-shrink-0' />
							<p>Incremento de la efectividad y los resultados de tu equipo de ventas.</p>
						</div>
						<div className='flex gap-3'>
							<CheckCircle2 className='h-6 w-6 text-primary flex-shrink-0' />
							<p>Desarrollo de habilidades de comunicación, negociación y cierre.</p>
						</div>
						<div className='flex gap-3'>
							<CheckCircle2 className='h-6 w-6 text-primary flex-shrink-0' />
							<p>Metodología práctica con casos reales y ejercicios aplicados.</p>
						</div>
						<div className='flex gap-3'>
							<CheckCircle2 className='h-6 w-6 text-primary flex-shrink-0' />
							<p>Programas adaptados a las necesidades específicas de tu empresa.</p>
						</div>
					</div>
					<div className='flex flex-col sm:flex-row gap-4'>
						<BookMeetingDialog
							triggerText='Agendar llamada de diagnóstico'
							triggerSize='lg'
							source='servicio_capacitaciones_hero'
						/>
						<Button size='lg' variant='outline' asChild>
							<Link href='/contacto?servicio=capacitaciones'>
								Consultar programa por formulario
							</Link>
						</Button>
					</div>
				</div>
				<div className='relative h-[400px] rounded-lg overflow-hidden shadow-lg border'>
					<Image
						src='/placeholder.svg?height=400&width=600'
						alt='Capacitaciones para Equipos Comerciales'
						fill
						className='object-cover'
					/>
				</div>
			</div>

			<div className='mb-16'>
				<h2 className='text-3xl font-bold mb-6'>Programas de capacitación</h2>
				<div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8'>
					<div className='border rounded-lg p-6 bg-card'>
						<h3 className='text-xl font-bold mb-3'>Ventas Consultivas</h3>
						<p className='text-muted-foreground'>
							Aprendé a vender soluciones de valor, no productos ni precios. Enfoque centrado en descubrir las necesidades y dolores reales del cliente.
						</p>
					</div>
					<div className='border rounded-lg p-6 bg-card'>
						<h3 className='text-xl font-bold mb-3'>Negociación Avanzada</h3>
						<p className='text-muted-foreground'>
							Técnicas y estrategias para negociar con éxito en situaciones complejas, manteniendo márgenes y fidelidad con clientes exigentes.
						</p>
					</div>
					<div className='border rounded-lg p-6 bg-card'>
						<h3 className='text-xl font-bold mb-3'>Manejo de Objeciones</h3>
						<p className='text-muted-foreground'>
							Aprendé a identificar, anticipar y desarticular las objeciones más comunes en el proceso comercial sin confrontar.
						</p>
					</div>
				</div>
			</div>

			<div className='bg-muted/40 p-8 md:p-12 rounded-2xl border'>
				<h2 className='text-3xl font-bold mb-6'>Metodología</h2>
				<p className='mb-8 text-lg text-muted-foreground'>
					Nuestras capacitaciones combinan teoría y práctica en un formato dinámico y participativo:
				</p>
				<div className='grid md:grid-cols-2 gap-8'>
					<div className='p-4 border rounded-xl bg-background'>
						<h3 className='text-xl font-bold mb-2'>1. Diagnóstico</h3>
						<p className='text-muted-foreground'>
							Evaluamos las necesidades y hábitos actuales de tu equipo para adaptar el contenido y los ejercicios a tu sector.
						</p>
					</div>
					<div className='p-4 border rounded-xl bg-background'>
						<h3 className='text-xl font-bold mb-2'>2. Formación Dinámica</h3>
						<p className='text-muted-foreground'>
							Sesiones teórico-prácticas con role-playing, análisis de llamadas y ejercicios concretos.
						</p>
					</div>
					<div className='p-4 border rounded-xl bg-background'>
						<h3 className='text-xl font-bold mb-2'>3. Implementación</h3>
						<p className='text-muted-foreground'>
							Herramientas, plantillas y planes de acción claros para aplicar lo aprendido en el día a día.
						</p>
					</div>
					<div className='p-4 border rounded-xl bg-background'>
						<h3 className='text-xl font-bold mb-2'>4. Seguimiento y Refuerzo</h3>
						<p className='text-muted-foreground'>
							Medición del impacto y sesiones de refuerzo para asegurar que los hábitos comerciales queden consolidados.
						</p>
					</div>
				</div>
			</div>

			<div className='text-center mt-12 bg-primary/5 py-16 px-6 rounded-2xl border border-primary/10 max-w-4xl mx-auto'>
				<h2 className='text-3xl font-bold mb-4'>¿Listo para potenciar tu equipo comercial?</h2>
				<p className='text-lg text-muted-foreground max-w-2xl mx-auto mb-8'>
					Coordiná una llamada de diagnóstico de 30 minutos para diseñar un programa a la medida de tu equipo.
				</p>
				<div className='flex flex-col sm:flex-row justify-center gap-4'>
					<BookMeetingDialog
						triggerText='Reservar llamada con Leandro'
						triggerSize='lg'
						source='servicio_capacitaciones_footer'
					/>
					<Button size='lg' variant='outline' asChild>
						<Link href='/contacto?servicio=capacitaciones'>
							Enviar consulta
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
