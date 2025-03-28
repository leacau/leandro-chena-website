import { AuthProvider } from '@/lib/auth-context';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
	title: 'Panel de Administración | Leandro Chena',
	description:
		'Panel de administración para gestionar el contenido del sitio web.',
};

export default function AdminLayout({ children }) {
	return (
		<div className={inter.className}>
			<ThemeProvider
				attribute='class'
				defaultTheme='light'
				enableSystem
				disableTransitionOnChange
			>
				<AuthProvider>
					<div className='flex min-h-screen flex-col'>{children}</div>
				</AuthProvider>
			</ThemeProvider>
		</div>
	);
}

