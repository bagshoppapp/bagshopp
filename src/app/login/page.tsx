"use client";

import dynamic from 'next/dynamic';
import Image from 'next/image';

const LoginContainer = dynamic(() => import('./LoginContainer'), { ssr: false });

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <header className="absolute top-0 w-full flex justify-center p-4">
        <Image
          src="/imagen01.jpeg"
          alt="Logo"
          width={100}
          height={100}
          className="rounded-full"
        />
      </header>
      <LoginContainer />
    </div>
  );
}
