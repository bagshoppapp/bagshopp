"use client";

import { useLayoutEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../firebase/client';
import { onAuthStateChanged } from 'firebase/auth';

// This component protects a route, redirecting to /login if the user is not authenticated.
export default function AuthProtector({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Check if the user is not logged in
      if (!user) {
        // If not logged in, redirect to the login page
        router.replace('/login');
      } else {
        // If logged in, stop showing the loading state
        setIsLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);

  // While checking the auth state, show a loading message
  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-black text-white">
            <p>Verificando acceso...</p>
        </div>
    );
  }

  // If the user is authenticated, render the children components (the protected page)
  return <>{children}</>;
}
