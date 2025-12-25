import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseProvider } from '@/firebase/provider'; // Importa el FirebaseProvider

export const metadata: Metadata = {
  title: 'bagshopp',
  description: 'A simple distraction-free text editor.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <FirebaseProvider> {/* Envuelve a los children con FirebaseProvider */}
          {children}
        </FirebaseProvider>
        <Toaster />
      </body>
    </html>
  );
}
