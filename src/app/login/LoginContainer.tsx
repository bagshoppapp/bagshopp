"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { signInWithEmailAndPassword } from 'firebase/auth';
// Importa el hook de contexto en lugar de la importación directa
import { useFirebaseAuth } from '../../firebase/firebase-context';

export default function LoginContainer() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  
  // Usa el hook para obtener la instancia de auth de forma segura
  const auth = useFirebaseAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Reset error message

    // Asegúrate de que auth no sea nulo antes de usarlo
    if (!auth) {
        setError('Error: La autenticación de Firebase no está disponible.');
        return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // On successful login, Firebase automatically handles the session.
      // Redirect to the dashboard.
      router.push('/dashboard');
    } catch (error: any) {
      // Handle errors here.
      console.error("Error de autenticación:", error.code, error.message);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setError('El correo o la contraseña son incorrectos.');
      } else {
        setError('Ha ocurrido un error. Por favor, inténtalo de nuevo.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <header className="absolute top-0 w-full flex justify-center p-4">
        <Image
          src="/imagen01.jpeg"
          alt="Logo"
          width={100}
          height={100}
          className="rounded-full"
        />
      </header>
      <div className="relative z-10 w-full max-w-md space-y-6">
        <div className="bg-gray-900 bg-opacity-75 p-8 rounded-lg shadow-xl">
          <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-300">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-medium text-gray-300">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-gray-900 focus:ring-orange-500"
              />
            </div>
            
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <div>
              <button
                type="submit"
                className="w-full px-4 py-2 font-bold text-white bg-orange-600 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-orange-500"
              >
                Ingresar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
