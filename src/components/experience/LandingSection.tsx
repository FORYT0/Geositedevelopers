'use client';
import { useEffect, useRef, useState } from 'react';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=85',
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1920&q=85',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&q=85',
];

const STATS = [
  { value: '120+', label: 'Projects Delivered' },
  { value: '8yrs', label: 'Design Excellence' },
  { value: '98%', label: 'Client Satisfaction' },
];

export function LandingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollY, setScrollY]       = useState(0);
  const [imgIndex, setImgIndex]     = useState(0);
  const [imgFading, setImgFading]   = useState(false);
  const [mounted, setMounted]       = useState(false);

  // Mount animation
  useEffect(() => { setMounted(true); }, []);

  // Scroll parallax
  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / (rect.height * 0.6)));
      setScrollY(progress);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Hero image rotator
  useEffect(() => {
    const id = setInterval(() => {
      setImgFading(true);
      setTimeout(() => {
        setImgIndex(i => (i + 1) % HERO_IMAGES.length);
        setImgFading(false);
      }, 800);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const scale = 1 + scrollY * 0.16;
  const translateY = scrollY * -5;
  const overlayOpacity = 0.3 + scrollY * 0.6;
  const heroOpacity = Math.max(0, 1 - scrollY * 2.2);

  return (
    <section
      id="landing"
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ height: '200vh' }}
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden">

        {/* Background image — rotate + zoom + parallax */}
        <div
          className="absolute inset-0 zoom-image"
          style={{
            transform: `scale(${scale}) translateY(${translateY}%)`,
            transition: 'transform 0.06s linear',
          }}
        >
          {HERO_IMAGES.map((src, i) => (
            <img
              key={src}
              src={src}
              alt="Geosite DEVELOPERS — Luxury Interior Design"
              className="absolute inset-0 w-full h-full object-cover object-center"
              draggable={false}
              style={{
                opacity: i === imgIndex ? (imgFading ? 0 : 1) : 0,
                transition: 'opacity 0.8s ease',
              }}
            />
          ))}
        </div>

        {/* Dark gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              160deg,
              rgba(13,13,13,${overlayOpacity * 0.5}) 0%,
              rgba(13,13,13,${overlayOpacity * 0.3}) 40%,
              rgba(13,13,13,${overlayOpacity}) 100%
            )`,
          }}
        />

        {/* Top vignette */}
        <div
          className="absolute inset-x-0 top-0 h-48 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(13,13,13,0.65), transparent)' }}
        />

        {/* Bottom vignette */}
        <div
          className="absolute inset-x-0 bottom-0 h-64 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(13,13,13,0.9), transparent)' }}
        />

        {/* ── Hero content ─────────────────────────────────────────── */}
        <div
          className="absolute inset-0 flex flex-col justify-center items-center px-8 md:px-24 lg:px-40"
          style={{ opacity: heroOpacity }}
        >

          {/* Eyebrow */}
          <div
            className="flex items-center gap-4 mb-8"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 1s ease 0.1s, transform 1s ease 0.1s',
            }}
          >
            <div className="gold-line" />
            <span
              className="text-[10px] tracking-[0.5em] uppercase font-body font-medium"
              style={{ color: 'var(--gold)' }}
            >
              Interior Design Studio · Nairobi 2026
            </span>
            <div className="gold-line" />
          </div>

          {/* Headline */}
          <h1
            className="font-display font-light text-center mb-6"
            style={{
              fontSize: 'clamp(3.8rem, 9.5vw, 10rem)',
              color: '#F8F4EE',
              letterSpacing: '-0.025em',
              lineHeight: 0.92,
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 1s ease 0.25s, transform 1s ease 0.25s',
            }}
          >
            Spaces That
            <br />
            <em
              style={{ color: 'var(--gold-light)', fontStyle: 'italic' }}
            >
              Tell Stories
            </em>
          </h1>

          {/* Sub-headline */}
          <p
            className="font-body font-light text-center max-w-xl mb-12"
            style={{
              fontSize: 'clamp(0.9rem, 1.4vw, 1.1rem)',
              color: 'rgba(248,244,238,0.65)',
              letterSpacing: '0.1em',
              lineHeight: 2,
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 1s ease 0.4s, transform 1s ease 0.4s',
            }}
          >
            Curating extraordinary living through iconic design,
            sustainable innovation, and timeless elegance.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row items-center gap-4"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 1s ease 0.55s, transform 1s ease 0.55s',
            }}
          >
            <a
              href="#portfolio"
              className="px-10 py-4 text-[10px] tracking-[0.4em] uppercase font-body font-medium transition-all duration-400"
              style={{
                background: 'var(--gold)',
                color: '#0D0D0D',
                letterSpacing: '0.35em',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'var(--gold-light)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'var(--gold)';
              }}
            >
              View Portfolio
            </a>
            <a
              href="#process"
              className="px-10 py-4 text-[10px] tracking-[0.4em] uppercase font-body font-medium transition-all duration-300"
              style={{
                border: '1px solid rgba(248,244,238,0.4)',
                color: 'rgba(248,244,238,0.85)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)';
                (e.currentTarget as HTMLElement).style.color = 'var(--gold)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(248,244,238,0.4)';
                (e.currentTarget as HTMLElement).style.color = 'rgba(248,244,238,0.85)';
              }}
            >
              Our Process
            </a>
          </div>
        </div>

        {/* ── Stats strip ─────────────────────────────────────────── */}
        <div
          className="absolute bottom-12 left-0 right-0 flex items-center justify-center gap-12 md:gap-24 px-8"
          style={{
            opacity: mounted ? (heroOpacity > 0.5 ? 1 : heroOpacity * 2) : 0,
            transition: 'opacity 1s ease 0.9s',
          }}
        >
          {STATS.map((stat, i) => (
            <div key={stat.label} className="flex flex-col items-center gap-1.5">
              <span
                className="font-display font-light"
                style={{
                  fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                  color: 'var(--gold-light)',
                  lineHeight: 1,
                  letterSpacing: '-0.01em',
                }}
              >
                {stat.value}
              </span>
              <span
                className="text-[8px] tracking-[0.45em] uppercase font-body"
                style={{ color: 'rgba(248,244,238,0.45)' }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* ── Image indicator dots ─────────────────────────────────── */}
        <div
          className="absolute right-8 md:right-12 top-1/2 -translate-y-1/2 flex flex-col gap-3"
          style={{ opacity: heroOpacity }}
        >
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => { setImgFading(true); setTimeout(() => { setImgIndex(i); setImgFading(false); }, 400); }}
              className="transition-all duration-300"
              style={{
                width: i === imgIndex ? 2 : 2,
                height: i === imgIndex ? 28 : 14,
                background: i === imgIndex ? 'var(--gold)' : 'rgba(201,168,76,0.3)',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                borderRadius: 1,
              }}
              aria-label={`Image ${i + 1}`}
            />
          ))}
        </div>

        {/* Scroll progress bar */}
        <div
          className="absolute bottom-0 left-0 h-[2px] transition-all duration-100"
          style={{
            width: `${scrollY * 100}%`,
            background: 'linear-gradient(90deg, var(--gold), var(--gold-light))',
          }}
        />
      </div>
    </section>
  );
}
