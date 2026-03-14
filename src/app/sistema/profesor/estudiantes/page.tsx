'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';

// --- 1. Interfaces para el uso dentro del componente (Limpias) ---
interface EstudianteProcesado {
  id: string;
  name: string;
  email: string;
}

interface DataPorClase {
  [materia: string]: EstudianteProcesado[];
}

// --- 2. Interfaces para la respuesta CRUDA de Supabase (Evita el 'any') ---
interface UsuarioRaw {
  id_usuario: string;
  nombre_completo: string;
  email: string;
}

interface ClaseRaw {
  nombre_materia: string;
}

interface InscripcionRaw {
  id_clase: number;
  clases: ClaseRaw | ClaseRaw[] | null;
  usuarios: UsuarioRaw | UsuarioRaw[] | null;
}

export default function StudentsPage() {
  const [dataPorClase, setDataPorClase] = useState<DataPorClase>({});
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const loadEstudiantes = useCallback(async () => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('inscripciones')
      .select(`
        id_clase,
        clases ( nombre_materia ),
        usuarios ( id_usuario, nombre_completo, email )
      `);

    if (error) {
      console.error("Error al cargar estudiantes:", error.message);
    } else if (data) {
      // Forzamos el tipo a nuestra interfaz de respuesta cruda
      const rawData = data as unknown as InscripcionRaw[];

      const agrupado = rawData.reduce((acc: DataPorClase, curr: InscripcionRaw) => {
        // Normalizar Clases (Supabase puede devolver objeto o array)
        const claseInfo = Array.isArray(curr.clases) ? curr.clases[0] : curr.clases;
        const materia = claseInfo?.nombre_materia || 'Sin Materia';
        
        // Normalizar Usuarios
        const usuarioInfo = Array.isArray(curr.usuarios) ? curr.usuarios[0] : curr.usuarios;

        if (!acc[materia]) {
          acc[materia] = [];
        }
        
        if (usuarioInfo) {
          acc[materia].push({
            id: usuarioInfo.id_usuario,
            name: usuarioInfo.nombre_completo,
            email: usuarioInfo.email,
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
            <div className="bg-[#1c1917] p-4 flex justify-between items-center">
              <h3 className="text-lg font-black uppercase text-[#f97316]">
                {clase}
              </h3>
              <span className="text-[10px] text-white font-black uppercase border border-white/20 px-2 py-1">
                {estudiantes.length} Alumnos
              </span>
            </div>
            
            <div className="p-4 md:p-6">
              <div className="overflow-x-auto">
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
                        <td className="py-4 font-bold text-[#1c1917] uppercase text-sm">{s.name}</td>
                        <td className="py-4 text-slate-500 font-medium text-sm">{s.email}</td>
                        <td className="py-4 text-right">
                          <button className="text-[10px] font-black uppercase text-[#f97316] hover:underline">Ver Perfil</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        ))
      ) : (
        <div className="p-12 border-4 border-dashed border-slate-200 text-center bg-white">
          <p className="text-slate-400 font-black uppercase tracking-widest text-sm">
            No hay estudiantes inscritos en ninguna materia.
          </p>
        </div>
      )}
    </div>
  );
}