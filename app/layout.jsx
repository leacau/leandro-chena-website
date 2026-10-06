import './globals.css';

import Footer from '@/components/footer';
import { Inter } from 'next/font/google';
import Navbar from '@/components/navbar';
import Script from 'next/script';
import SiteConfigProvider from '@/components/site-config-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from "@/components/ui/toaster";
import WhatsAppButton from '@/components/whatsapp-button';
import AnalyticsTracker from '@/components/analytics-tracker';
import { GTM_ID } from '@/lib/tracking-constants';

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
			<head>
				{/* Google Tag Manager (Snippet oficial en head) */}
				<Script
					id='google-tag-manager'
					strategy='afterInteractive'
					dangerouslySetInnerHTML={{
						__html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
					}}
				/>
			</head>
			<body className={inter.className}>
				{/* Google Tag Manager (noscript fallback oficial) */}
				<noscript>
					<iframe
						src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
						height='0'
						width='0'
						style={{ display: 'none', visibility: 'hidden' }}
					/>
				</noscript>

				<ThemeProvider
					attribute='class'
					defaultTheme='light'
					enableSystem
					disableTransitionOnChange
				>
					<SiteConfigProvider>
						<AnalyticsTracker />
						<div className='flex min-h-screen flex-col overflow-x-hidden w-full'>
							<Navbar />
							<main className='flex-1 w-full'>{children}</main>
							<Footer />
						</div>
						<WhatsAppButton />
						{/* Componente que permite mostrar los carteles de éxito/error */}
						<Toaster />
					</SiteConfigProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
