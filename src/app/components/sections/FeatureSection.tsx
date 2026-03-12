'use client';

import React from 'react';

// 1. Definimos la interfaz global
interface Feature {
  icon: string;
  title: string;
  description: string;
  color: string;
}

const features: Feature[] = [
  { icon: 'calendar_month', title: 'Planificación Visual', description: 'Líneas de tiempo claras para que nada se escape.', color: '#f97316' },
  { icon: 'smart_toy', title: 'Automatización', description: 'Delega tareas repetitivas a nuestros bots.', color: '#10b981' },
  { icon: 'sync', title: 'Sincronización', description: 'Tus datos al día en todos tus dispositivos.', color: '#6366f1' },
  { icon: 'group', title: 'Colaboración', description: 'Asigna roles y mantén a tu equipo unido.', color: '#f97316' },
  { icon: 'insights', title: 'Métricas', description: 'Dashboards claros para decisiones reales.', color: '#10b981' },
  { icon: 'lock', title: 'Seguridad', description: 'Cifrado de extremo a extremo garantizado.', color: '#6366f1' },
];

const FeatureCard = ({ feature, index }: { feature: Feature, index: number }) => {
  return (
    <div
      style={{ transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${index * 100}ms` }}
      className="bg-white border-2 border-[#1c1917] p-8 relative transition-all group overflow-hidden"
    >
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(135deg, ${feature.color}15 0%, #ffffff 100%)` }}
      />

      <div className="relative w-12 h-12 border-2 border-[#1c1917] flex items-center justify-center mb-6 bg-white z-10">
        {/* Aquí es donde Material Symbols debe activarse */}
        <span className="material-symbols-outlined text-2xl" style={{ color: feature.color }}>
          {feature.icon}
        </span>
      </div>

      <h3 className="relative text-xl font-black text-[#1c1917] mb-3 uppercase tracking-tight z-10">
        {feature.title}
      </h3>
      <p className="relative text-[#334155] font-medium text-sm leading-relaxed z-10">
        {feature.description}
      </p>

      <div className="absolute top-2 left-2 w-full h-full border-2 border-[#1c1917] -z-0 bg-[#f97316] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

const FeaturesSection = () => {
  return (
    <section className="px-6 md:px-20 py-24 bg-[#f8f9fa] border-t-4 border-[#1c1917]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-5xl md:text-7xl font-black text-[#1c1917] tracking-tighter uppercase mb-6">
            Funciones <span className="text-[#f97316]">Poderosas.</span>
          </h2>
          <div className="h-2 w-24 bg-[#1c1917]"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <FeatureCard key={i} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;