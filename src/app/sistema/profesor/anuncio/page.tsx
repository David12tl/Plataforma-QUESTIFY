'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

// 1. Interfaces para tipado estricto (evitando el uso de 'any')
interface CountData {
  count: number | null;
}

interface SupabaseTareaResponse {
  id_tarea: string;
  titulo: string;
  id_clase: string;
  entregas: CountData[];
  clases: {
    inscripciones: CountData[];
  } | null;
}

interface TareaProcesada {
  id_tarea: string;
  titulo: string;
  id_clase: string;
  totalEntregas: number;
  totalAlumnos: number;
}

export default function AnnouncementsPage() {
  const [tareasProgreso, setTareasProgreso] = useState<TareaProcesada[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      // 2. Query tipada con .returns para asegurar la estructura
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
        `)
        .returns<SupabaseTareaResponse[]>();

      if (error) {
        console.error("Error cargando actividades:", error);
      } else if (data) {
        // 3. Mapeo seguro a TareaProcesada
        const procesado: TareaProcesada[] = data.map((t) => ({
          id_tarea: t.id_tarea,
          titulo: t.titulo,
          id_clase: t.id_clase,
          totalEntregas: Number(t.entregas?.[0]?.count ?? 0),
          totalAlumnos: Number(t.clases?.inscripciones?.[0]?.count ?? 0)
        }));
        setTareasProgreso(procesado);
      }
      setLoading(false);
    }

    loadData();
  }, [supabase]);

  return (
    <div className="w-full">
      <header className="mb-8 md:mb-10">
        <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-[#1c1917]">
          Actividades y Entregas
        </h2>
        <p className="text-slate-500 text-sm font-bold uppercase mt-1">Monitoreo de rendimiento</p>
      </header>
      
      {loading ? (
        <div className="flex items-center gap-3">
           <div className="animate-spin size-5 border-4 border-[#f97316] border-t-transparent rounded-full"></div>
           <p className="font-bold text-slate-600 uppercase text-xs tracking-widest">Cargando...</p>
        </div>
      ) : (
        <div className="space-y-4 md:space-y-6">
          {tareasProgreso.length > 0 ? (
            tareasProgreso.map((t) => {
              const porcentaje = t.totalAlumnos > 0 ? (t.totalEntregas / t.totalAlumnos) * 100 : 0;
              const isComplete = t.totalEntregas === t.totalAlumnos && t.totalAlumnos > 0;

              return (
                <div key={t.id_tarea} className="bg-white border-2 border-[#1c1917] p-5 md:p-6 shadow-[4px_4px_0px_0px_#1c1917]">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                    <span className={`text-[10px] font-black uppercase px-2 py-1 border border-[#1c1917] ${
                      isComplete ? 'bg-emerald-500 text-white' : 'bg-[#1c1917] text-white'
                    }`}>
                      {isComplete ? 'COMPLETADO' : 'EN CURSO'}
                    </span>
                    <span className="text-[11px] md:text-xs font-black text-slate-500 uppercase">
                      {t.totalEntregas} / {t.totalAlumnos} Entregas
                    </span>
                  </div>
                  
                  <h3 className="text-lg md:text-xl font-black uppercase mt-3 leading-tight">{t.titulo}</h3>
                  
                  <div className="mt-5">
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Progreso</span>
                      <span className="text-[10px] font-black text-[#1c1917]">{Math.round(porcentaje)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-4 border-2 border-[#1c1917]">
                      <div 
                        className="bg-[#f97316] h-full transition-all duration-700 ease-out" 
                        style={{ width: `${porcentaje}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white border-2 border-dashed border-slate-300 p-12 text-center">
              <p className="text-slate-400 font-bold uppercase text-sm">No hay tareas pendientes</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}