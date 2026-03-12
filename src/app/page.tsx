// src/app/page.tsx
'use client';

import { useEffect } from 'react';
import Navbar from './components/layout/Navbar';  // Cambiado: @/components/layout/Navbar → ./components/layout/Navbar
import HeroSection from './components/sections/HeroSection';  // Cambiado
import FeaturesSection from './components/sections/FeatureSection';  // Cambiado
import StatsSection from './components/sections/StatsSection';  // Cambiado
import CTASection from './components/sections/CTASection';  // Cambiado
import Footer from './components/layout/Footer';  // Cambiado

export default function Home() {
  useEffect(() => {
    document.documentElement.classList.add('light');
  }, []);

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root wave-bg">
      <div className="layout-container flex h-full grow flex-col">
        <Navbar />
        <main className="flex flex-col flex-1">
          <HeroSection />
          <FeaturesSection />
          <StatsSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </div>
  );
}