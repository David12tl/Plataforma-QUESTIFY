'use client';

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Sidebar from '../../components/profesor/NavBar_Profesor';
import { createClient } from '@/utils/supabase/client';

export default function DashboardPage() {
  const [stats, setStats] = useState({ completadas: 0, pendientes: 0, clases: 0 });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadDashboardData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: usuario } = await supabase
        .from('usuarios')
        .select('id_usuario')
        .eq('id_auth', user.id)
        .single();

      if (!usuario) return;

      const { data: clases } = await supabase
        .from('clases')
        .select('*')
        .eq('id_profesor', usuario.id_usuario);

      if (clases) {
        const idsClases = clases.map(c => c.id_clase);
        
        const { data: tareas } = await supabase
          .from('tareas')
          .select('estado')
          .in('id_clase', idsClases);

        const completadas = tareas?.filter(t => t.estado?.toLowerCase() === 'completada').length || 0;
        const totalTareas = tareas?.length || 0;
        const pendientes = totalTareas - completadas;

        setStats({ completadas, pendientes, clases: clases.length });
      }
      setLoading(false);
    }
    loadDashboardData();
  }, [supabase]);

  const chartData = [
    { name: 'Completadas', val: stats.completadas },
    { name: 'Pendientes', val: stats.pendientes },
  ];

  return (
    // Cambiamos a flex-col en móvil para que el contenido fluya debajo del header del sidebar
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 font-syne">
      
      {/* SIDEBAR: Ya no lleva wrapper con 'hidden', él solo se gestiona */}
      <Sidebar />

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-4 md:p-8 w-full max-w-full overflow-x-hidden">
        <header className="mb-6 md:mb-10">
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-[#1c1917]">
            Dashboard Docente
          </h2>
          <p className="text-slate-500 text-sm font-bold uppercase">Resumen de actividad</p>
        </header>

        {/* STATS: 1 columna en móvil, 3 en escritorio */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <StatCard label="Clases Activas" val={stats.clases} />
          <StatCard label="Tareas Completadas" val={stats.completadas} />
          <StatCard label="Tareas Pendientes" val={stats.pendientes} />
        </div>

        {/* DASHBOARD GRID: Se apila en móvil */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
          
          {/* Gráfica: Ocupa 2 columnas en pantallas muy grandes */}
          <section className="xl:col-span-2 bg-white p-4 md:p-8 border-2 border-[#1c1917] shadow-[6px_6px_0px_0px_#1c1917]">
            <h3 className="text-lg md:text-xl font-black uppercase mb-6">Progreso de Tareas</h3>
            <div className="h-64 md:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis 
                    dataKey="name" 
                    stroke="#1c1917" 
                    tick={{fontSize: 12, fontWeight: 800}} 
                  />
                  <YAxis stroke="#1c1917" tick={{fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{ border: '2px solid #1c1917', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="val" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={index === 0 ? '#1c1917' : '#f97316'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Acciones Rápidas / Card Naranja */}
          <section className="bg-[#f97316] p-6 md:p-8 border-2 border-[#1c1917] shadow-[6px_6px_0px_0px_#1c1917] text-white flex flex-col justify-between">
            <div>
              <h3 className="text-lg md:text-xl font-black uppercase">Tareas por Evaluar</h3>
              <div className="text-6xl md:text-8xl font-black my-4 md:my-6">
                {loading ? '...' : stats.pendientes}
              </div>
            </div>
            <button className="w-full py-4 bg-[#1c1917] text-white font-black uppercase tracking-tighter hover:scale-[1.02] transition-all border-2 border-[#1c1917] active:translate-y-1">
              Ver Pendientes
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}

const StatCard = ({ label, val }: { label: string, val: number }) => (
  <div className="bg-white p-4 md:p-6 border-2 border-[#1c1917] shadow-[4px_4px_0px_0px_#1c1917] transition-transform hover:-translate-y-1">
    <p className="text-[10px] md:text-xs font-black uppercase text-slate-400">{label}</p>
    <h4 className="text-2xl md:text-3xl font-black text-[#1c1917]">{val}</h4>
  </div> 
);