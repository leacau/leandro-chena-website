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
			<div className='prose prose-lg dark:prose-invert max-w-none'>
				<p className='pl-20'>
					Soy Leandro, un apasionado de las ventas y del desarrollo de las
					personas. Creo en el aprendizaje continuo, en la importancia de la
					experiencia real y en la capacidad de cada persona para superarse.
				</p>
				<p className='pl-20'>
					Mi camino en este mundo comenzó casi por casualidad, cuando mi trabajo
					me llevó a relacionarme con vendedores. Con el tiempo, me tocó
					capacitarlos, y más tarde me ofrecieron el desafío de liderarlos. Ahí
					descubrí mi verdadera vocación: ayudar a otros a crecer y mejorar en
					el apasionante arte de vender.
				</p>
				<p className='pl-20'>
					A lo largo de mi carrera, he trabajado con equipos de distintos
					sectores, formando vendedores, supervisores y líderes comerciales. Mi
					diferencial no está en la teoría, sino en hablar desde la experiencia
					vívida, en entender los desafíos reales y en diseñar metodologías
					prácticas, aplicables y aterrizadas a la realidad de cada negocio.
				</p>
				<p className='pl-20'>
					Me guían la humanidad, la sinceridad y el respeto. Creo en la
					formación que transforma, en el aprendizaje que se traduce en acción y
					en el impacto real que una buena capacitación puede generar en una
					persona, un equipo y un negocio.
				</p>
				<p className='pl-20'>
					Si llegaste hasta acá, te invito a explorar la página. Quizás
					encuentres algo que te ayude a dar el siguiente paso en tu camino.
				</p>
			</div>
		</div>
	);
}

