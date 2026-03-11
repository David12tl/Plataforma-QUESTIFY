'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '../../../components/profesor/NavBar_Profesor';
import { createClient } from '@/utils/supabase/client';

export default function GradingPage() {
  const [entregas, setEntregas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadEntregas();
  }, []);

  async function loadEntregas() {
    setLoading(true);
    // Recuperamos entregas uniendo con alumnos y tareas
    const { data, error } = await supabase
      .from('entregas')
      .select(`
        id_entrega,
        calificacion,
        estado,
        comentarios,
        usuarios!entregas_id_alumno_fkey(nombre_completo),
        tareas(titulo)
      `);

    if (error) console.error("Error al cargar entregas:", error);
    else setEntregas(data || []);
    setLoading(false);
  }

  // Función para guardar calificación
  const handleUpdateGrade = async (id: number, calificacion: number, estado: string) => {
    const { error } = await supabase
      .from('entregas')
      .update({ calificacion, estado })
      .eq('id_entrega', id);

    if (error) alert("Error al guardar: " + error.message);
    else {
      alert("Calificación guardada!");
      loadEntregas();
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <h2 className="text-4xl font-black uppercase font-syne mb-10">Panel de Calificaciones</h2>
        
        <section className="bg-white border-2 border-[#1c1917] shadow-[6px_6px_0px_0px_#1c1917] p-8">
          {loading ? (
            <p className="font-bold">Cargando entregas...</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-[#1c1917] uppercase text-xs font-black">
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
                    <td className="p-4">{item.tareas?.titulo}</td>
                    <td className="p-4">
                      <input 
                        type="number" 
                        defaultValue={item.calificacion} 
                        className="w-16 border-2 border-[#1c1917] p-1 font-black"
                        onChange={(e) => item.tempNota = e.target.value}
                      />
                    </td>
                    <td className="p-4">
                      <select 
                        defaultValue={item.estado}
                        className="border-2 border-[#1c1917] p-1 uppercase text-xs font-black"
                        onChange={(e) => item.tempEstado = e.target.value}
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="entregado">Entregado</option>
                        <option value="calificado">Calificado</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => handleUpdateGrade(item.id_entrega, item.tempNota || item.calificacion, item.tempEstado || item.estado)}
                        className="bg-[#1c1917] text-white px-4 py-2 text-xs font-black uppercase hover:bg-orange-600"
                      >
                        Guardar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
}