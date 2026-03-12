'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { createClient } from '@/utils/supabase/client';

// Importación dinámica para evitar errores de SSR en Next.js
const FullCalendar = dynamic(() => import('@fullcalendar/react'), { ssr: false });
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

// Interfaz para los eventos del calendario
interface EventoCalendario {
  title: string;
  date: string;
}

export default function CalendarPage() {
  const [misEventos, setMisEventos] = useState<EventoCalendario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchTareasFiltradas = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setLoading(false);
        return;
      }

      // 1. Obtener ID del alumno
      const { data: userData } = await supabase
        .from('usuarios')
        .select('id_usuario')
        .eq('id_auth', session.user.id)
        .maybeSingle();

      if (userData) {
        // 2. Traer tareas solo de las clases donde el alumno está inscrito
        // Usamos el join: tareas -> clases -> inscripciones
        const { data } = await supabase
          .from('tareas')
          .select(`
            titulo, 
            fecha_limite,
            clases!inner(
              inscripciones!inner(id_alumno)
            )
          `)
          .eq('clases.inscripciones.id_alumno', userData.id_usuario);

        if (data) {
          const formatted: EventoCalendario[] = data.map((t) => ({
            title: t.titulo,
            date: t.fecha_limite ? new Date(t.fecha_limite).toISOString().split('T')[0] : ''
          }));
          setMisEventos(formatted);
        }
      }
      setLoading(false);
    };

    fetchTareasFiltradas();
  }, [supabase]);

  return (
    <div className="flex min-h-screen bg-[#fdfbf7] font-syne text-[#1c1917]">
      
      <main className="flex-1 p-8">
        <header className="mb-10">
          <h2 className="text-7xl font-black uppercase tracking-tighter">Calendario</h2>
          <p className="font-black uppercase text-[#f97316] text-xl">Actividades de mis clases</p>
        </header>

        

        <div className="bg-white border-4 border-[#1c1917] p-4 shadow-[12px_12px_0px_0px_#1c1917]">
          {loading ? (
            <div className="h-96 flex items-center justify-center font-black">CARGANDO CALENDARIO...</div>
          ) : (
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin]}
              initialView="dayGridMonth"
              events={misEventos}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              eventColor="#f97316"
              height="auto"
            />
          )}
        </div>
      </main>
    </div>
  );
}