'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { obtenerPerfilUsuario, PerfilUsuario } from '../../lib/perfilService';
import { supabase } from '@/lib/supabase'; // Asegúrate de importar tu cliente supabase

interface PerfilContextType {
  perfil: PerfilUsuario | null;
  loading: boolean;
  refreshPerfil: () => void;
}

const PerfilContext = createContext<PerfilContextType | undefined>(undefined);

export const PerfilProvider = ({ children }: { children: React.ReactNode }) => {
  const [perfil, setPerfil] = useState<PerfilUsuario | null>(null);
  const [loading, setLoading] = useState(true);

  const loadPerfil = useCallback(async () => {
    try {
      setLoading(true);
      const data = await obtenerPerfilUsuario();
      setPerfil(data);
    } catch (e) {
      console.error("Error cargando perfil global:", e);
      setPerfil(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // 1. Carga inicial
    loadPerfil();

    // 2. Escuchar cambios de autenticación (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        loadPerfil();
      } else if (event === 'SIGNED_OUT') {
        setPerfil(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadPerfil]);

  return (
    <PerfilContext.Provider value={{ perfil, loading, refreshPerfil: loadPerfil }}>
      {children}
    </PerfilContext.Provider>
  );
};

export const usePerfil = () => {
  const context = useContext(PerfilContext);
  if (!context) {
    throw new Error('usePerfil debe ser usado dentro de un PerfilProvider');
  }
  return context;
};