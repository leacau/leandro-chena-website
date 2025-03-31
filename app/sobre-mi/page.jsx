export const metadata = {
	title: 'Sobre Mí | Leandro Chena',
	description:
		'Conoce más sobre Leandro Chena, consultor comercial y capacitador con amplia experiencia en ventas y liderazgo.',
};

import { Card, CardContent } from '@/components/ui/card';

export default function SobreMiPage() {
	return (
		<div className='container mx-auto px-6 py-12 md:py-24'>
			<h1 className='text-4xl font-bold tracking-tight sm:text-5xl mb-6'>
				Sobre Mí
			</h1>
			<div className='bg-card rounded-lg shadow-lg overflow-hidden mb-16'>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-6 p-6'>
					{/* Columna izquierda para el texto */}
					<div className='md:col-span-2 space-y-6'>
						<p className='text-lg leading-relaxed'>
							¡Hola! Soy Leandro Chena, un apasionado por las ventas y el
							desarrollo de las personas.
						</p>
						<p className='text-lg leading-relaxed'>
							Desde hace años, me dedico a acompañar equipos comerciales,
							buscando siempre ayudarlos a alcanzar sus objetivos y superar sus
							propios límites. Me encanta entender cómo funcionan los procesos y
							encontrar formas de mejorarlos para que todos podamos crecer
							juntos.
						</p>
						<p className='text-lg leading-relaxed'>
							Creo en el aprendizaje constante y práctico, en meter las manos en
							la masa para aprender haciendo, porque es ahí donde se generan los
							verdaderos cambios. Mi enfoque está siempre en el otro, en su
							crecimiento y en construir relaciones que vayan más allá de la
							venta.
						</p>
						<p className='text-lg leading-relaxed'>
							Mi filosofía se basa en que el verdadero éxito en ventas y
							liderazgo proviene de construir relaciones auténticas, entender
							profundamente las necesidades del cliente y crear valor genuino en
							cada interacción.
						</p>
						<p className='text-lg leading-relaxed'>
							Cuando no estoy asesorando o capacitando, disfruto de la lectura,
							practicar deportes y pasar tiempo con mi familia. Creo firmemente
							que mantener un equilibrio entre la vida profesional y personal es
							esencial para el éxito sostenible.
						</p>
						<p className='text-lg leading-relaxed'>
							Si algo aprendí en todo este tiempo es que cada desafío es una
							oportunidad para mejorar, y eso es lo que intento transmitir en
							cada capacitación o charla que doy.
						</p>
						<p className='text-lg leading-relaxed'>
							Así que, si estás buscando a alguien que te acompañe a transformar
							tus ventas y tu equipo, estoy acá para vos. 😉
						</p>
					</div>

					{/* Columna derecha para la imagen */}
					<div className='md:col-span-1 flex justify-center md:justify-end h-100'>
						<div className='relative w-full max-w-md md:max-w-full'>
							<div className='aspect-[3/4] rounded-lg overflow-hidden shadow-xl h-full'>
								<img
									src='/images/about.webp'
									alt='Leandro Chena'
									className='w-full h-full object-cover'
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* <div className='bg-card rounded-xl shadow-md overflow-hidden mb-16'>
				<div className='md:flex'>
					<div className='md:flex-1 p-6 md:p-8 lg:p-10'>
						<div className='prose prose-lg dark:prose-invert max-w-none'>
							<p className='text-xl font-medium mb-6 text-black'>
								¡Hola! Soy Leandro Chena, un apasionado por las ventas y el
								desarrollo de las personas.
							</p>
							<p className='text-xl font-medium mb-6 text-black'>
								Desde hace años, me dedico a acompañar equipos comerciales,
								buscando siempre ayudarlos a alcanzar sus objetivos y superar
								sus propios límites. Me encanta entender cómo funcionan los
								procesos y encontrar formas de mejorarlos para que todos podamos
								crecer juntos.
							</p>

							<p className='text-xl font-medium mb-6 text-black'>
								Creo en el aprendizaje constante y práctico, en meter las manos
								en la masa para aprender haciendo, porque es ahí donde se
								generan los verdaderos cambios. Mi enfoque está siempre en el
								otro, en su crecimiento y en construir relaciones que vayan más
								allá de la venta.
							</p>

							<p className='text-xl font-medium mb-6 text-black'>
								Si algo aprendí en todo este tiempo es que cada desafío es una
								oportunidad para mejorar, y eso es lo que intento transmitir en
								cada capacitación o charla que doy.
							</p>

							<p className='text-xl font-medium mb-6 text-black'>
								Así que, si estás buscando a alguien que te acompañe a
								transformar tus ventas y tu equipo, estoy acá para vos. 😉
							</p>
						</div>
					</div>

					<div className='md:w-2/5 lg:w-1/3 relative'>
						<div className='h-full'>
							<img
								src='/images/about.webp'
								alt='Leandro Chena'
								className='h-full w-full object-cover'
							/>
						</div>
						<div className='absolute inset-0 bg-gradient-to-t from-black/30 to-transparent md:bg-gradient-to-r md:from-transparent md:to-transparent'></div>
					</div>
				</div>
			</div> */}

			{/* Sección de tarjetas informativas */}
			<div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-16'>
				<Card className='transform transition-all duration-300 hover:scale-105 hover:shadow-xl'>
					<CardContent className='p-6 text-center'>
						<div className='w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-8 w-8 text-primary'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M13 10V3L4 14h7v7l9-11h-7z'
								/>
							</svg>
						</div>
						<h3 className='text-xl font-bold mb-2'>Misión</h3>
						<p className='text-muted-foreground'>
							Potenciar el crecimiento de profesionales y empresas a través de
							estrategias efectivas y personalizadas que generen resultados
							excepcionales.
						</p>
					</CardContent>
				</Card>

				<Card className='transform transition-all duration-300 hover:scale-105 hover:shadow-xl animation'>
					<CardContent className='p-6 text-center'>
						<div className='w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-8 w-8 text-primary'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
								/>
							</svg>
						</div>
						<h3 className='text-xl font-bold mb-2'>Valores</h3>
						<p className='text-muted-foreground'>
							Integridad, excelencia, innovación, empatía y compromiso son los
							pilares que guían mi trabajo y relaciones profesionales.
						</p>
					</CardContent>
				</Card>

				<Card className='transform transition-all duration-300 hover:scale-105 hover:shadow-xl animation'>
					<CardContent className='p-6 text-center'>
						<div className='w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-8 w-8 text-primary'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
								/>
							</svg>
						</div>
						<h3 className='text-xl font-bold mb-2'>Enfoque</h3>
						<p className='text-muted-foreground'>
							Combino metodologías probadas con innovación constante para
							ofrecer soluciones adaptadas a las necesidades específicas de cada
							cliente.
						</p>
					</CardContent>
				</Card>
			</div>
			{/* <div className='mt-16 grid grid-cols-1 md:grid-cols-3 gap-8'>
				<div className='bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow'>
					<h3 className='text-xl font-bold mb-3'>Experiencia</h3>
					<p>
						Más de 15 años liderando equipos comerciales, potenciando las
						habilidades de las personas para transformar acciones en objetivos
						cumplidos.
					</p>
				</div>

				<div className='bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow'>
					<h3 className='text-xl font-bold mb-3'>Enfoque</h3>
					<p>
						Capacitaciones prácticas basadas en experiencia real. Metodologías
						aplicables de inmediato para mejorar resultados comerciales.
					</p>
				</div>

				<div className='bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow'>
					<h3 className='text-xl font-bold mb-3'>Valores</h3>
					<p>
						Empatía, sinceridad y respeto. Creo en la formación que transforma y
						en el aprendizaje que se traduce en acción.
					</p>
				</div>
			</div> */}
		</div>
	);
}

