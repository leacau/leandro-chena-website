// Mejorar la configuración de Firebase para soportar modo offline y mejorar rendimiento

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED, initializeFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJQZOV4P9KJA-9Pu6VWl9q_-9j9OMxZvE",
  authDomain: "leandro-chena-website.firebaseapp.com",
  projectId: "leandro-chena-website",
  storageBucket: "leandro-chena-website.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:1234567890abcdef",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Configure Firestore with persistence and larger cache
const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
})

// Enable offline persistence when possible
if (typeof window !== "undefined") {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === "failed-precondition") {
      // Multiple tabs open, persistence can only be enabled in one tab at a time
      console.log("Persistence failed: Multiple tabs open")
    } else if (err.code === "unimplemented") {
      // The current browser does not support all of the features required for persistence
      console.log("Persistence not supported by this browser")
    } else {
      console.error("Persistence error:", err)
    }
  })
}

const storage = getStorage(app)

export { app, db, storage }

