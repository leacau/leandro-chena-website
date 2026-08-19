export const dynamic = 'force-dynamic';

import {
	collection,
	doc,
	getDocs,
	increment,
	query,
	updateDoc,
	where,
} from 'firebase/firestore';

import { db } from '@/lib/firebase';
import { redirect } from 'next/navigation';

// Función para formatear URLs
function formatUrl(url) {
	if (!url) return null;

	// Asegurarse de que la URL tenga el protocolo correcto
	if (!url.startsWith('http://') && !url.startsWith('https://')) {
		return 'https://' + url;
	}
	return url;
}

export default async function RedirectPage({ params }) {
	const { slug } = await params;
	let redirectUrl = '/';

	try {
		// Buscar la URL en Firestore
		const q = query(collection(db, 'shortUrls'), where('slug', '==', slug));
		const querySnapshot = await getDocs(q);

		if (querySnapshot.empty) {
			console.error('URL no encontrada:', slug);
		} else {
			const docData = querySnapshot.docs[0].data();
			const longUrl = docData.longUrl;
			const docId = querySnapshot.docs[0].id;
			const formattedUrl = formatUrl(longUrl);

			if (!longUrl) {
				console.error('URL destino no encontrada para slug:', slug);
			} else if (!formattedUrl) {
				console.error('No se pudo formatear la URL:', longUrl);
			} else {
				try {
					await updateDoc(doc(db, 'shortUrls', docId), {
						clicks: increment(1),
					});
				} catch (updateError) {
					console.error('Error al actualizar contador:', updateError);
				}

				redirectUrl = formattedUrl;
			}
		}
	} catch (error) {
		console.error('Error al redirigir:', error);
	}

	redirect(redirectUrl);
}
