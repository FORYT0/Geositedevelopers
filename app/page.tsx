'use client';
import { NavBar }             from '@/src/components/experience/NavBar';
import { LandingSection }     from '@/src/components/experience/LandingSection';
import { ProcessSection }     from '@/src/components/experience/ProcessSection';
import { BeforeAfterSection } from '@/src/components/experience/BeforeAfterSection';
import { SuiteSection }       from '@/src/components/experience/SuiteSection';
import { BIMSection }         from '@/src/components/experience/BIMSection';
import { TestimonialsSection } from '@/src/components/experience/TestimonialsSection';
import { PortfolioSection }   from '@/src/components/experience/PortfolioSection';
import { FooterSection }      from '@/src/components/experience/FooterSection';

export default function Home() {
  return (
    <div className="relative" style={{ background: 'var(--charcoal)' }}>
      <NavBar />
      <LandingSection />
      <ProcessSection />
      <BeforeAfterSection />
      <SuiteSection />
      <BIMSection />
      <TestimonialsSection />
      <PortfolioSection />
      <FooterSection />
    </div>
  );
}
