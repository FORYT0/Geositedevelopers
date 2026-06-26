'use client';
import { useEffect, useState } from 'react';

const HERO_IMAGES = [
  '/renders/Geosite page 1 Backdrop.jpg',
  '/renders/Luxurious presidential suite Infinity feel 1.png',
  '/renders/Blue Spiral Hotel Ground full render.png',
];

interface Stat {
  raw: number;
  suffix: string;
  label: string;
}

const STATS: Stat[] = [
  { raw: 120, suffix: '+', label: 'Projects Delivered' },
  { raw: 8,   suffix: '+', label: 'Years of Excellence' },
  { raw: 98,  suffix: '%', label: 'Client Satisfaction' },
];

// Each word in the headline, with optional gold+italic flag
const HEADLINE: { text: string; gold?: boolean; break?: boolean }[] = [
  { text: 'Spaces' },
  { text: 'That' },
  { text: 'Tell', break: true },   // break BEFORE this word
  { text: 'Stories', gold: true },
];

function useCountUp(target: number, active: boolean, duration = 2200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return count;
}

function StatBlock({ stat, visible, delay }: { stat: Stat; visible: boolean; delay: number }) {
  const count = useCountUp(stat.raw, visible);
  return (
    <div
      style={{
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
        gap:           6,
        opacity:       visible ? 1 : 0,
        transform:     visible ? 'translateY(0)' : 'translateY(12px)',
        transition:    `opacity 0.9s ease ${delay}s, transform 0.9s ease ${delay}s`,
      }}
    >
      <span
        style={{
          fontFamily:    'var(--font-display)',
          fontWeight:    300,
          fontSize:      'clamp(1.6rem, 3vw, 2.5rem)',
          color:         '#C9A84C',
          lineHeight:    1,
          letterSpacing: '-0.01em',
        }}
      >
        {count}{stat.suffix}
      </span>
      <span
        style={{
          fontFamily:    'var(--font-body)',
          fontSize:      '0.44rem',
          letterSpacing: '0.5em',
          textTransform: 'uppercase',
          color:         'rgba(248,244,238,0.5)',
        }}
      >
        {stat.label}
      </span>
    </div>
  );
}

