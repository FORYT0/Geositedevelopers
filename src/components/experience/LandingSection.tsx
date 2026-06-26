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

  useEffect(() => {
    const id = setInterval(() => {
      setImgIndex(i => (i + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  const anim = (delay: number) => ({
    opacity:    mounted ? 1 : 0,
    transform:  mounted ? 'translateY(0)' : 'translateY(22px)',
    transition: `opacity 1s ease ${delay}s, transform 1s ease ${delay}s`,
  });

  return (
    <section
      id="landing"
      style={{
        position:   'relative',
        width:      '100%',
        height:     '100vh',
        minHeight:  640,
        overflow:   'hidden',
      }}
    >
      {/* ── Background images ──────────────────────────────────── */}
      {HERO_IMAGES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt="Geosite DEVELOPERS Interior Design"
          draggable={false}
          style={{
            position:   'absolute',
            top:        0,
            left:       0,
            width:      '100%',
            height:     '100%',
            objectFit:  'cover',
            objectPosition: 'center',
            opacity:    i === imgIndex ? 1 : 0,
            transition: 'opacity 1.6s ease',
            zIndex:     i === imgIndex ? 1 : 0,
          }}
        />
      ))}

      {/* ── Dark overlay ─────────────────────────────────────────── */}
      <div
        style={{
          position:   'absolute',
          inset:      0,
          zIndex:     2,
          background: 'linear-gradient(to bottom, rgba(8,8,8,0.5) 0%, rgba(8,8,8,0.18) 40%, rgba(8,8,8,0.75) 100%)',
        }}
      />

      {/* ── Hero content (centered) ───────────────────────────────── */}
      <div
        style={{
          position:       'absolute',
          top:            0,
          left:           0,
          right:          0,
          bottom:         0,
          zIndex:         3,
          display:        'flex',
          flexDirection:  'column',
          justifyContent: 'center',
          alignItems:     'center',
          textAlign:      'center',
          padding:        '0 24px',
          paddingBottom:  '120px', // leave room for stats at bottom
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            display:        'flex',
            alignItems:     'center',
            gap:            16,
            marginBottom:   32,
            ...anim(0.2),
          }}
        >
          <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)' }} />
          <span
            style={{
              fontFamily:     'var(--font-body)',
              fontSize:       '0.55rem',
              letterSpacing:  '0.55em',
              textTransform:  'uppercase',
              color:          '#C9A84C',
            }}
          >
            Interior Design Studio · Nairobi, Kenya
          </span>
          <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)' }} />
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily:     'var(--font-display)',
            fontWeight:     300,
            fontSize:       'clamp(3.5rem, 8.5vw, 9rem)',
            color:          '#F8F4EE',
            letterSpacing:  '-0.025em',
            lineHeight:     0.93,
            marginBottom:   24,
            ...anim(0.4),
          }}
        >
          Spaces That
          <br />
          <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>Tell Stories</em>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontFamily:     'var(--font-body)',
            fontWeight:     300,
            fontSize:       'clamp(0.8rem, 1.2vw, 0.95rem)',
            color:          'rgba(248,244,238,0.68)',
            letterSpacing:  '0.08em',
            lineHeight:     2,
            maxWidth:       540,
            marginBottom:   48,
            ...anim(0.58),
          }}
        >
          Crafting extraordinary interiors through bespoke design,
          BIM technology, and timeless elegance.
        </p>

        {/* CTAs */}
        <div
          style={{
            display:     'flex',
            flexWrap:    'wrap',
            gap:         16,
            justifyContent: 'center',
            ...anim(0.74),
          }}
        >
          <a
            href="#portfolio"
            style={{
              display:        'inline-block',
              padding:        '14px 40px',
              fontFamily:     'var(--font-body)',
              fontSize:       '0.56rem',
              letterSpacing:  '0.4em',
              textTransform:  'uppercase',
              fontWeight:     500,
              background:     '#C9A84C',
              color:          '#0D0D0D',
              textDecoration: 'none',
              transition:     'background 0.3s ease',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#E8C97A')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#C9A84C')}
          >
            View Portfolio
          </a>
          <a
            href="#process"
            style={{
              display:        'inline-block',
              padding:        '14px 40px',
              fontFamily:     'var(--font-body)',
              fontSize:       '0.56rem',
              letterSpacing:  '0.4em',
              textTransform:  'uppercase',
              fontWeight:     500,
              border:         '1px solid rgba(248,244,238,0.4)',
              color:          'rgba(248,244,238,0.85)',
              textDecoration: 'none',
              transition:     'border-color 0.3s ease, color 0.3s ease',
            }}
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

      {/* ── Stats strip (absolute bottom) ────────────────────────── */}
      <div
        style={{
          position:       'absolute',
          bottom:         40,
          left:           0,
          right:          0,
          zIndex:         4,
          display:        'flex',
          justifyContent: 'center',
          alignItems:     'flex-end',
          gap:            0,
          padding:        '0 32px',
          opacity:        mounted ? 1 : 0,
          transition:     'opacity 1s ease 1.1s',
        }}
      >
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            style={{
              display:        'flex',
              flexDirection:  'column',
              alignItems:     'center',
              gap:            6,
              padding:        '0 40px',
              borderLeft:     i > 0 ? '1px solid rgba(201,168,76,0.25)' : 'none',
            }}
          >
            <span
              style={{
                fontFamily:     'var(--font-display)',
                fontWeight:     300,
                fontSize:       'clamp(1.7rem, 3vw, 2.6rem)',
                color:          '#C9A84C',
                lineHeight:     1,
                letterSpacing:  '-0.01em',
              }}
            >
              {stat.value}
            </span>
            <span
              style={{
                fontFamily:    'var(--font-body)',
                fontSize:      '0.44rem',
                letterSpacing: '0.48em',
                textTransform: 'uppercase',
                color:         'rgba(248,244,238,0.5)',
              }}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* ── Image indicator dots ────────────────────────────────── */}
      <div
        style={{
          position:  'absolute',
          right:     48,
          top:       '50%',
          transform: 'translateY(-50%)',
          zIndex:    4,
          display:   'flex',
          flexDirection: 'column',
          gap:       10,
          opacity:   mounted ? 1 : 0,
          transition: 'opacity 1s ease 1.2s',
        }}
      >
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setImgIndex(i)}
            aria-label={`Image ${i + 1}`}
            style={{
              width:        2,
              height:       i === imgIndex ? 32 : 12,
              background:   i === imgIndex ? '#C9A84C' : 'rgba(201,168,76,0.35)',
              border:       'none',
              padding:      0,
              cursor:       'pointer',
              borderRadius: 1,
              transition:   'height 0.4s ease, background 0.4s ease',
            }}
          />
        ))}
      </div>

      {/* ── Scroll cue ──────────────────────────────────────────── */}
      <div
        style={{
          position:      'absolute',
          bottom:        40,
          right:         48,
          zIndex:        4,
          display:       'flex',
          flexDirection: 'column',
          alignItems:    'center',
          gap:           8,
          opacity:       mounted ? 0.5 : 0,
          transition:    'opacity 1s ease 1.5s',
        }}
      >
        <span
          style={{
            fontFamily:    'var(--font-body)',
            fontSize:      '0.44rem',
            letterSpacing: '0.5em',
            textTransform: 'uppercase',
            color:         'rgba(248,244,238,0.6)',
            writingMode:   'vertical-rl',
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width:      1,
            height:     40,
            background: 'linear-gradient(to bottom, rgba(201,168,76,0.6), transparent)',
          }}
        />
      </div>
    </section>
  );
}
