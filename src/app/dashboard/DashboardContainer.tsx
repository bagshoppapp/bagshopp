"use client";

import AuthProtector from '../../components/AuthProtector';
import dynamic from 'next/dynamic';

// Dynamically load DashboardClient with SSR disabled
const DashboardClient = dynamic(() => import('./DashboardClient'), { 
  ssr: false,
  loading: () => <p className="text-white text-center pt-20">Cargando dashboard...</p>
});

// This is the main protected page for the dashboard.
export default function DashboardContainer() {
  return (
    <AuthProtector>
      <DashboardClient />
    </AuthProtector>
  );
}
