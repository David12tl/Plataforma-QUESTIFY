'use client';

import React, { useState } from 'react';
import Image from 'next/image';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (email.trim()) { setSent(true); setEmail(''); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .footer-root { font-family: 'DM Sans', sans-serif; }
        .footer-link { color: #64748b; text-decoration: none; font-size: 0.875rem; transition: color 0.2s ease; display: inline-block; }
        .footer-link:hover { color: #f97316; }
        .social-btn { width: 38px; height: 38px; border-radius: 10px; background: #fff0e6; display: flex; align-items: center; justify-content: center; color: #f97316; text-decoration: none; transition: background 0.2s ease, transform 0.2s ease; border: 1.5px solid #fed7aa; }
        .social-btn:hover { background: #f97316; color: white; transform: translateY(-2px); }
        .newsletter-input { flex: 1; background: #f8fafc; border: 1.5px solid #f1f5f9; border-radius: 10px; font-size: 0.875rem; padding: 10px 14px; font-family: 'DM Sans', sans-serif; color: #1c1917; outline: none; transition: border-color 0.2s ease; }
        .newsletter-input:focus { border-color: #f97316; }
        .newsletter-btn { background: linear-gradient(135deg, #f97316, #ea580c); color: white; border: none; border-radius: 10px; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 12px rgba(249,115,22,0.30); transition: transform 0.2s ease, box-shadow 0.2s ease; flex-shrink: 0; }
      `}</style>

      <footer className="footer-root" style={{ background: 'white', borderTop: '1px solid #fff0e6', padding: '72px 24px 0' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            
            {/* Brand col */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="relative w-24 h-24 flex items-center justify-center">
                <Image src="/IMAGITIPO.png" alt="Logo" width={300} height={300} className="object-contain" />
              </div>
              <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.7, margin: 0 }}>
                Ayudamos a los equipos a navegar proyectos con calma y eficiencia. La forma más serena de gestionar tu trabajo.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                {['public', 'share', 'group'].map((icon) => (
                  <a key={icon} href="#" className="social-btn"><span className="material-symbols-outlined" style={{ fontSize: 18 }}>{icon}</span></a>
                ))}
              </div>
            </div>

            {/* Product col */}
            <div>
              <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: '#1c1917', marginBottom: 20 }}>Producto</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {['Integraciones','Empresas','Novedades','Estado del sistema'].map(item => (<li key={item}><a href="#" className="footer-link">{item}</a></li>))}
              </ul>
            </div>

            {/* Company col */}
            <div>
              <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: '#1c1917', marginBottom: 20 }}>Empresa</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {['Sobre Nosotros','Empleos','Política de Privacidad','Términos de Servicio'].map(item => (<li key={item}><a href="#" className="footer-link">{item}</a></li>))}
              </ul>
            </div>

            {/* Newsletter col */}
            <div>
              <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: '#1c1917', marginBottom: 12 }}>Newsletter</h4>
              <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: 16, lineHeight: 1.6 }}>Recibe las últimas novedades.</p>
              {sent ? (
                <div style={{ background: '#fff0e6', color: '#f97316', borderRadius: 10, padding: '10px 16px', fontSize: '0.875rem', fontWeight: 600, border: '1.5px solid #fed7aa' }}>✅ ¡Suscrito con éxito!</div>
              ) : (
                <div style={{ display: 'flex', gap: 8 }}>
                  <input className="newsletter-input" placeholder="tu@email.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <button className="newsletter-btn" onClick={handleSend} aria-label="Suscribirse"><span className="material-symbols-outlined" style={{ fontSize: 20 }}>send</span></button>
                </div>
              )}
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ marginTop: 56, paddingTop: 24, paddingBottom: 28, borderTop: '1px solid #fff0e6', display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0 }}>© 2025 TaskMaster Inc. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;