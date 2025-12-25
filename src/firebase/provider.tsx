"use client";
import dynamic from 'next/dynamic';

// Carga dinámica del proveedor de cliente de Firebase, deshabilitando el renderizado en servidor (SSR).
const FirebaseClientProvider = dynamic(
  () => import('./client-provider').then(mod => mod.FirebaseClientProvider),
  {
    ssr: false, 
    // Opcional: puedes añadir un componente de carga aquí si es necesario
    // loading: () => <p>Inicializando Firebase...</p>
  }
);

// Este es el único proveedor que se importa en el layout.
// Su única misión es asegurarse de que el proveedor real del lado del cliente
// solo se renderice en el navegador.
export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  return <FirebaseClientProvider>{children}</FirebaseClientProvider>;
}
