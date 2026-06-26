'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

const TESTIMONIALS = [
  {
    quote:   'Geosite DEVELOPERS transformed our family home into something out of a magazine. Every detail was considered. The BIM walkthrough before construction started gave us total confidence.',
    name:    'Amara Okonkwo',
    role:    'CEO, Horizon Capital',
    project: 'Runda Villa — Full Interior',
    initials:'AO',
  },
  {
    quote:   'Working with the Geosite team was effortless. They understood our brief immediately and delivered a 3D render so detailed we felt like we were already living there.',
    name:    'James & Wanjiru Njoroge',
    role:    'Entrepreneurs',
    project: 'Karen Residence — Living & Master',
    initials:'JW',
  },
  {
    quote:   "The before/after is genuinely shocking. Our kitchen went from dated to something I'm proud to show off. Delivered on time, on budget, and beyond expectation.",
    name:    'Chef Michael Kariuki',
    role:    'Executive Chef',
    project: 'Westlands Penthouse — Kitchen',
    initials:'MK',
  },
  {
    quote:   'The attention to Kenyan heritage materials mixed with contemporary design is what sets Geosite apart. Our office now tells our brand story before anyone says a word.',
    name:    'Fatuma Hassan',
    role:    'Co-founder, Nairobi Design Week',
    project: 'CBD Office — Commercial Interior',
    initials:'FH',
  },
];

const BG_IMAGE = '/renders/Blue Spiral Hotel Entrance Final.png';

export function TestimonialsSection() {
  const [active,   setActive]   = useState(0);
  const [fading,   setFading]   = useState(false);
  const [revealed, setRevealed] = useState(false);
  const sectionRef              = useRef<HTMLElement>(null);
  const timerRef                = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setRevealed(true); },
      { threshold: 0.08 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setActive(a => (a + 1) % TESTIMONIALS.length);
        setFading(false);
      }, 380);
    }, 6500);
  }, []);

  const goTo = useCallback((i: number) => {
    setFading(true);
    setTimeout(() => { setActive(i); setFading(false); }, 380);
    startTimer();
  }, [startTimer]);

  useEffect(() => { startTimer(); return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, [startTimer]);

  const t = TESTIMONIALS[active];

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      style={{ position: 'relative', width: '100%', overflow: 'hidden', minHeight: '80vh' }}
    >
      {/* Background */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <img
          src={BG_IMAGE}
          alt="Interior background"
          draggable={false}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,9,8,0.9) 0%, rgba(10,9,8,0.76) 50%, rgba(10,9,8,0.93) 100%)' }} />
      </div>

      <div
        style={{
          position:      'relative',
          zIndex:        10,
          maxWidth:      860,
          margin:        '0 auto',
          padding:       'clamp(80px, 10vw, 140px) clamp(24px, 5vw, 48px)',
          display:       'flex',
          flexDirection: 'column',
          alignItems:    'center',
          textAlign:     'center',
          opacity:       revealed ? 1 : 0,
          transform:     revealed ? 'translateY(0)' : 'translateY(24px)',
          transition:    'opacity 0.9s ease, transform 0.9s ease',
        }}
      >
        {/* Eyebrow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 44 }}>
          <div style={{ width: 48, height: 1, background: 'linear-gradient(90deg, transparent, #C9A84C)' }} />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.5rem', letterSpacing: '0.55em', textTransform: 'uppercase', color: '#C9A84C' }}>
            Client Stories
          </span>
          <div style={{ width: 48, height: 1, background: 'linear-gradient(90deg, #C9A84C, transparent)' }} />
        </div>

        {/* Heading */}
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(2rem, 4.5vw, 4.5rem)', color: '#F8F4EE', letterSpacing: '-0.025em', lineHeight: 0.93, marginBottom: 56 }}>
          Happy Clients.
          <br />
          <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>Beautiful Spaces.</em>
        </h2>

        {/* Quote block */}
        <div
          style={{
            width:      '100%',
            opacity:    fading ? 0 : 1,
            transform:  fading ? 'translateY(8px)' : 'translateY(0)',
            transition: 'opacity 0.38s ease, transform 0.38s ease',
            marginBottom: 44,
          }}
        >
          {/* Opening quote */}
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(4rem, 9vw, 8rem)', color: '#C9A84C', opacity: 0.12, lineHeight: 0.65, marginBottom: 12, userSelect: 'none' }}>
            "
          </div>

          <blockquote style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(1.05rem, 2vw, 1.45rem)', color: 'rgba(248,244,238,0.88)', lineHeight: 1.7, letterSpacing: '0.01em', marginBottom: 36 }}>
            {t.quote}
          </blockquote>

          {/* Stars */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 28 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} width="13" height="13" viewBox="0 0 13 13" fill="#C9A84C">
                <path d="M6.5 1 L8.1 4.7 H12.2 L9 7.1 L10.2 11 L6.5 8.7 L2.8 11 L4 7.1 L0.8 4.7 H4.9 Z"/>
              </svg>
            ))}
          </div>

          {/* Client info */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(201,168,76,0.18)', border: '1px solid rgba(201,168,76,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 500, color: '#C9A84C', flexShrink: 0 }}>
              {t.initials}
            </div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '0.95rem', color: '#F8F4EE', lineHeight: 1.2, marginBottom: 3 }}>
                {t.name}
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.46rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: '#C9A84C' }}>
                {t.role}
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.42rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(248,244,238,0.28)', marginTop: 3 }}>
                {t.project}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          {/* Prev */}
          <button
            onClick={() => goTo((active - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
            aria-label="Previous"
            style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(201,168,76,0.3)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.12)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.7)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.3)'; }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 3 L5 7 L9 11" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Dots */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Review ${i + 1}`}
                style={{ width: i === active ? 24 : 7, height: 7, borderRadius: 4, background: i === active ? '#C9A84C' : 'rgba(201,168,76,0.22)', border: 'none', padding: 0, cursor: 'pointer', transition: 'width 0.35s ease, background 0.35s ease' }}
              />
            ))}
          </div>

          {/* Next */}
          <button
            onClick={() => goTo((active + 1) % TESTIMONIALS.length)}
            aria-label="Next"
            style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(201,168,76,0.3)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.12)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.7)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.3)'; }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 3 L9 7 L5 11" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
