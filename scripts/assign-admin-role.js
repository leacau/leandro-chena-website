// Este script debe ejecutarse en un entorno seguro, como Cloud Functions o la consola de Firebase

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // Asegúrate de tener tu archivo de credenciales

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Función para asignar rol de administrador a un usuario por su email
async function assignAdminRole(email) {
	try {
		// Buscar el usuario por email
		const usersSnapshot = await db
			.collection('users')
			.where('email', '==', email)
			.get();

		if (usersSnapshot.empty) {
			return;
		}

		// Actualizar el rol del usuario a "admin"
		const userDoc = usersSnapshot.docs[0];
		await db.collection('users').doc(userDoc.id).update({
			role: 'admin',
		});
	} catch (error) {
		console.error('Error al asignar rol de administrador:', error);
	}
}

// Ejecutar la función con el email del usuario que deseas convertir en administrador
assignAdminRole('admin@example.com'); // Reemplaza con el email real

