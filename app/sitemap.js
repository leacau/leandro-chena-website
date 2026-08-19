import { collection, getDocs } from 'firebase/firestore';

import { db } from '@/lib/firebase';

export const dynamic = 'force-dynamic';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://leandrochena.com';

async function getCollectionEntries(collectionName, pathBuilder) {
	try {
		const snapshot = await getDocs(collection(db, collectionName));
		return snapshot.docs
			.map((doc) => ({ id: doc.id, ...doc.data() }))
			.map((item) => ({
				url: `${baseUrl}${pathBuilder(item)}`,
				lastModified: item.updatedAt?.toDate?.() || item.createdAt?.toDate?.() || new Date(),
				changeFrequency: 'monthly',
				priority: 0.6,
			}));
	} catch (error) {
		console.error(`Error al generar sitemap para ${collectionName}:`, error);
		return [];
	}
}

export default async function sitemap() {
	const staticRoutes = [
		'',
		'/sobre-mi',
		'/servicios',
		'/servicios/consultoria',
		'/servicios/capacitaciones',
		'/servicios/charlas',
		'/servicios/mentorias',
		'/blog',
		'/eventos',
		'/recursos',
		'/contacto',
	].map((path) => ({
		url: `${baseUrl}${path}`,
		lastModified: new Date(),
		changeFrequency: path === '' ? 'weekly' : 'monthly',
		priority: path === '' ? 1 : 0.7,
	}));

	const [blogPosts, events] = await Promise.all([
		getCollectionEntries('blogPosts', (post) => `/blog/${post.slug || post.id}`),
		getCollectionEntries('events', (event) => `/eventos/${event.id}`),
	]);

	return [...staticRoutes, ...blogPosts, ...events];
}
