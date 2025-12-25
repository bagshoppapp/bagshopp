"use client";
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { ReactNode, createContext, useContext } from 'react';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

interface FirebaseContextValue {
    app: FirebaseApp;
    auth: Auth;
    db: Firestore;
    storage: FirebaseStorage;
}

// Inicializa Firebase y exporta la app
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// --- Opcional: Contexto de React para proveer la app a los componentes ---

// Crear un contexto para la app de Firebase
const FirebaseAppContext = createContext<FirebaseContextValue | null>(null);

// Hook personalizado para usar el contexto de Firebase
export const useFirebase = () => {
    const context = useContext(FirebaseAppContext);
    if (!context) {
        throw new Error("useFirebase debe ser usado dentro de un FirebaseClientProvider");
    }
    return context;
};

// Proveedor de React que inicializa Firebase y lo pone a disposición
export function FirebaseClientProvider({ children }: { children: ReactNode }) {
    const firebaseContextValue: FirebaseContextValue = {
        app,
        auth,
        db,
        storage,
    };

    return (
        <FirebaseAppContext.Provider value={firebaseContextValue}>
            {children}
        </FirebaseAppContext.Provider>
    );
}
