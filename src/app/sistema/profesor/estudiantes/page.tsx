'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '../../../components/profesor/NavBar_Profesor';
import { createClient } from '@/utils/supabase/client';

export default function StudentsPage() {
  const [dataPorClase, setDataPorClase] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadEstudiantes() {
      // 1. Obtenemos todas las inscripciones con sus relaciones
      const { data, error } = await supabase
        .from('inscripciones')
        .select(`
          id_clase,
          clases(nombre_materia),
          usuarios(id_usuario, nombre_completo, email)
        `);

      if (error) {
        console.error("Error al cargar estudiantes:", error);
      } else {
        // 2. Agrupamos los datos por materia
        const agrupado = data.reduce((acc: any, curr: any) => {
          const materia = curr.clases?.nombre_materia || 'Sin Materia';
          if (!acc[materia]) acc[materia] = [];
          
          acc[materia].push({
            id: curr.usuarios?.id_usuario,
            name: curr.usuarios?.nombre_completo,
            email: curr.usuarios?.email,
          });
          return acc;
        }, {});
        
        setDataPorClase(agrupado);
      }
      setLoading(false);
    }

    loadEstudiantes();
  }, [supabase]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="hidden md:block w-64 flex-shrink-0">
        <Sidebar />
      </div>

      <main className="flex-1 p-8">
        <h2 className="text-4xl font-black uppercase tracking-tighter font-syne mb-10">Estudiantes por Clase</h2>

        {loading ? (
          <p className="font-bold">Cargando alumnos...</p>
        ) : Object.keys(dataPorClase).length > 0 ? (
          Object.entries(dataPorClase).map(([clase, estudiantes]: [string, any]) => (
            <section key={clase} className="mb-12 bg-white p-8 border-2 border-[#1c1917] shadow-[6px_6px_0px_0px_#1c1917]">
              <h3 className="text-xl font-black uppercase font-syne mb-6 border-b-2 border-[#1c1917] pb-4 text-[#f97316]">
                {clase}
              </h3>
              
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs uppercase text-slate-400">
                    <th className="pb-4">Nombre</th>
                    <th className="pb-4">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {estudiantes.map((s: any) => (
                    <tr key={s.id} className="border-t border-slate-100">
                      <td className="py-4 font-bold">{s.name}</td>
                      <td className="py-4 text-slate-500">{s.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ))
        ) : (
          <p className="text-slate-500 font-bold">No hay estudiantes inscritos aún.</p>
        )}
      </main>
    </div>
  );
}