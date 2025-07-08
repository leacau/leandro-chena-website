'use client';

import { Download, ExternalLink, Home } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

// Extensiones de archivo comunes para descargas
const DOWNLOAD_EXTENSIONS = [
	'.pdf',
	'.doc',
	'.docx',
	'.xls',
	'.xlsx',
	'.ppt',
	'.pptx',
	'.zip',
	'.rar',
	'.7z',
	'.tar',
	'.gz',
	'.mp3',
	'.mp4',
	'.avi',
	'.mov',
	'.jpg',
	'.jpeg',
	'.png',
	'.gif',
	'.exe',
	'.dmg',
	'.apk',
	'.csv',
	'.txt',
];

// Función para verificar si una URL es probablemente una descarga
function isDownloadUrl(url) {
	if (!url) return false;

	// Verificar extensiones de archivo comunes
	const lowercaseUrl = url.toLowerCase();
	return (
		DOWNLOAD_EXTENSIONS.some((ext) => lowercaseUrl.endsWith(ext)) ||
		lowercaseUrl.includes('download') ||
		lowercaseUrl.includes('attachment') ||
		lowercaseUrl.includes('file=')
	);
}

export default function ClientRedirect({ url }) {
	const router = useRouter();
	const [isDownload, setIsDownload] = useState(false);
	const [downloadStarted, setDownloadStarted] = useState(false);
	const [countdown, setCountdown] = useState(15);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!url) {
			router.push('/');
			return;
		}

		// Determinar si es una URL de descarga
		const downloadUrl = isDownloadUrl(url);
		setIsDownload(downloadUrl);

		// Agregar un temporizador para redirigir si tarda demasiado
		const loadingTimeout = setTimeout(() => {
			if (isLoading && !downloadUrl) {
				router.push('/');
			}
		}, 3000);

		// Para URLs normales, redirigir inmediatamente
		if (!downloadUrl) {
			window.location.href = url;

			// Como respaldo, usar el router de Next.js después de un breve retraso
			const routerTimeout = setTimeout(() => {
				router.push(url);
			}, 1000);

			return () => {
				clearTimeout(loadingTimeout);
				clearTimeout(routerTimeout);
			};
		} else {
			// Para URLs de descarga, iniciar la descarga pero permanecer en la página
			const link = document.createElement('a');
			link.href = url;
			link.target = '_blank';
			link.rel = 'noopener noreferrer';
			link.click();

			setDownloadStarted(true);
			setIsLoading(false);

			// Iniciar cuenta regresiva para volver a la página principal
			const interval = setInterval(() => {
				setCountdown((prev) => {
					if (prev <= 1) {
						clearInterval(interval);
						router.push('/');
						return 0;
					}
					return prev - 1;
				});
			}, 1000);

			return () => {
				clearTimeout(loadingTimeout);
				clearInterval(interval);
			};
		}
	}, [url, router]);

	// Si es una descarga, mostrar un mensaje diferente
	if (isDownload && downloadStarted) {
		return (
			<div className='flex flex-col items-center justify-center min-h-screen p-4 text-center'>
				<div className='max-w-md mx-auto'>
					<Download className='h-16 w-16 text-primary mx-auto mb-4' />
					<h1 className='text-2xl font-bold mb-2'>Descarga iniciada</h1>
					<p className='text-muted-foreground mb-6'>
						Tu descarga debería comenzar automáticamente. Si no es así, puedes
						intentar
						<a
							href={url}
							className='text-primary hover:underline mx-1'
							target='_blank'
							rel='noopener noreferrer'
						>
							descargar directamente
						</a>
						o revisar la configuración de tu navegador.
					</p>

					<div className='flex flex-col sm:flex-row gap-3 justify-center mt-4'>
						<Button
							onClick={() => router.push('/')}
							className='flex items-center gap-2'
						>
							<Home className='h-4 w-4' />
							Volver al inicio
						</Button>

						<Button
							variant='outline'
							onClick={() => window.open(url, '_blank')}
							className='flex items-center gap-2'
						>
							<ExternalLink className='h-4 w-4' />
							Abrir en nueva pestaña
						</Button>
					</div>

					<p className='text-sm text-muted-foreground mt-6'>
						Volverás a la página principal en {countdown} segundos...
					</p>
				</div>
			</div>
		);
	}

	// Para URLs normales o mientras se procesa la descarga
	return (
		<div className='flex flex-col items-center justify-center min-h-screen p-4'>
			<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4'></div>
			<h1 className='text-2xl font-bold mb-2'>Redirigiendo...</h1>
			<p className='text-muted-foreground mb-4'>
				Serás redirigido automáticamente
			</p>
			{url && (
				<p className='text-sm text-muted-foreground'>
					Si no eres redirigido automáticamente,
					<a href={url} className='text-primary hover:underline ml-1'>
						haz clic aquí
					</a>
				</p>
			)}
		</div>
	);
}
