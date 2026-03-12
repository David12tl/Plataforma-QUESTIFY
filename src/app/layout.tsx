import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { PerfilProvider } from './context/PerfilContext'; 

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'TaskMaster',
  description: 'Dominando el flujo de trabajo.',
};

// Configuración importante para dispositivos móviles
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover', // Esto permite que el sitio ocupe toda la pantalla incluyendo el notch
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="light">
      <link 
  rel="stylesheet" 
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" 
/>
      <body className={`${inter.className} antialiased min-h-screen`}>
        <PerfilProvider>
          {children}
        </PerfilProvider>
      </body>
    </html>
  );
}