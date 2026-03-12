'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { usePerfil } from '../../context/PerfilContext';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  
  const { perfil, loading } = usePerfil();

  // Cerrar menú al cambiar de ruta
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const menuItems = [
    { name: 'Home', icon: 'home', href: '/sistema/alumno' },
    { name: 'Calendar', icon: 'calendar_today', href: '/sistema/alumno/calendario' },
    { name: 'Team', icon: 'group', href: '/sistema/alumno/team' },
    { name: 'Settings', icon: 'settings', href: '/sistema/alumno/ajustes' },
  ];

  return (
    <>
      {/* HEADER MÓVIL: visible solo en pantallas pequeñas */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b-2 border-[#1c1917] z-50">
        <div className="relative w-24 h-8">
            <Image src="/IMAGITIPO.png" alt="Logo" fill className="object-contain" />
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 border-2 border-[#1c1917] bg-white">
          <span className="material-symbols-outlined">{isOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {/* OVERLAY PARA MÓVIL */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed top-0 left-0 h-screen w-64 bg-white border-r-2 border-[#1c1917] flex flex-col font-syne z-50 transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Header (Escritorio) */}
        <div className="p-6 border-b-2 border-[#1c1917] hidden md:block">
           <div className="relative w-full h-12">
              <Image src="/IMAGITIPO.png" alt="Logo" fill className="object-contain" />
           </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-4 py-6 space-y-3 mt-10 md:mt-0">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 border-2 transition-all ${
                pathname === item.href 
                  ? 'bg-[#f97316] text-white border-[#1c1917] shadow-[4px_4px_0px_0px_#1c1917]' 
                  : 'bg-white text-[#1c1917] border-transparent hover:border-[#1c1917] hover:shadow-[2px_2px_0px_0px_#1c1917]'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
              <span className="text-sm font-black uppercase">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Perfil */}
        <div className="p-4 border-t-2 border-[#1c1917] space-y-4">
          <div className="flex items-center gap-3 p-2 border-2 border-[#1c1917] bg-slate-50">
            <div className="size-8 rounded-full bg-slate-200 border-2 border-[#1c1917] overflow-hidden flex items-center justify-center">
              <span className="material-symbols-outlined text-slate-500">person</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black uppercase truncate">
                {loading ? 'Cargando...' : (perfil?.nombre_usuario || 'Usuario')}
              </p>
              <p className="text-[9px] font-bold text-slate-500 truncate uppercase">
                {loading ? '...' : (perfil?.email || 'Sin correo')}
              </p>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-xs font-black uppercase text-red-600 hover:text-red-800 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;