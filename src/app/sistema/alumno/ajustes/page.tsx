'use client';

import React from 'react';

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-slate-50 font-syne text-[#1c1917]">
      <main className="flex-1 p-8">
        <header className="mb-10">
          <h2 className="text-5xl font-black uppercase tracking-tighter">Ajustes</h2>
          <p className="font-bold uppercase text-[#f97316]">Configuración de tu Perfil</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tarjeta de Perfil */}
          <div className="bg-white border-2 border-[#1c1917] p-8 shadow-[8px_8px_0px_0px_#1c1917]">
            <h3 className="text-2xl font-black uppercase mb-6">Información Personal</h3>
            
            <div className="space-y-4">
              <label className="block font-black uppercase text-xs">Nombre Completo</label>
              <input type="text" className="w-full p-4 border-2 border-[#1c1917] font-bold uppercase" placeholder="Alex Rivers" />
              
              <label className="block font-black uppercase text-xs">Email Institucional</label>
              <input type="email" className="w-full p-4 border-2 border-[#1c1917] font-bold uppercase" placeholder="alex@questify.edu" />
            </div>
          </div>

          {/* Tarjeta de Seguridad */}
          <div className="bg-white border-2 border-[#1c1917] p-8 shadow-[8px_8px_0px_0px_#1c1917]">
            <h3 className="text-2xl font-black uppercase mb-6">Seguridad</h3>
            
            <div className="space-y-4">
              <label className="block font-black uppercase text-xs">Nueva Contraseña</label>
              <input type="password" className="w-full p-4 border-2 border-[#1c1917] font-bold uppercase" />
              
              <label className="block font-black uppercase text-xs">Confirmar Contraseña</label>
              <input type="password" className="w-full p-4 border-2 border-[#1c1917] font-bold uppercase" />
            </div>
          </div>
        </div>

        {/* Botón de Acción Principal */}
        <div className="mt-8 flex justify-end">
          <button className="bg-[#1c1917] text-white px-12 py-4 font-black uppercase border-2 border-[#1c1917] shadow-[6px_6px_0px_0px_#f97316] hover:shadow-none transition-all">
            Guardar Cambios
          </button>
        </div>
      </main>
    </div>
  );
}