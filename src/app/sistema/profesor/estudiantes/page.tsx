'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';

// --- Interfaces para Tipado Estricto ---
interface Usuario {
  id_usuario: string;
  nombre_completo: string;
  email: string;
}

interface EstudianteProcesado {
  id: string;
  name: string;
  email: string;
}

interface InscripcionRaw {
  id_clase: number;
  clases: { nombre_materia: string } | null;
  usuarios: Usuario | null;
}

interface DataPorClase {
  [materia: string]: EstudianteProcesado[];
}

export default function StudentsPage() {
  const [dataPorClase, setDataPorClase] = useState<DataPorClase>({});
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const loadEstudiantes = useCallback(async () => {
    setLoading(true);
    
    // Tipado con .returns para asegurar la estructura de datos
    const { data, error } = await supabase
      .from('inscripciones')
      .select(`
        id_clase,
        clases(nombre_materia),
        usuarios(id_usuario, nombre_completo, email)
      `)
      .returns<InscripcionRaw[]>();

    if (error) {
      console.error("Error al cargar estudiantes:", error.message);
    } else if (data) {
      const agrupado = data.reduce((acc: DataPorClase, curr: InscripcionRaw) => {
        const materia = curr.clases?.nombre_materia || 'Sin Materia';
        
        if (!acc[materia]) {
          acc[materia] = [];
        }
        
        if (curr.usuarios) {
          acc[materia].push({
            id: curr.usuarios.id_usuario,
            name: curr.usuarios.nombre_completo,
            email: curr.usuarios.email,
          });
        }
        return acc;
      }, {} as DataPorClase);
      
      setDataPorClase(agrupado);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadEstudiantes();
  }, [loadEstudiantes]);

  return (
    // Ya no contiene Sidebar ni flex local; el layout padre los provee.
    <div className="w-full">
      <header className="mb-8 md:mb-10">
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-[#1c1917]">
          Estudiantes por Clase
        </h2>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
          Listado oficial de inscritos
        </p>
      </header>

      {loading ? (
        <div className="flex items-center gap-3">
           <div className="animate-spin size-5 border-4 border-[#f97316] border-t-transparent rounded-full"></div>
           <p className="font-bold text-slate-600 uppercase text-xs tracking-widest">Sincronizando registros...</p>
        </div>
      ) : Object.keys(dataPorClase).length > 0 ? (
        Object.entries(dataPorClase).map(([clase, estudiantes]) => (
          <section key={clase} className="mb-10 bg-white border-4 border-[#1c1917] shadow-[6px_6px_0px_0px_#1c1917] overflow-hidden">
            <div className="bg-[#1c1917] p-4">
              <h3 className="text-lg font-black uppercase text-[#f97316]">
                {clase}
              </h3>
              <span className="text-[10px] text-white/60 font-bold uppercase">
                {estudiantes.length} Alumnos inscritos
              </span>
            </div>
            
            <div className="p-4 md:p-6">
              {/* Vista de Tabla para Escritorio */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] uppercase text-slate-400 border-b-2 border-slate-100">
                      <th className="pb-4">Nombre Completo</th>
                      <th className="pb-4">Correo Electrónico</th>
                      <th className="pb-4 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {estudiantes.map((s) => (
                      <tr key={s.id} className="group hover:bg-slate-50 transition-colors">
                        <td className="py-4 font-bold text-[#1c1917]">{s.name}</td>
                        <td className="py-4 text-slate-500 font-medium">{s.email}</td>
                        <td className="py-4 text-right">
                          <button className="text-[10px] font-black uppercase text-[#f97316] hover:underline">Ver Perfil</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Vista de Tarjetas para Móvil */}
              <div className="md:hidden space-y-4">
                {estudiantes.map((s) => (
                  <div key={s.id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                    <p className="font-black uppercase text-sm text-[#1c1917]">{s.name}</p>
                    <p className="text-xs text-slate-500 mb-2">{s.email}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))
      ) : (
        <div className="p-12 border-4 border-dashed border-slate-200 text-center">
          <p className="text-slate-400 font-black uppercase tracking-widest text-sm">
            No hay estudiantes inscritos en ninguna materia.
          </p>
        </div>
      )}
    </div>
  );
}