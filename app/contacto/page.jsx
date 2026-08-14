import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';

import ContactForm from '@/components/contact-form';

export const metadata = {
	title: 'Contacto | Leandro Chena',
	description:
		'Ponete en contacto con Leandro Chena para consultas, servicios o colaboraciones.',
};

export default function ContactoPage() {
	return (
		<div className='container mx-auto px-6 py-12 md:py-24'>
			<h1 className='text-4xl font-bold tracking-tight sm:text-5xl mb-6'>
				Contacto
			</h1>
			<p className='text-xl text-muted-foreground mb-12 max-w-3xl'>
				¿Tenés alguna pregunta o te interesan mis servicios? Completá el
				formulario y estaremos en contacto a la brevedad.
			</p>

			<div className='grid md:grid-cols-3 gap-12'>
				<div className='md:col-span-2'>
					<ContactForm />
				</div>

				<div className='space-y-8'>
					<div>
						<h2 className='text-xl font-bold mb-4'>Información de contacto</h2>
						<ul className='space-y-4'>
							<li className='flex items-start gap-3'>
								<MapPin className='h-5 w-5 text-primary mt-0.5' />
								<div>
									<p className='font-medium'>Ubicación</p>
									<p className='text-muted-foreground'>Santa Fe, Argentina</p>
								</div>
							</li>
							<li className='flex items-start gap-3'>
								<Mail className='h-5 w-5 text-primary mt-0.5' />
								<div>
									<p className='font-medium'>Email</p>
									<p className='text-muted-foreground'>
										consultas@leandrochena.com
									</p>
								</div>
							</li>
							<li className='flex items-start gap-3'>
								<MessageCircle className='h-5 w-5 text-primary mt-0.5' />
								<a
									href='https://api.whatsapp.com/send?phone=5493424790708&text=Hola%20Leandro%2C%20tengo%20una%20consulta.'
									target='_blank'
									rel='noopener noreferrer'
									className='hover:text-foreground'
								>
									<div>
										<p className='font-medium'>Whatsapp</p>
										<p className='text-muted-foreground'>+54 342 4790708</p>
									</div>
								</a>
							</li>
						</ul>
					</div>

					<div>
						<h2 className='text-xl font-bold mb-4'>Horario de atención</h2>
						<p className='text-muted-foreground'>
							Lunes a Viernes: 8:00 - 17:00
						</p>
					</div>

					<div>
						<h2 className='text-xl font-bold mb-4'>
							Seguime en redes sociales
						</h2>
						<div className='flex space-x-4'>
							<a
								href='https://www.linkedin.com/in/leandro-chena/'
								className='text-muted-foreground hover:text-foreground'
							>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									width='24'
									height='24'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
									className='lucide lucide-linkedin'
								>
									<path d='M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z' />
									<rect width='4' height='12' x='2' y='9' />
									<circle cx='4' cy='4' r='2' />
								</svg>
							</a>
							<a
								href='https://www.instagram.com/leandrochena/'
								className='text-muted-foreground hover:text-foreground'
							>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									width='24'
									height='24'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
									className='lucide lucide-instagram'
								>
									<rect width='20' height='20' x='2' y='2' rx='5' ry='5' />
									<path d='M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z' />
									<line x1='17.5' x2='17.51' y1='6.5' y2='6.5' />
								</svg>
							</a>
							<a
								href='https://www.facebook.com/people/Leandro-Chena/100071083136084/'
								className='text-muted-foreground hover:text-foreground'
							>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									width='24'
									height='24'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
									className='lucide lucide-facebook'
								>
									<path d='M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' />
								</svg>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

