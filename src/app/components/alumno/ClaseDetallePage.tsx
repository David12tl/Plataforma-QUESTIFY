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
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [tareaSeleccionada, setTareaSeleccionada] = useState<Tarea | null>(null);
  
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

  const handleOpenModal = (tarea: Tarea) => {
    setTareaSeleccionada(tarea);
    setModalOpen(true);
  };

  return (
    <div className="p-10 font-syne bg-[#fdfbf7] min-h-screen text-[#1c1917]">
      <header className="mb-10">
        <h1 className="text-6xl font-black uppercase tracking-tighter">Tareas de la Clase</h1>
        <Link href="/sistema/alumno/clases" className="underline font-black uppercase hover:text-[#f97316] mt-4 block">
          ← Volver a Mis Clases
        </Link>
      </header>
      
      {/* Visualización del estado de tareas */}
      
      
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
                Fecha límite: {new Date(tarea.fecha_limite).toLocaleDateString()}
              </p>
              
              <button 
                onClick={() => handleOpenModal(tarea)}
                className="mt-4 bg-[#1c1917] text-white px-6 py-2 font-black uppercase hover:bg-[#f97316] transition-colors"
              >
                Entregar Tarea
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="border-4 border-[#1c1917] p-12 text-center shadow-[8px_8px_0px_0px_#1c1917] bg-white">
          <h2 className="text-4xl font-black uppercase mb-2">Sin tareas pendientes</h2>
          <p className="font-bold text-lg">Actualmente no hay ninguna actividad asignada en esta clase.</p>
        </div>
      )}

      {/* Modal de entrega */}
      {modalOpen && tareaSeleccionada && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white border-4 border-[#1c1917] p-8 w-full max-w-md shadow-[12px_12px_0px_0px_#1c1917]">
            <h2 className="text-2xl font-black uppercase mb-4">Entregar: {tareaSeleccionada.titulo}</h2>
            
            
            
            <input type="file" className="w-full border-2 border-[#1c1917] p-2 mb-4 font-black text-sm" />
            
            <div className="flex gap-4">
              <button 
                onClick={() => setModalOpen(false)} 
                className="border-2 border-[#1c1917] px-4 py-2 font-black uppercase hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button className="bg-[#f97316] text-white px-4 py-2 font-black uppercase hover:bg-[#1c1917]">
                Subir Archivo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}