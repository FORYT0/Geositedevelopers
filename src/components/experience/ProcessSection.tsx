'use client';
import { useEffect, useRef, useState } from 'react';

const STEPS = [
  {
    number: '01',
    title: 'Discovery',
    subtitle: 'Understanding Your Vision',
    description:
      'We begin with an in-depth consultation to understand your lifestyle, aesthetic preferences, and spatial goals. Every detail matters — from morning rituals to entertaining habits.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&q=80',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M14 4v3M14 21v3M4 14h3M21 14h3M6.5 6.5l2 2M19.5 19.5l2 2M6.5 21.5l2-2M19.5 8.5l2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Concept',
    subtitle: 'Design Proposals',
    description:
      'Our designers craft multiple bespoke concepts tailored specifically to your space. You receive mood boards, material palettes, and layout options — each a distinct design narrative.',
    image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=900&q=80',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="4" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M4 10h20M10 10v14" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Visualise',
    subtitle: '3D & BIM Rendering',
    description:
      'Walk through photorealistic 3D renders and BIM models of your space before a single nail is hammered. Experience your new home virtually — lighting, materials, and all.',
    image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=900&q=80',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 4L24 9.5V18.5L14 24L4 18.5V9.5L14 4Z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M14 4v20M4 9.5l10 5 10-5" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Deliver',
    subtitle: 'Flawless Execution',
    description:
      'Our trusted network of craftsmen and project managers bring the vision to life with surgical precision. We handle procurement, installation, and final styling — you simply arrive.',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=900&q=80',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M6 14l5 5 11-11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export function ProcessSection() {
  const [active, setActive]         = useState(0);
  const [revealed, setRevealed]     = useState(false);
  const sectionRef                  = useRef<HTMLElement>(null);
  const intervalRef                 = useRef<ReturnType<typeof setInterval> | null>(null);

  // Scroll reveal
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setRevealed(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  // Auto-advance
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
      style={{ background: 'var(--charcoal-mid)' }}
    >
      {/* Subtle background grid */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(var(--gold) 1px, transparent 1px),
                            linear-gradient(90deg, var(--gold) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      <div className="max-w-[1400px] mx-auto px-8 md:px-16">

        {/* Section header */}
        <div
          className="mb-20"
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'translateY(0)' : 'translateY(30px)',
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
              fontSize: 'clamp(2.2rem, 5vw, 5rem)',
              color: 'var(--warm-white)',
              letterSpacing: '-0.02em',
              lineHeight: 0.95,
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
            className="relative rounded-2xl overflow-hidden"
            style={{
              aspectRatio: '4/3',
              opacity: revealed ? 1 : 0,
              transform: revealed ? 'translateX(0)' : 'translateX(-30px)',
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
                  opacity: i === active ? 1 : 0,
                  transition: 'opacity 0.7s ease',
                  transform: i === active ? 'scale(1.02)' : 'scale(1)',
                }}
              />
            ))}
            {/* Overlay */}
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(135deg, rgba(13,13,13,0.35) 0%, transparent 60%)' }}
            />
            {/* Step badge */}
            <div
              className="absolute top-6 left-6 flex items-center gap-3 px-5 py-3 rounded-full"
              style={{
                background: 'rgba(13,13,13,0.75)',
                border: '1px solid rgba(201,168,76,0.3)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <span
                className="font-display text-3xl font-light"
                style={{ color: 'var(--gold)', lineHeight: 1 }}
              >
                {step.number}
              </span>
              <div
                className="w-px h-5"
                style={{ background: 'rgba(201,168,76,0.3)' }}
              />
              <span
                className="text-[9px] tracking-[0.45em] uppercase font-body"
                style={{ color: 'rgba(248,244,238,0.7)' }}
              >
                {step.subtitle}
              </span>
            </div>
          </div>

          {/* Right: steps */}
          <div
            className="flex flex-col gap-2"
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed ? 'translateX(0)' : 'translateX(30px)',
              transition: 'opacity 0.9s ease 0.3s, transform 0.9s ease 0.3s',
            }}
          >
            {STEPS.map((s, i) => {
              const isActive = i === active;
              return (
                <button
                  key={s.number}
                  onClick={() => pick(i)}
                  className="relative text-left group transition-all duration-500 rounded-xl overflow-hidden"
                  style={{
                    padding: isActive ? '20px 24px' : '16px 24px',
                    background: isActive ? 'rgba(201,168,76,0.08)' : 'transparent',
                    border: isActive ? '1px solid rgba(201,168,76,0.25)' : '1px solid transparent',
                  }}
                >
                  {/* Progress bar (active) */}
                  {isActive && (
                    <div
                      className="absolute bottom-0 left-0 h-[2px]"
                      style={{
                        background: 'var(--gold)',
                        animation: 'progress-step 4s linear forwards',
                      }}
                    />
                  )}

                  <div className="flex items-start gap-5">
                    {/* Number + icon */}
                    <div className="flex flex-col items-center gap-2 flex-shrink-0">
                      <span
                        className="font-display font-light"
                        style={{
                          fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
                          color: isActive ? 'var(--gold)' : 'var(--text-muted)',
                          lineHeight: 1,
                          transition: 'color 0.3s ease',
                        }}
                      >
                        {s.number}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3
                          className="font-display font-medium"
                          style={{
                            fontSize: 'clamp(1.2rem, 2vw, 1.6rem)',
                            color: isActive ? 'var(--warm-white)' : 'var(--text-muted)',
                            lineHeight: 1.1,
                            transition: 'color 0.3s ease',
                          }}
                        >
                          {s.title}
                        </h3>
                      </div>
                      <div
                        className="overflow-hidden transition-all duration-500"
                        style={{ maxHeight: isActive ? '120px' : '0' }}
                      >
                        <p
                          className="font-body font-light text-sm leading-relaxed mt-2"
                          style={{ color: 'rgba(248,244,238,0.6)', lineHeight: 1.8 }}
                        >
                          {s.description}
                        </p>
                      </div>
                    </div>

                    {/* Arrow */}
                    <span
                      className="flex-shrink-0 transition-all duration-300"
                      style={{
                        color: 'var(--gold)',
                        opacity: isActive ? 1 : 0,
                        transform: isActive ? 'translateX(0)' : 'translateX(-8px)',
                        fontSize: 18,
                        marginTop: 4,
                      }}
                    >
                      →
                    </span>
                  </div>
                </button>
              );
            })}

            {/* CTA */}
            <div className="mt-6">
              <a
                href="#footer"
                className="inline-flex items-center gap-3 text-[9px] tracking-[0.4em] uppercase font-body font-medium transition-all duration-300"
                style={{ color: 'var(--gold)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.gap = '20px'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.gap = '12px'; }}
              >
                Start Your Project
                <span
                  className="block h-px"
                  style={{ width: 40, background: 'var(--gold)' }}
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes progress-step {
          from { width: 0; }
          to   { width: 100%; }
        }
      `}</style>
    </section>
  );
}
