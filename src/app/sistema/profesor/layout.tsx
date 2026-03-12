// src/app/sistema/profesor/layout.tsx
import Sidebar from '../../components/profesor/NavBar_Profesor';

export default function ProfesorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 'flex-col md:flex-row' permite que en móvil se apile verticalmente
    // y en desktop se convierta en una fila (sidebar a la izquierda)
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
      
      {/* El Sidebar contiene la lógica responsiva interna */}
      <Sidebar />
      
      {/* El main respeta el flujo del flex */}
      <main className="flex-1 w-full overflow-hidden p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}