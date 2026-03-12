'use client';

import Navbar from './components/layout/Navbar'; 
import HeroSection from './components/sections/HeroSection'; 
import FeaturesSection from './components/sections/FeatureSection'; 
import StatsSection from './components/sections/StatsSection'; 
import CTASection from './components/sections/CTASection'; 
import Footer from './components/layout/Footer'; 

export default function Home() {
  return (
    // Hemos eliminado el flex y min-h-screen aquí porque el layout.tsx ya los provee.
    // Esto evita conflictos de scroll y de altura.
    <div className="relative w-full group/design-root wave-bg">
      <Navbar />
      
      <main className="flex flex-col w-full">
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
}