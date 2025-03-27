// Configuración de Firebase con manejo de errores mejorado

import {
	createUserWithEmailAndPassword,
	getAuth,
	signInWithEmailAndPassword,
	signOut,
} from 'firebase/auth';
import {
	doc,
	enableIndexedDbPersistence,
	getDoc,
	getFirestore,
	setDoc,
} from 'firebase/firestore';
// Importaciones necesarias
import { getApps, initializeApp } from 'firebase/app';

import { getStorage } from 'firebase/storage';

// Verificar si las variables de entorno están disponibles
const hasValidConfig =
	process.env.NEXT_PUBLIC_APIKEY &&
	process.env.NEXT_PUBLIC_AUTHDOMAIN &&
	process.env.NEXT_PUBLIC_PROJECTID &&
	process.env.NEXT_PUBLIC_STORAGEBUCKET &&
	process.env.NEXT_PUBLIC_MESSAGINGSENDERID &&
	process.env.NEXT_PUBLIC_APPID;

// Configuración de Firebase
const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_APIKEY || '',
	authDomain: process.env.NEXT_PUBLIC_AUTHDOMAIN || '',
	projectId: process.env.NEXT_PUBLIC_PROJECTID || '',
	storageBucket: process.env.NEXT_PUBLIC_STORAGEBUCKET || '',
	messagingSenderId: process.env.NEXT_PUBLIC_MESSAGINGSENDERID || '',
	appId: process.env.NEXT_PUBLIC_APPID || '',
	appId: process.env.NEXT_PUBLIC_MEASUREMENTID || '',
};

// Variables para exportar
let app = null;
let db = null;
let storage = null;
let auth = null;

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

		// Inicializar Auth
		auth = getAuth(app);
	} catch (error) {
		console.error('❌ Error al inicializar Firebase:', error);
	}
} else {
	console.error(
		'❌ Faltan variables de entorno para Firebase. La aplicación funcionará en modo offline/mock.'
	);
}

// Crear versiones simuladas si no se pudo inicializar Firebase
if (!app || !db || !storage || !auth) {
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

	// Mock de Auth
	auth = auth || {
		createUserWithEmailAndPassword: async () => ({
			user: { uid: `mock-${Date.now()}` },
		}),
		signInWithEmailAndPassword: async () => ({
			user: { uid: `mock-${Date.now()}` },
		}),
		signOut: async () => {},
		onAuthStateChanged: (callback) => {
			callback(null);
			return () => {};
		},
		currentUser: null,
	};
}

// Funciones de autenticación con roles
const registerUser = async (email, password) => {
	try {
		// Crear usuario en Firebase Auth
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);
		const user = userCredential.user;

		// Guardar información adicional del usuario en Firestore
		await setDoc(doc(db, 'users', user.uid), {
			email: user.email,
			role: 'user', // Rol por defecto
			createdAt: new Date().toISOString(),
		});

		return { success: true, user };
	} catch (error) {
		console.error('Error al registrar usuario:', error);
		return { success: false, error: error.message };
	}
};

const loginUser = async (email, password) => {
	try {
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password
		);
		return { success: true, user: userCredential.user };
	} catch (error) {
		console.error('Error al iniciar sesión:', error);
		return { success: false, error: error.message };
	}
};

const logoutUser = async () => {
	try {
		await signOut(auth);
		return { success: true };
	} catch (error) {
		console.error('Error al cerrar sesión:', error);
		return { success: false, error: error.message };
	}
};

// Función para obtener el rol del usuario
const getUserRole = async (userId) => {
	try {
		const userDoc = await getDoc(doc(db, 'users', userId));
		if (userDoc.exists()) {
			return userDoc.data().role || 'user';
		}
		return 'user'; // Por defecto, si no existe el documento
	} catch (error) {
		console.error('Error al obtener el rol del usuario:', error);
		return 'user'; // Por defecto en caso de error
	}
};

// Exportar las instancias de Firebase
export {
	app,
	db,
	storage,
	auth,
	registerUser,
	loginUser,
	logoutUser,
	getUserRole,
};

