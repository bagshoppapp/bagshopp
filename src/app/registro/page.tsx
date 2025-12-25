"use client";

// Originalmente se usaba `next/dynamic` aquí, pero no es necesario y puede causar problemas
// en el empaquetado si el componente importado ya es de cliente.
// La forma más directa es simplemente exportar el componente de cliente.

export { default } from './RegistroContainer';
