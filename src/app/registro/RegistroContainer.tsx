"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Upload } from 'lucide-react';
import { db, storage } from '../../firebase/client';
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

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreServicio || !email) {
      setSubmitMessage('Por favor, completa al menos el nombre del servicio y el email.');
      return;
    }
    setIsSubmitting(true);
    setSubmitMessage('Guardando servicio...');

    try {
      let logoUrl = '';
      if (logo) {
        const logoRef = ref(storage, `logos/${Date.now()}_${logo.name}`);
        const uploadResult = await uploadBytes(logoRef, logo);
        logoUrl = await getDownloadURL(uploadResult.ref);
      }

      await addDoc(collection(db, "servicios"), {
        nombreServicio,
        nombreEmprendedor,
        email,
        telefono,
        direccion,
        descripcion,
        logoUrl,
        createdAt: new Date(),
      });

      setSubmitMessage('¡Servicio guardado con éxito!');
      setNombreServicio('');
      setNombreEmprendedor('');
      setEmail('');
      setTelefono('');
      setDireccion('');
      setDescripcion('');
      setLogo(null);
      setTimeout(() => setSubmitMessage(''), 5000);

    } catch (error) {
      console.error("Error al guardar el servicio: ", error);
      setSubmitMessage('Hubo un error al guardar el servicio. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative flex flex-col items-center min-h-screen overflow-y-auto bg-black pt-10 pb-20">
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
      <header className="relative z-10 w-full flex justify-center p-4">
        <Image
          src="/imagen01.jpeg"
          alt="Logo"
          width={100}
          height={100}
          className="rounded-full"
        />
      </header>
      <div className="relative z-10 flex flex-col items-center text-white w-full max-w-2xl px-8">
        <h1 className="text-4xl font-bold mb-8">Registro de Servicio</h1>
        <form onSubmit={handleSubmit} className="w-full space-y-6 bg-gray-900 bg-opacity-75 p-8 rounded-lg border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Nombre del Servicio"
              value={nombreServicio}
              onChange={(e) => setNombreServicio(e.target.value)}
              className="w-full p-3 text-white bg-gray-800 border border-gray-600 rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
              required
            />
            <input
              type="text"
              placeholder="Nombre del Emprendedor"
              value={nombreEmprendedor}
              onChange={(e) => setNombreEmprendedor(e.target.value)}
              className="w-full p-3 text-white bg-gray-800 border border-gray-600 rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="email"
              placeholder="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 text-white bg-gray-800 border border-gray-600 rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
              required
            />
            <input
              type="tel"
              placeholder="Teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full p-3 text-white bg-gray-800 border border-gray-600 rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
            />
          </div>
          <input
            type="text"
            placeholder="Dirección"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            className="w-full p-3 text-white bg-gray-800 border border-gray-600 rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
          />
          <textarea
            placeholder="Descripción del Servicio"
            rows={4}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full p-3 text-white bg-gray-800 border border-gray-600 rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
          />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Logo del Emprendedor</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {logo ? (
                    <p className='text-orange-400'>{logo.name}</p>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Click para subir</span> o arrastra y suelta</p>
                      <p className="text-xs text-gray-400">PNG, JPG</p>
                    </>
                  )}
                </div>
                <input type="file" className="hidden" onChange={handleLogoChange} accept="image/png, image/jpeg" />
              </label>
            </div> 
          </div>
          {submitMessage && (
            <p className={`text-center ${submitMessage.includes('error') ? 'text-red-500' : 'text-green-500'}`}>
              {submitMessage}
            </p>
          )}
          <button type="submit" disabled={isSubmitting} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-md transition duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed">
            {isSubmitting ? 'Guardando...' : 'Guardar Servicio'}
          </button>
        </form>
      </div>
    </main>
  );
}
