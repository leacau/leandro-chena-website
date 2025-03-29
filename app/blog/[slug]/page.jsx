'use client';

import { ArrowLeft, Loader2 } from 'lucide-react';
import { use, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function BlogPostPage({ params }) {
	// Usar React.use() para desenvolver los parámetros
	const unwrappedParams = use(params);
	const { slug } = unwrappedParams;

	const router = useRouter();
	const [post, setPost] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		async function loadPost() {
			try {
				setLoading(true);
				setError(false);

				// Importar Firebase dinámicamente
				const { db } = await import('@/lib/firebase');
				const { collection, query, where, getDocs } = await import(
					'firebase/firestore'
				);

				// Consultar Firestore
				const postsQuery = query(
					collection(db, 'blogPosts'),
					where('slug', '==', slug)
				);
				const querySnapshot = await getDocs(postsQuery);

				if (querySnapshot.empty) {
					setError(true);
					return;
				}

				// Obtener el primer documento que coincida
				const postDoc = querySnapshot.docs[0];
				const postData = {
					id: postDoc.id,
					...postDoc.data(),
				};

				setPost(postData);
			} catch (err) {
				console.error('Error al cargar el post:', err);
				setError(true);
			} finally {
				setLoading(false);
			}
		}

		loadPost();
	}, [slug]);

	// Mostrar estado de carga
	if (loading) {
		return (
			<div className='container mx-auto py-12 flex justify-center items-center'>
				<Loader2 className='h-8 w-8 animate-spin text-primary' />
				<span className='ml-2'>Cargando artículo...</span>
			</div>
		);
	}

	// Mostrar error
	if (error || !post) {
		return (
			<div className='container mx-auto py-12 px-4 text-center'>
				<h1 className='text-2xl font-bold mb-4'>Error al cargar el artículo</h1>
				<p className='mb-8'>
					Lo sentimos, ha ocurrido un error al cargar este artículo.
				</p>
				<Button asChild>
					<Link href='/blog'>Volver al blog</Link>
				</Button>
			</div>
		);
	}

	// Asegurar que todos los campos necesarios existan
	const safePost = {
		title: post.title || 'Sin título',
		date: post.date || 'Sin fecha',
		author: post.author || 'Anónimo',
		category: post.category || 'Sin categoría',
		description: post.description || '',
		content: post.content || '<p>Este artículo no tiene contenido.</p>',
		image: post.image || null,
	};

	return (
		<div className='container mx-auto py-12 px-4'>
			<div className='max-w-4xl mx-auto'>
				<Link
					href='/blog'
					className='inline-flex items-center text-primary hover:underline mb-6'
				>
					<ArrowLeft className='mr-2 h-4 w-4' />
					Volver al blog
				</Link>

				{safePost.image && (
					<div className='w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden'>
						<img
							src={safePost.image || '/placeholder.svg'}
							alt={safePost.title}
							className='w-full h-full object-cover'
							onError={(e) => {
								e.target.onerror = null;
								e.target.src = '/placeholder.svg?height=400&width=800';
							}}
						/>
					</div>
				)}

				<h1 className='text-3xl md:text-4xl font-bold mb-4'>
					{safePost.title}
				</h1>

				<div className='flex flex-wrap gap-4 mb-8 text-sm text-muted-foreground'>
					<div>{safePost.date}</div>
					{safePost.author && <div>Por: {safePost.author}</div>}
					{safePost.category && <div>Categoría: {safePost.category}</div>}
				</div>

				{safePost.description && (
					<div className='text-lg font-medium mb-8 text-muted-foreground'>
						{safePost.description}
					</div>
				)}

				<div className='prose prose-lg max-w-none dark:prose-invert mb-8'>
					<div
						dangerouslySetInnerHTML={{ __html: safePost.content }}
						className='blog-content'
					/>
				</div>

				<div className='mt-12 pt-8 border-t'>
					<Button asChild>
						<Link href='/blog'>Volver al blog</Link>
					</Button>
				</div>
			</div>
			<style jsx global>{`
				.blog-content blockquote {
					border-left: 4px solid var(--primary);
					padding-left: 1rem;
					margin-left: 0;
					margin-right: 0;
					font-style: italic;
					color: var(--muted-foreground);
				}

				.blog-content blockquote p {
					margin-bottom: 0;
				}
			`}</style>
		</div>
	);
}

