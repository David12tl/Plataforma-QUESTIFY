// src/app/sistema/profesor/layout.tsx
import Sidebar from '../../components/profesor/NavBar_Profesor';

export default function ProfesorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
      {/* Aseguramos que el Sidebar tenga una clase base de ancho 
         para que el navegador reserve el espacio correctamente.
      */}
      <div className="md:w-64 flex-shrink-0">
        <Sidebar />
      </div>
      
      {/* Usamos w-full y overflow-x-hidden para evitar que el 
         contenido se desborde fuera de la pantalla.
      */}
      <main className="flex-1 w-full p-4 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}