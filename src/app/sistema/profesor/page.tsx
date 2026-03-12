'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { createClient } from '@/utils/supabase/client';

interface Stats {
  completadas: number;
  pendientes: number;
  clases: number;
}

interface ChartEntry {
  name: string;
  val: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ completadas: 0, pendientes: 0, clases: 0 });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
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
      .select('id_clase')
      .eq('id_profesor', usuario.id_usuario);

    if (clases && clases.length > 0) {
      const idsClases = clases.map((c) => c.id_clase);
      
      const { data: tareas } = await supabase
        .from('tareas')
        .select('estado')
        .in('id_clase', idsClases);

      const completadas = tareas?.filter((t) => t.estado?.toLowerCase() === 'completada').length || 0;
      const totalTareas = tareas?.length || 0;
      const pendientes = totalTareas - completadas;

      setStats({ completadas, pendientes, clases: clases.length });
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const chartData: ChartEntry[] = [
    { name: 'Completadas', val: stats.completadas },
    { name: 'Pendientes', val: stats.pendientes },
  ];

  return (
    // Ya no necesitas el contenedor 'flex' ni 'Sidebar' aquí.
    // El layout se encarga de posicionar esto dentro del <main>.
    <div className="w-full">
      <header className="mb-8">
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-[#1c1917]">
          Dashboard
        </h2>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Panel de control docente</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Clases" val={stats.clases} />
        <StatCard label="Completadas" val={stats.completadas} />
        <StatCard label="Pendientes" val={stats.pendientes} />
      </div>

      {/* Layout de Dashboard Principal */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <section className="xl:col-span-2 bg-white p-4 md:p-6 border-4 border-[#1c1917] shadow-[6px_6px_0px_0px_#1c1917]">
          <h3 className="text-md font-black uppercase mb-6">Progreso Académico</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#1c1917" tick={{fontSize: 10, fontWeight: 900}} />
                <YAxis stroke="#1c1917" tick={{fontSize: 10}} />
                <Tooltip cursor={{fill: '#f1f5f9'}} />
                <Bar dataKey="val" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={index === 0 ? '#1c1917' : '#f97316'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-[#f97316] p-6 border-4 border-[#1c1917] shadow-[6px_6px_0px_0px_#1c1917] text-white flex flex-col justify-between">
          <div>
            <h3 className="font-black uppercase text-xl">Pendientes</h3>
            <p className="text-7xl font-black mt-2">{loading ? '...' : stats.pendientes}</p>
          </div>
          <button className="w-full mt-8 py-3 bg-[#1c1917] text-white font-black uppercase text-sm hover:bg-black transition-all">
            Gestionar Tareas
          </button>
        </section>
      </div>
    </div>
  );
}

const StatCard = ({ label, val }: { label: string, val: number }) => (
  <div className="bg-white p-4 border-4 border-[#1c1917] shadow-[4px_4px_0px_0px_#1c1917]">
    <p className="text-[10px] font-black uppercase text-slate-400">{label}</p>
    <h4 className="text-3xl font-black text-[#1c1917]">{val}</h4>
  </div>
);