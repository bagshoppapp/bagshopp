"use client";

import { useEffect, useState, useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useFirebaseAuth } from '../firebase/firebase-context';

export default function AuthProtector({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const auth = useFirebaseAuth();
  // Este estado nos dirá si la verificación del lado del cliente ha finalizado.
  const [isCheckComplete, setIsCheckComplete] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Este efecto se suscribe al estado de autenticación de Firebase.
  useLayoutEffect(() => {
    // No hacemos nada hasta que el contexto de Firebase esté listo.
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // 1. Guardamos el estado del usuario (sea el que sea).
      setUser(user);
      // 2. Marcamos la verificación como completa.
      setIsCheckComplete(true);
    });

    return () => unsubscribe();
  }, [auth]);

  // Este efecto se encarga de la redirección, y SOLO se ejecuta cuando la verificación ha terminado.
  useEffect(() => {
    // Si la verificación está completa y NO hay usuario, redirigimos.
    if (isCheckComplete && !user) {
      router.replace('/login');
    }
  }, [isCheckComplete, user, router]);

  // -- Lógica de Renderizado --
  // Renderizamos el contenido protegido SOLO si la verificación está completa Y tenemos un usuario.
  // En cualquier otro caso (en el servidor, en el primer render del cliente, o mientras se verifica),
  // mostramos el mensaje de carga. Esto garantiza que el servidor y el cliente rendericen lo mismo inicialmente.
  if (isCheckComplete && user) {
    return <>{children}</>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p>Verificando acceso...</p>
    </div>
  );
}
