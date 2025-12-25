"use client";

import { createContext, useContext } from 'react';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import type { FirebaseStorage } from 'firebase/storage';

// Define la forma de los datos del contexto
export interface FirebaseContextValue {
  auth: Auth;
  db: Firestore;
  storage: FirebaseStorage;
}

// Crea el contexto. Lanzaremos un error si se usa fuera de un proveedor.
export const FirebaseContext = createContext<FirebaseContextValue | null>(null);

// Hook personalizado para obtener el contexto completo de Firebase
export const useFirebaseContext = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebaseContext debe usarse dentro de un FirebaseContextProvider');
  }
  return context;
};

// Hooks específicos para cada servicio para mayor comodidad y seguridad de tipos
export const useFirebaseAuth = () => {
    const context = useContext(FirebaseContext);
    if (!context) throw new Error('useFirebaseAuth debe usarse dentro de un FirebaseContextProvider');
    return context.auth;
}

export const useFirebaseDb = () => {
    const context = useContext(FirebaseContext);
    if (!context) throw new Error('useFirebaseDb debe usarse dentro de un FirebaseContextProvider');
    return context.db;
}

export const useFirebaseStorage = () => {
    const context = useContext(FirebaseContext);
    if (!context) throw new Error('useFirebaseStorage debe usarse dentro de un FirebaseContextProvider');
    return context.storage;
}
