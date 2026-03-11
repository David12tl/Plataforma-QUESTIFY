import { supabase } from "./supabase";

export interface PerfilUsuario {
  id_usuario: string; // Tu UUID interno
  nombre_usuario: string;
  email: string;
  id_rol: number | null;
  id_auth: string; // El UUID de Supabase Auth
}

export async function obtenerPerfilUsuario(): Promise<PerfilUsuario | null> {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session?.user) {
    return null;
  }

  // Usamos el ID del usuario de la sesión para encontrar su perfil en 'usuarios'
  const { data, error } = await supabase
    .from("usuarios")
    .select(`
      id_usuario,
      nombre_usuario,
      email,
      id_rol,
      id_auth
    `)
    .eq("id_auth", session.user.id) // <--- Esta es la clave
    .maybeSingle();

  if (error) {
    console.error("Error en consulta de perfil:", error);
    return null;
  }

  return data as PerfilUsuario | null;
}