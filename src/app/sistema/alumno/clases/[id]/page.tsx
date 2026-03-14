'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

interface Entrega {
  id_entrega: number;
  calificacion: number | null;
  estado: string;
}

interface Tarea {
  id_tarea: number;
  titulo: string;
  descripcion: string;
  entregas?: Entrega[];
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

  const fetchTareasConEstado = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
        const { data: userData } = await supabase
        .from('usuarios')
        .select('id_usuario')
        .eq('id_auth', user.id)
        .single();

        const { data } = await supabase
        .from('tareas')
        .select(`
            id_tarea, titulo, descripcion,
            entregas (id_entrega, calificacion, estado)
        `)
        .eq('id_clase', id)
        .eq('entregas.id_alumno', userData?.id_usuario ?? '');

        if (data) setTareas(data as Tarea[]);
    }
    setLoading(false);
  }, [id, supabase]);

  useEffect(() => {
    fetchTareasConEstado();
  }, [fetchTareasConEstado]);

  const handleConfirmarEntrega = async (tarea: Tarea) => {
    setSubiendo(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data: userData } = await supabase
      .from('usuarios')
      .select('id_usuario')
      .eq('id_auth', user?.id)
      .single();

    if (!userData) {
      alert("Error: No se encontró tu perfil.");
      setSubiendo(false);
      return;
    }

    const { error } = await supabase
      .from('entregas')
      .insert([{ 
        id_tarea: tarea.id_tarea, 
        id_alumno: userData.id_usuario, 
        estado: 'entregado' 
      }]);

    if (error) alert("Error: " + error.message);
    else {
      alert("¡Tarea entregada!");
      fetchTareasConEstado();
    }
    setSubiendo(false);
  };

  const handleSubirArchivo = async () => {
    if (!archivo || !tareaSeleccionada) return;
    setSubiendo(true);
    const fileName = `entrega_${tareaSeleccionada.id_tarea}_${Date.now()}`;
    await supabase.storage.from('entregas').upload(fileName, archivo);
    alert("Archivo subido. Presiona 'Confirmar Entrega'.");
    setModalOpen(false);
    setSubiendo(false);
  };

  return (
    <div className="p-10 font-syne bg-[#fdfbf7] min-h-screen">
      <h1 className="text-6xl font-black uppercase mb-10">Tareas</h1>
      {loading ? <p className="font-black animate-pulse">CARGANDO TAREAS...</p> : (
        <div className="grid gap-6">
          {tareas.map((tarea) => {
            const entrega = tarea.entregas?.[0];
            const yaEntregada = !!entrega;
            
            return (
              <div key={tarea.id_tarea} className="border-4 border-[#1c1917] p-6 bg-white">
                <h3 className="text-2xl font-black uppercase">{tarea.titulo}</h3>
                
                <div className="flex gap-4 items-center mb-4">
                  <p className={`text-sm font-black uppercase ${yaEntregada ? 'text-orange-600' : 'text-gray-500'}`}>
                    ESTADO: {yaEntregada ? entrega.estado : 'PENDIENTE'}
                  </p>
                  
                  {/* Se muestra la calificación si existe */}
                  {entrega?.estado === 'calificado' && (
                    <span className="bg-[#1c1917] text-white px-3 py-1 font-black">
                      NOTA: {entrega.calificacion ?? 'S/C'}
                    </span>
                  )}
                </div>

                <div className="flex gap-4">
                  <button 
                    disabled={yaEntregada}
                    onClick={() => { setTareaSeleccionada(tarea); setModalOpen(true); }}
                    className={`px-6 py-2 font-black uppercase ${yaEntregada ? 'bg-gray-300' : 'bg-[#1c1917] text-white'}`}
                  >
                    {yaEntregada ? 'Entregada' : 'Subir Archivo'}
                  </button>
                  <button 
                    disabled={yaEntregada}
                    onClick={() => handleConfirmarEntrega(tarea)}
                    className={`border-2 px-6 py-2 font-black uppercase ${yaEntregada ? 'border-gray-300 text-gray-300' : 'border-green-600 text-green-600 hover:bg-green-600 hover:text-white'}`}
                  >
                    Confirmar Entrega
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white border-4 border-[#1c1917] p-8 w-full max-w-md">
            <h2 className="text-xl font-black mb-4 uppercase">Subir: {tareaSeleccionada?.titulo}</h2>
            <input type="file" onChange={(e) => setArchivo(e.target.files?.[0] || null)} className="block w-full mb-6 border-2 border-[#1c1917] p-2" />
            <button onClick={handleSubirArchivo} className="bg-[#1c1917] text-white px-4 py-2 w-full font-black uppercase">
              {subiendo ? 'SUBIENDO...' : 'Enviar archivo'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}