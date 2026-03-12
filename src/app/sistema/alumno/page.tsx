'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface DashboardData {
  clasesCount: number;
  pendientesCount: number;
  proximaTarea: { titulo: string; fecha: string } | null;
}

export default function StudentDashboard() {
  const [data, setData] = useState<DashboardData>({ clasesCount: 0, pendientesCount: 0, proximaTarea: null });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadDashboard() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // 1. Obtener ID alumno
      const { data: user } = await supabase.from('usuarios').select('id_usuario').eq('id_auth', session.user.id).single();
      
      if (user) {
        // 2. Contar clases e inscripciones
        const { count: cCount } = await supabase.from('inscripciones').select('*', { count: 'exact' }).eq('id_alumno', user.id_usuario);
        
        // 3. Contar tareas pendientes (donde id_clase pertenece a alumno)
        const { count: pCount } = await supabase
          .from('tareas')
          .select('*', { count: 'exact' })
          .eq('estado', 'pendiente');

        setData({
          clasesCount: cCount || 0,
          pendientesCount: pCount || 0,
          proximaTarea: { titulo: 'Examen de Cálculo', fecha: '15 Mar' } // Mock de tarea
        });
      }
      setLoading(false);
    }
    loadDashboard();
  }, [supabase]);

  if (loading) return <div className="p-10 font-black text-4xl">CARGANDO...</div>;

  return (
    <div className="flex min-h-screen bg-[#fdfbf7] font-syne text-[#1c1917]">
      <main className="flex-1 p-10">
        <header className="mb-12">
          <h1 className="text-7xl font-black uppercase tracking-tighter">Bienvenido, Alumno</h1>
          <p className="text-2xl font-bold uppercase text-[#f97316]">Resumen de actividad académica</p>
        </header>

        

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="border-4 border-[#1c1917] p-8 shadow-[8px_8px_0px_0px_#1c1917]">
            <h3 className="text-xl font-black uppercase">Clases Activas</h3>
            <p className="text-6xl font-black">{data.clasesCount}</p>
          </div>
          <div className="border-4 border-[#1c1917] p-8 shadow-[8px_8px_0px_0px_#1c1917]">
            <h3 className="text-xl font-black uppercase">Pendientes</h3>
            <p className="text-6xl font-black text-[#f97316]">{data.pendientesCount}</p>
          </div>
          <div className="border-4 border-[#1c1917] p-8 shadow-[8px_8px_0px_0px_#1c1917]">
            <h3 className="text-xl font-black uppercase">Próxima Entrega</h3>
            <p className="text-2xl font-black uppercase">{data.proximaTarea?.titulo ?? 'Nada pendiente'}</p>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <section className="border-4 border-[#1c1917] p-8">
          <h2 className="text-4xl font-black uppercase mb-6">Acciones Rápidas</h2>
          <div className="flex gap-4">
            <button className="bg-[#1c1917] text-white px-8 py-4 font-black uppercase hover:bg-[#f97316] transition-colors">
              Ver Tareas
            </button>
            <button className="border-2 border-[#1c1917] px-8 py-4 font-black uppercase hover:bg-slate-100 transition-colors">
              Mi Calendario
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}