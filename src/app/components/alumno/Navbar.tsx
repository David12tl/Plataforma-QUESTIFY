'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { usePerfil } from '../../context/PerfilContext';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  
  // Consumimos el perfil del contexto global
  const { perfil, loading } = usePerfil();

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
    <aside className="w-64 flex-shrink-0 border-r-2 border-[#1c1917] bg-white flex flex-col h-screen font-syne">
      
      {/* Header */}
      <div className="p-6 border-b-2 border-[#1c1917]">
         <div className="relative w-full h-12">
            <Image src="/IMAGITIPO.png" alt="Logo" fill className="object-contain" />
         </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-4 py-6 space-y-3">
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

      {/* Perfil (Datos del contexto) */}
      <div className="p-4 border-t-2 border-[#1c1917] space-y-4">
        <div className="flex items-center gap-3 p-2 border-2 border-[#1c1917] bg-slate-50">
          <div className="size-8 rounded-full bg-slate-200 border-2 border-[#1c1917] overflow-hidden flex items-center justify-center">
            <span className="material-symbols-outlined text-slate-500">person</span>
          </div>
          <div className="flex-1 min-w-0">
            {/* Usamos 'nombre_usuario' porque es el campo real en tu tabla */}
            <p className="text-xs font-black uppercase truncate">
              {loading ? 'Cargando...' : (perfil?.nombre_usuario || 'Usuario')}
            </p>
            {/* Usamos 'email' porque es el campo real en tu tabla */}
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
  );
};

export default Sidebar;