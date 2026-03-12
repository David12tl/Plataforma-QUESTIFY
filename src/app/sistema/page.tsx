import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

// 1. Definimos una interfaz clara para el rol esperado
interface RolData {
  roles: {
    nombre_rol: string;
  } | null;
}

export default async function SistemaPage() {
  const supabase = await createClient();

  // 2. Obtenemos el usuario autenticado
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login?mensaje=Debes iniciar sesión para acceder al sistema');
  }

  // 3. Consultamos el rol usando la interfaz definida
  const { data: userData, error } = await supabase
    .from('usuarios')
    .select(`
      roles ( nombre_rol )
    `)
    .eq('id_usuario', user.id)
    .single();

  if (error || !userData) {
    console.error("Error al obtener rol:", error);
    redirect('/auth/login?mensaje=Error al verificar permisos');
  }

  // 4. Extraemos el rol de forma segura (sin 'any')
  const rolData = userData as unknown as RolData;
  const nombreRol = rolData.roles?.nombre_rol;

  // 5. Redirección basada en el rol
  if (nombreRol === 'Profesor') {
    redirect('/sistema/profesor');
  } else if (nombreRol === 'Alumno') {
    redirect('/sistema/alumno');
  } else {
    redirect('/auth/login?mensaje=Rol de usuario no reconocido');
  }
}