import AboutPreview from '@/components/about-preview';
import CallToAction from '@/components/call-to-action';
import ContactForm from '@/components/contact-form';
import Hero from '@/components/hero';
import LatestPosts from '@/components/latest-posts';
import LeadMagnet from '@/components/lead-magnet';
import Services from '@/components/services';
import Testimonials from '@/components/testimonials';
import UpcomingEvents from '@/components/upcoming-events';

export default function Home() {
	return (
		<div className='flex flex-col gap-16 pb-16'>
			<Hero />
			<AboutPreview />
			<Services />
			{/*<Testimonials />*/}

			<UpcomingEvents />
			<LeadMagnet />
			<LatestPosts />

			<section className='bg-muted/40 py-16'>
				<div className='mx-auto max-w-7xl px-6 lg:px-8'>
					<h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>
						Contactame
					</h2>
					<p className='mt-6 text-lg leading-8 text-muted-foreground mb-12'>
						¿Tenés alguna pregunta o te interesan mis servicios? Completá el
						formulario y estaremos en contacto a la brevedad.
					</p>
					<section className='"bg-primary/5 py-16 border-y border-primary/10"'>
						<ContactForm />
					</section>
				</div>
			</section>

			<CallToAction />
		</div>
	);
}
