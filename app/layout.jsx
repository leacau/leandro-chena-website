import './globals.css';
import './globals.css';

import Footer from '@/components/footer';
import { Inter } from 'next/font/google';
import Navbar from '@/components/navbar';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
	title: 'Leandro Chena | Consultor Comercial & Capacitador',
	description:
		'Experto en ventas, consultoría comercial y capacitación de equipos de ventas. Descubre cómo puedo ayudarte a potenciar tu negocio.',
	icons: {
		icon: [
			{ url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' }, // Ícono clásico
			{ url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' }, // Navegadores modernos
			{ url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
			{
				url: '/favicon-192x192.png',
				sizes: '192x192',
				type: 'image/png',
			}, // Android
			{
				url: '/favicon-512x512.png',
				sizes: '512x512',
				type: 'image/png',
			}, // Android
		],
		apple: '/apple-touch-icon.png', // Icono para dispositivos Apple
		shortcut: '/favicon.ico', // Favicon de acceso directo
	},
	manifest: '/site.webmanifest', // Web App Manifest para PWA
};

export default function RootLayout({ children }) {
	return (
		<html lang='es' suppressHydrationWarning>
			<body className={inter.className}>
				{/* <!-- Google tag (gtag.js) --> */}
				<script
					async
					src='https://www.googletagmanager.com/gtag/js?id=G-P05LJZCZVB'
				></script>
				<script>
					window.dataLayer = window.dataLayer || []; function gtag()
					{dataLayer.push(arguments)}
					gtag('js', new Date()); gtag('config', 'G-P05LJZCZVB');
				</script>

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
				</ThemeProvider>
			</body>
		</html>
	);
}

