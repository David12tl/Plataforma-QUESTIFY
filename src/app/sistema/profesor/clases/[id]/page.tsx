'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Sidebar from '../../../../components/profesor/NavBar_Profesor';
import Image from 'next/image';

export default function ClaseDetallePage() {
  const params = useParams();
  const idClase = params.id as string;
  const supabase = createClient();

  const [clase, setClase] = useState<any>(null);
  const [tareas, setTareas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<any>(null);

  const [taskData, setTaskData] = useState({ 
    titulo: '', 
    descripcion: '', 
    fecha_limite: '', 
    prioridad: 'media',
    estado: 'pendiente'
  });

  useEffect(() => {
    if (idClase) fetchData();
  }, [idClase]);

  const fetchData = async () => {
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

    setClase(claseData);
    setTareas(tareasData || []);
    setLoading(false);
  };

  // Función para cerrar y limpiar
  const closeModal = () => {
    setIsTaskModalOpen(false);
    setTaskToEdit(null);
    setTaskData({ 
        titulo: '', descripcion: '', fecha_limite: '', prioridad: 'media', estado: 'pendiente' 
    });
  };

  // Función específica para NUEVA tarea
  const openCreateModal = () => {
    setTaskToEdit(null);
    setTaskData({
      titulo: '',
      descripcion: '',
      fecha_limite: '',
      prioridad: 'media',
      estado: 'pendiente'
    });
    setIsTaskModalOpen(true);
  };

  // Función específica para EDITAR tarea
  const openEditModal = (tarea: any) => {
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
    if (error) alert("Error al eliminar: " + error.message);
    else {
      alert("Tarea eliminada");
      fetchData();
    }
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

      if (error) alert("Error al actualizar: " + error.message);
      else alert("Tarea actualizada!");
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
      if (error) alert("Error al guardar: " + error.message);
      else alert("Tarea creada!");
    }

    closeModal();
    fetchData();
  };

  if (loading) return <div className="p-10 text-center font-black">CARGANDO...</div>;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="relative w-full h-60 border-4 border-[#1c1917] bg-white mb-8 overflow-hidden shadow-[8px_8px_0px_0px_#1c1917]">
          {clase?.imagen_url ? <Image src={clase.imagen_url} alt="Portada" fill className="object-cover" /> : <div className="w-full h-full bg-slate-300 flex items-center justify-center font-black">SIN IMAGEN</div>}
          <div className="absolute inset-0 bg-black/40" />
          <h1 className="absolute bottom-6 left-6 text-4xl font-black uppercase text-white">{clase?.nombre_materia || 'Clase'}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-2xl font-black uppercase">Tareas ({tareas.length})</h2>
            {tareas.length > 0 ? (
              tareas.map((t) => (
                <div key={t.id_tarea} className="bg-white border-2 border-[#1c1917] p-4 shadow-[4px_4px_0px_0px_#1c1917] flex justify-between items-center">
                  <div>
                    <h3 className="font-bold uppercase text-lg">{t.titulo}</h3>
                    <p className="text-sm text-slate-600">{t.descripcion}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-[10px] font-black bg-slate-200 px-2 py-1 uppercase">{t.prioridad}</span>
                      <span className="text-[10px] font-black bg-orange-200 px-2 py-1 uppercase">{t.estado}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(t)} className="bg-black text-white px-4 py-2 font-black text-xs uppercase">Editar</button>
                    <button onClick={() => handleDeleteTask(t.id_tarea)} className="bg-red-600 text-white px-4 py-2 font-black text-xs uppercase hover:bg-red-700">X</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 border-2 border-dashed border-slate-300 text-center font-bold text-slate-400">NO HAY TAREAS</div>
            )}
          </div>
          <div>
            <button onClick={openCreateModal} className="w-full bg-[#1c1917] text-white py-4 font-black uppercase">+ Nueva Tarea</button>
          </div>
        </div>

        {isTaskModalOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white p-8 border-4 border-[#1c1917] w-full max-w-lg shadow-[12px_12px_0px_0px_#1c1917]">
              <h3 className="font-black text-2xl uppercase mb-6 border-b-4 border-[#1c1917] pb-2">{taskToEdit ? 'Editar Tarea' : 'Nueva Tarea'}</h3>
              <div className="space-y-4">
                <input value={taskData.titulo} className="w-full border-2 border-[#1c1917] p-3 font-bold" placeholder="Título" onChange={(e) => setTaskData({...taskData, titulo: e.target.value})} />
                <textarea value={taskData.descripcion} className="w-full border-2 border-[#1c1917] p-3 font-bold h-24" placeholder="Descripción" onChange={(e) => setTaskData({...taskData, descripcion: e.target.value})} />
                <input type="date" value={taskData.fecha_limite} className="w-full border-2 border-[#1c1917] p-3 font-bold" onChange={(e) => setTaskData({...taskData, fecha_limite: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                  <select value={taskData.prioridad} className="w-full border-2 border-[#1c1917] p-3 font-bold bg-white" onChange={(e) => setTaskData({...taskData, prioridad: e.target.value})}>
                    <option value="baja">Baja</option><option value="media">Media</option><option value="alta">Alta</option>
                  </select>
                  <select value={taskData.estado} className="w-full border-2 border-[#1c1917] p-3 font-bold bg-white" onChange={(e) => setTaskData({...taskData, estado: e.target.value})}>
                    <option value="pendiente">Pendiente</option><option value="en_progreso">En Progreso</option><option value="completada">Completada</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button onClick={closeModal} className="flex-1 border-2 border-[#1c1917] py-3 font-black uppercase">Cancelar</button>
                <button onClick={handleSaveTask} className="flex-1 bg-[#1c1917] text-white py-3 font-black uppercase">Guardar</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}