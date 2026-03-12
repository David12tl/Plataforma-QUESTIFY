'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';

// 1. Tipado estricto para las clases
interface Clase {
  id_clase: string;
  nombre_materia: string;
  codigo_acceso: string;
  imagen_url: string | null;
  fecha_creacion: string;
}

const availableImages = Array.from({ length: 10 }, (_, i) => `/materias/${i + 1}.jpg`);

export default function ClassesPage() {
  const supabase = createClient();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clases, setClases] = useState<Clase[]>([]);

  // Estados del formulario
  const [selectedImage, setSelectedImage] = useState(availableImages[0]);
  const [className, setClassName] = useState('');
  const [classCode, setClassCode] = useState('');

  const fetchClases = useCallback(async () => {
    const { data, error } = await supabase
      .from('clases')
      .select('*')
      .order('fecha_creacion', { ascending: false });
    
    if (error) {
      console.error("Error cargando clases:", error.message);
    } else {
      // Tipado explícito de la respuesta
      setClases((data as Clase[]) || []);
    }
  }, [supabase]);

  useEffect(() => {
    fetchClases();
  }, [fetchClases]);

  const generateCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setClassCode(code);
  };

  const handleSaveClass = async () => {
    if (!className || !classCode) return alert("Por favor ingresa un nombre y genera un código.");
    setLoading(true);

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("Sesión no encontrada.");

      const { data: perfil, error: perfilError } = await supabase
        .from('usuarios')
        .select('id_usuario')
        .eq('id_auth', user.id)
        .single();

      if (perfilError || !perfil) throw new Error("No se encontró tu perfil de profesor.");

      const { error: insertError } = await supabase.from('clases').insert([{ 
        nombre_materia: className, 
        codigo_acceso: classCode, 
        id_profesor: perfil.id_usuario, 
        imagen_url: selectedImage 
      }]);

      if (insertError) throw insertError;

      setClassName('');
      setClassCode('');
      setIsModalOpen(false);
      fetchClases();
    } catch (err: unknown) {
      const mensaje = err instanceof Error ? err.message : "Error desconocido";
      alert("Error al guardar: " + mensaje);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Ya no contiene Sidebar ni flex local; el layout padre los provee.
    <div className="w-full">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-[#1c1917]">
            Módulo de Clases
          </h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Panel de gestión docente</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto bg-[#f97316] text-white px-8 py-3 font-black uppercase border-2 border-[#1c1917] shadow-[4px_4px_0px_0px_#1c1917] transition-all hover:translate-y-[2px] hover:shadow-none active:scale-95"
        >
          + Nueva Clase
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {clases.length > 0 ? (
          clases.map((clase) => (
            <Link 
              href={`clases/${clase.id_clase}`} 
              key={clase.id_clase}
              className="border-4 border-[#1c1917] bg-white overflow-hidden shadow-[6px_6px_0px_0px_#1c1917] group transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            >
              <div className="relative h-40 w-full border-b-4 border-[#1c1917]">
                <Image 
                  src={clase.imagen_url || '/materias/1.jpg'} 
                  alt="Portada" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-4 left-4 bg-[#1c1917] text-white px-3 py-1 text-xs font-black uppercase tracking-widest">
                  {clase.codigo_acceso}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl md:text-2xl font-black uppercase text-[#1c1917] leading-tight mb-2 truncate">
                  {clase.nombre_materia}
                </h3>
                <p className="text-xs font-bold text-slate-400 uppercase group-hover:text-[#f97316] transition-colors">Ver administración →</p>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-20 text-center border-4 border-dashed border-slate-300 bg-white">
            <span className="material-symbols-outlined text-5xl text-slate-200 mb-4 block">domain_disabled</span>
            <p className="text-slate-400 font-black uppercase tracking-widest text-sm">No tienes clases creadas aún</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4 overflow-y-auto">
          <div className="bg-white border-4 border-[#1c1917] p-6 md:p-8 w-full max-w-lg shadow-[12px_12px_0px_0px_#1c1917] my-auto">
            <h3 className="text-2xl md:text-3xl font-black uppercase mb-6 text-[#1c1917]">Configurar Materia</h3>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Nombre</label>
                <input 
                  className="w-full p-4 border-2 border-[#1c1917] font-bold text-lg focus:outline-none focus:bg-slate-50 transition-colors" 
                  placeholder="Ej. Diseño Gráfico II" 
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Código de Acceso</label>
                <div className="flex gap-2">
                  <div className="flex-1 border-2 border-[#1c1917] flex items-center justify-center font-black text-xl tracking-[0.3em] bg-slate-50">{classCode || "------"}</div>
                  <button onClick={generateCode} className="bg-slate-200 px-4 py-2 border-2 border-[#1c1917] font-black uppercase text-xs hover:bg-slate-300 transition-colors">Generar</button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Imagen de Portada</label>
                <div className="grid grid-cols-5 gap-2 max-h-32 overflow-y-auto p-1">
                  {availableImages.map((img) => (
                    <button 
                      key={img} 
                      onClick={() => setSelectedImage(img)} 
                      className={`relative h-12 border-2 transition-all ${selectedImage === img ? 'border-[#f97316] scale-110 z-10 shadow-lg' : 'border-slate-100 grayscale opacity-60 hover:opacity-100 hover:grayscale-0'}`}
                    >
                      <Image src={img} alt="P" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 border-2 border-[#1c1917] font-black uppercase text-sm hover:bg-slate-100 transition-colors order-2 sm:order-1">
                  Cancelar
                </button>
                <button onClick={handleSaveClass} disabled={loading} className="flex-1 py-4 bg-[#1c1917] text-white font-black uppercase text-sm hover:bg-black transition-all order-1 sm:order-2 disabled:opacity-50">
                  {loading ? 'Procesando...' : 'Crear Materia'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}