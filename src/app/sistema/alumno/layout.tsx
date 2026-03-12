import Sidebar from '../../components/alumno/Navbar';

export default function ProfesorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 'flex' establece el eje horizontal (Sidebar a la izq, Main a la der)
    // 'min-h-screen' asegura que ocupe toda la altura de la pantalla
    <div className="flex min-h-screen bg-slate-50">
      
      {/* 1. Sidebar con ancho fijo y flex-shrink-0 para que no se comprima */}
      <aside className="w-64 flex-shrink-0 hidden md:block border-r border-slate-200">
        <Sidebar />
      </aside>

      {/* 2. Main content toma el espacio restante con flex-1 */}
      {/* 'overflow-x-hidden' evita que la tabla o gráficas rompan el layout */}
      <main className="flex-1 w-full overflow-x-hidden p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}