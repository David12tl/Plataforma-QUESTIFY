'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';

// 1. Interfaz Limpia para el Estado del Componente
interface Entrega {
  id_entrega: number;
  calificacion: number | null;
  estado: string;
  usuarios: { nombre_completo: string; email: string } | null;
  tareas: { 
    titulo: string;
    clases: { nombre_materia: string } | null;
  } | null;
}

// 2. Interfaces Estrictas para la Respuesta de Supabase (Adiós al 'any')
interface ClaseRaw {
  nombre_materia: string;
}

interface TareaRaw {
  titulo: string;
  clases: ClaseRaw[] | ClaseRaw | null;
}

interface SupabaseResponse {
  id_entrega: number;
  calificacion: number | null;
  estado: string;
  usuarios: { nombre_completo: string; email: string }[] | { nombre_completo: string; email: string } | null;
  tareas: TareaRaw[] | TareaRaw | null;
}

export default function GradingPage() {
  const [entregas, setEntregas] = useState<Entrega[]>([]);
  const [loading, setLoading] = useState(true);
  const [edits, setEdits] = useState<Record<number, { calificacion: number; estado: string }>>({});
  
  const supabase = createClient();

  const loadEntregas = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('entregas')
      .select(`
        id_entrega,
        calificacion,
        estado,
        usuarios(nombre_completo, email),
        tareas(titulo, clases(nombre_materia))
      `);

    if (error) {
      console.error("Error cargando entregas:", error.message);
    } else if (data) {
      // Forzamos el tipo a nuestra interfaz de respuesta cruda
      const rawData = data as unknown as SupabaseResponse[];
      
      const formattedData: Entrega[] = rawData.map((item) => {
        // Normalizar Usuario
        const usuario = Array.isArray(item.usuarios) ? item.usuarios[0] : item.usuarios;
        
        // Normalizar Tarea
        const tareaRaw = Array.isArray(item.tareas) ? item.tareas[0] : item.tareas;
        
        // Normalizar Clase (dentro de la tarea)
        let claseFinal: ClaseRaw | null = null;
        if (tareaRaw?.clases) {
          claseFinal = Array.isArray(tareaRaw.clases) ? tareaRaw.clases[0] : tareaRaw.clases;
        }

        return {
          id_entrega: item.id_entrega,
          calificacion: item.calificacion,
          estado: item.estado,
          usuarios: usuario || null,
          tareas: tareaRaw ? {
            titulo: tareaRaw.titulo,
            clases: claseFinal
          } : null
        };
      });

      setEntregas(formattedData);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => { loadEntregas(); }, [loadEntregas]);

  const handleUpdateGrade = async (id: number) => {
    const edit = edits[id];
    if (!edit) return;

    const { error } = await supabase
      .from('entregas')
      .update({ 
        calificacion: edit.calificacion, 
        estado: edit.estado 
      })
      .eq('id_entrega', id);

    if (error) {
      alert("Error al guardar: " + error.message);
    } else {
      alert("¡Calificación guardada!");
      setEdits((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      loadEntregas();
    }
  };

  const entregasPorClase = entregas.reduce((acc, entrega) => {
    const materia = entrega.tareas?.clases?.nombre_materia || 'Sin Materia';
    if (!acc[materia]) acc[materia] = [];
    acc[materia].push(entrega);
    return acc;
  }, {} as Record<string, Entrega[]>);

  return (
    <div className="w-full p-6 bg-[#fdfbf7] min-h-screen font-syne">
      <header className="mb-8">
        <h2 className="text-4xl font-black uppercase tracking-tighter text-[#1c1917]">Panel de Calificaciones</h2>
      </header>
      
      {loading ? (
        <p className="font-black animate-pulse">CARGANDO ENTREGAS...</p>
      ) : (
        <div className="space-y-10">
          {Object.entries(entregasPorClase).map(([materia, listaEntregas]) => (
            <section key={materia} className="bg-white border-4 border-[#1c1917] p-6 shadow-[6px_6px_0px_0px_#1c1917]">
              <h3 className="text-2xl font-black uppercase mb-6 text-[#f97316] border-b-4 border-[#1c1917] pb-2">{materia}</h3>
              
              <div className="space-y-2">
                {listaEntregas.map((item) => {
                  const editData = edits[item.id_entrega] || { 
                    calificacion: item.calificacion ?? 0, 
                    estado: item.estado 
                  };

                  return (
                    <div key={item.id_entrega} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center p-4 border-b border-slate-200">
                      <div>
                        <p className="font-black text-lg uppercase text-[#1c1917]">{item.usuarios?.nombre_completo}</p>
                        <p className="text-sm font-black text-[#f97316] italic tracking-tight">{item.usuarios?.email}</p>
                      </div>

                      <p className="font-bold text-sm bg-slate-100 p-2 border-l-4 border-[#1c1917]">{item.tareas?.titulo}</p>

                      <input 
                        type="number" 
                        value={editData.calificacion}
                        className="border-2 border-[#1c1917] p-2 font-black w-20 text-center"
                        onChange={(e) => setEdits(prev => ({ 
                          ...prev, 
                          [item.id_entrega]: { ...editData, calificacion: Number(e.target.value) } 
                        }))}
                      />

                      <select 
                        value={editData.estado}
                        className="border-2 border-[#1c1917] p-2 uppercase text-xs font-black cursor-pointer"
                        onChange={(e) => setEdits(prev => ({ 
                          ...prev, 
                          [item.id_entrega]: { ...editData, estado: e.target.value } 
                        }))}
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="entregado">Entregado</option>
                        <option value="calificado">Calificado</option>
                      </select>

                      <button 
                        onClick={() => handleUpdateGrade(item.id_entrega)}
                        disabled={!edits[item.id_entrega]}
                        className={`px-4 py-2 text-xs font-black uppercase border-2 transition-all ${
                          edits[item.id_entrega] 
                            ? 'bg-[#f97316] text-white border-[#f97316] hover:bg-[#1c1917]' 
                            : 'bg-slate-200 text-slate-500 border-slate-300'
                        }`}
                      >
                        {edits[item.id_entrega] ? 'Guardar' : 'Sin cambios'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}