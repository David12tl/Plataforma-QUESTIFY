'use client';

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Sidebar from '../../components/profesor/NavBar_Profesor';
import { createClient } from '@/utils/supabase/client';

export default function DashboardPage() {
  const [stats, setStats] = useState({ completadas: 0, pendientes: 0, clases: 0 });
  const [clasesList, setClasesList] = useState<any[]>([]);
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

      if (clases && clases.length > 0) {
        setClasesList(clases);
        const idsClases = clases.map(c => c.id_clase);
        
        const { data: tareas } = await supabase
          .from('tareas')
          .select('estado')
          .in('id_clase', idsClases);

        if (tareas) {
          // Normalizamos estados a minúsculas para el conteo
          const completadas = tareas.filter(t => t.estado?.toLowerCase() === 'completada').length;
          const pendientes = tareas.length - completadas;

          setStats({ completadas, pendientes, clases: clases.length });
        }
      }
    }
    loadDashboardData();
  }, [supabase]);

  // Datos para la gráfica
  const chartData = [
    { name: 'Completadas', val: stats.completadas },
    { name: 'Pendientes', val: stats.pendientes },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="hidden md:block w-64 flex-shrink-0">
        <Sidebar />
      </div>

      <main className="flex-1 p-4 md:p-8">
        <header className="mb-10">
          <h2 className="text-4xl font-black uppercase tracking-tighter text-[#1c1917] font-syne">Dashboard Docente</h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard label="Clases Activas" val={stats.clases} />
          <StatCard label="Tareas Completadas" val={stats.completadas} />
          <StatCard label="Tareas Pendientes" val={stats.pendientes} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Gráfica */}
          <section className="xl:col-span-2 bg-white p-8 border-2 border-[#1c1917] shadow-[6px_6px_0px_0px_#1c1917]">
            <h3 className="text-xl font-black uppercase font-syne mb-6">Progreso de Tareas</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#1c1917" tick={{fontFamily: 'Syne', fontWeight: 800}} />
                  <YAxis stroke="#1c1917" />
                  <Tooltip cursor={{fill: '#f1f5f9'}} />
                  <Bar dataKey="val">
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={index === 0 ? '#1c1917' : '#f97316'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Acciones */}
          <section className="bg-[#f97316] p-8 border-2 border-[#1c1917] shadow-[6px_6px_0px_0px_#1c1917] text-white flex flex-col justify-between">
            <h3 className="text-xl font-black uppercase font-syne">Tareas por Evaluar</h3>
            <div className="text-8xl font-black my-4">{stats.pendientes}</div>
            <button className="w-full py-4 bg-[#1c1917] font-black uppercase tracking-tighter hover:bg-black transition-colors">Ver Pendientes</button>
          </section>
        </div>
      </main>
    </div>
  );
}

const StatCard = ({ label, val }: { label: string, val: number }) => (
  <div className="bg-white p-6 border-2 border-[#1c1917] shadow-[4px_4px_0px_0px_#1c1917]">
    <p className="text-xs font-black uppercase text-slate-400 font-syne">{label}</p>
    <h4 className="text-3xl font-black font-syne text-[#1c1917]">{val}</h4>
  </div> 
);