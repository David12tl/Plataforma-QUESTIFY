'use client';

import React from 'react';
import Sidebar from '../../../../components/alumno/Navbar';

export default function ClassDetailPage() {
  return (
    <div className="flex min-h-screen bg-slate-50 font-syne text-[#1c1917]">
      <Sidebar />
      
      <main className="flex-1 p-8">
        {/* Cabecera de la Clase */}
        <div className="bg-[#1c1917] text-white p-10 mb-8 border-2 border-[#1c1917] shadow-[8px_8px_0px_0px_#f97316]">
          <h1 className="text-6xl font-black uppercase tracking-tighter">Advanced Mathematics</h1>
          <p className="text-xl font-bold uppercase mt-2 opacity-80">Prof. Rossi • Sección A</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Panel Principal: Muro de Tareas */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white border-2 border-[#1c1917] p-6 shadow-[4px_4px_0px_0px_#1c1917]">
              <h3 className="text-xl font-black uppercase mb-4">Anuncios Recientes</h3>
              <div className="border-2 border-[#1c1917] p-4 bg-slate-50">
                <p className="font-bold text-sm uppercase">¡Recordatorio!</p>
                <p className="font-medium">El examen final será el próximo viernes. Asegúrense de revisar el material en el apartado de documentos.</p>
              </div>
            </div>

            <div className="bg-white border-2 border-[#1c1917] p-6 shadow-[4px_4px_0px_0px_#1c1917]">
              <h3 className="text-xl font-black uppercase mb-4">Tareas Pendientes</h3>
              <div className="flex justify-between items-center p-4 border-2 border-[#1c1917] hover:bg-[#f97316] hover:text-white transition-colors cursor-pointer">
                <span className="font-black uppercase">Entrega de Proyecto Final</span>
                <span className="text-xs font-black uppercase bg-white text-[#1c1917] px-2 py-1">Vence hoy</span>
              </div>
            </div>
          </div>

          {/* Panel Lateral: Info/Código */}
          <div className="space-y-6">
            <div className="bg-white border-2 border-[#1c1917] p-6 shadow-[4px_4px_0px_0px_#1c1917]">
              <h4 className="font-black uppercase mb-2">Código de Clase</h4>
              <div className="bg-[#f97316] text-white text-center py-4 font-black text-2xl tracking-widest border-2 border-[#1c1917]">
                MATH101
              </div>
            </div>

            <div className="bg-white border-2 border-[#1c1917] p-6 shadow-[4px_4px_0px_0px_#1c1917]">
              <h4 className="font-black uppercase mb-2">Miembros</h4>
              <ul className="text-sm font-bold uppercase space-y-2">
                <li>• 24 Estudiantes</li>
                <li>• 1 Profesor</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}