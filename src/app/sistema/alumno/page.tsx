'use client';

import React, { useEffect, useState, useCallback } from 'react';
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

  const loadDashboard = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Obtener ID alumno interno (UUID)
    const { data: usuario } = await supabase.from('usuarios').select('id_usuario').eq('id_auth', user.id).single();
    if (!usuario) return;

    // 2. Clases Activas
    const { count: cCount } = await supabase.from('inscripciones').select('*', { count: 'exact' }).eq('id_alumno', usuario.id_usuario);

    // 3. Obtener IDs de tareas ya entregadas por este alumno
    const { data: entregas } = await supabase.from('entregas').select('id_tarea').eq('id_alumno', usuario.id_usuario);
    const idsEntregadas = entregas?.map(e => e.id_tarea) || [];

    // 4. Obtener clases del alumno para filtrar tareas
    const { data: inscripciones } = await supabase.from('inscripciones').select('id_clase').eq('id_alumno', usuario.id_usuario);
    const idsClases = inscripciones?.map(i => i.id_clase) || [];

    // 5. Tareas pendientes reales (excluyendo las ya entregadas)
    let queryPendientes = supabase
      .from('tareas')
      .select('*', { count: 'exact' })
      .in('id_clase', idsClases)
      .eq('estado', 'pendiente');

    if (idsEntregadas.length > 0) {
      queryPendientes = queryPendientes.not('id_tarea', 'in', `(${idsEntregadas.join(',')})`);
    }

    const { count: pCount } = await queryPendientes;

    // 6. Próxima Tarea (excluyendo entregadas)
    let queryProxima = supabase
      .from('tareas')
      .select('titulo, fecha_limite')
      .in('id_clase', idsClases)
      .eq('estado', 'pendiente')
      .gt('fecha_limite', new Date().toISOString())
      .order('fecha_limite', { ascending: true })
      .limit(1);

    if (idsEntregadas.length > 0) {
      queryProxima = queryProxima.not('id_tarea', 'in', `(${idsEntregadas.join(',')})`);
    }

    const { data: proxima } = await queryProxima.single();

    setData({
      clasesCount: cCount || 0,
      pendientesCount: pCount || 0,
      proximaTarea: proxima ? { titulo: proxima.titulo, fecha: new Date(proxima.fecha_limite).toLocaleDateString() } : null
    });
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (loading) return <div className="p-10 font-black text-4xl">CARGANDO...</div>;

  return (
    <div className="flex min-h-screen bg-[#fdfbf7] font-syne text-[#1c1917]">
      <main className="flex-1 p-10">
        <header className="mb-12">
          <h1 className="text-7xl font-black uppercase tracking-tighter">Bienvenido, Alumno</h1>
          <p className="text-2xl font-bold uppercase text-[#f97316]">Resumen de actividad académica</p>
        </header>

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
            <p className="text-2xl font-black uppercase">{data.proximaTarea?.titulo ?? '¡Nada pendiente!'}</p>
            <p className="text-sm font-bold">{data.proximaTarea?.fecha ?? ''}</p>
          </div>
        </div>

        <section className="border-4 border-[#1c1917] p-8">
          <h2 className="text-4xl font-black uppercase mb-6">Acciones Rápidas</h2>
          <div className="flex gap-4">
            <a href="clases" className="bg-[#1c1917] text-white px-8 py-4 font-black uppercase hover:bg-[#f97316] transition-colors">
              Ver Mis Clases
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}