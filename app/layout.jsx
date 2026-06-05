import './globals.css';

import Footer from '@/components/footer';
import { Inter } from 'next/font/google';
import Navbar from '@/components/navbar';
import Script from 'next/script';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from "@/components/ui/toaster"; // Importación necesaria para los mensajes

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
	title: 'Leandro Chena | Consultor Comercial & Capacitador',
	description:
		'Experto en ventas, consultoría comercial y capacitación de equipos de ventas. Descubre cómo puedo ayudarte a potenciar tu negocio.',
	icons: {
		icon: [
			{ url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
			{ url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
			{ url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
			{
				url: '/favicon-192x192.png',
				sizes: '192x192',
				type: 'image/png',
			},
			{
				url: '/favicon-512x512.png',
				sizes: '512x512',
				type: 'image/png',
			},
		],
		apple: '/apple-touch-icon.png',
		shortcut: '/favicon.ico',
	},
	manifest: '/site.webmanifest',
};

export default function RootLayout({ children }) {
	return (
		<html lang='es' suppressHydrationWarning>
			<body className={inter.className}>
				{/* Google Tag Manager */}
				<Script
					async
					src='https://www.googletagmanager.com/gtag/js?id=G-P05LJZCZVB'
					strategy='afterInteractive'
				/>
				<Script id='google-analytics' strategy='afterInteractive'>
					{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){ dataLayer.push(arguments); }
          gtag('js', new Date());
          gtag('config', 'G-P05LJZCZVB');
        `}
				</Script>

				<ThemeProvider
					attribute='class'
					defaultTheme='light'
					enableSystem
					disableTransitionOnChange
				>
					<div className='flex min-h-screen flex-col overflow-x-hidden w-full'>
						<Navbar />
						<main className='flex-1 w-full'>{children}</main>
						<Footer />
					</div>
					{/* Componente que permite mostrar los carteles de éxito/error */}
					<Toaster /> 
				</ThemeProvider>
			</body>
		</html>
	);
}
