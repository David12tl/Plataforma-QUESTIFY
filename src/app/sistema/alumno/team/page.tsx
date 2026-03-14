'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';

interface AlumnoBusqueda {
  id_usuario: string; 
  nombre_completo: string;
}

interface Equipo {
  id_equipo: number;
  nombre_equipo: string;
}

export default function TeamPage() {
  const [busqueda, setBusqueda] = useState('');
  const [nombreEquipo, setNombreEquipo] = useState('');
  const [resultados, setResultados] = useState<AlumnoBusqueda[]>([]);
  const [miembrosEquipo, setMiembrosEquipo] = useState<AlumnoBusqueda[]>([]);
  const [misEquipos, setMisEquipos] = useState<Equipo[]>([]);
  const [buscado, setBuscado] = useState(false); // Estado para controlar si ya se realizó una búsqueda
  
  const supabase = createClient();

  const cargarEquipos = useCallback(async () => {
    const { data } = await supabase
      .from('equipos')
      .select('id_equipo, nombre_equipo');
    
    if (data) setMisEquipos(data as Equipo[]);
  }, [supabase]);

  useEffect(() => {
    cargarEquipos();
  }, [cargarEquipos]);

  const handleBuscar = async () => {
    if (!busqueda) return;
    
    setBuscado(true);
    const { data } = await supabase
      .from('usuarios')
      .select('id_usuario, nombre_completo')
      .ilike('nombre_completo', `%${busqueda}%`)
      .limit(5);
    
    setResultados(data as AlumnoBusqueda[] || []);
  };

  const agregarMiembro = (alumno: AlumnoBusqueda) => {
    if (!miembrosEquipo.find(m => m.id_usuario === alumno.id_usuario)) {
      setMiembrosEquipo([...miembrosEquipo, alumno]);
    }
  };

  const crearEquipoFinal = async () => {
    if (miembrosEquipo.length === 0 || !nombreEquipo) {
      alert("Por favor, pon un nombre al equipo y agrega miembros.");
      return;
    }

    const { data: equipo, error: errorEquipo } = await supabase
      .from('equipos')
      .insert([{ nombre_equipo: nombreEquipo }])
      .select('id_equipo')
      .single();

    if (errorEquipo) {
      alert("Error: " + errorEquipo.message);
      return;
    }

    const miembrosConEquipo = miembrosEquipo.map(m => ({
      id_equipo: equipo.id_equipo,
      id_alumno: m.id_usuario
    }));

    const { error: errorMiembros } = await supabase
      .from('miembros_equipo')
      .insert(miembrosConEquipo);

    if (errorMiembros) {
      alert("Error al agregar miembros: " + errorMiembros.message);
    } else {
      alert("¡Equipo creado!");
      setMiembrosEquipo([]);
      setNombreEquipo('');
      cargarEquipos();
    }
  };

  return (
    <div className="flex min-h-screen bg-[#fdfbf7] font-syne text-[#1c1917] p-10">
      <main className="flex-1">
        <header className="mb-10">
          <h2 className="text-6xl font-black uppercase tracking-tighter">Gestión de Equipos</h2>
          <p className="text-xl font-bold text-[#f97316]">Crea y gestiona tus grupos</p>
        </header>

        {/* Búsqueda y Resultados */}
        <div className="mb-12">
          <div className="border-4 border-[#1c1917] p-4 flex gap-4">
            <input 
              type="text" 
              placeholder="Buscar compañero..."
              className="flex-1 p-2 font-bold uppercase outline-none"
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setBuscado(false); // Resetear estado de búsqueda al escribir
              }}
            />
            <button onClick={handleBuscar} className="bg-[#1c1917] text-white px-6 font-black uppercase hover:bg-[#f97316]">Buscar</button>
          </div>
          
          {buscado && resultados.length === 0 && (
            <div className="mt-2 p-4 border-2 border-red-500 bg-red-50 text-red-700 font-bold uppercase italic">
              No se encontró ningún alumno con ese nombre.
            </div>
          )}

          {resultados.length > 0 && (
            <div className="mt-2 border-2 border-[#1c1917] bg-white p-4">
              {resultados.map(r => (
                <div key={r.id_usuario} className="flex justify-between py-2 border-b">
                  <span>{r.nombre_completo}</span>
                  <button onClick={() => agregarMiembro(r)} className="font-black text-[#f97316]">+ Agregar</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sección de Equipos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <section className="border-4 border-[#1c1917] p-6 shadow-[8px_8px_0px_0px_#f97316]">
            <h3 className="text-3xl font-black uppercase mb-4">Mis Equipos</h3>
            {misEquipos.map(eq => (
              <div key={eq.id_equipo} className="p-3 border-b-2 border-[#1c1917] font-bold">
                {eq.nombre_equipo}
              </div>
            ))}
          </section>

          {miembrosEquipo.length > 0 && (
            <section className="border-4 border-[#f97316] p-6 shadow-[8px_8px_0px_0px_#1c1917]">
              <h3 className="text-2xl font-black uppercase mb-4">Equipo en formación</h3>
              <input 
                placeholder="Nombre del nuevo equipo"
                className="w-full mb-4 p-2 border-2 border-[#1c1917] font-bold"
                value={nombreEquipo}
                onChange={(e) => setNombreEquipo(e.target.value)}
              />
              <button onClick={crearEquipoFinal} className="bg-[#f97316] text-white w-full py-2 font-black uppercase">Crear Equipo</button>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}