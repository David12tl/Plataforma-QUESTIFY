'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '../../../components/profesor/NavBar_Profesor';
import { createClient } from '@/utils/supabase/client';

export default function AnnouncementsPage() {
  const [tareasProgreso, setTareasProgreso] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      // Consultamos tareas y sus relaciones
      const { data, error } = await supabase
        .from('tareas')
        .select(`
          id_tarea,
          titulo,
          id_clase,
          entregas(count),
          clases(
            inscripciones(count)
          )
        `);

      if (error) {
        console.error("Error cargando actividades:", error);
      } else if (data) {
        // Mapeo seguro con validación de tipos
        const procesado = data.map((t: any) => {
          // Extraer entregas: supabase devuelve un arreglo de objetos [{count: ...}]
          const entregas = t.entregas?.[0]?.count || 0;
          
          // Extraer inscripciones: acceden a clases -> arreglo de inscripciones
          const inscripciones = t.clases?.inscripciones?.[0]?.count || 0;

          return {
            ...t,
            totalEntregas: Number(entregas),
            totalAlumnos: Number(inscripciones)
          };
        });
        setTareasProgreso(procesado);
      }
      setLoading(false);
    }

    loadData();
  }, [supabase]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <h2 className="text-4xl font-black uppercase font-syne mb-10">Actividades y Entregas</h2>
        
        {loading ? (
          <p className="font-bold">Cargando actividades...</p>
        ) : (
          <div className="space-y-6">
            {tareasProgreso.length > 0 ? (
              tareasProgreso.map((t) => (
                <div key={t.id_tarea} className="bg-white border-2 border-[#1c1917] p-6 shadow-[4px_4px_0px_0px_#1c1917]">
                  <div className="flex justify-between items-start">
                    <span className={`text-[10px] font-black uppercase px-2 py-1 ${
                      t.totalEntregas === t.totalAlumnos && t.totalAlumnos > 0 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-[#1c1917] text-white'
                    }`}>
                      {t.totalEntregas === t.totalAlumnos && t.totalAlumnos > 0 ? 'COMPLETADO' : 'EN CURSO'}
                    </span>
                    <span className="text-xs font-black text-slate-500">
                      {t.totalEntregas} / {t.totalAlumnos} Entregas recibidas
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-black uppercase mt-2">{t.titulo}</h3>
                  
                  {/* Barra de progreso visual */}
                  <div className="w-full bg-slate-200 h-2 mt-4 border border-[#1c1917]">
                    <div 
                      className="bg-[#f97316] h-full transition-all duration-500" 
                      style={{ width: `${t.totalAlumnos > 0 ? (t.totalEntregas / t.totalAlumnos) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 font-bold border-2 border-dashed p-6 text-center">
                No hay actividades publicadas actualmente.
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}