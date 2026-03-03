import Hero from '@/components/hero';
import AboutPreview from '@/components/about-preview';
import Services from '@/components/services';
import UpcomingEvents from '@/components/upcoming-events';
import LeadMagnet from '@/components/lead-magnet';
import LatestPosts from '@/components/latest-posts';
import Testimonials from '@/components/testimonials';
import ContactForm from '@/components/contact-form';
import CallToAction from '@/components/call-to-action';
import WhatsAppButton from "@/components/whatsapp-button"


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
					<div>
						<ContactForm />
					</div>
				</div>
			</section>

			<CallToAction />
			<WhatsAppButton />
		</div>
	);
}
