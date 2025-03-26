// Configuración de Firebase con manejo de errores mejorado

import { enableIndexedDbPersistence, getFirestore } from 'firebase/firestore';
// Importaciones necesarias
import { getApps, initializeApp } from 'firebase/app';

import { getStorage } from 'firebase/storage';

// Verificar si las variables de entorno están disponibles
const hasValidConfig =
	process.env.NEXT_PRIVATE_apiKey &&
	process.env.NEXT_PRIVATE_authDomain &&
	process.env.NEXT_PRIVATE_projectId &&
	process.env.NEXT_PRIVATE_storageBucket &&
	process.env.NEXT_PRIVATE_messagingSenderId &&
	process.env.NEXT_PRIVATE_appId;

// Configuración de Firebase
const firebaseConfig = {
	apiKey: process.env.NEXT_PRIVATE_apiKey || '',
	authDomain: process.env.NEXT_PRIVATE_authDomain || '',
	projectId: process.env.NEXT_PRIVATE_projectId || '',
	storageBucket: process.env.NEXT_PRIVATE_storageBucket || '',
	messagingSenderId: process.env.NEXT_PRIVATE_messagingSenderId || '',
	appId: process.env.NEXT_PRIVATE_appId || '',
};

// Variables para exportar
let app = null;
let db = null;
let storage = null;

// Solo inicializar Firebase si tenemos una configuración válida
if (hasValidConfig) {
	try {
		// Verificar si ya hay una instancia de Firebase
		if (!getApps().length) {
			app = initializeApp(firebaseConfig);
			console.log('✅ Firebase inicializado correctamente');
		} else {
			app = getApps()[0];
			console.log('✅ Usando instancia existente de Firebase');
		}

		// Inicializar Firestore
		db = getFirestore(app);

		// Habilitar persistencia offline cuando sea posible
		if (typeof window !== 'undefined') {
			enableIndexedDbPersistence(db).catch((err) => {
				if (err.code === 'failed-precondition') {
					console.warn(
						'⚠️ La persistencia no pudo habilitarse: múltiples pestañas abiertas'
					);
				} else if (err.code === 'unimplemented') {
					console.warn(
						'⚠️ La persistencia no está disponible en este navegador'
					);
				} else {
					console.error('❌ Error al habilitar la persistencia:', err);
				}
			});
		}

		// Inicializar Storage
		storage = getStorage(app);
	} catch (error) {
		console.error('❌ Error al inicializar Firebase:', error);
	}
} else {
	console.error(
		'❌ Faltan variables de entorno para Firebase. La aplicación funcionará en modo offline/mock.'
	);
}

// Crear versiones simuladas si no se pudo inicializar Firebase
if (!app || !db || !storage) {
	console.warn('⚠️ Usando versiones simuladas de Firebase para evitar errores');

	// Mock de Firebase
	app = app || {
		name: 'firebase-mock',
		options: { ...firebaseConfig },
	};

	// Mock de Firestore con funciones que no hacen nada pero no fallan
	db = db || {
		collection: (path) => ({
			getDocs: async () => ({
				forEach: () => {},
				docs: [],
			}),
			doc: (id) => ({
				id,
				set: async () => {},
				update: async () => {},
				delete: async () => {},
			}),
			add: async (data) => ({ id: `mock-${Date.now()}`, ...data }),
		}),
		doc: (path) => ({
			id: path.split('/').pop(),
			get: async () => ({
				exists: () => false,
				data: () => ({}),
			}),
			set: async () => {},
			update: async () => {},
			delete: async () => {},
		}),
		batch: () => ({
			set: () => {},
			update: () => {},
			delete: () => {},
			commit: async () => {},
		}),
		runTransaction: async (fn) =>
			await fn({ get: async () => ({ exists: false, data: () => ({}) }) }),
	};

	// Mock de Storage
	storage = storage || {
		ref: (path) => ({
			put: async () => ({
				ref: {
					getDownloadURL: async () => '/placeholder.svg',
				},
			}),
			getDownloadURL: async () => '/placeholder.svg',
			delete: async () => {},
		}),
	};
}

// Exportar las instancias de Firebase
export { app, db, storage };

