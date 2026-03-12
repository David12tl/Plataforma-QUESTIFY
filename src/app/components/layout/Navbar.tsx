'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b-4 border-[#1c1917] px-4 md:px-20 h-20 flex items-center justify-between transition-all">
      
      {/* LOGO: Ajustado para que el isologo no se deforme */}
      <Link href="/" className="flex items-center gap-3">
        <div className="relative w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
          <Image 
            src="/ISOTIPO.png" 
            alt="Logo" 
            width={60} 
            height={60} 
            className="object-contain"
            priority
          />
        </div>
      </Link>

      {/* Navegación y CTA */}
      <nav className="flex items-center gap-2 md:gap-6">
        
        {/* INICIAR SESIÓN: Oculto en móviles muy pequeños para dar espacio */}
        <Link href="/auth/login" className="hidden sm:block font-black text-[#1c1917] hover:text-[#f97316] uppercase text-[10px] md:text-xs transition-colors">
          SESIÓN
        </Link>

        {/* REGISTRARSE: Oculto en móviles, visible en tablet/desktop */}
        <Link href="/auth/registro" className="hidden md:block bg-[#f97316] text-white font-black px-4 py-2 uppercase border-2 border-[#1c1917] shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] hover:shadow-none transition-all text-xs">
          REGISTRARSE
        </Link>

        {/* BOTÓN ENTAR: Visible siempre, es la acción principal */}
        <Link href="/sistema" className="bg-[#1c1917] text-white font-black px-4 md:px-6 py-2 uppercase border-2 border-[#1c1917] hover:bg-[#f97316] transition-colors text-[10px] md:text-sm">
          ENTRAR
        </Link>
        
      </nav>
    </header>
  );
};

export default Navbar;