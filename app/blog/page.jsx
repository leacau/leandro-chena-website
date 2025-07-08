'use client';

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function BlogPage() {
	const [posts, setPosts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	const convertTimestamp = (timestamp) => {
		const meses = [
			'Enero',
			'Febrero',
			'Marzo',
			'Abril',
			'Mayo',
			'Junio',
			'Julio',
			'Agosto',
			'Septiembre',
			'Octubre',
			'Noviembre',
			'Diciembre',
		];
		let date = timestamp.toDate();
		let mm = meses[date.getMonth()];
		let dd = date.getDate();
		let yyyy = date.getFullYear();

		date = dd + ' de ' + mm + ' de ' + yyyy;

		return date;
	};

	useEffect(() => {
		const loadPosts = async () => {
			try {
				setIsLoading(true);
				setError(null);

				// Intentar obtener datos de caché primero
				const cachedPosts = localStorage.getItem('cachedBlogPosts');
				if (cachedPosts) {
					setPosts(JSON.parse(cachedPosts));
					setIsLoading(false);
				}

				// Importar Firebase de manera dinámica
				const { db } = await import('@/lib/firebase');
				const { collection, getDocs, query, orderBy } = await import(
					'firebase/firestore'
				);

				// Consultar Firestore con un timeout
				const timeoutId = setTimeout(() => {
					if (isLoading && !error) {
						setError(
							'La consulta está tomando demasiado tiempo. Usando datos en caché si están disponibles.'
						);
					}
				}, 5000);

				try {
					const postsQuery = query(
						collection(db, 'blogPosts'),
						orderBy('createdAt', 'desc')
					);
					const querySnapshot = await getDocs(postsQuery);
					const loadedPosts = [];

					querySnapshot.forEach((doc) => {
						loadedPosts.push({
							id: doc.id,
							...doc.data(),
						});
					});

					clearTimeout(timeoutId);

					if (loadedPosts.length > 0) {
						setPosts(loadedPosts);
						localStorage.setItem(
							'cachedBlogPosts',
							JSON.stringify(loadedPosts)
						);
						console.log('Posts cargados desde Firestore:', loadedPosts);
					}
				} catch (firestoreError) {
					console.error('Error en la consulta a Firestore:', firestoreError);
					setError(
						'Error al cargar los posts. Usando datos en caché si están disponibles.'
					);
				}
			} catch (error) {
				console.error('Error general:', error);
				setError(
					'Error al cargar los posts. Usando datos en caché si están disponibles.'
				);
			} finally {
				setIsLoading(false);
			}
		};

		loadPosts();
	}, []);

	if (isLoading && posts.length === 0) {
		return (
			<div className='container mx-auto py-12 flex justify-center items-center'>
				<Loader2 className='h-8 w-8 animate-spin text-primary' />
				<span className='ml-2'>Cargando artículos...</span>
			</div>
		);
	}

	return (
		<div className='container mx-auto py-12 px-4'>
			<h1 className='text-4xl font-bold mb-8'>Blog</h1>

			{error && (
				<div className='bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-6'>
					{error}
				</div>
			)}

			{posts.length === 0 ? (
				<div className='text-center py-12'>
					<p className='text-muted-foreground mb-4'>
						No hay artículos publicados aún.
					</p>
					<p className='text-sm'>
						Puedes crear nuevos artículos desde el panel de administración.
					</p>
					<Button asChild className='mt-4'>
						<Link href='/admin/dashboard'>Ir al panel de administración</Link>
					</Button>
				</div>
			) : (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
					{posts.map((post) => (
						<Card key={post.id} className='overflow-hidden flex flex-col'>
							<div className='h-48 relative'>
								<img
									src={post.image || '/placeholder.svg?height=200&width=400'}
									alt={post.title}
									className='object-cover w-full h-full'
									onError={(e) => {
										e.target.onerror = null;
										e.target.src = '/placeholder.svg?height=200&width=400';
									}}
								/>
							</div>
							<CardHeader>
								<CardTitle className='line-clamp-2'>{post.title}</CardTitle>
								<CardDescription>
									{convertTimestamp(post.createdAt)} |{' '}
									{post.category || 'Sin categoría'}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<p className='line-clamp-3'>{post.description}</p>
							</CardContent>
							<CardFooter className='mt-auto'>
								<Button variant='link' className='p-0' asChild>
									<Link href={`/blog/${post.slug || post.id}`}>Leer más</Link>
								</Button>
							</CardFooter>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}

