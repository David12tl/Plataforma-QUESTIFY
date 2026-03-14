'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { usePerfil } from '../../context/PerfilContext';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const { perfil, loading } = usePerfil();

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
    { name: 'Classes', icon: 'school', href: '/sistema/alumno/clases' },
    { name: 'Calificaciones', icon: 'school', href: '/sistema/alumno/calificaciones' },
    { name: 'Team', icon: 'groups', href: '/sistema/alumno/team' },
    { name: 'Settings', icon: 'settings', href: '/sistema/alumno/ajustes' },
  ];

  return (
    <>
      {/* --- NAVBAR MÓVIL (Horizontal) --- */}
      <nav className="md:hidden flex items-center justify-between p-4 bg-white border-b-4 border-[#1c1917] sticky top-0 z-50">
        <div className="relative w-24 h-8">
          <Image src="/IMAGITIPO.png" alt="Logo" fill className="object-contain" />
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 border-2 border-[#1c1917] bg-white">
          <span className="material-symbols-outlined text-2xl">{isOpen ? 'close' : 'menu'}</span>
        </button>
      </nav>

      {/* --- SIDEBAR (Lateral) --- */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r-4 border-[#1c1917] flex flex-col z-50 transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Brand */}
        <div className="p-6 mb-4 border-b-4 border-[#1c1917]">
          <div className="relative w-full h-12">
            <Image src="/IMAGITIPO.png" alt="Logo" fill className="object-contain" />
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 space-y-2 font-black uppercase tracking-tight">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all border-2 ${
                  isActive 
                    ? 'bg-[#f97316] text-white border-[#1c1917] shadow-[4px_4px_0px_0px_#1c1917]' 
                    : 'bg-white text-slate-600 border-transparent hover:bg-slate-100'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontFamily: 'Material Symbols Outlined' }}>
                  {item.icon}
                </span>
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer / Perfil */}
        <div className="p-4 border-t-4 border-[#1c1917] bg-slate-50 mt-auto">
          <div className="flex items-center gap-3 mb-4">
             <div className="size-8 rounded-full bg-slate-200 border-2 border-[#1c1917] flex items-center justify-center">
               <span className="material-symbols-outlined text-sm" style={{ fontFamily: 'Material Symbols Outlined' }}>person</span>
             </div>
             <div className="flex-1 min-w-0">
               <p className="text-xs font-black uppercase truncate">{loading ? '...' : (perfil?.nombre_usuario || 'Usuario')}</p>
             </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full text-left text-[10px] font-black uppercase text-red-600 hover:underline"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;