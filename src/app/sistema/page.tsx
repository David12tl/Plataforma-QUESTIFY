import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function SistemaPage() {
  // 1. Inicializamos el cliente de servidor (SSR)
  const supabase = await createClient();

  // 2. Obtenemos el usuario autenticado
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // 3. Consultamos el rol en la base de datos
  const { data: userData, error } = await supabase
    .from('usuarios')
    .select(`
      roles ( nombre_rol )
    `)
    .eq('id_usuario', user.id)
    .single();

  if (error || !userData) {
    console.error("Error al obtener rol:", error);
    redirect('/login'); // O a una página de 'error-de-permisos'
  }

  // 4. Normalizamos el rol
  const rol = (userData.roles as any)?.nombre_rol;

  // 5. Redirección basada en el rol
  if (rol === 'Profesor') {
    redirect('/sistema/profesor');
  } else if (rol === 'Alumno') {
    redirect('/sistema/alumno');
  } else {
    // Si el usuario no tiene rol asignado, lo sacamos del sistema
    redirect('/login');
  }
}