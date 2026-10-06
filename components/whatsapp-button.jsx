'use client';

import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { trackEvent } from '@/lib/tracking';

export default function WhatsAppButton() {
	const pathname = usePathname();

	// Mensajes contextuales según la página en la que se encuentre el visitante
	const getContextualMessage = () => {
		if (pathname === '/servicios/consultoria') {
			return 'Hola Leandro, estuve viendo la sección de Consultoría para Empresas y me gustaría recibir más detalles.';
		}
		if (pathname === '/servicios/capacitaciones') {
			return 'Hola Leandro, me interesa conocer más sobre las Capacitaciones para Equipos Comerciales.';
		}
		if (pathname === '/servicios/charlas') {
			return 'Hola Leandro, me gustaría consultar disponibilidad y temáticas para Charlas Motivacionales.';
		}
		if (pathname === '/servicios/mentorias') {
			return 'Hola Leandro, quisiera consultar por las sesiones de Mentoría 1:1.';
		}
		if (pathname.startsWith('/servicios')) {
			return 'Hola Leandro, estuve viendo tus servicios comerciales y tengo una consulta.';
		}
		if (pathname.startsWith('/eventos')) {
			return 'Hola Leandro, te escribo para consultar por los próximos eventos y masterclasses.';
		}
		if (pathname.startsWith('/recursos') || pathname.startsWith('/descargar')) {
			return 'Hola Leandro, descargué material de tu web y me gustaría hacerte una consulta.';
		}
		if (pathname === '/contacto') {
			return 'Hola Leandro, estuve en tu formulario de contacto y prefiero consultarte directo por WhatsApp.';
		}
		return 'Hola Leandro, tengo una consulta sobre tus servicios comerciales.';
	};

	const message = getContextualMessage();
	const whatsappUrl = `https://api.whatsapp.com/send?phone=5493424790708&text=${encodeURIComponent(
		message
	)}`;

	const handleClick = () => {
		trackEvent('whatsapp_click', {
			page_path: pathname,
			context_message: message,
		});
	};

	return (
		<a
			href={whatsappUrl}
			target='_blank'
			rel='noopener noreferrer'
			onClick={handleClick}
			className='fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-50 flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-green-500 text-white shadow-xl hover:bg-green-600 transition-all duration-300 hover:scale-110 group'
			aria-label='Contactar por WhatsApp'
		>
			<MessageCircle className='h-7 w-7 sm:h-8 sm:w-8' />
			<span className='sr-only'>Contactar por WhatsApp</span>
		</a>
	);
}
