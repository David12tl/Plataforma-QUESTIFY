'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

interface Tarea {
  id_tarea: number;
  titulo: string;
  descripcion: string;
  fecha_limite: string;
  estado: string;
}

export default function ClaseDetallePage() {
  const { id } = useParams();
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [tareaSeleccionada, setTareaSeleccionada] = useState<Tarea | null>(null);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [subiendo, setSubiendo] = useState(false);
  
  const supabase = createClient();

  useEffect(() => {
    if (!id) return;
    
    const fetchTareas = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('tareas')
        .select('*')
        .eq('id_clase', id);
      
      if (data) setTareas(data as Tarea[]);
      setLoading(false);
    };
    fetchTareas();
  }, [id, supabase]);

  const handleSubirTarea = async () => {
    if (!archivo || !tareaSeleccionada) return;
    setSubiendo(true);

    // 1. Subir el archivo al Storage de Supabase
    const fileName = `entrega_${tareaSeleccionada.id_tarea}_${Date.now()}`;
    const { error: storageError } = await supabase.storage
      .from('entregas')
      .upload(fileName, archivo);

    if (storageError) {
      alert("Error al subir el archivo: " + storageError.message);
      setSubiendo(false);
      return;
    }

    // 2. Actualizar el estado de la tarea en la tabla 'tareas'
    const { error: dbError } = await supabase
      .from('tareas')
      .update({ estado: 'entregado' })
      .eq('id_tarea', tareaSeleccionada.id_tarea);

    if (dbError) {
      alert("Error al actualizar la base de datos: " + dbError.message);
    } else {
      alert("¡Tarea entregada con éxito!");
      setModalOpen(false);
      window.location.reload(); // Recarga para ver el cambio
    }
    setSubiendo(false);
  };

  return (
    <div className="p-10 font-syne bg-[#fdfbf7] min-h-screen text-[#1c1917]">
      <header className="mb-10 flex justify-between items-center">
        <h1 className="text-6xl font-black uppercase tracking-tighter">Tareas de la Clase</h1>
        <Link href="/sistema/alumno/clases" className="border-2 border-[#1c1917] px-6 py-2 font-black uppercase hover:bg-[#1c1917] hover:text-white transition-all">
          Volver a Clases
        </Link>
      </header>

      
      
      {loading ? (
        <div className="border-4 border-[#1c1917] p-8 font-black uppercase text-2xl animate-pulse">
          Cargando tareas...
        </div>
      ) : tareas.length > 0 ? (
        <div className="grid gap-6">
          {tareas.map((tarea) => (
            <div key={tarea.id_tarea} className="border-4 border-[#1c1917] p-6 shadow-[6px_6px_0px_0px_#1c1917] bg-white">
              <h3 className="text-2xl font-black uppercase">{tarea.titulo}</h3>
              <p className="font-bold my-2 text-slate-600">{tarea.descripcion}</p>
              <p className="text-sm font-black text-[#f97316]">
                Estado: {tarea.estado.toUpperCase()} | Fecha límite: {new Date(tarea.fecha_limite).toLocaleDateString()}
              </p>
              
              <button 
                onClick={() => { setTareaSeleccionada(tarea); setModalOpen(true); }}
                disabled={tarea.estado === 'entregado'}
                className={`mt-4 px-6 py-2 font-black uppercase transition-colors ${tarea.estado === 'entregado' ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1c1917] text-white hover:bg-[#f97316]'}`}
              >
                {tarea.estado === 'entregado' ? 'Ya entregada' : 'Entregar Tarea'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="border-4 border-[#1c1917] p-12 text-center shadow-[8px_8px_0px_0px_#1c1917] bg-white">
          <h2 className="text-4xl font-black uppercase mb-2">Sin tareas pendientes</h2>
        </div>
      )}

      {/* Modal de entrega */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-4 border-[#1c1917] p-8 w-full max-w-md shadow-[12px_12px_0px_0px_#1c1917]">
            <h2 className="text-2xl font-black uppercase mb-4">Entregar: {tareaSeleccionada?.titulo}</h2>
            
            
            
            <input 
              type="file" 
              onChange={(e) => setArchivo(e.target.files?.[0] || null)}
              className="block w-full text-sm mb-6 font-bold border-2 border-[#1c1917] p-2" 
            />
            
            <div className="flex gap-4">
              <button onClick={() => setModalOpen(false)} className="border-2 border-[#1c1917] px-6 py-2 font-black uppercase hover:bg-gray-100">
                Cancelar
              </button>
              <button 
                onClick={handleSubirTarea}
                disabled={subiendo || !archivo}
                className="bg-[#1c1917] text-white px-6 py-2 font-black uppercase hover:bg-[#f97316] disabled:bg-gray-400"
              >
                {subiendo ? 'SUBIENDO...' : 'Enviar archivo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}