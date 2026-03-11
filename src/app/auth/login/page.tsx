'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client'; // Tu cliente configurado
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Iniciar sesión en Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // 2. Obtener rol desde tu tabla 'usuarios'
      // Usamos id_auth porque es la llave que vincula con auth.users
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
      
      // Accedemos al nombre del rol (asegurando el tipo con any)
      const rol = (userData?.roles as any)?.nombre_rol;

      if (!rol) {
        await supabase.auth.signOut();
        throw new Error("Usuario sin rol asignado o perfil no encontrado.");
      }

      // 3. Redirección basada en el rol
      if (rol === 'Profesor') {
        router.push('/sistema/profesor');
      } else if (rol === 'Alumno') {
        router.push('/sistema/alumno');
      } else {
        router.push('/sistema/dashboard');
      }

      // Refrescamos para que el sistema detecte la nueva sesión
      router.refresh();

    } catch (err: any) {
      console.error("Error al iniciar sesión:", err);
      alert(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[480px] bg-white border-4 border-[#1c1917] p-10 shadow-[8px_8px_0px_0px_rgba(28,25,23,1)]">
          <h1 className="text-2xl font-black mb-6 uppercase">Acceso al Sistema</h1>
          <form className="flex flex-col gap-6" onSubmit={handleLogin}>
            <input 
              type="email" 
              placeholder="Correo electrónico"
              required
              value={email}
              className="h-14 w-full border-2 border-[#1c1917] px-4 outline-none"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input 
              type="password"
              placeholder="Contraseña"
              required
              value={password}
              className="h-14 w-full px-4 border-2 border-[#1c1917] outline-none"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button 
              type="submit"
              disabled={loading}
              className="h-14 bg-[#1c1917] text-white font-black uppercase hover:bg-[#f97316] transition-all disabled:opacity-50"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;