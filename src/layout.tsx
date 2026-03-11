import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
// 1. Importa tu provider
import { PerfilProvider } from './app/context/PerfilContext'; 

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'TaskMaster - Master Your Workflow',
  description: 'Navigate your daily tasks with serene clarity.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body 
        className={`${inter.className} antialiased`} 
        suppressHydrationWarning={true}
      >
        {/* 2. Envolvemos la aplicación con el provider */}
        <PerfilProvider>
          {children}
        </PerfilProvider>
      </body>
    </html>
  );
}