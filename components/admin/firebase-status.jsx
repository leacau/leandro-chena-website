'use client';

import { AlertCircle, CheckCircle, Loader2, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { app, db, storage } from '@/lib/firebase';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

export default function FirebaseStatus() {
	const [status, setStatus] = useState({
		checking: true,
		connected: false,
		error: null,
		warning: null,
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
				measurementId: process.env.NEXT_PUBLIC_MEASUREMENTID || '',
			};

			const requiredConfig = {
				apiKey: config.apiKey,
				authDomain: config.authDomain,
				projectId: config.projectId,
				storageBucket: config.storageBucket,
				messagingSenderId: config.messagingSenderId,
				appId: config.appId,
			};

			// Verificar si hay variables de entorno obligatorias faltantes
			const missingVars = Object.entries(requiredConfig)
				.filter(([_, value]) => !value)
				.map(([key]) => key);

			// Verificar si Firebase está inicializado correctamente
			const isInitialized = app && db && storage;

			setStatus({
				checking: false,
				connected: Boolean(isInitialized && missingVars.length === 0),
				error:
					missingVars.length > 0
						? `Faltan variables de entorno: ${missingVars.join(', ')}`
						: null,
				warning: !config.measurementId
					? 'Measurement ID no configurado. Firebase funciona igual; solo puede afectar Analytics.'
					: null,
				config,
			});
		} catch (error) {
			console.error('Error al verificar el estado de Firebase:', error);
			setStatus({
				checking: false,
				connected: false,
				error: error.message,
				warning: null,
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
						<div className='space-y-1'>
							<p className='text-green-600'>Firebase inicializado correctamente</p>
							{status.warning && (
								<p className='text-xs bg-yellow-50 text-yellow-800 p-2 rounded'>
									{status.warning}
								</p>
							)}
						</div>
					) : (
						<div className='text-red-500 space-y-1'>
							<p>No se pudo inicializar Firebase</p>
							{status.error && (
								<p className='text-xs bg-red-50 p-2 rounded'>{status.error}</p>
							)}
							<p className='text-xs text-gray-500 mt-2'>
								Revisá las variables obligatorias de Firebase en el entorno.
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
