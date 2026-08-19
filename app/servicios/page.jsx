import { Building, Presentation, UserPlus, Users } from 'lucide-react';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata = {
	title: 'Servicios | Leandro Chena',
	description:
		'Descubre los servicios de consultoría, capacitación y mentorías que ofrece Leandro Chena para potenciar tu negocio.',
};

const services = [
	{
		title: 'Capacitaciones para Equipos Comerciales',
		description:
			'Programas personalizados para potenciar las habilidades de venta y negociación de tu equipo.',
		icon: Users,
		href: '/servicios/capacitaciones',
		longDescription:
			'Desarrollo de habilidades comerciales, técnicas de venta consultiva, manejo de objeciones, cierre de ventas y más. Programas adaptados a las necesidades específicas de tu equipo y sector.',
	},
	{
		title: 'Consultoría para Empresas',
		description:
			'Análisis y optimización de procesos comerciales para incrementar la efectividad y los resultados de ventas.',
		icon: Building,
		href: '/servicios/consultoria',
		longDescription:
			'Diagnóstico de la situación actual, identificación de oportunidades de mejora, diseño e implementación de estrategias comerciales, seguimiento y medición de resultados.',
	},
	{
		title: 'Charlas Motivacionales',
		description:
			'Conferencias inspiradoras sobre liderazgo sensible, motivación y desarrollo de equipos de alto rendimiento.',
		icon: Presentation,
		href: '/servicios/charlas',
		longDescription:
			'Charlas dinámicas y participativas sobre liderazgo, trabajo en equipo, resiliencia, gestión del cambio y otros temas clave para el desarrollo personal y profesional.',
	},
	{
		title: 'Mentorías 1:1',
		description:
			'Acompañamiento personalizado para líderes y profesionales que buscan potenciar su desarrollo comercial.',
		icon: UserPlus,
		href: '/servicios/mentorias',
		longDescription:
			'Sesiones individuales de acompañamiento para directivos, gerentes comerciales y vendedores que buscan mejorar sus habilidades y resultados a través de un plan personalizado.',
	},
];

export default function ServiciosPage() {
	return (
		<div className='container mx-auto px-6 py-12 md:py-24'>
			<h1 className='text-4xl font-bold tracking-tight sm:text-5xl mb-6'>
				Servicios
			</h1>
			<p className='text-xl text-muted-foreground mb-12 max-w-3xl'>
				Soluciones personalizadas para potenciar tu negocio y equipo comercial.
				Cada servicio está diseñado para adaptarse a las necesidades específicas
				de tu organización.
			</p>

			<div className='grid gap-8 md:grid-cols-2'>
				{services.map((service) => (
					<Card key={service.title} className='flex flex-col h-full'>
						<CardHeader>
							<div className='mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10'>
								<service.icon className='h-6 w-6 text-primary' />
							</div>
							<CardTitle>{service.title}</CardTitle>
							<CardDescription>{service.description}</CardDescription>
						</CardHeader>
						<CardContent>
							<p>{service.longDescription}</p>
						</CardContent>
						<CardFooter className='mt-auto pt-4'>
							<Button variant='outline' asChild className='w-full'>
								<Link href={service.href}>Conocé más</Link>
							</Button>
						</CardFooter>
					</Card>
				))}
			</div>

			<div className='mt-16 text-center'>
				<h2 className='text-2xl font-bold mb-4'>
					¿No estás seguro de qué servicio necesitás?
				</h2>
				<p className='text-muted-foreground mb-6 max-w-2xl mx-auto'>
					Agendá una consulta gratuita para analizar tu situación y recomendarte
					la mejor solución para tus necesidades.
				</p>
				<Button
					asChild
					size='lg'
					className='w-full max-w-2xl mx-auto py-3'
				>
					<Link href='/contacto'>Agendar consulta gratuita</Link>
				</Button>
			</div>
		</div>
	);
}

