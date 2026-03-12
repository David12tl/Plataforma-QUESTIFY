import SidebarAlumno from '../../components/alumno/Navbar'; // Tu sidebar de alumno

export default function AlumnoLayout({ children }: { children: React.ReactNode }) {
  return (
    // 'flex' permite que el Sidebar y el Main vivan lado a lado
    <div className="min-h-screen bg-slate-50 flex">
      
      {/* Sidebar fijo a la izquierda */}
      <div className="w-64 fixed inset-y-0 left-0 hidden md:block z-10">
        <SidebarAlumno />
      </div>

      {/* Área principal: el pl-64 reserva el espacio para el sidebar */}
      <main className="flex-1 w-full md:pl-64 transition-all duration-300">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}