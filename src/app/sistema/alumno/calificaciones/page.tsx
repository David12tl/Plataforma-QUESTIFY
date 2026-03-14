'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

// Interfaces que coinciden exactamente con la respuesta de Supabase
interface ClaseDB {
  nombre_materia: string;
}

interface TareaDB {
  titulo: string;
  clases: ClaseDB[] | ClaseDB | null; // Supabase a veces retorna un array o un objeto único
}

interface EntregaDB {
  calificacion: number | null;
  estado: string;
  tareas: TareaDB[] | TareaDB | null;
}

export default function CalificacionesPage() {
  const [entregas, setEntregas] = useState<EntregaDB[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchCalificaciones = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: userData } = await supabase
          .from('usuarios')
          .select('id_usuario')
          .eq('id_auth', user.id)
          .single();

        if (userData) {
          const { data } = await supabase
            .from('entregas')
            .select(`
              calificacion,
              estado,
              tareas (
                titulo,
                clases (nombre_materia)
              )
            `)
            .eq('id_alumno', userData.id_usuario);

          if (data) {
            // El casteo aquí es seguro porque definimos las interfaces arriba
            setEntregas(data as unknown as EntregaDB[]);
          }
        }
      }
      setLoading(false);
    };

    fetchCalificaciones();
  }, [supabase]);

  // Función auxiliar para extraer datos normalizados sin usar 'any'
  const getTareaData = (tarea: TareaDB[] | TareaDB | null) => {
    if (!tarea) return { titulo: 'Sin título', materia: 'Sin materia' };
    const t = Array.isArray(tarea) ? tarea[0] : tarea;
    const c = Array.isArray(t.clases) ? t.clases[0] : t.clases;
    return { 
      titulo: t.titulo, 
      materia: c?.nombre_materia ?? 'Sin materia' 
    };
  };

  return (
    <div className="p-10 font-syne bg-[#fdfbf7] min-h-screen">
      <h1 className="text-6xl font-black uppercase mb-10">Mis Calificaciones</h1>
      
      {loading ? (
        <p className="font-black animate-pulse">CARGANDO...</p>
      ) : (
        <div className="grid gap-4">
          {entregas.map((entrega, index) => {
            const data = getTareaData(entrega.tareas);
            return (
              <div key={index} className="flex justify-between items-center border-4 border-[#1c1917] p-6 bg-white">
                <div>
                  <p className="text-xs font-bold uppercase text-gray-500">{data.materia}</p>
                  <h3 className="text-xl font-black uppercase">{data.titulo}</h3>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold uppercase">{entrega.estado}</p>
                  <p className="text-4xl font-black text-[#f97316]">
                    {entrega.calificacion ?? 'N/A'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}