"use client";

import dynamic from 'next/dynamic';

const RegistroContainer = dynamic(() => import('./RegistroContainer'), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen bg-black text-white"><p>Cargando formulario...</p></div>
});

export default function RegistroPage() {
  return <RegistroContainer />;
}
