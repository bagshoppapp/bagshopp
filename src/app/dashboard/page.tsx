"use client";

import dynamic from 'next/dynamic';

// Carga dinámicamente todo el contenedor del dashboard con SSR deshabilitado
const DashboardContainer = dynamic(() => import('./DashboardContainer'), { 
    ssr: false,
    loading: () => <div className="flex items-center justify-center min-h-screen bg-black text-white"><p>Cargando...</p></div>
});

export default function DashboardPage() {
  return <DashboardContainer />;
}
