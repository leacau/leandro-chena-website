'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function WhatsAppButton() {
	const pathname = usePathname();
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		// Solo mostrar en la página de inicio
		setIsVisible(pathname === '/');
	}, [pathname]);

	if (!isVisible) return null;

	return (
		<Link
			href='https://api.whatsapp.com/send?phone=5493424790708&text=Hola%20Leandro%2C%20tengo%20una%20consulta.'
			target='_blank'
			rel='noopener noreferrer'
			className='fixed bottom-10 right-10 z-50 flex items-center justify-center w-16 h-16 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110'
			aria-label='Contactar por WhatsApp'
		>
			<MessageCircle className='h-8 w-8' />
			<span className='sr-only'>Contactar por WhatsApp</span>
		</Link>
	);
}

