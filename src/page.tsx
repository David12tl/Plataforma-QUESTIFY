// src/app/page.tsx
'use client';

import { useEffect } from 'react';
import Navbar from './app/components/layout/Navbar';  // Cambiado: @/components/layout/Navbar → ./components/layout/Navbar
import HeroSection from './app/components/sections/HeroSection';  // Cambiado
import FeaturesSection from './app/components/sections/FeatureSection';  // Cambiado
import StatsSection from './app/components/sections/StatsSection';  // Cambiado
import CTASection from './app/components/sections/CTASection';  // Cambiado
import Footer from './app/components/layout/Footer';  // Cambiado

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