export function LandingSection() {
  const [imgIndex, setImgIndex] = useState(0);
  const [mounted,  setMounted]  = useState(false);

  useEffect(() => {
    // Small delay so clip animation is perceptible on initial load
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setImgIndex(i => (i + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  // Clip-reveal: overflow:hidden wrapper + translateY on inner span
  const clipReveal = (delay: number, extraStyle?: React.CSSProperties): [React.CSSProperties, React.CSSProperties] => [
    // wrapper
    {
      display:       'inline-block',
      overflow:      'hidden',
      verticalAlign: 'bottom',
    },
    // inner
    {
      display:    'inline-block',
      transform:  mounted ? 'translateY(0)' : 'translateY(105%)',
      transition: `transform 1.1s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      ...extraStyle,
    },
  ];

  // Simple fade for non-headline elements
  const fadeIn = (delay: number): React.CSSProperties => ({
    opacity:    mounted ? 1 : 0,
    transform:  mounted ? 'translateY(0)' : 'translateY(18px)',
    transition: `opacity 0.9s ease ${delay}s, transform 0.9s ease ${delay}s`,
  });

  return (
    <section
      id="landing"
      style={{
        position:  'relative',
        width:     '100%',
        height:    '100vh',
        minHeight: 640,
        overflow:  'hidden',
      }}
    >
      {/* ── Background images ─────────────────────────────── */}
      {HERO_IMAGES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt="Geosite DEVELOPERS Interior Design"
          draggable={false}
          style={{
            position:       'absolute',
            top:            0,
            left:           0,
            width:          '100%',
            height:         '100%',
            objectFit:      'cover',
            objectPosition: 'center',
            opacity:        i === imgIndex ? 1 : 0,
            transition:     'opacity 1.8s ease',
            zIndex:         i === imgIndex ? 1 : 0,
          }}
        />
      ))}

      {/* ── Overlay ───────────────────────────────────────── */}
      <div
        style={{
          position:   'absolute',
          inset:      0,
          zIndex:     2,
          background: 'linear-gradient(to bottom, rgba(8,8,8,0.55) 0%, rgba(8,8,8,0.15) 38%, rgba(8,8,8,0.82) 100%)',
        }}
      />

      {/* ── Hero content ─────────────────────────────────── */}
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
          paddingBottom:  '130px',
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            display:      'flex',
            alignItems:   'center',
            gap:          16,
            marginBottom: 36,
            ...fadeIn(0.1),
          }}
        >
          <div style={{ width: 50, height: 1, background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)' }} />
          <span
            style={{
              fontFamily:    'var(--font-body)',
              fontSize:      '0.5rem',
              letterSpacing: '0.55em',
              textTransform: 'uppercase',
              color:         '#C9A84C',
            }}
          >
            Interior Design Studio · Nairobi, Kenya
          </span>
          <div style={{ width: 50, height: 1, background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)' }} />
        </div>

        {/* ── Headline with word-by-word clip reveal ─────── */}
        <h1
          style={{
            fontFamily:    'var(--font-display)',
            fontWeight:    300,
            fontSize:      'clamp(4rem, 10vw, 11rem)',
            color:         '#F8F4EE',
            letterSpacing: '-0.03em',
            lineHeight:    0.9,
            marginBottom:  28,
          }}
        >
          {HEADLINE.map((item, i) => {
            const delay = 0.28 + i * 0.14;
            const [wrapStyle, innerStyle] = clipReveal(delay, item.gold ? { color: '#C9A84C', fontStyle: 'italic' } : undefined);
            return (
              <span key={item.text}>
                {item.break && <br />}
                {item.break && ' '}
                <span style={wrapStyle}>
                  <span style={innerStyle}>{item.text}</span>
                </span>
                {!item.break && i < HEADLINE.length - 1 && ' '}
              </span>
            );
          })}
        </h1>

        {/* Tagline */}
        <p
          style={{
            fontFamily:    'var(--font-body)',
            fontWeight:    300,
            fontSize:      'clamp(0.7rem, 1.1vw, 0.88rem)',
            color:         'rgba(248,244,238,0.62)',
            letterSpacing: '0.1em',
            lineHeight:    2,
            maxWidth:      520,
            marginBottom:  48,
            ...fadeIn(0.75),
          }}
        >
          Crafting extraordinary interiors through bespoke design,
          BIM technology, and timeless elegance.
        </p>

        {/* CTAs */}
        <div
          style={{
            display:        'flex',
            flexWrap:       'wrap',
            gap:            16,
            justifyContent: 'center',
            ...fadeIn(0.9),
          }}
        >
          <a
            href="#portfolio"
            style={{
              display:        'inline-block',
              padding:        '15px 44px',
              fontFamily:     'var(--font-body)',
              fontSize:       '0.52rem',
              letterSpacing:  '0.42em',
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
              padding:        '15px 44px',
              fontFamily:     'var(--font-body)',
              fontSize:       '0.52rem',
              letterSpacing:  '0.42em',
              textTransform:  'uppercase',
              fontWeight:     500,
              border:         '1px solid rgba(248,244,238,0.38)',
              color:          'rgba(248,244,238,0.82)',
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
              el.style.borderColor = 'rgba(248,244,238,0.38)';
              el.style.color       = 'rgba(248,244,238,0.82)';
            }}
          >
            Our Process
          </a>
        </div>
      </div>

      {/* ── Stats strip ───────────────────────────────────── */}
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
          padding:        '0 32px',
        }}
      >
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            style={{
              padding:    '0 44px',
              borderLeft: i > 0 ? '1px solid rgba(201,168,76,0.22)' : 'none',
            }}
          >
            <StatBlock stat={stat} visible={mounted} delay={1.1 + i * 0.12} />
          </div>
        ))}
      </div>

      {/* ── Vertical image dots ───────────────────────────── */}
      <div
        style={{
          position:      'absolute',
          right:         48,
          top:           '50%',
          transform:     'translateY(-50%)',
          zIndex:        4,
          display:       'flex',
          flexDirection: 'column',
          gap:           10,
          opacity:       mounted ? 1 : 0,
          transition:    'opacity 1s ease 1.3s',
        }}
      >
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setImgIndex(i)}
            aria-label={`Image ${i + 1}`}
            style={{
              width:        2,
              height:       i === imgIndex ? 34 : 12,
              background:   i === imgIndex ? '#C9A84C' : 'rgba(201,168,76,0.3)',
              border:       'none',
              padding:      0,
              cursor:       'pointer',
              borderRadius: 1,
              transition:   'height 0.4s ease, background 0.4s ease',
            }}
          />
        ))}
      </div>

      {/* ── Scroll cue ────────────────────────────────────── */}
      <div
        style={{
          position:      'absolute',
          bottom:        40,
          left:          48,
          zIndex:        4,
          display:       'flex',
          flexDirection: 'column',
          alignItems:    'center',
          gap:           8,
          opacity:       mounted ? 0.45 : 0,
          transition:    'opacity 1s ease 1.6s',
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
