"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
// Importa los hooks de contexto en lugar de la importación directa
import { useFirebaseDb, useFirebaseAuth } from '../../firebase/firebase-context';
import { collection, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";

interface Service {
  id: string;
  nombreServicio: string;
  nombreEmprendedor: string;
  email: string;
  telefono: string;
  direccion: string;
  descripcion: string;
  logoUrl: string;
}

export default function DashboardClient() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  // Usa los hooks para obtener las instancias de db y auth de forma segura
  const db = useFirebaseDb();
  const auth = useFirebaseAuth();

  useEffect(() => {
    // Asegúrate de que db y auth no sean nulos antes de usarlos
    if (!db || !auth) return;

    const fetchServices = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "servicios"));
        const servicesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
        setServices(servicesData);
      } catch (error) {
        console.error("Error fetching services: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [db, auth]); // Añade db y auth como dependencias del efecto

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Error al cerrar sesión: ", error);
    }
  };

  return (
    <main className="relative flex flex-col items-center min-h-screen overflow-y-auto bg-black pt-10 pb-20">
      {/* Fondo de rejilla */}
      <div className="absolute inset-0 z-0">
        <div className="grid grid-cols-10 sm:grid-cols-15 md:grid-cols-20 lg:grid-cols-30 xl:grid-cols-40 gap-4">
          {Array.from({ length: 480 }).map((_, index) => (
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

      {/* Encabezado con Logo y Botones */}
      <header className="relative z-10 w-full flex flex-col items-center p-4 max-w-6xl mx-auto space-y-4">
        <Image
          src="/imagen01.jpeg"
          alt="Logo"
          width={100}
          height={100}
          className="rounded-full"
        />
        <div className="flex flex-col space-y-2">
          <button 
              onClick={() => router.push('/registro')} 
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-md transition duration-300">
              Agregar Servicio
          </button>
          <button 
              onClick={handleLogout} 
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-md transition duration-300">
              Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Contenido Principal */}
      <div className="relative z-10 flex flex-col items-center text-white w-full max-w-6xl px-8">
        <h1 className="text-4xl font-bold mb-8">Dashboard de Servicios</h1>
        
        {loading ? (
          <p>Cargando servicios...</p>
        ) : services.length === 0 ? (
          <p>No hay servicios registrados.</p>
        ) : (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(service => (
              <div key={service.id} className="bg-gray-900 bg-opacity-75 p-6 rounded-lg border border-gray-700 space-y-4">
                <div className="flex items-center space-x-4">
                    {service.logoUrl && (
                        <div className="relative w-20 h-20 flex-shrink-0">
                            <Image src={service.logoUrl} alt={`Logo de ${service.nombreServicio}`} layout="fill" className="rounded-full object-cover" />
                        </div>
                    )}
                    <h2 className="text-2xl font-bold text-orange-400 flex-grow">{service.nombreServicio}</h2>
                </div>
                <p className="text-gray-300"><span className="font-semibold">Emprendedor:</span> {service.nombreEmprendedor || "No especificado"}</p>
                <p className="text-gray-300"><span className="font-semibold">Descripción:</span> {service.descripcion || "No especificado"}</p>
                <p className="text-gray-300"><span className="font-semibold">Email:</span> {service.email}</p>
                <p className="text-gray-300"><span className="font-semibold">Teléfono:</span> {service.telefono || "No especificado"}</p>
                <p className="text-gray-300"><span className="font-semibold">Dirección:</span> {service.direccion || "No especificado"}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
