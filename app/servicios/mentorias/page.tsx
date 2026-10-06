import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import BookMeetingDialog from '@/components/book-meeting-dialog';

export const metadata: Metadata = {
	title: 'Mentorías 1:1 | Leandro Chena',
	description:
		'Acompañamiento personalizado para potenciar tu crecimiento y resultados comerciales.',
};

export default function MentoriasPage() {
	return (
		<div className='container mx-auto px-6 py-12 md:py-24'>
			<div className='grid lg:grid-cols-2 gap-12 items-center mb-16'>
				<div>
					<h1 className='text-4xl font-bold tracking-tight sm:text-5xl mb-6'>
						Mentorías 1:1
					</h1>
					<p className='text-xl text-muted-foreground mb-6'>
						Acompañamiento personalizado para potenciar tu crecimiento y resultados.
					</p>
					<p className='text-muted-foreground mb-8'>
						Las mentorías individuales están diseñadas para directores, gerentes
						comerciales y líderes que buscan perfeccionar su enfoque estratégico,
						desarrollar su liderazgo comercial y acelerar sus metas con un plan a
						medida.
					</p>
					<div className='space-y-4 mb-8'>
						<div className='flex gap-3'>
							<CheckCircle2 className='h-6 w-6 text-primary flex-shrink-0' />
							<p>Mayor claridad, confianza y criterio estratégico en tu rol.</p>
						</div>
						<div className='flex gap-3'>
							<CheckCircle2 className='h-6 w-6 text-primary flex-shrink-0' />
							<p>Metodología consultiva para cerrar ventas complejas con solidez.</p>
						</div>
						<div className='flex gap-3'>
							<CheckCircle2 className='h-6 w-6 text-primary flex-shrink-0' />
							<p>Habilidades de liderazgo para guiar a tu equipo hacia el alto rendimiento.</p>
						</div>
						<div className='flex gap-3'>
							<CheckCircle2 className='h-6 w-6 text-primary flex-shrink-0' />
							<p>Plan de acción individualizado con seguimiento paso a paso.</p>
						</div>
					</div>
					<div className='flex flex-col sm:flex-row gap-4'>
						<BookMeetingDialog
							triggerText='Agendar llamada de diagnóstico (15 min)'
							triggerSize='lg'
							source='servicio_mentorias_hero'
						/>
						<Button size='lg' variant='outline' asChild>
							<Link href='/contacto?servicio=mentorias'>
								Consultar por formulario
							</Link>
						</Button>
					</div>
				</div>
				<div className='relative h-[400px] rounded-lg overflow-hidden shadow-lg border'>
					<Image
						src='/placeholder.svg?height=400&width=600'
						alt='Mentorías 1:1 con Leandro Chena'
						fill
						className='object-cover'
					/>
				</div>
			</div>

			<div className='bg-muted/40 mb-16 rounded-2xl p-8 md:p-12 border'>
				<h2 className='text-3xl font-bold mb-6'>¿Cómo trabajamos juntos?</h2>
				<div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
					<div className='border bg-background rounded-xl p-6'>
						<h3 className='text-lg font-bold mb-2'>1. Diagnóstico</h3>
						<p className='text-sm text-muted-foreground'>
							Evaluamos tu posición de partida, fortalezas, puntos ciegos y metas.
						</p>
					</div>
					<div className='border bg-background rounded-xl p-6'>
						<h3 className='text-lg font-bold mb-2'>2. Estrategia</h3>
						<p className='text-sm text-muted-foreground'>
							Diseñamos un plan de trabajo táctico enfocado en tus metas comerciales.
						</p>
					</div>
					<div className='border bg-background rounded-xl p-6'>
						<h3 className='text-lg font-bold mb-2'>3. Sesiones 1:1</h3>
						<p className='text-sm text-muted-foreground'>
							Encuentros periódicos de trabajo práctico, resolución de casos y toma de decisiones.
						</p>
					</div>
					<div className='border bg-background rounded-xl p-6'>
						<h3 className='text-lg font-bold mb-2'>4. Consolidación</h3>
						<p className='text-sm text-muted-foreground'>
							Medición constante de avances y ajustes continuos en tus procesos y hábitos.
						</p>
					</div>
				</div>
			</div>

			<div className='text-center bg-primary/5 py-16 px-6 rounded-2xl border border-primary/10 max-w-4xl mx-auto'>
				<h2 className='text-3xl font-bold mb-4'>Da el próximo paso en tu liderazgo comercial</h2>
				<p className='text-lg text-muted-foreground max-w-2xl mx-auto mb-8'>
					Agendá una sesión inicial de 15 minutos para conocernos y evaluar si la mentoría es lo que hoy necesitás.
				</p>
				<div className='flex flex-col sm:flex-row justify-center gap-4'>
					<BookMeetingDialog
						triggerText='Reservar llamada con Leandro'
						triggerSize='lg'
						source='servicio_mentorias_footer'
					/>
					<Button size='lg' variant='outline' asChild>
						<Link href='/contacto?servicio=mentorias'>Enviar consulta</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
