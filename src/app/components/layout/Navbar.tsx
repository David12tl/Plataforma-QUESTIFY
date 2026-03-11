'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link'; // Importamos Link para navegación rápida

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b-4 border-[#1c1917] px-6 md:px-20 h-20 flex items-center justify-between">
      
      {/* LOGO: Ahora redirige a la página principal (/) */}
      <Link href="/" className="flex items-center gap-3 group transition-transform active:scale-95">
        <div className="relative w-10 h-10 flex items-center justify-center group-hover:shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] transition-all">
    <Image 
  src="/ISOTIPO.png" 
  alt="Logo" 
  width={150} // Cambia esto por un valor mayor
  height={150} // Ajusta proporcionalmente
  className="object-contain"
/>
      </div>
      </Link>

      {/* Navegación y CTA */}
      <nav className="flex items-center gap-4 md:gap-6">
        
        <Link href="/auth/login" className="font-black text-[#1c1917] hover:text-[#f97316] uppercase text-xs md:text-sm transition-colors">
          INICIAR SESIÓN
        </Link>

        {/* Botón de Registro */}
        <Link href="/auth/registro" className="hidden md:block bg-[#f97316] text-white font-black px-4 py-2 uppercase border-2 border-[#1c1917] shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all text-sm">
          REGISTRARSE
        </Link>

        {/* Botón Entrar (Dashboard) */}
        <Link href="/dashboard" className="bg-[#1c1917] text-white font-black px-6 py-2 uppercase border-2 border-[#1c1917] hover:bg-[#f97316] transition-colors text-sm">
          Entrar
        </Link>
        
      </nav>
    </header>
  );
};

export default Navbar;