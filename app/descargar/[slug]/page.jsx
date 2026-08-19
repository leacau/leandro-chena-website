import { ArrowLeft, Download } from 'lucide-react';
import {
	collection,
	doc,
	getDocs,
	increment,
	query,
	updateDoc,
	where,
} from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { db } from '@/lib/firebase';

export const dynamic = 'force-dynamic';

async function getFile(slug) {
	try {
		const filesCollection = collection(db, 'files');
		const fileQuery = query(filesCollection, where('slug', '==', slug));
		const querySnapshot = await getDocs(fileQuery);

		if (querySnapshot.empty) return null;

		const fileDoc = querySnapshot.docs[0];
		return {
			id: fileDoc.id,
			...fileDoc.data(),
		};
	} catch (error) {
		console.error('Error al cargar el archivo:', error);
		return null;
	}
}

export async function generateMetadata({ params }) {
	const { slug } = await params;
	const fileData = await getFile(slug);

	if (!fileData) {
		return {
			title: 'Archivo no encontrado | Leandro Chena',
			robots: { index: false, follow: false },
		};
	}

	const title = `${fileData.name || 'Descarga'} | Leandro Chena`;
	const description =
		fileData.description ||
		`Descargá ${fileData.name || 'este recurso'} de Leandro Chena.`;

	return {
		title,
		description,
		robots: { index: false, follow: true },
		openGraph: {
			title,
			description,
		},
		twitter: {
			card: 'summary',
			title,
			description,
		},
	};
}

export default async function DownloadPage({ params }) {
	const { slug } = await params;
	const fileData = await getFile(slug);

	const getDownloadUrl = () => {
		if (!fileData) return '#';

		try {
			const url = new URL(fileData.storageURL);
			url.searchParams.append(
				'response-content-disposition',
				`attachment; filename="${encodeURIComponent(
					fileData.name + '.' + fileData.fileType
				)}"`
			);
			return url.toString();
		} catch (e) {
			return fileData.storageURL;
		}
	};

	if (!fileData) {
		return (
			<div className='container mx-auto py-12 px-4'>
				<div className='max-w-lg mx-auto text-center'>
					<h1 className='text-2xl font-bold mb-4'>Archivo no encontrado</h1>
					<p className='mb-6 text-muted-foreground'>
						Lo sentimos, el archivo que estás buscando no existe o ha sido
						eliminado.
					</p>
					<Button asChild>
						<Link href='/'>Volver al inicio</Link>
					</Button>
				</div>
			</div>
		);
	}

	try {
		const fileDocRef = doc(db, 'files', fileData.id);
		await updateDoc(fileDocRef, {
			downloads: increment(1),
		});
	} catch (updateError) {
		console.error('Error al actualizar contador de descargas:', updateError);
	}

	return (
		<div className='container mx-auto py-12 px-4'>
			<Link
				href='/'
				className='inline-flex items-center text-primary hover:underline mb-6'
			>
				<ArrowLeft className='mr-2 h-4 w-4' />
				Volver al inicio
			</Link>

			<div className='max-w-lg mx-auto'>
				<div className='bg-card rounded-lg shadow-lg overflow-hidden'>
					<div className='p-6'>
						<h1 className='text-2xl font-bold mb-2'>{fileData.name}</h1>
						{fileData.description && (
							<p className='text-muted-foreground mb-6'>
								{fileData.description}
							</p>
						)}
						<div className='flex flex-col space-y-2'>
							<p className='text-sm'>
								<span className='font-medium'>Tipo:</span>{' '}
								{fileData.fileType?.toUpperCase() || 'Desconocido'}
							</p>
							<p className='text-sm'>
								<span className='font-medium'>Descargas:</span>{' '}
								{fileData.downloads || 0}
							</p>
							<p className='text-sm'>
								<span className='font-medium'>Nombre original:</span>{' '}
								{fileData.originalName || fileData.name}
							</p>
						</div>
						<div className='mt-8'>
							<Button asChild size='lg' className='w-full'>
								<a
									href={getDownloadUrl()}
									download={`${fileData.name}.${fileData.fileType}`}
								>
									<Download className='mr-2 h-5 w-5' />
									Descargar Archivo
								</a>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
