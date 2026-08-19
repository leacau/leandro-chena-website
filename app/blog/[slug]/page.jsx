import { ArrowLeft } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

function stripHtml(value = '') {
	return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

async function getPost(slug) {
	try {
		const postsQuery = query(
			collection(db, 'blogPosts'),
			where('slug', '==', slug)
		);
		const querySnapshot = await getDocs(postsQuery);

		if (querySnapshot.empty) return null;

		const postDoc = querySnapshot.docs[0];
		return {
			id: postDoc.id,
			...postDoc.data(),
		};
	} catch (err) {
		console.error('Error al cargar el post:', err);
		return null;
	}
}

export async function generateMetadata({ params }) {
	const { slug } = await params;
	const post = await getPost(slug);

	if (!post) {
		return {
			title: 'Artículo no encontrado | Leandro Chena',
		};
	}

	const title = `${post.title || 'Artículo'} | Leandro Chena`;
	const description =
		post.description || stripHtml(post.content).slice(0, 155) || undefined;

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: 'article',
			images: post.image ? [{ url: post.image, alt: post.title }] : [],
		},
		twitter: {
			card: post.image ? 'summary_large_image' : 'summary',
			title,
			description,
			images: post.image ? [post.image] : [],
		},
	};
}

export default async function BlogPostPage({ params }) {
	const { slug } = await params;
	const post = await getPost(slug);

	if (!post) notFound();

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
			<style>{`
				.blog-content blockquote {
					border-left: 4px solid hsl(var(--primary));
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
