"use client";
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Phone, MapPin, Search } from 'lucide-react';

export default function ContenidoPage() {
  return (
    <div className="relative min-h-screen bg-black">
      <main className="h-screen overflow-hidden p-4 relative">
        <div className="absolute inset-0">
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
        <div className="relative z-10 flex flex-col items-center justify-center h-full gap-8" style={{ marginTop: '-100px' }}>
          <div className="relative w-64 h-64">
            <Image
              src="/imagen01.jpeg"
              alt="Imagen central"
              fill
              className="object-cover rounded-full"
              sizes="256px"
            />
          </div>
          <div className="w-full max-w-md">
            <div className="relative">
              <input
                type="search"
                placeholder="Buscar..."
                className="w-full p-4 pl-12 text-white bg-gray-900 bg-opacity-75 border border-gray-700 rounded-full focus:ring-primary focus:border-primary focus:outline-none"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                <Search className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="absolute bottom-0 left-0 right-0 z-20 bg-gray-900 bg-opacity-75 text-white p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4">
                <p className="text-sm">&copy; {new Date().getFullYear()} Tu Empresa. Todos los derechos reservados.</p>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <a href="mailto:info@tuempresa.com" className="flex items-center gap-1 hover:text-primary">
                <Mail size={16} />
                <span className="text-sm">info@tuempresa.com</span>
              </a>
              <span className="text-sm flex items-center gap-1">
                <Phone size={16} />
                +1 (123) 456-7890
              </span>
              <span className="text-sm flex items-center gap-1">
                <MapPin size={16} />
                Ciudad, País
              </span>
            </div>
          </div>
          <Link href="/login">
              <div className="relative h-12 w-12 cursor-pointer">
                <Image
                  src="/imagen01.jpeg"
                  alt="Logo de la empresa"
                  fill
                  className="object-contain"
                  sizes="48px"
                />
              </div>
          </Link>
        </div>
      </footer>
    </div>
  );
}