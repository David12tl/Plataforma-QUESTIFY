// components/sections/CTASection.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';

const CTASection = () => {
  const ref = useRef<HTMLElement>(null);
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@800&display=swap');

        .cta-btn-primary {
          background: white;
          color: #f97316;
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1rem;
          padding: 14px 36px;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          white-space: nowrap;
          letter-spacing: -0.2px;
        }
        .cta-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.2);
        }

        .cta-btn-secondary {
          background: rgba(255,255,255,0.12);
          color: white;
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1rem;
          padding: 14px 36px;
          border-radius: 14px;
          border: 2px solid rgba(255,255,255,0.35);
          cursor: pointer;
          transition: background 0.2s ease, transform 0.2s ease;
          backdrop-filter: blur(8px);
          white-space: nowrap;
          letter-spacing: -0.2px;
        }
        .cta-btn-secondary:hover {
          background: rgba(255,255,255,0.22);
          transform: translateY(-2px);
        }

        @keyframes floatA {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(-14px) rotate(3deg); }
        }
        @keyframes floatB {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(-10px) rotate(-4deg); }
        }
        @keyframes floatC {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-18px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .float-a { animation: floatA 5s ease-in-out infinite; }
        .float-b { animation: floatB 6.5s ease-in-out infinite 1s; }
        .float-c { animation: floatC 4.5s ease-in-out infinite 0.5s; }
        .spin-slow { animation: spin-slow 18s linear infinite; }
      `}</style>

      <section ref={ref} className="px-6 md:px-20 py-24 relative overflow-hidden">

        {/* Outer glow blob */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 600, height: 300, borderRadius: '50%',
          background: 'rgba(249,115,22,0.12)', filter: 'blur(80px)',
          pointerEvents: 'none', zIndex: 0,
        }}/>

        <div
          className="max-w-5xl mx-auto relative"
          style={{
            borderRadius: 48,
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%)',
            boxShadow: '0 32px 80px rgba(249,115,22,0.45)',
            transition: 'transform 0.6s ease, opacity 0.6s ease',
            transform: visible ? 'translateY(0)' : 'translateY(32px)',
            opacity: visible ? 1 : 0,
          }}
        >
          {/* Wave SVG pattern */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.08, pointerEvents: 'none' }}>
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 200">
              <path d="M0,80 C60,120 120,40 180,80 C240,120 300,40 360,80 C390,95 400,85 400,80 L400,200 L0,200 Z" fill="white"/>
              <path d="M0,120 C50,150 110,90 170,120 C230,150 290,90 350,120 C380,135 400,125 400,120 L400,200 L0,200 Z" fill="white" opacity="0.5"/>
            </svg>
          </div>

          {/* Spinning ring decoration */}
          <div className="spin-slow" style={{
            position: 'absolute', top: -60, right: -60,
            width: 220, height: 220, borderRadius: '50%',
            border: '2px dashed rgba(255,255,255,0.2)',
            pointerEvents: 'none',
          }}/>
          <div className="spin-slow" style={{
            position: 'absolute', bottom: -40, left: -40,
            width: 160, height: 160, borderRadius: '50%',
            border: '2px dashed rgba(255,255,255,0.15)',
            pointerEvents: 'none',
            animationDirection: 'reverse',
          }}/>

          {/* Floating decorative blobs */}
          <div className="float-a" style={{
            position: 'absolute', top: 24, right: 80,
            width: 48, height: 48, borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)', pointerEvents: 'none',
          }}/>
          <div className="float-b" style={{
            position: 'absolute', bottom: 32, left: 100,
            width: 32, height: 32, borderRadius: '50%',
            background: 'rgba(255,255,255,0.12)', pointerEvents: 'none',
          }}/>
          <div className="float-c" style={{
            position: 'absolute', top: 40, left: 60,
            width: 20, height: 20, borderRadius: '50%',
            background: 'rgba(255,255,255,0.18)', pointerEvents: 'none',
          }}/>

          {/* Glare blobs */}
          <div style={{
            position: 'absolute', top: -40, left: -40,
            width: 200, height: 200, borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)', filter: 'blur(30px)',
            pointerEvents: 'none',
          }}/>
          <div style={{
            position: 'absolute', bottom: -40, right: -40,
            width: 200, height: 200, borderRadius: '50%',
            background: 'rgba(0,0,0,0.08)', filter: 'blur(30px)',
            pointerEvents: 'none',
          }}/>

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 10, padding: 'clamp(48px,8vw,88px)', textAlign: 'center' }}>

            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(8px)',
              borderRadius: 999,
              padding: '6px 18px',
              fontSize: '0.75rem', fontWeight: 700,
              color: 'white', letterSpacing: '0.08em',
              textTransform: 'uppercase', marginBottom: 28,
              border: '1px solid rgba(255,255,255,0.25)',
            }}>
              🚀 Sin tarjeta de crédito
            </div>

            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color: 'white',
              lineHeight: 1.1,
              letterSpacing: '-1px',
              marginBottom: 20,
            }}>
              ¿Listo para encontrar<br/>tu flujo ideal?
            </h2>

            <p style={{
              color: 'rgba(255,255,255,0.82)',
              fontSize: 'clamp(1rem, 2vw, 1.15rem)',
              maxWidth: 520,
              margin: '0 auto 40px',
              lineHeight: 1.7,
            }}>
              Únete a miles de equipos que encontraron una forma más tranquila y eficiente de trabajar. Empieza tu viaje hoy.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
              <button className="cta-btn-primary">Iniciar Prueba Gratis</button>
              <button className="cta-btn-secondary">Solicitar una Demo</button>
            </div>

            {/* Social proof */}
            <div style={{
              marginTop: 40,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
              flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex' }}>
                {['#f97316','#ea580c','#fb923c','#fed7aa','#fff'].map((c, i) => (
                  <div key={i} style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: c, border: '2px solid rgba(255,255,255,0.6)',
                    marginLeft: i === 0 ? 0 : -10,
                  }}/>
                ))}
              </div>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem', margin: 0 }}>
                <strong style={{ color: 'white' }}>+12,000 equipos</strong> ya confían en TaskMaster
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CTASection;