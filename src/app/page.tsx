"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/contenido');
    }, 5000); // 5 segundos

    return () => clearTimeout(timer); // Limpiar el temporizador si el componente se desmonta
  }, [router]);

  return (
    <main className="relative flex flex-col items-center justify-center h-screen overflow-hidden bg-black">
      {/* Fondo de rejilla */}
      <div className="absolute inset-0 z-0">
        <div className="grid grid-cols-10 sm:grid-cols-15 md:grid-cols-20 lg:grid-cols-30 xl:grid-cols-40 gap-4">
          {Array.from({ length: 240 }).map((_, index) => (
            <div key={index} className="aspect-square relative">
              <Image
                src="/imagen02.jpeg"
                alt="Imagen de la galería"
                fill
                className="object-cover rounded-md opacity-20"
                sizes="(max-width: 640px) 10vw, (max-width: 768px) 6.67vw, (max-width: 1024px) 5vw, (max-width: 1280px) 3.33vw, 2.5vw"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Contenido Centrado */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center text-white">
        <div className="bg-black bg-opacity-50 rounded-full p-8 animate-zoom-in">
          <Image
            src="/imagen03.jpeg" // Asumo que esta es la imagen del logo de Bagshopp
            alt="Logo"
            width={150}
            height={150}
            className="rounded-full"
          />
        </div>
        <h1 className="text-4xl font-bold mt-4 animate-zoom-in">POWERED</h1>
      </div>
    </main>
  );
}