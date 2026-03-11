'use client';

import React from 'react';
import Sidebar from '../../components/alumno/Navbar'; // Ajusta la ruta

const misClases = [
  { id: 1, title: 'Advanced Mathematics', teacher: 'Prof. Rossi', code: 'MATH101', img: '/materias/1.jpg' },
  { id: 2, title: 'Physics II', teacher: 'Prof. Bianchi', code: 'PHYS202', img: '/materias/2.jpg' },
];

export default function StudentDashboard() {
  return (
    <div className="flex min-h-screen bg-slate-50 font-syne">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <header className="mb-10">
          <h1 className="text-5xl font-black uppercase tracking-tighter text-[#1c1917]">Mis Clases</h1>
          <p className="text-slate-500 font-bold uppercase mt-2">Bienvenido, selecciona una materia para comenzar.</p>
        </header>

        {/* Grid de Tarjetas (Estilo Classroom) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {misClases.map((clase) => (
            <div key={clase.id} className="bg-white border-2 border-[#1c1917] shadow-[8px_8px_0px_0px_#1c1917] flex flex-col group">
              {/* Imagen de cabecera de la clase */}
              <div className="h-32 bg-slate-200 border-b-2 border-[#1c1917] relative overflow-hidden">
                <img src={clase.img} alt={clase.title} className="w-full h-full object-cover" />
              </div>
              
              <div className="p-6 flex-1">
                <h3 className="text-2xl font-black uppercase leading-none mb-2">{clase.title}</h3>
                <p className="font-bold text-[#f97316] mb-4 uppercase">{clase.teacher}</p>
                
                <div className="bg-slate-100 p-3 border-2 border-[#1c1917] font-black uppercase text-sm tracking-widest text-center">
                  Código: {clase.code}
                </div>
              </div>

              <div className="p-4 border-t-2 border-[#1c1917]">
                <button className="w-full py-3 bg-[#1c1917] text-white font-black uppercase hover:bg-[#f97316] transition-colors">
                  Entrar a la Clase
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}