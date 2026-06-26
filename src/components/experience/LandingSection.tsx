'use client';
import { useEffect, useState } from 'react';

const HERO_IMAGES = [
  '/renders/Geosite page 1 Backdrop.jpg',
  '/renders/Luxurious presidential suite Infinity feel 1.png',
  '/renders/Blue Spiral Hotel Ground full render.png',
];

const STATS = [
  { value: '120+', label: 'Projects Delivered' },
  { value: '8+',   label: 'Years of Excellence' },
  { value: '98%',  label: 'Client Satisfaction' },
];

export function LandingSection() {
  const [imgIndex, setImgIndex] = useState(0);
  const [mounted,  setMounted]  = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Cross-fade image rotator
  useEffect(() => {
    const id = setInterval(() => {
      setImgIndex(i => (i + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="landing"
      className="relative w-full overflow-hidden"
      style={{ height: '100vh', minHeight: 640 }}
    >
      {/* ── Background images ──────────────────────────────────────── */}
      {HERO_IMAGES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt="Geosite DEVELOPERS Interior Design"
          className="absolute inset-0 w-full h-full object-cover object-center"
          draggable={false}
          style={{
            opacity: i === imgIndex ? 1 : 0,
            transition: 'opacity 1.6s ease',
          }}
        />
      ))}

      {/* ── Dark overlay ───────────────────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(8,8,8,0.5) 0%, rgba(8,8,8,0.25) 40%, rgba(8,8,8,0.72) 100%)',
        }}
      />

      {/* ── Hero content ───────────────────────────────────────────── */}
      <div className="absolute inset-0 flex flex-col justify-center items-center px-6 text-center">

        {/* Eyebrow */}
        <div
          className="flex items-center gap-4 mb-8"
          style={{
            opacity:    mounted ? 1 : 0,
            transform:  mounted ? 'translateY(0)' : 'translateY(18px)',
            transition: 'opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s',
          }}
        >
          <div className="gold-line" />
          <span
            className="text-[9px] tracking-[0.55em] uppercase font-body"
            style={{ color: '#C9A84C' }}
          >
            Interior Design Studio · Nairobi, Kenya
          </span>
          <div className="gold-line" />
        </div>

        {/* Headline */}
        <h1
          className="font-display font-light mb-6"
          style={{
            fontSize:   'clamp(3.5rem, 8.5vw, 9rem)',
            color:      '#F8F4EE',
            letterSpacing: '-0.025em',
            lineHeight: 0.93,
            opacity:    mounted ? 1 : 0,
            transform:  mounted ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 1s ease 0.38s, transform 1s ease 0.38s',
          }}
        >
          Spaces That
          <br />
          <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>Tell Stories</em>
        </h1>

        {/* Subtitle */}
        <p
          className="font-body font-light max-w-xl mb-12"
          style={{
            fontSize:      'clamp(0.82rem, 1.25vw, 0.98rem)',
            color:         'rgba(248,244,238,0.68)',
            letterSpacing: '0.08em',
            lineHeight:    2,
            opacity:       mounted ? 1 : 0,
            transform:     mounted ? 'translateY(0)' : 'translateY(20px)',
            transition:    'opacity 1s ease 0.56s, transform 1s ease 0.56s',
          }}
        >
          Crafting extraordinary interiors through bespoke design,
          <br className="hidden sm:block" />
          BIM technology, and timeless elegance.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center gap-4"
          style={{
            opacity:    mounted ? 1 : 0,
            transform:  mounted ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 1s ease 0.72s, transform 1s ease 0.72s',
          }}
        >
          <a
            href="#portfolio"
            className="px-10 py-3.5 text-[9px] tracking-[0.4em] uppercase font-body font-medium"
            style={{ background: '#C9A84C', color: '#0D0D0D' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#E8C97A')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#C9A84C')}
          >
            View Portfolio
          </a>
          <a
            href="#process"
            className="px-10 py-3.5 text-[9px] tracking-[0.4em] uppercase font-body font-medium transition-all duration-300"
            style={{ border: '1px solid rgba(248,244,238,0.4)', color: 'rgba(248,244,238,0.85)' }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = '#C9A84C';
              el.style.color       = '#C9A84C';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = 'rgba(248,244,238,0.4)';
              el.style.color       = 'rgba(248,244,238,0.85)';
            }}
          >
            Our Process
          </a>
        </div>
      </div>

      {/* ── Stats strip ────────────────────────────────────────────── */}
      <div
        className="absolute bottom-10 left-0 right-0 flex items-end justify-center gap-0 px-8"
        style={{
          opacity:    mounted ? 1 : 0,
          transition: 'opacity 1s ease 1.1s',
        }}
      >
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className="flex flex-col items-center gap-1.5 px-8 md:px-14"
            style={{
              borderLeft: i > 0 ? '1px solid rgba(201,168,76,0.25)' : 'none',
            }}
          >
            <span
              className="font-display font-light"
              style={{
                fontSize:      'clamp(1.7rem, 3vw, 2.6rem)',
                color:         '#C9A84C',
                lineHeight:    1,
                letterSpacing: '-0.01em',
              }}
            >
              {stat.value}
            </span>
            <span
              className="text-[7px] tracking-[0.48em] uppercase font-body"
              style={{ color: 'rgba(248,244,238,0.5)' }}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* ── Image indicator dots ────────────────────────────────────── */}
      <div
        className="absolute right-8 md:right-12 top-1/2 -translate-y-1/2 flex flex-col gap-2.5"
        style={{ opacity: mounted ? 1 : 0, transition: 'opacity 1s ease 1.2s' }}
      >
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setImgIndex(i)}
            className="transition-all duration-400"
            style={{
              width:        2,
              height:       i === imgIndex ? 32 : 12,
              background:   i === imgIndex ? '#C9A84C' : 'rgba(201,168,76,0.35)',
              border:       'none',
              padding:      0,
              cursor:       'pointer',
              borderRadius: 1,
            }}
            aria-label={`Image ${i + 1}`}
          />
        ))}
      </div>

      {/* ── Scroll cue ─────────────────────────────────────────────── */}
      <div
        className="absolute bottom-10 right-8 md:right-12 flex flex-col items-center gap-2"
        style={{
          opacity:    mounted ? 0.5 : 0,
          transition: 'opacity 1s ease 1.4s',
        }}
      >
        <span
          className="text-[7px] tracking-[0.5em] uppercase font-body"
          style={{ color: 'rgba(248,244,238,0.6)', writingMode: 'vertical-rl' }}
        >
          Scroll
        </span>
        <div
          style={{
            width: 1,
            height: 40,
            background: 'linear-gradient(to bottom, rgba(201,168,76,0.6), transparent)',
          }}
        />
      </div>
    </section>
  );
}
