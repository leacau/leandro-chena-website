import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import BookMeetingDialog from '@/components/book-meeting-dialog';

export const metadata: Metadata = {
	title: 'Charlas Motivacionales | Leandro Chena',
	description:
		'Inspiración y liderazgo para potenciar equipos y transformar resultados.',
};

export default function CharlasPage() {
	return (
		<div className='container mx-auto px-6 py-12 md:py-24'>
			<div className='grid lg:grid-cols-2 gap-12 items-center mb-16'>
				<div>
					<h1 className='text-4xl font-bold tracking-tight sm:text-5xl mb-6'>
						Charlas Motivacionales y Conferencias
					</h1>
					<p className='text-xl text-muted-foreground mb-6'>
						Inspiración y liderazgo para potenciar equipos y transformar resultados.
					</p>
					<p className='text-muted-foreground mb-8'>
						Las conferencias están diseñadas para impactar, inspirar y generar un
						cambio positivo en la mentalidad y desempeño de las personas. A través
						de experiencias reales, reflexiones profundas y herramientas prácticas,
						ayudamos a fortalecer el liderazgo, la resiliencia y el trabajo en equipo.
					</p>
					<div className='flex flex-col sm:flex-row gap-4'>
						<BookMeetingDialog
							triggerText='Agendar llamada para consultar fechas'
							triggerSize='lg'
							source='servicio_charlas_hero'
						/>
						<Button size='lg' variant='outline' asChild>
							<Link href='/contacto?servicio=charlas'>
								Consultar por formulario
							</Link>
						</Button>
					</div>
				</div>
				<div className='relative h-[400px] rounded-lg overflow-hidden shadow-lg border'>
					<Image
						src='/placeholder.svg?height=400&width=600'
						alt='Charlas Motivacionales'
						fill
						className='object-cover'
					/>
				</div>
			</div>

			<div className='mb-16'>
				<h2 className='text-3xl font-bold mb-6'>Temáticas clave</h2>
				<div className='grid md:grid-cols-2 lg:grid-cols-2 gap-8'>
					<div className='border rounded-xl p-6 bg-card'>
						<h3 className='text-xl font-bold mb-3'>Liderazgo Sensible</h3>
						<p className='text-muted-foreground'>
							Cómo liderar con empatía, conexión y propósito para lograr equipos más
							comprometidos y productivos.
						</p>
					</div>
					<div className='border rounded-xl p-6 bg-card'>
						<h3 className='text-xl font-bold mb-3'>Motivación y Alto Rendimiento</h3>
						<p className='text-muted-foreground'>
							Estrategias para potenciar la automotivación, superar desafíos y
							alcanzar resultados extraordinarios.
						</p>
					</div>
					<div className='border rounded-xl p-6 bg-card'>
						<h3 className='text-xl font-bold mb-3'>Gestión del Cambio y Resiliencia</h3>
						<p className='text-muted-foreground'>
							Cómo adaptarse a los cambios del mercado y transformar los momentos de
							incertidumbre en oportunidades.
						</p>
					</div>
					<div className='border rounded-xl p-6 bg-card'>
						<h3 className='text-xl font-bold mb-3'>Trabajo en Equipo y Comunicación</h3>
						<p className='text-muted-foreground'>
							Claves para fortalecer la colaboración, la confianza mutua y la
							sinergia entre diferentes áreas de la organización.
						</p>
					</div>
				</div>
			</div>

			<div className='bg-muted/40 p-8 md:p-12 rounded-2xl border mb-16'>
				<h2 className='text-3xl font-bold mb-6'>¿Por qué elegir mis charlas?</h2>
				<div className='grid md:grid-cols-3 gap-8'>
					<div className='p-4 border rounded-xl bg-background'>
						<h3 className='text-xl font-bold mb-3'>Enfoque dinámico</h3>
						<p className='text-muted-foreground'>
							Contenidos prácticos y aplicables a la vida cotidiana corporativa.
						</p>
					</div>
					<div className='p-4 border rounded-xl bg-background'>
						<h3 className='text-xl font-bold mb-3'>Inspiración con impacto</h3>
						<p className='text-muted-foreground'>
							Historias reales y herramientas directas que despiertan acción inmediata.
						</p>
					</div>
					<div className='p-4 border rounded-xl bg-background'>
						<h3 className='text-xl font-bold mb-3'>Adaptadas a tu evento</h3>
						<p className='text-muted-foreground'>
							Alineación previa con los organizadores para responder al objetivo de la jornada.
						</p>
					</div>
				</div>
			</div>

			<div className='text-center bg-primary/5 py-16 px-6 rounded-2xl border border-primary/10 max-w-4xl mx-auto'>
				<h2 className='text-3xl font-bold mb-4'>Llevá inspiración a tu próximo evento</h2>
				<p className='text-lg text-muted-foreground max-w-2xl mx-auto mb-8'>
					Escribime o agendá una llamada corta para conversar sobre tu evento, fechas y audiencia.
				</p>
				<div className='flex flex-col sm:flex-row justify-center gap-4'>
					<BookMeetingDialog
						triggerText='Agendar conversación (15 min)'
						triggerSize='lg'
						source='servicio_charlas_footer'
					/>
					<Button size='lg' variant='outline' asChild>
						<Link href='/contacto?servicio=charlas'>Enviar consulta</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
