'use client';

import React, { useEffect, useRef, useState } from 'react';

const stats = [
  { value: 2,    suffix: 'M+',  label: 'Usuarios Activos' },
  { value: 500,  suffix: 'M+',  label: 'Tareas Completadas' },
  { value: 40,   suffix: '%',   label: 'Más Productividad' },
  { value: 99.9, suffix: '%',   label: 'Disponibilidad' },
];

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

function useCountUp(target: number, duration: number = 1600, start: boolean = false): number {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(parseFloat((eased * target).toFixed(target % 1 !== 0 ? 1 : 0)));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

const StatCard = ({ stat, index, visible }: { stat: Stat; index: number; visible: boolean }) => {
  const count = useCountUp(stat.value, 1400 + index * 100, visible);

  return (
    <div className="bg-white border-2 border-[#1c1917] p-8 text-center relative hover:translate-x-1 hover:-translate-y-1 transition-transform">
      <div className="text-5xl font-black text-[#1c1917] mb-2 font-mono">
        {count}{stat.suffix}
      </div>
      <div className="text-sm font-bold uppercase tracking-widest text-[#64748b]">
        {stat.label}
      </div>
      {/* Sombra brutalista */}
      <div className="absolute top-2 left-2 w-full h-full border-2 border-[#1c1917] -z-10" />
    </div>
  );
};

const StatsSection = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="px-6 md:px-20 py-24 bg-[#f8f9fa] border-t-4 border-[#1c1917]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 border-b-4 border-[#1c1917] pb-8">
          <h2 className="text-4xl md:text-6xl font-black text-[#1c1917] tracking-tighter">
            DATOS DUROS.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <StatCard key={i} stat={stat} index={i} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;