'use client';

import { AlertCircle, CheckCircle, Loader2, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { app, db, storage } from '@/lib/firebase';
// Importar las funciones de Firestore correctamente
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

export default function FirebaseStatus() {
	const [status, setStatus] = useState({
		checking: true,
		connected: false,
		error: null,
		config: {},
	});

	const checkFirebaseStatus = async () => {
		setStatus((prev) => ({ ...prev, checking: true }));

		try {
			// Verificar la configuración de Firebase
			const config = {
				apiKey: process.env.NEXT_PUBLIC_APIKEY || '',
				authDomain: process.env.NEXT_PUBLIC_AUTHDOMAIN || '',
				projectId: process.env.NEXT_PUBLIC_PROJECTID || '',
				storageBucket: process.env.NEXT_PUBLIC_STORAGEBUCKET || '',
				messagingSenderId: process.env.NEXT_PUBLIC_MESSAGINGSENDERID || '',
				appId: process.env.NEXT_PUBLIC_APPID || '',
				appId: process.env.NEXT_PUBLIC_MEASUREMENTID || '',
			};

			console.log(config);

			// Verificar si hay variables de entorno faltantes
			const missingVars = Object.entries(config)
				.filter(([_, value]) => !value)
				.map(([key]) => key);

			// Verificar si Firebase está inicializado correctamente
			const isInitialized = app && db && storage;

			// Intentar una operación simple para verificar la conexión
			let connectionTest = false;
			if (
				isInitialized &&
				config.projectId &&
				typeof collection === 'function' &&
				typeof getDocs === 'function'
			) {
				try {
					// Intentar acceder a una colección (sin leer datos)
					const querySnapshot = await getDocs(
						collection(db, '_test_connection')
					);
					connectionTest = true;
				} catch (err) {
					console.error('Error al probar la conexión:', err);
				}
			}

			setStatus({
				checking: false,
				connected: isInitialized && connectionTest,
				error:
					missingVars.length > 0
						? `Faltan variables de entorno: ${missingVars.join(', ')}`
						: null,
				config,
			});
		} catch (error) {
			console.error('Error al verificar el estado de Firebase:', error);
			setStatus({
				checking: false,
				connected: false,
				error: error.message,
				config: {},
			});
		}
	};

	useEffect(() => {
		checkFirebaseStatus();
	}, []);

	return (
		<Card className='mb-6'>
			<CardHeader className='pb-2'>
				<CardTitle className='text-lg flex items-center gap-2'>
					{status.checking ? (
						<Loader2 className='h-4 w-4 animate-spin text-primary' />
					) : status.connected ? (
						<CheckCircle className='h-4 w-4 text-green-500' />
					) : (
						<AlertCircle className='h-4 w-4 text-red-500' />
					)}
					Estado de Firebase
					<Button
						variant='ghost'
						size='sm'
						className='ml-auto'
						onClick={checkFirebaseStatus}
						disabled={status.checking}
					>
						<RefreshCw
							className={`h-4 w-4 ${status.checking ? 'animate-spin' : ''}`}
						/>
					</Button>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='text-sm'>
					{status.checking ? (
						<p>Verificando conexión a Firebase...</p>
					) : status.connected ? (
						<p className='text-green-600'>Firebase conectado correctamente</p>
					) : (
						<div className='text-red-500 space-y-1'>
							<p>No se pudo conectar a Firebase</p>
							{status.error && (
								<p className='text-xs bg-red-50 p-2 rounded'>{status.error}</p>
							)}
							<p className='text-xs text-gray-500 mt-2'>
								La aplicación está funcionando en modo offline. Los datos se
								guardarán localmente.
							</p>
						</div>
					)}

					<div className='mt-2 pt-2 border-t text-xs text-gray-500'>
						<p>Project ID: {status.config.projectId || 'No configurado'}</p>
						<p>
							API Key: {status.config.apiKey ? 'Configurada' : 'No configurada'}
						</p>
						<p>
							Auth Domain:{' '}
							{status.config.authDomain ? 'Configurado' : 'No configurado'}
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

