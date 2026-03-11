'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [roleId, setRoleId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleId) return alert("Por favor, selecciona si eres Profesor o Alumno.");
    
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            id_rol: roleId,
          },
        },
      });

      if (error) throw error;

      alert("¡Registro exitoso! Por favor, verifica tu correo electrónico si la confirmación está activa.");
      router.replace('/auth/login');
    } catch (err: any) {
      console.error("Error al registrar:", err);
      alert(err.message || "Error al intentar registrarse.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-syne">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="relative z-10 w-full max-w-[1000px] grid grid-cols-1 md:grid-cols-2 bg-white border-4 border-[#1c1917] shadow-[12px_12px_0px_0px_rgba(28,25,23,1)] overflow-hidden">
          
          <div className="hidden md:flex flex-col justify-center p-12 bg-[#fff0e6] border-r-4 border-[#1c1917]">
            <h2 className="text-4xl font-black uppercase tracking-tighter text-[#1c1917] mb-6">
              Empieza tu viaje educativo
            </h2>
            <p className="text-lg font-medium text-[#1c1917]/80">
              Únete a nuestra plataforma y gestiona tus clases o tareas de forma sencilla. 
              Elige tu rol para comenzar a configurar tu perfil personalizado hoy mismo.
            </p>
          </div>

          <div className="flex flex-col p-8 md:p-12 bg-white">
            <h2 className="text-3xl font-black text-[#1c1917] uppercase tracking-tighter mb-8">Crear Cuenta</h2>
            
            <form className="space-y-5" onSubmit={handleRegister}>
              <div className="flex gap-4 mb-6">
                <button 
                  type="button" 
                  onClick={() => setRoleId(2)} 
                  className={`flex-1 py-3 border-2 font-black uppercase text-xs transition-colors ${roleId === 2 ? 'bg-[#f97316] text-white border-[#1c1917]' : 'bg-white border-[#1c1917]'}`}
                >
                  Profesor
                </button>
                <button 
                  type="button" 
                  onClick={() => setRoleId(3)} 
                  className={`flex-1 py-3 border-2 font-black uppercase text-xs transition-colors ${roleId === 3 ? 'bg-[#f97316] text-white border-[#1c1917]' : 'bg-white border-[#1c1917]'}`}
                >
                  Alumno
                </button>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-[#1c1917] mb-2">Nombre Completo</label>
                <input required className="w-full h-12 px-4 border-2 border-[#1c1917] font-medium" placeholder="John Doe" type="text" onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-[#1c1917] mb-2">Correo Electrónico</label>
                <input required className="w-full h-12 px-4 border-2 border-[#1c1917] font-medium" placeholder="nombre@correo.com" type="email" onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-[#1c1917] mb-2">Contraseña</label>
                <input required className="w-full h-12 px-4 border-2 border-[#1c1917] font-medium" placeholder="••••••••" type="password" onChange={(e) => setFormData({...formData, password: e.target.value})} />
              </div>

              <button 
                disabled={loading} 
                className="w-full bg-[#1c1917] text-white font-black py-4 uppercase border-2 border-[#1c1917] hover:bg-[#f97316] transition-all disabled:opacity-50"
              >
                {loading ? 'Procesando...' : 'Comenzar ahora'}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  );
};

export default RegisterPage;