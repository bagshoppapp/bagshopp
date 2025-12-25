"use client";

import { ReactNode, useState, useEffect } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Importa el CONTEXTO y la INTERFAZ desde el archivo de contexto
import { FirebaseContext, FirebaseContextValue } from './firebase-context';

// La configuración de Firebase se mantiene igual
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Este es el componente que realmente proveerá el contexto
export function FirebaseClientProvider({ children }: { children: ReactNode }) {
    // Estado para almacenar las instancias de Firebase una vez inicializadas
    const [firebase, setFirebase] = useState<FirebaseContextValue | null>(null);

    useEffect(() => {
        // Inicializa Firebase solo en el cliente
        const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
        const auth = getAuth(app);
        const db = getFirestore(app);
        const storage = getStorage(app);

        // Asigna las instancias al estado. Esto provocará un re-render.
        setFirebase({ auth, db, storage });

        // No es necesario un cleanup, ya que la app se inicializa una vez.
    }, []); // El array vacío asegura que este efecto se ejecute solo una vez

    // Mientras Firebase se inicializa, no renderices nada o muestra un loader.
    // Esto es CRUCIAL para evitar que los hooks se usen antes de tiempo.
    if (!firebase) {
        // Puedes reemplazar esto con un componente de carga más sofisticado
        return <p className="text-white text-center pt-20">Inicializando aplicación...</p>;
    }

    // Una vez que `firebase` tiene valor, renderiza el proveedor con el contexto
    // y los componentes hijos dentro.
    return (
        <FirebaseContext.Provider value={firebase}>
            {children}
        </FirebaseContext.Provider>
    );
}
