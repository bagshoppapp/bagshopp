"use client";

import { ReactNode, useState, useEffect } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Importa el CONTEXTO y la INTERFAZ desde el archivo de contexto
import { FirebaseContext, FirebaseContextValue } from './firebase-context';
import { clientConfig } from '@/lib/firebase/client-config';

// La configuración de Firebase se mantiene igual
const firebaseConfig = clientConfig;

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

    // Renderiza siempre el proveedor. El valor será `null` hasta que Firebase
    // se inicialice en el `useEffect`. Los componentes que consumen el contexto
    // ya están preparados para manejar un valor `null`.
    // Esto soluciona el error de hidratación de React.
    return (
        <FirebaseContext.Provider value={firebase}>
            {children}
        </FirebaseContext.Provider>
    );
}
