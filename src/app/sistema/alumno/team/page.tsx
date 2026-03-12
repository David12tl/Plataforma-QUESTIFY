'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface Usuario {
  id_usuario: number;
  nombre_completo: string;
  email: string;
  rol: string;
  estado: string;
}

export default function TeamPage() {
  const [team, setTeam] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchTeam = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('usuarios')
        .select('id_usuario, nombre_completo, email, rol, estado');
      
      if (data) setTeam(data as Usuario[]);
      setLoading(false);
    };

    fetchTeam();
  }, [supabase]);

  return (
    <div className="flex min-h-screen bg-[#fdfbf7] font-syne text-[#1c1917]">
      <main className="flex-1 p-8">
        <header className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-6xl font-black uppercase tracking-tighter">Team</h2>
            <p className="font-black uppercase text-[#f97316] text-xl">Gestión de Estudiantes</p>
          </div>
          
          <button className="bg-[#1c1917] text-white px-8 py-4 font-black uppercase border-4 border-[#1c1917] shadow-[6px_6px_0px_0px_#f97316] hover:shadow-none transition-all">
            + Añadir Alumno
          </button>
        </header>

        {loading ? (
          <div className="font-black">CARGANDO EQUIPO...</div>
        ) : (
          <div className="bg-white border-4 border-[#1c1917] shadow-[8px_8px_0px_0px_#1c1917]">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#1c1917] text-white">
                <tr>
                  <th className="p-6 font-black uppercase">Nombre</th>
                  <th className="p-6 font-black uppercase">Email</th>
                  <th className="p-6 font-black uppercase">Estado</th>
                  <th className="p-6 font-black uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y-4 divide-[#1c1917]">
                {team.map((member) => (
                  <tr key={member.id_usuario} className="hover:bg-[#f97316]/10 transition-colors">
                    <td className="p-6 font-black uppercase">{member.nombre_completo}</td>
                    <td className="p-6 font-bold">{member.email}</td>
                    <td className="p-6">
                      <span className={`px-4 py-2 font-black uppercase border-2 border-[#1c1917] ${
                        member.estado === 'Activo' ? 'bg-white' : 'bg-slate-200'
                      }`}>
                        {member.estado}
                      </span>
                    </td>
                    <td className="p-6">
                      <button className="font-black uppercase underline decoration-2 decoration-[#f97316] hover:text-[#f97316]">
                        Gestionar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}