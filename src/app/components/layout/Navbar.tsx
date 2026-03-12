'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    // 'pt-[env(safe-area-inset-top)]' es la clave para evitar el notch
    <header className="sticky top-0 z-50 bg-white border-b-4 border-[#1c1917] px-4 md:px-20 h-20 flex items-center justify-between transition-all pt-[env(safe-area-inset-top)]">
      
      {/* LOGO */}
      <Link href="/" className="flex items-center">
        <div className="relative w-10 h-10 md:w-14 md:h-14">
          <Image src="/ISOTIPO.png" alt="Logo" fill className="object-contain" priority />
        </div>
      </Link>

      {/* Navegación Desktop */}
      <nav className="hidden md:flex items-center gap-6">
        <Link href="/auth/login" className="font-black text-[#1c1917] hover:text-[#f97316] uppercase text-xs">INICIA SESIÓN</Link>
        <Link href="/auth/registro" className="bg-[#f97316] text-white font-black px-4 py-2 uppercase border-2 border-[#1c1917] hover:shadow-none transition-all text-xs">REGISTRARSE</Link>
        <Link href="/sistema" className="bg-[#1c1917] text-white font-black px-6 py-2 uppercase border-2 border-[#1c1917] hover:bg-[#f97316] text-sm">ENTRAR</Link>
      </nav>

      {/* Botón Hamburguesa */}
      <button className="md:hidden p-2 text-[#1c1917]" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Menú Móvil */}
      {isOpen && (
        <div className="absolute top-[80px] left-0 w-full bg-white border-b-4 border-[#1c1917] flex flex-col p-6 gap-6 md:hidden shadow-xl">
          <Link href="/auth/login" className="font-black uppercase text-sm" onClick={() => setIsOpen(false)}>INICIA SESIÓN</Link>
          <Link href="/auth/registro" className="font-black uppercase text-sm" onClick={() => setIsOpen(false)}>REGISTRARSE</Link>
          <Link href="/sistema" className="bg-[#1c1917] text-white font-black p-4 text-center uppercase" onClick={() => setIsOpen(false)}>ENTRAR AL SISTEMA</Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;