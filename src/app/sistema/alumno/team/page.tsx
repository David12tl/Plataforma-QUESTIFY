'use client';

import React from 'react';
import Sidebar from '../../../components/alumno/Navbar';

const teamMembers = [
  { id: 1, name: 'Marco Rossi', email: 'marco@questify.edu', role: 'Estudiante', status: 'Activo' },
  { id: 2, name: 'Elena Bianchi', email: 'elena@questify.edu', role: 'Estudiante', status: 'En Espera' },
  { id: 3, name: 'Luca Verdi', email: 'luca@questify.edu', role: 'Estudiante', status: 'Activo' },
];

export default function TeamPage() {
  return (
    <div className="flex min-h-screen bg-slate-50 font-syne text-[#1c1917]">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <header className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-5xl font-black uppercase tracking-tighter">Team</h2>
            <p className="font-bold uppercase text-[#f97316]">Gestión de Estudiantes</p>
          </div>
          
          <button className="bg-[#1c1917] text-white px-8 py-4 font-black uppercase border-2 border-[#1c1917] shadow-[6px_6px_0px_0px_#f97316] hover:shadow-none transition-all">
            + Añadir Alumno
          </button>
        </header>

        {/* Tabla de Team */}
        <div className="bg-white border-2 border-[#1c1917] shadow-[8px_8px_0px_0px_#1c1917]">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#f97316] border-b-2 border-[#1c1917] text-white">
              <tr>
                <th className="p-6 font-black uppercase">Nombre</th>
                <th className="p-6 font-black uppercase">Email</th>
                <th className="p-6 font-black uppercase">Estado</th>
                <th className="p-6 font-black uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-[#1c1917]">
              {teamMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-100 transition-colors">
                  <td className="p-6 font-black uppercase">{member.name}</td>
                  <td className="p-6 font-bold">{member.email}</td>
                  <td className="p-6">
                    <span className={`px-3 py-1 font-black uppercase text-[10px] border-2 border-[#1c1917] ${
                      member.status === 'Activo' ? 'bg-white' : 'bg-slate-200'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="p-6">
                    <button className="font-black uppercase text-xs underline decoration-2 decoration-[#f97316]">
                      Gestionar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}