'use client';
import { NavBar }             from '@/src/components/experience/NavBar';
import { CustomCursor }       from '@/src/components/experience/CustomCursor';
import { LandingSection }     from '@/src/components/experience/LandingSection';
import { ProcessSection }     from '@/src/components/experience/ProcessSection';
import { BeforeAfterSection } from '@/src/components/experience/BeforeAfterSection';
import { SuiteSection }       from '@/src/components/experience/SuiteSection';
import { BIMSection }         from '@/src/components/experience/BIMSection';
import { TestimonialsSection } from '@/src/components/experience/TestimonialsSection';
import { ServicesSection }    from '@/src/components/experience/ServicesSection';
import { PortfolioSection }   from '@/src/components/experience/PortfolioSection';
import { FooterSection }      from '@/src/components/experience/FooterSection';
import { AdminProvider }      from '@/src/contexts/AdminContext';
import { AdminToolbar }       from '@/src/components/admin/AdminToolbar';
import { LoginModal }         from '@/src/components/admin/LoginModal';

export default function Home() {
  return (
    <AdminProvider>
      <div className="relative" style={{ background: 'var(--charcoal)' }}>
        <CustomCursor />
        <NavBar />
        <LandingSection />
        <ProcessSection />
        <BeforeAfterSection />
        <SuiteSection />
        <BIMSection />
        <ServicesSection />
        <TestimonialsSection />
        <PortfolioSection />
        <FooterSection />
      </div>
      <AdminToolbar />
      <LoginModal />
    </AdminProvider>
  );
}
