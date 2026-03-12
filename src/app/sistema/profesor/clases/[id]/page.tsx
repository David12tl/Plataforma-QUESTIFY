'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';

// --- Interfaces para Tipado Estricto ---
interface Clase {
  id_clase: number;
  nombre_materia: string;
  imagen_url: string | null;
}

interface Tarea {
  id_tarea: number;
  id_clase: number;
  titulo: string;
  descripcion: string | null;
  fecha_limite: string | null;
  prioridad: string;
  estado: string;
}

export default function ClaseDetallePage() {
  const params = useParams();
  const idClase = params.id as string;
  const supabase = createClient();

  const [clase, setClase] = useState<Clase | null>(null);
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Tarea | null>(null);

  const [taskData, setTaskData] = useState({ 
    titulo: '', 
    descripcion: '', 
    fecha_limite: '', 
    prioridad: 'media',
    estado: 'pendiente'
  });

  const fetchData = useCallback(async () => {
    if (!idClase) return;
    setLoading(true);
    const idInt = parseInt(idClase);

    const { data: claseData } = await supabase
      .from('clases')
      .select('*')
      .eq('id_clase', idInt)
      .single();

    const { data: tareasData } = await supabase
      .from('tareas')
      .select('*')
      .eq('id_clase', idInt);

    setClase(claseData as Clase);
    setTareas((tareasData as Tarea[]) || []);
    setLoading(false);
  }, [idClase, supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const closeModal = () => {
    setIsTaskModalOpen(false);
    setTaskToEdit(null);
    setTaskData({ titulo: '', descripcion: '', fecha_limite: '', prioridad: 'media', estado: 'pendiente' });
  };

  const openCreateModal = () => {
    setTaskToEdit(null);
    setTaskData({ titulo: '', descripcion: '', fecha_limite: '', prioridad: 'media', estado: 'pendiente' });
    setIsTaskModalOpen(true);
  };

  const openEditModal = (tarea: Tarea) => {
    setTaskToEdit(tarea);
    setTaskData({
      titulo: tarea.titulo,
      descripcion: tarea.descripcion || '',
      fecha_limite: tarea.fecha_limite ? tarea.fecha_limite.split('T')[0] : '',
      prioridad: tarea.prioridad,
      estado: tarea.estado
    });
    setIsTaskModalOpen(true);
  };

  const handleDeleteTask = async (id_tarea: number) => {
    if (!confirm("¿Seguro que quieres borrar esta tarea?")) return;
    const { error } = await supabase.from('tareas').delete().eq('id_tarea', id_tarea);
    if (error) alert("Error: " + error.message);
    else fetchData();
  };

  const handleSaveTask = async () => {
    if (!taskData.titulo) return alert("Título obligatorio.");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Error de sesión.");

    const { data: perfil } = await supabase
      .from('usuarios')
      .select('id_usuario')
      .eq('id_auth', user.id)
      .single();

    if (!perfil) return alert("Perfil no encontrado.");

    if (taskToEdit) {
      const { error } = await supabase
        .from('tareas')
        .update({
          titulo: taskData.titulo,
          descripcion: taskData.descripcion,
          fecha_limite: taskData.fecha_limite || null,
          prioridad: taskData.prioridad,
          estado: taskData.estado
        })
        .eq('id_tarea', taskToEdit.id_tarea);
      if (error) alert("Error: " + error.message);
    } else {
      const { error } = await supabase.from('tareas').insert([{
        id_clase: parseInt(idClase),
        id_usuario_creador: perfil.id_usuario,
        titulo: taskData.titulo,
        descripcion: taskData.descripcion,
        fecha_limite: taskData.fecha_limite || null,
        prioridad: taskData.prioridad,
        estado: taskData.estado
      }]);
      if (error) alert("Error: " + error.message);
    }
    closeModal();
    fetchData();
  };

  if (loading) return <div className="p-10 text-center font-black uppercase tracking-widest animate-pulse">Cargando Clase...</div>;

  return (
    <div className="w-full">
      {/* Banner de Clase */}
      <div className="relative w-full h-48 md:h-64 border-4 border-[#1c1917] bg-white mb-8 overflow-hidden shadow-[6px_6px_0px_0px_#1c1917]">
        {clase?.imagen_url ? (
          <Image src={clase.imagen_url} alt="Portada" fill className="object-cover" priority />
        ) : (
          <div className="w-full h-full bg-slate-200 flex items-center justify-center font-black">SIN PORTADA</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <h1 className="absolute bottom-4 left-4 md:bottom-8 md:left-8 text-2xl md:text-5xl font-black uppercase text-white tracking-tighter">
          {clase?.nombre_materia || 'Materia'}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center border-b-4 border-[#1c1917] pb-2">
            <h2 className="text-xl md:text-2xl font-black uppercase">Actividades ({tareas.length})</h2>
            <button onClick={openCreateModal} className="lg:hidden bg-[#1c1917] text-white px-4 py-2 font-black text-xs uppercase shadow-[4px_4px_0px_0px_#f97316]">
              + Añadir
            </button>
          </div>

          {tareas.length > 0 ? (
            tareas.map((t) => (
              <div key={t.id_tarea} className="bg-white border-2 border-[#1c1917] p-4 shadow-[4px_4px_0px_0px_#1c1917] flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-all hover:translate-x-1">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[8px] font-black px-2 py-0.5 uppercase border ${t.prioridad === 'alta' ? 'bg-red-100 text-red-600 border-red-600' : 'bg-slate-100 border-slate-400'}`}>
                      {t.prioridad}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">{t.fecha_limite || 'Sin fecha'}</span>
                  </div>
                  <h3 className="font-black uppercase text-lg leading-tight">{t.titulo}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mt-1">{t.descripcion}</p>
                </div>
                <div className="flex sm:flex-col md:flex-row gap-2">
                  <button onClick={() => openEditModal(t)} className="flex-1 sm:flex-none bg-[#1c1917] text-white px-4 py-2 font-black text-[10px] uppercase hover:bg-orange-600 transition-colors">Editar</button>
                  <button onClick={() => handleDeleteTask(t.id_tarea)} className="bg-white border-2 border-[#1c1917] text-[#1c1917] px-3 py-2 font-black text-[10px] uppercase hover:bg-red-50 transition-colors">Eliminar</button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-10 border-4 border-dashed border-slate-200 text-center font-black text-slate-300 uppercase">Aún no hay tareas publicadas</div>
          )}
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-8 bg-[#f97316] p-6 border-4 border-[#1c1917] shadow-[8px_8px_0px_0px_#1c1917]">
            <h3 className="font-black text-white text-xl uppercase mb-4">Acciones Rápidas</h3>
            <button onClick={openCreateModal} className="w-full bg-[#1c1917] text-white py-4 font-black uppercase hover:scale-[1.02] transition-transform active:scale-95 shadow-lg">
              + Crear Nueva Tarea
            </button>
          </div>
        </div>
      </div>
      {/* Modal Responsivo */}
        {isTaskModalOpen && (
          <div className="fixed inset-0 bg-[#1c1917]/90 flex items-center justify-center z-[100] p-4 backdrop-blur-md">
            <div className="bg-white p-6 md:p-8 border-4 border-[#1c1917] w-full max-w-lg shadow-[12px_12px_0px_0px_#f97316] max-h-[90vh] overflow-y-auto">
              <h3 className="font-black text-2xl uppercase mb-6 border-b-4 border-[#1c1917] pb-2">
                {taskToEdit ? 'Actualizar Tarea' : 'Nueva Actividad'}
              </h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Título de la tarea</label>
                  <input value={taskData.titulo} className="w-full border-2 border-[#1c1917] p-3 font-bold focus:bg-orange-50 outline-none" placeholder="Ej: Investigación de Layouts" onChange={(e) => setTaskData({...taskData, titulo: e.target.value})} />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Instrucciones</label>
                  <textarea value={taskData.descripcion} className="w-full border-2 border-[#1c1917] p-3 font-bold h-24 outline-none focus:bg-orange-50" placeholder="Describe los pasos a seguir..." onChange={(e) => setTaskData({...taskData, descripcion: e.target.value})} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400">Fecha Límite</label>
                    <input type="date" value={taskData.fecha_limite} className="w-full border-2 border-[#1c1917] p-3 font-bold" onChange={(e) => setTaskData({...taskData, fecha_limite: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400">Prioridad</label>
                    <select value={taskData.prioridad} className="w-full border-2 border-[#1c1917] p-3 font-bold bg-white" onChange={(e) => setTaskData({...taskData, prioridad: e.target.value})}>
                      <option value="baja">Baja</option>
                      <option value="media">Media</option>
                      <option value="alta">Alta</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button onClick={closeModal} className="flex-1 border-4 border-[#1c1917] py-3 font-black uppercase hover:bg-slate-100">Cancelar</button>
                <button onClick={handleSaveTask} className="flex-1 bg-[#f97316] border-4 border-[#1c1917] text-white py-3 font-black uppercase hover:bg-orange-600 shadow-[4px_4px_0px_0px_#1c1917] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all">
                  {taskToEdit ? 'Guardar Cambios' : 'Publicar Tarea'}
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
