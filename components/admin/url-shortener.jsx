'use client';

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Clipboard, ExternalLink, RefreshCw, Trash2 } from 'lucide-react';
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDocs,
	orderBy,
	query,
	where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { db } from '@/lib/firebase';
import { useToast } from '@/components/ui/use-toast';

export default function UrlShortener() {
	const [longUrl, setLongUrl] = useState('');
	const [customSlug, setCustomSlug] = useState('');
	const [shortUrls, setShortUrls] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingUrls, setIsLoadingUrls] = useState(true);
	const { toast } = useToast();
	const baseUrl =
		typeof window !== 'undefined' ? `${window.location.origin}/go/` : '';

	// Cargar URLs existentes
	const loadShortUrls = async () => {
		setIsLoadingUrls(true);
		try {
			const urlsQuery = query(
				collection(db, 'shortUrls'),
				orderBy('createdAt', 'desc')
			);
			const querySnapshot = await getDocs(urlsQuery);
			const urls = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setShortUrls(urls);
		} catch (error) {
			console.error('Error al cargar URLs:', error);
			toast({
				title: 'Error',
				description: 'No se pudieron cargar las URLs acortadas',
				variant: 'destructive',
			});
		} finally {
			setIsLoadingUrls(false);
		}
	};

	useEffect(() => {
		loadShortUrls();
	}, []);

	// Generar slug aleatorio
	const generateRandomSlug = () => {
		const characters =
			'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let result = '';
		const length = 6;
		for (let i = 0; i < length; i++) {
			result += characters.charAt(
				Math.floor(Math.random() * characters.length)
			);
		}
		return result;
	};

	// Validar URL
	const isValidUrl = (url) => {
		try {
			new URL(url);
			return true;
		} catch (e) {
			return false;
		}
	};

	// Verificar si un slug ya existe
	const slugExists = async (slug) => {
		const q = query(collection(db, 'shortUrls'), where('slug', '==', slug));
		const querySnapshot = await getDocs(q);
		return !querySnapshot.empty;
	};

	// Crear URL corta
	const createShortUrl = async () => {
		if (!longUrl) {
			toast({
				title: 'Error',
				description: 'Por favor, ingresa una URL',
				variant: 'destructive',
			});
			return;
		}

		// Validar y formatear la URL
		let formattedUrl = longUrl.trim();
		if (!isValidUrl(formattedUrl)) {
			// Intentar añadir https:// si no tiene protocolo
			formattedUrl = 'https://' + formattedUrl;
			if (!isValidUrl(formattedUrl)) {
				toast({
					title: 'Error',
					description: 'Por favor, ingresa una URL válida',
					variant: 'destructive',
				});
				return;
			}
		}

		setIsLoading(true);
		try {
			let slug = customSlug.trim();

			// Si no hay slug personalizado, generar uno aleatorio
			if (!slug) {
				let isUnique = false;
				while (!isUnique) {
					slug = generateRandomSlug();
					isUnique = !(await slugExists(slug));
				}
			} else {
				// Verificar si el slug personalizado ya existe
				if (await slugExists(slug)) {
					toast({
						title: 'Error',
						description: 'Este slug ya está en uso. Por favor, elige otro.',
						variant: 'destructive',
					});
					setIsLoading(false);
					return;
				}
			}

			// Guardar en Firestore - Asegurarse de usar el campo longUrl con la URL formateada
			await addDoc(collection(db, 'shortUrls'), {
				longUrl: formattedUrl,
				slug: slug,
				createdAt: new Date().toISOString(),
				clicks: 0,
			});

			toast({
				title: '¡URL acortada!',
				description: `Tu URL corta es: ${baseUrl}${slug}`,
			});

			// Limpiar formulario y recargar lista
			setLongUrl('');
			setCustomSlug('');
			loadShortUrls();
		} catch (error) {
			console.error('Error al crear URL corta:', error);
			toast({
				title: 'Error',
				description: 'No se pudo crear la URL corta',
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	};

	// Copiar URL al portapapeles
	const copyToClipboard = (text) => {
		navigator.clipboard
			.writeText(text)
			.then(() => {
				toast({
					title: '¡Copiado!',
					description: 'URL copiada al portapapeles',
				});
			})
			.catch((err) => {
				console.error('Error al copiar:', err);
				toast({
					title: 'Error',
					description: 'No se pudo copiar la URL',
					variant: 'destructive',
				});
			});
	};

	// Eliminar URL corta
	const deleteShortUrl = async (id) => {
		if (confirm('¿Estás seguro de que deseas eliminar esta URL?')) {
			try {
				await deleteDoc(doc(db, 'shortUrls', id));
				toast({
					title: 'Eliminada',
					description: 'La URL corta ha sido eliminada',
				});
				loadShortUrls();
			} catch (error) {
				console.error('Error al eliminar URL:', error);
				toast({
					title: 'Error',
					description: 'No se pudo eliminar la URL',
					variant: 'destructive',
				});
			}
		}
	};

	return (
		<div className='space-y-6'>
			<Card>
				<CardHeader>
					<CardTitle>Acortador de URL</CardTitle>
					<CardDescription>
						Crea URLs cortas para compartir fácilmente
					</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='longUrl'>URL Original</Label>
						<Input
							id='longUrl'
							placeholder='https://ejemplo.com/pagina-con-url-muy-larga'
							value={longUrl}
							onChange={(e) => setLongUrl(e.target.value)}
						/>
					</div>
					<div className='space-y-2'>
						<Label htmlFor='customSlug'>Slug personalizado (opcional)</Label>
						<div className='flex items-center space-x-2'>
							<div className='text-sm text-muted-foreground'>{baseUrl}</div>
							<Input
								id='customSlug'
								placeholder='mi-slug'
								value={customSlug}
								onChange={(e) => setCustomSlug(e.target.value)}
							/>
						</div>
						<p className='text-xs text-muted-foreground'>
							Si lo dejas en blanco, se generará automáticamente
						</p>
					</div>
				</CardContent>
				<CardFooter>
					<Button
						onClick={createShortUrl}
						disabled={isLoading}
						className='w-full'
					>
						{isLoading ? (
							<>
								<RefreshCw className='mr-2 h-4 w-4 animate-spin' />
								Creando...
							</>
						) : (
							'Acortar URL'
						)}
					</Button>
				</CardFooter>
			</Card>

			<Card>
				<CardHeader className='flex flex-row items-center justify-between'>
					<div>
						<CardTitle>URLs Acortadas</CardTitle>
						<CardDescription>Gestiona tus URLs acortadas</CardDescription>
					</div>
					<Button
						variant='outline'
						size='sm'
						onClick={loadShortUrls}
						disabled={isLoadingUrls}
					>
						<RefreshCw
							className={`h-4 w-4 mr-2 ${isLoadingUrls ? 'animate-spin' : ''}`}
						/>
						Actualizar
					</Button>
				</CardHeader>
				<CardContent>
					{isLoadingUrls ? (
						<div className='flex justify-center py-6'>
							<RefreshCw className='h-6 w-6 animate-spin text-primary' />
						</div>
					) : shortUrls.length === 0 ? (
						<p className='text-center py-6 text-muted-foreground'>
							No hay URLs acortadas todavía
						</p>
					) : (
						<div className='space-y-4'>
							{shortUrls.map((url) => (
								<div
									key={url.id}
									className='flex flex-col space-y-2 p-4 border rounded-lg'
								>
									<div className='flex justify-between items-start'>
										<div className='space-y-1 overflow-hidden'>
											<p className='font-medium truncate' title={url.longUrl}>
												{url.longUrl}
											</p>
											<p className='text-sm text-primary font-medium'>
												{baseUrl}
												{url.slug}
											</p>
										</div>
										<div className='text-sm text-muted-foreground'>
											{url.clicks || 0} clics
										</div>
									</div>
									<div className='flex space-x-2'>
										<Button
											variant='outline'
											size='sm'
											onClick={() => copyToClipboard(`${baseUrl}${url.slug}`)}
										>
											<Clipboard className='h-4 w-4 mr-2' />
											Copiar
										</Button>
										<Button
											variant='outline'
											size='sm'
											onClick={() =>
												window.open(`${baseUrl}${url.slug}`, '_blank')
											}
										>
											<ExternalLink className='h-4 w-4 mr-2' />
											Abrir
										</Button>
										<Button
											variant='outline'
											size='sm'
											className='text-destructive hover:text-destructive'
											onClick={() => deleteShortUrl(url.id)}
										>
											<Trash2 className='h-4 w-4 mr-2' />
											Eliminar
										</Button>
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

