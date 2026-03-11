'use client';

import React from 'react';

// Nuevo diseño: Estilo Neo-Brutalista (bordes fuertes, sombras sólidas)
const TaskListMockup = () => (
  <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Tarjeta con borde sólido */}
    <rect x="4" y="4" width="392" height="292" rx="0" fill="white" stroke="#1c1917" strokeWidth="4" />
    
    {/* Header de la tarjeta */}
    <rect x="20" y="20" width="360" height="40" fill="#f1f5f9" stroke="#1c1917" strokeWidth="2" />
    <rect x="40" y="34" width="80" height="12" fill="#1c1917" />

    {/* Tareas (Estilo plano y directo) */}
    {[1, 2, 3].map((i) => (
      <g key={i} transform={`translate(40, ${90 + (i * 60)})`}>
        <rect width="320" height="40" fill="white" stroke="#1c1917" strokeWidth="2" />
        <rect x="12" y="12" width="16" height="16" stroke="#1c1917" strokeWidth="2" fill="white" />
        <rect x="40" y="16" width="120" height="8" fill="#1c1917" />
      </g>
    ))}
  </svg>
);

const HeroSection = () => {
  return (
    <section className="relative px-6 md:px-20 py-24 bg-[#f8f9fa]">
      {/* Patrón de puntos (Grid de puntos técnico) */}
      <div className="absolute inset-0 opacity-20" 
           style={{ backgroundImage: 'radial-gradient(#1c1917 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
        
        {/* Columna de Texto: Tipografía pesada y directa */}
        <div className="flex-1 space-y-8">
          <h1 className="text-6xl md:text-8xl font-black text-[#1c1917] leading-[0.9] tracking-tighter">
            DOMINA<br/>
            TU<br/>
            FLUJO.
          </h1>
          <p className="text-xl text-[#334155] border-l-4 border-[#1c1917] pl-6 py-2 font-medium">
            La herramienta de productividad diseñada para equipos que prefieren <b>resultados</b> sobre adornos. Clara, rápida y directa.
          </p>
          <button className="bg-[#1c1917] text-white font-bold py-5 px-10 text-lg hover:bg-[#f97316] transition-colors border-b-8 border-r-8 border-[#f97316]">
            EMPEZAR AHORA
          </button>
        </div>

        {/* Columna Visual: Diseño sólido y cuadrado */}
        <div className="flex-1 w-full relative">
          <div className="relative w-full p-2 bg-[#f97316]">
            <div className="bg-white">
              <TaskListMockup />
            </div>
          </div>
          {/* Sombra desplazada (Brutalismo) */}
          <div className="absolute top-4 -right-4 w-full h-full border-4 border-[#1c1917] -z-10" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;