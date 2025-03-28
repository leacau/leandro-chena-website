'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';

export default function Footer() {
	const { theme } = useTheme();
	const logoSrc =
		theme === 'dark' ? '/images/logo-white.png' : '/images/logo.png';

	return (
		<footer className='bg-gray-50 dark:bg-gray-900 w-full overflow-hidden'>
			<div className='container mx-auto px-6 py-12'>
				<div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
					<div className='md:col-span-1'>
						<Link href='/'>
							<Image
								src={logoSrc || '/placeholder.svg'}
								alt='Leandro Chena'
								width={150}
								height={40}
								className='h-8 w-auto mb-4 object-contain'
							/>
						</Link>
						<p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>
							Consultor comercial y capacitador especializado en transformar
							equipos de ventas y desarrollar líderes.
						</p>
					</div>

					<div>
						<h3 className='text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4'>
							Servicios
						</h3>
						<ul className='space-y-2'>
							<li>
								<Link
									href='/servicios/capacitaciones'
									className='text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary'
								>
									Capacitaciones
								</Link>
							</li>
							<li>
								<Link
									href='/servicios/consultoria'
									className='text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary'
								>
									Consultoría
								</Link>
							</li>
							<li>
								<Link
									href='/servicios/charlas'
									className='text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary'
								>
									Charlas Motivacionales
								</Link>
							</li>
							<li>
								<Link
									href='/servicios/mentorias'
									className='text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary'
								>
									Mentorías 1:1
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h3 className='text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4'>
							Recursos
						</h3>
						<ul className='space-y-2'>
							<li>
								<Link
									href='/blog'
									className='text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary'
								>
									Blog
								</Link>
							</li>
							<li>
								<Link
									href='/recursos'
									className='text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary'
								>
									Recursos Gratuitos
								</Link>
							</li>
							<li>
								<Link
									href='/eventos'
									className='text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary'
								>
									Eventos
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h3 className='text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4'>
							Contacto
						</h3>
						<ul className='space-y-2'>
							<li>
								<Link
									href='/contacto'
									className='text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary'
								>
									Contacto
								</Link>
							</li>
							<li>
								<a
									href='https://www.linkedin.com/in/leandro-chena/'
									target='_blank'
									rel='noopener noreferrer'
									className='text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary'
								>
									LinkedIn
								</a>
							</li>
							<li>
								<a
									href='https://www.instagram.com/leandro.chena/'
									target='_blank'
									rel='noopener noreferrer'
									className='text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary'
								>
									Instagram
								</a>
							</li>
						</ul>
					</div>
				</div>

				<div className='mt-8 pt-8 border-t border-gray-200 dark:border-gray-800'>
					<p className='text-sm text-gray-500 dark:text-gray-400 text-center'>
						&copy; {new Date().getFullYear()} Leandro Chena. Todos los derechos
						reservados.
					</p>
				</div>
			</div>
		</footer>
	);
}

