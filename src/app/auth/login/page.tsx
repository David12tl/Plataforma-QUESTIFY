'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Navbar from '../../components/layout/Navbar'; // Ajustado el alias @/ por orden
import Footer from '../../components/layout/Footer';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Iniciar sesión en Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("No se pudo obtener el usuario.");

      // 2. Obtener rol desde la tabla 'usuarios' usando el ID de Auth
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select(`
          roles (
            nombre_rol
          )
        `)
        .eq('id_auth', authData.user.id)
        .maybeSingle();

      if (userError) throw userError;
      
      // Acceso seguro al nombre del rol (Tipado manual para evitar 'any')
      const rol = (userData?.roles as { nombre_rol: string } | undefined)?.nombre_rol;

      if (!rol) {
        await supabase.auth.signOut();
        throw new Error("Usuario sin rol asignado o perfil no encontrado.");
      }

      // 3. Redirección basada en el rol
      // Profesor -> /sistema/profesor
      // Alumno -> /sistema/alumno
      if (rol === 'Profesor') {
        router.replace('/sistema/profesor');
      } else if (rol === 'Alumno') {
        router.replace('/sistema/alumno');
      } else {
        router.replace('/sistema/dashboard');
      }

    } catch (err: unknown) {
      // SOLUCIÓN AL ERROR DE ESLINT: Manejo de error con tipo 'unknown'
      console.error("Error al iniciar sesión:", err);
      
      const mensajeError = err instanceof Error 
        ? err.message 
        : "Ocurrió un error inesperado al iniciar sesión";
      
      alert(mensajeError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-inter">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[480px] bg-white border-4 border-[#1c1917] p-10 shadow-[8px_8px_0px_0px_rgba(28,25,23,1)]">
          
          <header className="mb-8">
            <h1 className="text-3xl font-black uppercase tracking-tighter text-[#1c1917]">
              Acceso al Sistema
            </h1>
            <div className="h-1 w-12 bg-[#f97316] mt-2"></div>
          </header>

          <form className="flex flex-col gap-6" onSubmit={handleLogin}>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Credenciales de acceso
              </label>
              <input 
                name="email" // <--- CRITICO PARA SELENIUM
                type="email" 
                placeholder="Correo electrónico"
                required
                value={email}
                className="h-14 w-full border-2 border-[#1c1917] px-4 font-bold outline-none focus:border-[#f97316] transition-colors"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input 
                name="password" // <--- CRITICO PARA SELENIUM
                type="password"
                placeholder="Contraseña"
                required
                value={password}
                className="h-14 w-full px-4 border-2 border-[#1c1917] font-bold outline-none focus:border-[#f97316] transition-colors"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="h-14 bg-[#1c1917] text-white font-black uppercase tracking-widest hover:bg-[#f97316] hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 shadow-[4px_4px_0px_0px_#f97316] hover:shadow-none"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
            
            <p className="text-[10px] text-center font-bold text-slate-400 uppercase tracking-tighter">
              Protegido por cifrado de extremo a extremo
            </p>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;