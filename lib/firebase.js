// Mejorar la configuración de Firebase para soportar modo offline y mejorar rendimiento

import {
	CACHE_SIZE_UNLIMITED,
	enableIndexedDbPersistence,
	initializeFirestore,
} from 'firebase/firestore';

import { getStorage } from 'firebase/storage';
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: process.env.REACT_APP_API_KEY,
	authDomain: process.env.REACT_APP_AUTH_DOMAIN,
	projectId: process.env.REACT_APP_PROJECT_ID,
	storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
	appId: process.env.REACT_APP_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Configure Firestore with persistence and larger cache
const db = initializeFirestore(app, {
	cacheSizeBytes: CACHE_SIZE_UNLIMITED,
});

// Enable offline persistence when possible
if (typeof window !== 'undefined') {
	enableIndexedDbPersistence(db).catch((err) => {
		if (err.code === 'failed-precondition') {
			// Multiple tabs open, persistence can only be enabled in one tab at a time
			console.log('Persistence failed: Multiple tabs open');
		} else if (err.code === 'unimplemented') {
			// The current browser does not support all of the features required for persistence
			console.log('Persistence not supported by this browser');
		} else {
			console.error('Persistence error:', err);
		}
	});
}

const storage = getStorage(app);

export { app, db, storage };

