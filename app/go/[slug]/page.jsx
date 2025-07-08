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

import ClientRedirect from './client-redirect';
import { db } from '@/lib/firebase';

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
	const { slug } = params;

	try {
		// Buscar la URL en Firestore
		const q = query(collection(db, 'shortUrls'), where('slug', '==', slug));
		const querySnapshot = await getDocs(q);

		if (querySnapshot.empty) {
			// Si no se encuentra, redirigir a la página principal
			console.error('URL no encontrada:', slug);
			return <ClientRedirect url='/' />;
		}

		// Obtener la URL larga
		const docData = querySnapshot.docs[0].data();
		const longUrl = docData.longUrl;
		const docId = querySnapshot.docs[0].id;

		// Verificar que longUrl existe y es válida
		if (!longUrl) {
			console.error('URL destino no encontrada para slug:', slug);
			return <ClientRedirect url='/' />;
		}

		// Formatear la URL correctamente
		const formattedUrl = formatUrl(longUrl);

		if (!formattedUrl) {
			console.error('No se pudo formatear la URL:', longUrl);
			return <ClientRedirect url='/' />;
		}

		// Incrementar el contador de clics (en segundo plano)
		try {
			await updateDoc(doc(db, 'shortUrls', docId), {
				clicks: increment(1),
			});
		} catch (updateError) {
			console.error('Error al actualizar contador:', updateError);
			// Continuamos con la redirección aunque falle el contador
		}

		// Usar el componente de redirección del lado del cliente
		return <ClientRedirect url={formattedUrl} />;
	} catch (error) {
		console.error('Error al redirigir:', error);
		// En caso de error, redirigir a la página principal
		return <ClientRedirect url='/' />;
	}
}

