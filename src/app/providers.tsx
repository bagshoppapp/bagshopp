'use client';

import { FirebaseClientProvider } from '@/firebase/client-provider';
import React from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  return <FirebaseClientProvider>{children}</FirebaseClientProvider>;
}
