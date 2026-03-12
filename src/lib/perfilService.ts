import { createClient } from '@/utils/supabase/client';

export interface PerfilUsuario {
  id_usuario: string;
  nombre_usuario: string;
  email: string;
  id_rol: number | null;
  id_auth: string;
}

export async function obtenerPerfilUsuario(): Promise<PerfilUsuario | null> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) return null;

  // Intentar primero en alumnos
  const { data: alumno } = await supabase
    .from("alumnos")
    .select("*")
    .eq("id_auth", session.user.id)
    .maybeSingle();

  if (alumno) return alumno as PerfilUsuario;

  // Si no, intentar en profesores
  const { data: profesor } = await supabase
    .from("profesores")
    .select("*")
    .eq("id_auth", session.user.id)
    .maybeSingle();

  return profesor ? (profesor as PerfilUsuario) : null;
}