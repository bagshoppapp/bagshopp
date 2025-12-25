"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Upload } from 'lucide-react';
// Importa los hooks de contexto en lugar de la importación directa
import { useFirebaseDb, useFirebaseStorage } from '../../firebase/firebase-context';
import { collection, addDoc } from "firebase/firestore"; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function RegistroContainer() {
  const [nombreServicio, setNombreServicio] = useState('');
  const [nombreEmprendedor, setNombreEmprendedor] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  
  // Usa los hooks para obtener las instancias de db y storage de forma segura
  const db = useFirebaseDb();
  const storage = useFirebaseStorage();

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setLogo(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!logo || !db || !storage) {
        setSubmitMessage('Error: Faltan dependencias de Firebase.');
        return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // 1. Subir el logo a Firebase Storage
      const logoRef = ref(storage, `logos/${Date.now()}_${logo.name}`);
      const uploadResult = await uploadBytes(logoRef, logo);
      const logoUrl = await getDownloadURL(uploadResult.ref);

      // 2. Guardar los datos del servicio en Firestore
      await addDoc(collection(db, "servicios"), {
        nombreServicio,
        nombreEmprendedor,
        email,
        telefono,
        direccion,
        descripcion,
        logoUrl
      });

      // 3. Limpiar el formulario y mostrar mensaje de éxito
      setSubmitMessage('¡Servicio registrado con éxito!');
      setNombreServicio('');
      setNombreEmprendedor('');
      setEmail('');
      setTelefono('');
      setDireccion('');
      setDescripcion('');
      setLogo(null);

    } catch (error) {
      console.error("Error al registrar el servicio: ", error);
      setSubmitMessage('Error al registrar el servicio. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative flex flex-col items-center min-h-screen overflow-y-auto bg-black pt-10 pb-20 text-white">
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

      {/* Contenido del formulario */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-2xl px-8">
        <h1 className="text-4xl font-bold mb-8">Registro de Nuevo Servicio</h1>
        
        <form onSubmit={handleSubmit} className="w-full bg-gray-900 bg-opacity-75 p-8 rounded-lg border border-gray-700 space-y-6">
          
          {/* Campos del formulario */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" placeholder="Nombre del Servicio" value={nombreServicio} onChange={(e) => setNombreServicio(e.target.value)} required className="bg-gray-800 p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500" />
            <input type="text" placeholder="Nombre del Emprendedor" value={nombreEmprendedor} onChange={(e) => setNombreEmprendedor(e.target.value)} required className="bg-gray-800 p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500" />
            <input type="email" placeholder="Email de Contacto" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-gray-800 p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500" />
            <input type="tel" placeholder="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} className="bg-gray-800 p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <input type="text" placeholder="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} className="w-full bg-gray-800 p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500" />
          <textarea placeholder="Descripción del servicio" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required rows={4} className="w-full bg-gray-800 p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500" />

          {/* Carga de Logo */}
          <div className="flex flex-col items-center justify-center bg-gray-800 p-6 rounded-md border-2 border-dashed border-gray-600">
              <label htmlFor="logo-upload" className="cursor-pointer flex flex-col items-center text-gray-400">
                  <Upload className="w-10 h-10 mb-2" />
                  <span className="text-lg">Cargar Logo</span>
                  <span className="text-sm">(Preferiblemente formato cuadrado)</span>
              </label>
              <input id="logo-upload" type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
              {logo && <p className="text-sm mt-4 text-gray-300">Archivo seleccionado: {logo.name}</p>}
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-md transition duration-300 disabled:bg-gray-500">
            {isSubmitting ? 'Registrando...' : 'Registrar Servicio'}
          </button>
        </form>

        {submitMessage && <p className="mt-4 text-center">{submitMessage}</p>}
      </div>
    </main>
  );
}
