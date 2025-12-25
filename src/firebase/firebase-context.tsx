"use client";

import { createContext, useContext, ReactNode } from 'react';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import type { FirebaseStorage } from 'firebase/storage';

// 1. Define la forma de los datos del contexto
export interface FirebaseContextValue {
  auth: Auth;
  db: Firestore;
  storage: FirebaseStorage;
}

// 2. Crea el Contexto con un valor inicial nulo
//    Este contexto será el que los componentes consumirán.
export const FirebaseContext = createContext<FirebaseContextValue | null>(null);

// 3. Define los Hooks para acceder al contexto.
//    Estos hooks proporcionan una forma segura y tipada para que los componentes
//    obtengan las instancias de Firebase que necesitan.

export const useFirebaseAuth = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebaseAuth debe usarse dentro de un FirebaseContextProvider');
  }
  return context.auth;
};

export const useFirebaseDb = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebaseDb debe usarse dentro de un FirebaseContextProvider');
  }
  return context.db;
};

export const useFirebaseStorage = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebaseStorage debe usarse dentro de un FirebaseContextProvider');
  }
  return context.storage;
};
