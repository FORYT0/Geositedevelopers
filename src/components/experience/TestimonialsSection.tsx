'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

const TESTIMONIALS = [
  {
    quote:
      'Geosite DEVELOPERS transformed our family home into something out of a magazine. Every detail was considered. The BIM walkthrough before construction started gave us total confidence.',
    name: 'Amara Okonkwo',
    role: 'CEO, Horizon Capital',
    project: 'Runda Villa — Full Interior',
    initials: 'AO',
    accent: '#C9A84C',
  },
  {
    quote:
      'Working with the Geosite team was effortless. They understood our brief immediately and delivered a 3D render so detailed we felt like we were already living there.',
    name: 'James & Wanjiru Njoroge',
    role: 'Entrepreneurs',
    project: 'Karen Residence — Living & Master',
    initials: 'JW',
    accent: '#8B7355',
  },
  {
    quote:
      'The before/after is genuinely shocking. Our kitchen went from dated to something I\'m proud to show off. Delivered on time, on budget, and beyond expectation.',
    name: 'Chef Michael Kariuki',
    role: 'Executive Chef',
    project: 'Westlands Penthouse — Kitchen',
    initials: 'MK',
    accent: '#7A8B6A',
  },
  {
    quote:
      'The attention to Kenyan heritage materials mixed with contemporary design is what sets Geosite apart. Our office now tells our brand story before anyone says a word.',
    name: 'Fatuma Hassan',
    role: 'Co-founder, Nairobi Design Week',
    project: 'CBD Office — Commercial Interior',
    initials: 'FH',
    accent: '#8B6A7A',
  },
];

const BG_IMAGE = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80';

export function TestimonialsSection() {
  const [active, setActive]     = useState(0);
  const [fading, setFading]     = useState(false);
  const [revealed, setRevealed] = useState(false);
  const sectionRef              = useRef<HTMLElement>(null);
  const intervalRef             = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setRevealed(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const goTo = useCallback((i: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setFading(true);
    setTimeout(() => { setActive(i); setFading(false); }, 350);
  }, []);

  // Auto-advance
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setActive(a => (a + 1) % TESTIMONIALS.length);
        setFading(false);
      }, 350);
    }, 5500);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const t = TESTIMONIALS[active];

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ minHeight: '80vh' }}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={BG_IMAGE}
          alt="Interior background"
          className="w-full h-full object-cover object-center"
          draggable={false}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(13,13,13,0.92) 0%, rgba(13,13,13,0.75) 50%, rgba(13,13,13,0.88) 100%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-8 md:px-16 py-32 md:py-40">

        {/* Header */}
        <div
          className="mb-16"
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.9s ease, transform 0.9s ease',
          }}
        >
          <div className="flex items-center gap-4 mb-5">
            <div className="gold-line" />
            <span className="text-[9px] tracking-[0.55em] uppercase font-body" style={{ color: 'var(--gold)' }}>
              Client Stories
            </span>
          </div>
          <h2
            className="font-display font-light"
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 5rem)',
              color: '#F8F4EE',
              letterSpacing: '-0.02em',
              lineHeight: 0.95,
            }}
          >
            Happy Clients.
            <br />
            <em style={{ color: 'var(--gold-light)', fontStyle: 'italic' }}>Beautiful Spaces.</em>
          </h2>
        </div>

        <div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12"
          style={{
            opacity: revealed ? 1 : 0,
            transition: 'opacity 0.9s ease 0.2s',
          }}
        >
          {/* Quote card */}
          <div className="lg:col-span-2">
            <div
              className="relative rounded-2xl p-10 md:p-14 h-full"
              style={{
                background: 'rgba(13,13,13,0.6)',
                border: `1px solid ${t.accent}40`,
                backdropFilter: 'blur(24px)',
                opacity: fading ? 0 : 1,
                transform: fading ? 'translateY(8px)' : 'translateY(0)',
                transition: 'opacity 0.35s ease, transform 0.35s ease, border-color 0.5s ease',
              }}
            >
              {/* Quote mark */}
              <div
                className="font-display mb-6"
                style={{ fontSize: '5rem', color: t.accent, opacity: 0.3, lineHeight: 1 }}
              >
                "
              </div>

              <blockquote
                className="font-display font-light mb-10"
                style={{
                  fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
                  color: 'rgba(248,244,238,0.85)',
                  lineHeight: 1.65,
                  letterSpacing: '0.01em',
                }}
              >
                {t.quote}
              </blockquote>

              <div className="flex items-center gap-5">
                {/* Avatar */}
                <div
                  className="flex items-center justify-center w-14 h-14 rounded-full font-display text-xl font-medium flex-shrink-0"
                  style={{ background: t.accent, color: '#0D0D0D' }}
                >
                  {t.initials}
                </div>
                <div>
                  <p
                    className="font-display font-medium"
                    style={{ fontSize: '1.1rem', color: '#F8F4EE' }}
                  >
                    {t.name}
                  </p>
                  <p
                    className="text-[9px] tracking-[0.3em] uppercase font-body mt-0.5"
                    style={{ color: t.accent }}
                  >
                    {t.role}
                  </p>
                  <p
                    className="text-[8px] tracking-[0.25em] uppercase font-body mt-1"
                    style={{ color: 'rgba(248,244,238,0.35)' }}
                  >
                    {t.project}
                  </p>
                </div>
              </div>

              {/* Stars */}
              <div className="absolute top-8 right-8 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} style={{ color: t.accent, fontSize: 14 }}>★</span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: all testimonial previews */}
          <div className="flex flex-col gap-3 justify-center">
            {TESTIMONIALS.map((testimonial, i) => {
              const isActive = i === active;
              return (
                <button
                  key={testimonial.name}
                  onClick={() => goTo(i)}
                  className="relative text-left p-5 rounded-xl transition-all duration-400"
                  style={{
                    background: isActive ? 'rgba(201,168,76,0.1)' : 'rgba(13,13,13,0.4)',
                    border: isActive ? `1px solid ${testimonial.accent}50` : '1px solid rgba(201,168,76,0.08)',
                    backdropFilter: 'blur(12px)',
                    transform: isActive ? 'translateX(6px)' : 'translateX(0)',
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-display font-medium flex-shrink-0"
                      style={{ background: testimonial.accent, color: '#0D0D0D' }}
                    >
                      {testimonial.initials}
                    </div>
                    <div>
                      <p
                        className="text-[10px] font-body font-medium"
                        style={{ color: isActive ? '#F8F4EE' : 'rgba(248,244,238,0.5)' }}
                      >
                        {testimonial.name}
                      </p>
                      <p
                        className="text-[8px] tracking-[0.2em] uppercase font-body"
                        style={{ color: isActive ? testimonial.accent : 'rgba(201,168,76,0.3)' }}
                      >
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p
                    className="text-[9px] font-body font-light line-clamp-2"
                    style={{
                      color: isActive ? 'rgba(248,244,238,0.6)' : 'rgba(248,244,238,0.25)',
                      lineHeight: 1.6,
                    }}
                  >
                    {testimonial.quote.slice(0, 80)}…
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex items-center gap-3 mt-10">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === active ? 28 : 8,
                height: 8,
                background: i === active ? 'var(--gold)' : 'rgba(201,168,76,0.25)',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
              }}
              aria-label={`Review ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
