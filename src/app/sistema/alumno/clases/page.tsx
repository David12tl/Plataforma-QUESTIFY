'use client';

import React, { useEffect, useState, useCallback, FormEvent } from 'react';
import Link from 'next/link'; // <--- Importante
import { createClient } from '@/utils/supabase/client';

interface Clase {
  id_clase: number;
  nombre_materia: string;
  codigo_acceso: string;
  imagen_url: string;
}

interface SupabaseRow {
  clases: {
    id_clase: number;
    nombre_materia: string;
    codigo_acceso: string;
    imagen_url: string;
  } | null;
}

export default function StudentDashboard() {
  const [clases, setClases] = useState<Clase[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [codigo, setCodigo] = useState<string>('');
  const [isJoining, setIsJoining] = useState<boolean>(false);
  const supabase = createClient();

  const fetchClases = useCallback(async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      setLoading(false);
      return;
    }

    const { data: userData } = await supabase
      .from('usuarios')
      .select('id_usuario')
      .eq('id_auth', session.user.id)
      .maybeSingle();

    if (userData) {
      const { data } = await supabase
        .from('inscripciones')
        .select(`
          clases (
            id_clase,
            nombre_materia,
            codigo_acceso,
            imagen_url
          )
        `)
        .eq('id_alumno', userData.id_usuario);

      if (data) {
        const rows = data as unknown as SupabaseRow[];
        const listaClases: Clase[] = rows
          .filter((row): row is { clases: NonNullable<SupabaseRow['clases']> } => row.clases !== null)
          .map((row) => ({
            id_clase: row.clases.id_clase,
            nombre_materia: row.clases.nombre_materia,
            codigo_acceso: row.clases.codigo_acceso,
            imagen_url: row.clases.imagen_url || '',
          }));
        setClases(listaClases);
      }
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchClases();
  }, [fetchClases]);

  const handleJoinClass = async (e: FormEvent) => {
    e.preventDefault();
    const codigoNormalizado = codigo.trim().toUpperCase();
    if (!codigoNormalizado) return;

    setIsJoining(true);
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setIsJoining(false); return; }

    const { data: claseEncontrada } = await supabase
      .from('clases')
      .select('id_clase')
      .eq('codigo_acceso', codigoNormalizado)
      .maybeSingle();

    if (claseEncontrada) {
      const { data: userData } = await supabase
        .from('usuarios')
        .select('id_usuario')
        .eq('id_auth', session.user.id)
        .single();

      if (userData) {
        await supabase.from('inscripciones').insert({
          id_clase: claseEncontrada.id_clase,
          id_alumno: userData.id_usuario
        });
        setCodigo('');
        fetchClases();
      }
    }
    setIsJoining(false);
  };

  if (loading) return <div className="p-8 font-black font-syne">CARGANDO...</div>;

  return (
    <div className="p-8 font-syne bg-[#fdfbf7] min-h-screen text-[#1c1917]">
      <header className="mb-16">
        <h1 className="text-7xl font-black uppercase tracking-tighter">Mis Clases</h1>
        <form onSubmit={handleJoinClass} className="mt-8 flex gap-2">
          <input 
            className="border-4 border-[#1c1917] p-4 font-black uppercase w-full md:w-80 outline-none focus:bg-[#1c1917] focus:text-white transition-all"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="INGRESAR CÓDIGO"
            disabled={isJoining}
          />
          <button type="submit" disabled={isJoining} className="bg-[#1c1917] text-white px-8 font-black uppercase hover:scale-105 transition-transform">
            {isJoining ? 'UNIENDO...' : 'UNIRSE'}
          </button>
        </form>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {clases.map((clase) => (
          <div key={clase.id_clase} className="border-4 border-[#1c1917] p-6 shadow-[8px_8px_0px_0px_#1c1917] hover:shadow-none transition-shadow bg-white flex flex-col">
            {clase.imagen_url && (
              <img src={clase.imagen_url} alt={clase.nombre_materia} className="w-full h-48 object-cover mb-6 border-2 border-[#1c1917]" />
            )}
            <h3 className="text-3xl font-black uppercase leading-none mb-6">{clase.nombre_materia}</h3>
            
            {/* Botón convertido a Link dinámico */}
            <Link href={`/sistema/alumno/clases/${clase.id_clase}`}>
              <button className="mt-auto bg-[#1c1917] text-white w-full py-3 font-black uppercase hover:bg-[#f97316] transition-colors">
                Ver Clase
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}