'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';

// --- Interfaces para Tipado Estricto ---
interface Entrega {
  id_entrega: number;
  calificacion: number | null;
  estado: string;
  comentarios: string | null;
  usuarios: { nombre_completo: string } | null;
  tareas: { titulo: string } | null;
}

export default function GradingPage() {
  const [entregas, setEntregas] = useState<Entrega[]>([]);
  const [loading, setLoading] = useState(true);
  const [edits, setEdits] = useState<Record<number, { calificacion: number; estado: string }>>({});
  
  const supabase = createClient();

  const loadEntregas = useCallback(async () => {
    setLoading(true);
    // Tipado directo en la consulta
    const { data, error } = await supabase
      .from('entregas')
      .select(`
        id_entrega,
        calificacion,
        estado,
        comentarios,
        usuarios(nombre_completo),
        tareas(titulo)
      `)
      .returns<Entrega[]>();

    if (error) {
      console.error("Error al cargar entregas:", error.message);
    } else {
      setEntregas(data || []);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadEntregas();
  }, [loadEntregas]);

  const handleUpdateGrade = async (id: number) => {
    const edit = edits[id];
    if (!edit) return;

    const { error } = await supabase
      .from('entregas')
      .update({ calificacion: edit.calificacion, estado: edit.estado })
      .eq('id_entrega', id);

    if (error) {
      alert("Error al guardar: " + error.message);
    } else {
      alert("Calificación guardada!");
      setEdits((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      loadEntregas();
    }
  };

  return (
    // Sin Sidebar ni envoltorio flex: el layout global maneja la estructura
    <div className="w-full">
      <header className="mb-8">
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-[#1c1917]">Panel de Calificaciones</h2>
      </header>
      
      <section className="bg-white border-4 border-[#1c1917] shadow-[6px_6px_0px_0px_#1c1917] p-4 md:p-8">
        {loading ? (
          <p className="font-black text-slate-400 animate-pulse">CARGANDO ENTREGAS...</p>
        ) : (
          <div className="space-y-4">
            {/* Tabla para Escritorio */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-4 border-[#1c1917] uppercase text-[10px] font-black">
                    <th className="p-4">Estudiante</th>
                    <th className="p-4">Tarea</th>
                    <th className="p-4">Calificación</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {entregas.map((item) => (
                    <tr key={item.id_entrega} className="border-b border-slate-200">
                      <td className="p-4 font-bold">{item.usuarios?.nombre_completo}</td>
                      <td className="p-4 text-slate-600">{item.tareas?.titulo}</td>
                      <td className="p-4">
                        <input 
                          type="number" 
                          defaultValue={item.calificacion || 0} 
                          className="w-20 border-2 border-[#1c1917] p-2 font-black"
                          onChange={(e) => setEdits(prev => ({ 
                            ...prev, 
                            [item.id_entrega]: { calificacion: Number(e.target.value), estado: edits[item.id_entrega]?.estado || item.estado } 
                          }))}
                        />
                      </td>
                      <td className="p-4">
                        <select 
                          defaultValue={item.estado}
                          className="border-2 border-[#1c1917] p-2 uppercase text-[10px] font-black"
                          onChange={(e) => setEdits(prev => ({ 
                            ...prev, 
                            [item.id_entrega]: { calificacion: edits[item.id_entrega]?.calificacion || item.calificacion || 0, estado: e.target.value } 
                          }))}
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="entregado">Entregado</option>
                          <option value="calificado">Calificado</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <button 
                          onClick={() => handleUpdateGrade(item.id_entrega)}
                          className={`px-4 py-2 text-[10px] font-black uppercase border-2 border-[#1c1917] ${edits[item.id_entrega] ? 'bg-[#f97316] text-white' : 'bg-slate-200'}`}
                        >
                          {edits[item.id_entrega] ? 'Guardar' : 'Sin cambios'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Lista para Móvil */}
            <div className="md:hidden space-y-4">
              {entregas.map((item) => (
                <div key={item.id_entrega} className="border-2 border-[#1c1917] p-4 space-y-3">
                  <p className="font-black text-sm uppercase">{item.usuarios?.nombre_completo}</p>
                  <p className="text-xs text-slate-500">{item.tareas?.titulo}</p>
                  <div className="flex gap-2">
                     <input type="number" defaultValue={item.calificacion || 0} className="w-full border-2 border-[#1c1917] p-2" onChange={(e) => setEdits(prev => ({ ...prev, [item.id_entrega]: { calificacion: Number(e.target.value), estado: edits[item.id_entrega]?.estado || item.estado } }))} />
                     <select 
                          defaultValue={item.estado} 
                          className="w-full border-2 border-[#1c1917] p-2 text-[10px]" 
                          onChange={(e) => setEdits(prev => ({ 
                            ...prev, 
                            [item.id_entrega]: { 
                              calificacion: edits[item.id_entrega]?.calificacion || item.calificacion || 0, 
                              estado: e.target.value 
                            } 
                          }))}
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="entregado">Entregado</option>
                          <option value="calificado">Calificado</option>
                        </select>
                  </div>
                  <button onClick={() => handleUpdateGrade(item.id_entrega)} className="w-full bg-[#1c1917] text-white p-2 font-black uppercase text-xs">Guardar</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}