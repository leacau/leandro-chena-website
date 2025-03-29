export const metadata = {
	title: 'Sobre Mí | Leandro Chena',
	description:
		'Conoce más sobre Leandro Chena, consultor comercial y capacitador con amplia experiencia en ventas y liderazgo.',
};

export default function SobreMiPage() {
	return (
		<div className='container mx-auto px-6 py-12 md:py-24'>
			<h1 className='text-4xl font-bold tracking-tight sm:text-5xl mb-6'>
				Sobre Mí
			</h1>

			<div className='bg-card rounded-xl shadow-md overflow-hidden'>
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
			</div>

			<div className='mt-16 grid grid-cols-1 md:grid-cols-3 gap-8'>
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
			</div>
		</div>
	);
}

