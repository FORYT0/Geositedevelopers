'use client';
import { useEffect, useRef, useState } from 'react';

const STEPS = [
  {
    number: '01',
    title: 'Discovery',
    subtitle: 'Understanding Your Vision',
    description:
      'We begin with an in-depth consultation to understand your lifestyle, aesthetic preferences, and spatial goals. Every detail matters — from morning rituals to entertaining habits.',
    image: '/renders/Blue Spiral Hotel Ground full render.png',
  },
  {
    number: '02',
    title: 'Concept',
    subtitle: 'Design Proposals',
    description:
      'Our designers craft multiple bespoke concepts tailored specifically to your space. You receive mood boards, material palettes, and layout options — each a distinct design narrative.',
    image: '/renders/Blue Spiral Hotel Render.jpg',
  },
  {
    number: '03',
    title: 'Visualise',
    subtitle: '3D & BIM Rendering',
    description:
      'Walk through photorealistic 3D renders and BIM models of your space before a single nail is hammered. Experience your new home virtually — lighting, materials, and all.',
    image: '/renders/Luxurious presidential suite Infinity feel 1.png',
  },
  {
    number: '04',
    title: 'Deliver',
    subtitle: 'Flawless Execution',
    description:
      'Our trusted network of craftsmen and project managers bring the vision to life with surgical precision. We handle procurement, installation, and final styling — you simply arrive.',
    image: '/renders/Blue Spiral Hotel Entrance Final.png',
  },
];

export function ProcessSection() {
  const [active, setActive]     = useState(0);
  const [revealed, setRevealed] = useState(false);
  const sectionRef              = useRef<HTMLElement>(null);
  const intervalRef             = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setRevealed(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActive(a => (a + 1) % STEPS.length);
    }, 4000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const pick = (i: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setActive(i);
  };

  const step = STEPS[active];

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative w-full py-32 md:py-40 overflow-hidden"
      style={{ background: '#FAF9F6' }}
    >
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(176,132,34,0.08) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="max-w-[1400px] mx-auto px-8 md:px-16 relative">

        {/* Section header */}
        <div
          className="mb-20"
          style={{
            opacity:    revealed ? 1 : 0,
            transform:  revealed ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.9s ease, transform 0.9s ease',
          }}
        >
          <div className="flex items-center gap-4 mb-5">
            <div className="gold-line" />
            <span
              className="text-[9px] tracking-[0.55em] uppercase font-body"
              style={{ color: 'var(--gold)' }}
            >
              How We Work
            </span>
          </div>
          <h2
            className="font-display font-light"
            style={{
              fontSize:      'clamp(2.4rem, 5vw, 5rem)',
              color:         '#1A1614',
              letterSpacing: '-0.02em',
              lineHeight:    0.95,
            }}
          >
            Our Design
            <br />
            <em style={{ color: 'var(--gold-light)', fontStyle: 'italic' }}>Process</em>
          </h2>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left: image */}
          <div
            className="relative overflow-hidden"
            style={{
              aspectRatio: '4/3',
              opacity:    revealed ? 1 : 0,
              transform:  revealed ? 'translateX(0)' : 'translateX(-30px)',
              transition: 'opacity 0.9s ease 0.15s, transform 0.9s ease 0.15s',
            }}
          >
            {STEPS.map((s, i) => (
              <img
                key={s.number}
                src={s.image}
                alt={s.title}
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  opacity:    i === active ? 1 : 0,
                  transition: 'opacity 0.8s ease',
                  transform:  i === active ? 'scale(1.02)' : 'scale(1)',
                }}
              />
            ))}

            {/* Step badge */}
            <div
              className="absolute top-6 left-6 flex items-center gap-3 px-5 py-3"
              style={{
                background:     'rgba(8,8,8,0.78)',
                border:         '1px solid rgba(201,168,76,0.3)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <span
                className="font-display text-3xl font-light"
                style={{ color: '#C9A84C', lineHeight: 1 }}
              >
                {step.number}
              </span>
              <div style={{ width: 1, height: 20, background: 'rgba(201,168,76,0.3)' }} />
              <span
                className="text-[8px] tracking-[0.45em] uppercase font-body"
                style={{ color: 'rgba(248,244,238,0.75)' }}
              >
                {step.subtitle}
              </span>
            </div>

            {/* Gold corner accent */}
            <div className="absolute bottom-0 right-0 w-16 h-16" style={{ borderTop: '2px solid #C9A84C', borderLeft: '2px solid #C9A84C', opacity: 0.4 }} />
          </div>

          {/* Right: step accordion */}
          <div
            className="flex flex-col gap-1"
            style={{
              opacity:    revealed ? 1 : 0,
              transform:  revealed ? 'translateX(0)' : 'translateX(30px)',
              transition: 'opacity 0.9s ease 0.3s, transform 0.9s ease 0.3s',
            }}
          >
            {STEPS.map((s, i) => {
              const isActive = i === active;
              return (
                <button
                  key={s.number}
                  onClick={() => pick(i)}
                  className="relative text-left transition-all duration-400 overflow-hidden"
                  style={{
                    padding:    isActive ? '20px 24px' : '16px 24px',
                    background: isActive ? 'rgba(176,132,34,0.06)' : 'transparent',
                    border:     isActive ? '1px solid rgba(176,132,34,0.2)' : '1px solid transparent',
                    borderLeft: isActive ? '3px solid #B08422' : '3px solid transparent',
                  }}
                >
                  {/* Progress bar */}
                  {isActive && (
                    <div
                      className="absolute bottom-0 left-0 h-[2px]"
                      style={{ background: '#B08422', animation: 'progress-step 4s linear forwards' }}
                    />
                  )}

                  <div className="flex items-start gap-5">
                    <span
                      className="font-display font-light flex-shrink-0 mt-0.5"
                      style={{
                        fontSize:   'clamp(1.5rem, 2.5vw, 2.1rem)',
                        color:      isActive ? '#B08422' : '#CCC4B8',
                        lineHeight: 1,
                        transition: 'color 0.3s ease',
                      }}
                    >
                      {s.number}
                    </span>

                    <div className="flex-1">
                      <h3
                        className="font-display font-medium mb-0.5"
                        style={{
                          fontSize:   'clamp(1.1rem, 1.8vw, 1.5rem)',
                          color:      isActive ? '#1A1614' : '#6B5F55',
                          lineHeight: 1.1,
                          transition: 'color 0.3s ease',
                        }}
                      >
                        {s.title}
                      </h3>

                      <div
                        className="overflow-hidden transition-all duration-500"
                        style={{ maxHeight: isActive ? '120px' : '0' }}
                      >
                        <p
                          className="font-body font-light text-sm leading-relaxed mt-2"
                          style={{ color: '#7A6E60', lineHeight: 1.85 }}
                        >
                          {s.description}
                        </p>
                      </div>
                    </div>

                    <span
                      className="flex-shrink-0 transition-all duration-300 mt-1"
                      style={{
                        color:     '#B08422',
                        opacity:   isActive ? 1 : 0,
                        transform: isActive ? 'translateX(0)' : 'translateX(-8px)',
                        fontSize:  17,
                      }}
                    >
                      →
                    </span>
                  </div>
                </button>
              );
            })}

            <div className="mt-6 pl-6">
              <a
                href="#footer"
                className="inline-flex items-center gap-3 text-[9px] tracking-[0.4em] uppercase font-body font-medium transition-all duration-300"
                style={{ color: '#B08422' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.gap = '20px'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.gap = '12px'; }}
              >
                Start Your Project
                <span className="block h-px" style={{ width: 40, background: '#B08422' }} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
