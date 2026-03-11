'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '../../../components/profesor/NavBar_Profesor';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';

// Array de imágenes disponibles
const availableImages = Array.from({ length: 10 }, (_, i) => `/materias/${i + 1}.jpg`);

export default function ClassesPage() {
  const supabase = createClient();
  
  // Estados de la interfaz
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clases, setClases] = useState<any[]>([]);

  // Estados del formulario
  const [selectedImage, setSelectedImage] = useState(availableImages[0]);
  const [className, setClassName] = useState('');
  const [classCode, setClassCode] = useState('');

  useEffect(() => {
    fetchClases();
  }, []);

  const fetchClases = async () => {
    const { data, error } = await supabase
      .from('clases')
      .select('*')
      .order('fecha_creacion', { ascending: false });
    
    if (error) console.error("Error cargando clases:", error.message);
    else setClases(data || []);
  };

  const generateCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setClassCode(code);
  };

  const handleSaveClass = async () => {
    if (!className || !classCode) return alert("Por favor ingresa un nombre y genera un código.");
    setLoading(true);

    try {
      // 1. Obtener ID de Auth
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("Sesión no encontrada.");

      // 2. Obtener el ID de la tabla 'usuarios' para cumplir la Foreign Key
      const { data: perfil, error: perfilError } = await supabase
        .from('usuarios')
        .select('id_usuario')
        .eq('id_auth', user.id)
        .single();

      if (perfilError || !perfil) throw new Error("No se encontró tu perfil de profesor.");

      // 3. Insertar con el ID real
      const { error: insertError } = await supabase.from('clases').insert([{ 
        nombre_materia: className, 
        codigo_acceso: classCode, 
        id_profesor: perfil.id_usuario, 
        imagen_url: selectedImage 
      }]);

      if (insertError) throw insertError;

      alert("¡Clase creada!");
      setClassName('');
      setClassCode('');
      setIsModalOpen(false);
      fetchClases();
    } catch (err: any) {
      alert("Error al guardar: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-10">
          <h2 className="text-4xl font-black uppercase font-syne text-[#1c1917] tracking-tighter">Módulo de Clases</h2>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#f97316] text-white px-6 py-3 font-black uppercase border-2 border-[#1c1917] shadow-[4px_4px_0px_0px_#1c1917] transition-all hover:translate-y-[2px] hover:shadow-none"
          >
            + Nueva Clase
          </button>
        </header>

        {/* GRID DE CLASES CON ENLACES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {clases.length > 0 ? (
            clases.map((clase) => (
              <Link 
                href={`clases/${clase.id_clase}`} 
                key={clase.id_clase}
                className="border-4 border-[#1c1917] bg-white overflow-hidden shadow-[8px_8px_0px_0px_#1c1917] group transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
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
                  <h3 className="text-2xl font-black uppercase text-[#1c1917] leading-tight mb-2">
                    {clase.nombre_materia}
                  </h3>
                  <p className="text-sm font-bold text-slate-400 uppercase">Ver clase →</p>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 text-center border-4 border-dashed border-slate-300">
              <p className="text-slate-400 font-black uppercase tracking-widest">No tienes clases creadas aún</p>
            </div>
          )}
        </div>

        {/* MODAL DE CREACIÓN */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white border-4 border-[#1c1917] p-8 w-full max-w-lg shadow-[12px_12px_0px_0px_#1c1917]">
              <h3 className="text-3xl font-black uppercase mb-6 text-[#1c1917]">Configurar Materia</h3>
              <div className="space-y-5">
                <input 
                  className="w-full p-4 border-2 border-[#1c1917] font-bold text-lg" 
                  placeholder="Nombre de la materia..." 
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                />
                <div className="flex gap-2">
                  <div className="flex-1 border-2 border-[#1c1917] flex items-center justify-center font-black text-xl tracking-[0.3em] bg-slate-50">{classCode || "------"}</div>
                  <button onClick={generateCode} className="bg-slate-200 px-4 py-2 border-2 border-[#1c1917] font-black uppercase text-xs">Gen.</button>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {availableImages.map((img) => (
                    <button key={img} onClick={() => setSelectedImage(img)} className={`relative h-12 border-2 ${selectedImage === img ? 'border-[#f97316] scale-110' : 'border-slate-200'}`}>
                      <Image src={img} alt="P" fill className="object-cover" />
                    </button>
                  ))}
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 border-2 border-[#1c1917] font-black uppercase">Cancelar</button>
                  <button onClick={handleSaveClass} className="flex-1 py-4 bg-[#1c1917] text-white font-black uppercase">{loading ? '...' : 'Crear'}</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}