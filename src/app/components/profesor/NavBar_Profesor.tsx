'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserEmail(user.email || null);
    };
    fetchUser();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const navItems = [
    { name: 'Dashboard', icon: 'dashboard', href: '/sistema/profesor' },
    { name: 'Classes', icon: 'school', href: '/sistema/profesor/clases' },
    { name: 'Grading', icon: 'grade', href: '/sistema/profesor/grading' },
    { name: 'Announcements', icon: 'campaign', href: '/sistema/profesor/anuncio' },
    { name: 'Students', icon: 'group', href: '/sistema/profesor/estudiantes' },
  ];

  return (
    <aside className="fixed md:static inset-y-0 left-0 w-64 bg-white border-r border-slate-200 h-screen p-6 flex flex-col z-50">
      
      {/* Brand area */}
      <div className="flex items-center gap-3 mb-10">
        <div className="relative w-12 h-12">
           <Image src="/ISOTIPO.png" alt="Logo" fill className="object-contain" />
        </div>
        <h1 className="text-slate-900 text-2xl font-black uppercase tracking-tighter font-syne leading-none">
          Questify
        </h1>
      </div>

      {/* Navegación */}
      <nav className="flex-1 flex flex-col gap-2 font-syne uppercase tracking-tight">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-[#f97316] text-white shadow-[4px_4px_0px_0px_#1c1917]' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-[#1c1917]'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-bold">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer del Sidebar */}
      <div className="mt-auto pt-6 border-t border-slate-100 flex flex-col gap-3">
        {/* Visualización de sesión */}
        {userEmail && (
          <div className="px-2 mb-2">
            <p className="text-[10px] uppercase font-bold text-slate-400">Sesión activa</p>
            <p className="text-xs font-semibold text-slate-700 truncate">{userEmail}</p>
          </div>
        )}
        
        <button className="w-full bg-[#1c1917] text-white font-black uppercase tracking-tighter py-3 px-4 rounded-xl shadow-[4px_4px_0px_0px_#f97316] hover:shadow-none transition-all">
          Crear Tarea
        </button>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-red-600 font-bold uppercase tracking-tight py-2 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;