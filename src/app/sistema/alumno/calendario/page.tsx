'use client';

import React from 'react';
import Sidebar from '../../../components/alumno/Navbar';

export default function CalendarPage() {
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="flex min-h-screen bg-slate-50 font-syne text-[#1c1917]">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <header className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-5xl font-black uppercase tracking-tighter">Calendario</h2>
            <p className="font-bold uppercase text-[#f97316]">Marzo 2026</p>
          </div>
          
          <div className="flex border-2 border-[#1c1917] bg-white shadow-[4px_4px_0px_0px_#1c1917]">
            <button className="px-4 py-2 border-r-2 border-[#1c1917] font-black uppercase hover:bg-slate-100">Ant</button>
            <button className="px-4 py-2 font-black uppercase bg-[#f97316] text-white">Hoy</button>
            <button className="px-4 py-2 border-l-2 border-[#1c1917] font-black uppercase hover:bg-slate-100">Sig</button>
          </div>
        </header>

        {/* Grid del Calendario */}
        <div className="bg-white border-2 border-[#1c1917] shadow-[8px_8px_0px_0px_#1c1917]">
          {/* Cabecera de días */}
          <div className="grid grid-cols-7 border-b-2 border-[#1c1917]">
            {days.map((day) => (
              <div key={day} className="py-3 text-center font-black uppercase border-r-2 border-[#1c1917] last:border-r-0">
                {day}
              </div>
            ))}
          </div>

          {/* Días del mes */}
          <div className="grid grid-cols-7">
            {dates.map((date) => (
              <div 
                key={date} 
                className="h-32 border-b-2 border-r-2 border-[#1c1917] p-2 hover:bg-slate-50 transition-colors"
              >
                <span className="font-black text-sm">{date}</span>
                {/* Ejemplo de evento */}
                {date === 10 && (
                  <div className="mt-2 bg-[#f97316] text-white text-[10px] p-1 font-bold uppercase border border-[#1c1917]">
                    Examen Final
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}