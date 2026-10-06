import AboutPreview from '@/components/about-preview';
import CallToAction from '@/components/call-to-action';
import CommercialDiagnosticQuiz from '@/components/commercial-diagnostic-quiz';
import Hero from '@/components/hero';
import LatestPosts from '@/components/latest-posts';
import LeadMagnet from '@/components/lead-magnet';
import Services from '@/components/services';
import UpcomingEvents from '@/components/upcoming-events';

export default function Home() {
	return (
		<div className='flex flex-col gap-16 pb-16'>
			<Hero />
			<AboutPreview />
			<Services />
			{/*<Testimonials />*/}

			<UpcomingEvents />

			{/* Sección Diagnosticador Comercial Interactivo */}
			<section className='bg-gradient-to-b from-primary/5 via-primary/10 to-transparent py-16 px-6 lg:px-8 border-y border-primary/15'>
				<div className='mx-auto max-w-7xl text-center mb-10'>
					<span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/15 text-primary mb-3'>
						Evaluación Comercial Rápida
					</span>
					<h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>
						¿Cuál es tu situación comercial?
					</h2>
					<p className='mt-4 text-lg text-muted-foreground max-w-2xl mx-auto'>
						Respondé 3 preguntas breves para analizar tu caso y evaluar juntos qué alternativa tiene más sentido para vos o tu equipo.
					</p>
				</div>
				<CommercialDiagnosticQuiz />
			</section>

			<LeadMagnet />
			<LatestPosts />
			<CallToAction />
		</div>
	);
}
