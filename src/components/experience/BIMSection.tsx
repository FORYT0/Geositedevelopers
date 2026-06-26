'use client';
import { useEffect, useRef, useState } from 'react';

/* ─── Data ─────────────────────────────────────────────────── */
const ROOMS = [
  { id: 'living',   label: 'Living Room', sqm: 42, x: 40,  y: 30,  w: 240, h: 160 },
  { id: 'master',   label: 'Master Bed',  sqm: 28, x: 40,  y: 200, w: 160, h: 120 },
  { id: 'bed2',     label: 'Bedroom 2',   sqm: 18, x: 210, y: 200, w: 120, h: 120 },
  { id: 'kitchen',  label: 'Kitchen',     sqm: 22, x: 290, y: 30,  w: 140, h: 120 },
  { id: 'bath',     label: 'Bathroom',    sqm: 8,  x: 290, y: 160, w: 140, h: 60  },
  { id: 'corridor', label: 'Corridor',    sqm: 12, x: 200, y: 200, w: 10,  h: 120 },
];

const MATERIALS = [
  { label: 'Engineered Oak Flooring',     pct: 85, color: '#C9A84C' },
  { label: 'Italian Marble (Bathrooms)',  pct: 60, color: '#9B8B6E' },
  { label: 'Custom Joinery (Walnut)',     pct: 72, color: '#8A7860' },
  { label: 'Venetian Plaster Walls',      pct: 45, color: '#A09278' },
];

const PROJECT_STATS = [
  { value: '210', unit: 'sqm',  label: 'Total Area'   },
  { value: '4',   unit: 'beds', label: 'Bedrooms'     },
  { value: '3',   unit: 'mo',   label: 'Timeline'     },
  { value: '12',  unit: 'wks',  label: 'Design Phase' },
];

/* ─── Component ─────────────────────────────────────────────── */
export function BIMSection() {
  const sectionRef              = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [barsPct, setBarsPct]   = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setRevealed(true);
          setTimeout(() => setBarsPct(true), 500);
        }
      },
      { threshold: 0.08 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const hovered = ROOMS.find(r => r.id === activeRoom);

  return (
    <section
      id="bim"
      ref={sectionRef}
      style={{ position: 'relative', width: '100%', background: '#0A0908', overflow: 'hidden' }}
    >
      {/* Subtle radial glow */}
      <div
        style={{
          position:       'absolute',
          inset:          0,
          pointerEvents:  'none',
          background:     'radial-gradient(ellipse 65% 55% at 80% 50%, rgba(201,168,76,0.035) 0%, transparent 70%)',
        }}
      />

      {/* ── Section Header ──────────────────────────────────────── */}
      <div
        style={{
          maxWidth:   1400,
          margin:     '0 auto',
          padding:    'clamp(80px, 10vw, 120px) clamp(32px, 5vw, 80px) 0',
          opacity:    revealed ? 1 : 0,
          transform:  revealed ? 'translateY(0)' : 'translateY(28px)',
          transition: 'opacity 0.9s ease, transform 0.9s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <div style={{ width: 40, height: 1, background: 'linear-gradient(90deg, transparent, #C9A84C)' }} />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.48rem', letterSpacing: '0.55em', textTransform: 'uppercase', color: '#C9A84C' }}>
            BIM Breakdown
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
          <h2
            style={{
              fontFamily:    'var(--font-display)',
              fontWeight:    300,
              fontSize:      'clamp(2.4rem, 5vw, 5rem)',
              color:         '#F8F4EE',
              letterSpacing: '-0.025em',
              lineHeight:    0.93,
            }}
          >
            Project{' '}
            <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>Intelligence</em>
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'rgba(248,244,238,0.32)', lineHeight: 1.85, maxWidth: 380, textAlign: 'right' }}>
            Every Geosite project is modelled in full BIM — giving you a precise
            digital twin before the first material is ordered.
          </p>
        </div>
      </div>

      {/* ── Stats Strip ─────────────────────────────────────────── */}
      <div
        style={{
          maxWidth:   1400,
          margin:     'clamp(56px, 7vw, 80px) auto 0',
          padding:    '0 clamp(32px, 5vw, 80px)',
          opacity:    revealed ? 1 : 0,
          transform:  revealed ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.9s ease 0.15s, transform 0.9s ease 0.15s',
        }}
      >
        <div
          style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            borderTop:           '1px solid rgba(248,244,238,0.07)',
            borderBottom:        '1px solid rgba(248,244,238,0.07)',
          }}
        >
          {PROJECT_STATS.map((stat, i) => (
            <div
              key={stat.label}
              style={{
                padding:     'clamp(28px, 3.5vw, 44px) clamp(20px, 2.5vw, 40px)',
                borderRight: i < 3 ? '1px solid rgba(248,244,238,0.07)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, marginBottom: 10 }}>
                <span
                  style={{
                    fontFamily:    'var(--font-display)',
                    fontWeight:    300,
                    fontSize:      'clamp(3rem, 5vw, 5.5rem)',
                    color:         '#C9A84C',
                    lineHeight:    1,
                    letterSpacing: '-0.04em',
                  }}
                >
                  {stat.value}
                </span>
                <span
                  style={{
                    fontFamily:    'var(--font-body)',
                    fontSize:      '0.48rem',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    color:         'rgba(201,168,76,0.45)',
                  }}
                >
                  {stat.unit}
                </span>
              </div>
              <p
                style={{
                  fontFamily:    'var(--font-body)',
                  fontSize:      '0.44rem',
                  letterSpacing: '0.45em',
                  textTransform: 'uppercase',
                  color:         'rgba(248,244,238,0.25)',
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Two-column: Floor Plan + Materials ──────────────────── */}
      <div
        style={{
          maxWidth: 1400,
          margin:   '0 auto',
          padding:  'clamp(56px, 7vw, 80px) clamp(32px, 5vw, 80px) clamp(80px, 10vw, 120px)',
          display:  'grid',
          gridTemplateColumns: '1fr 1fr',
          gap:      'clamp(32px, 5vw, 64px)',
          alignItems: 'start',
        }}
      >

        {/* Left: SVG floor plan */}
        <div
          style={{
            opacity:    revealed ? 1 : 0,
            transform:  revealed ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s',
          }}
        >
          {/* Plan header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.42rem', letterSpacing: '0.45em', textTransform: 'uppercase', color: '#C9A84C' }}>
              Floor Plan — Level 1
            </span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.4rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(248,244,238,0.2)' }}>
              1 : 100 Scale
            </span>
          </div>

          <div
            style={{
              background:   'rgba(248,244,238,0.02)',
              border:       '1px solid rgba(248,244,238,0.06)',
              borderRadius: 4,
              padding:      'clamp(24px, 3vw, 36px)',
            }}
          >
            {/* SVG */}
            <svg viewBox="0 0 480 360" style={{ display: 'block', width: '100%' }}>
              {/* Outer walls */}
              <rect x="30" y="20" width="420" height="320" rx="2"
                fill="none" stroke="rgba(201,168,76,0.25)" strokeWidth="8" />

              {/* Rooms */}
              {ROOMS.filter(r => r.id !== 'corridor').map(room => {
                const isActive = activeRoom === room.id;
                return (
                  <g key={room.id}>
                    <rect
                      x={room.x} y={room.y} width={room.w} height={room.h} rx="2"
                      fill={isActive ? 'rgba(201,168,76,0.14)' : 'rgba(201,168,76,0.03)'}
                      stroke={isActive ? 'rgba(201,168,76,0.75)' : 'rgba(201,168,76,0.22)'}
                      strokeWidth={isActive ? 2 : 1}
                      style={{ cursor: 'pointer', transition: 'all 0.25s ease' }}
                      onMouseEnter={() => setActiveRoom(room.id)}
                      onMouseLeave={() => setActiveRoom(null)}
                    />
                    <text
                      x={room.x + room.w / 2} y={room.y + room.h / 2 - 7}
                      textAnchor="middle"
                      style={{
                        fontSize: 9, fontFamily: 'var(--font-body)',
                        fill: isActive ? 'rgba(201,168,76,0.9)' : 'rgba(201,168,76,0.38)',
                        letterSpacing: '0.06em', textTransform: 'uppercase',
                        transition: 'fill 0.2s ease', pointerEvents: 'none',
                      }}
                    >
                      {room.label}
                    </text>
                    <text
                      x={room.x + room.w / 2} y={room.y + room.h / 2 + 10}
                      textAnchor="middle"
                      style={{
                        fontSize: 8, fontFamily: 'var(--font-body)',
                        fill: isActive ? 'rgba(248,244,238,0.7)' : 'rgba(248,244,238,0.2)',
                        transition: 'fill 0.2s ease', pointerEvents: 'none',
                      }}
                    >
                      {room.sqm} m²
                    </text>
                  </g>
                );
              })}

              {/* North arrow */}
              <g transform="translate(440, 40)">
                <circle cx="0" cy="0" r="14" fill="none" stroke="rgba(201,168,76,0.25)" strokeWidth="1" />
                <path d="M0 -10 L-4 4 L0 1 L4 4 Z" fill="rgba(201,168,76,0.55)" />
                <text y="6" textAnchor="middle" style={{ fontSize: 7, fill: 'rgba(201,168,76,0.45)', fontFamily: 'var(--font-body)' }}>N</text>
              </g>
            </svg>

            {/* Room tooltip */}
            <div
              style={{
                marginTop:  16,
                padding:    '14px 18px',
                borderRadius: 4,
                background: 'rgba(201,168,76,0.06)',
                border:     '1px solid rgba(248,244,238,0.06)',
                opacity:    hovered ? 1 : 0,
                transform:  hovered ? 'translateY(0)' : 'translateY(6px)',
                transition: 'opacity 0.3s ease, transform 0.3s ease',
                minHeight:  48,
                display:    'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {hovered ? (
                <>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.44rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#C9A84C' }}>
                    {hovered.label}
                  </span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem, 2vw, 1.6rem)', color: '#F8F4EE' }}>
                    {hovered.sqm} m²
                  </span>
                </>
              ) : (
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.4rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(248,244,238,0.18)' }}>
                  Hover a room to inspect
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Materials + CTA */}
        <div
          style={{
            opacity:    revealed ? 1 : 0,
            transform:  revealed ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.9s ease 0.35s, transform 0.9s ease 0.35s',
            display:    'flex',
            flexDirection: 'column',
            gap:        0,
          }}
        >
          <h4
            style={{
              fontFamily:    'var(--font-body)',
              fontSize:      '0.44rem',
              letterSpacing: '0.5em',
              textTransform: 'uppercase',
              color:         '#C9A84C',
              marginBottom:  'clamp(32px, 4vw, 48px)',
            }}
          >
            Material Specification
          </h4>

          {/* Material bars */}
          {MATERIALS.map((m, i) => (
            <div
              key={m.label}
              style={{
                marginBottom: 36,
                paddingBottom: 36,
                borderBottom: i < MATERIALS.length - 1 ? '1px solid rgba(248,244,238,0.06)' : 'none',
              }}
            >
              {/* Label + big percentage */}
              <div
                style={{
                  display:        'flex',
                  alignItems:     'flex-end',
                  justifyContent: 'space-between',
                  marginBottom:   14,
                  gap:            12,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize:   '0.85rem',
                    color:      'rgba(248,244,238,0.65)',
                    lineHeight: 1.4,
                  }}
                >
                  {m.label}
                </span>
                <span
                  style={{
                    fontFamily:    'var(--font-display)',
                    fontWeight:    300,
                    fontSize:      'clamp(2rem, 3vw, 2.8rem)',
                    color:         m.color,
                    lineHeight:    1,
                    letterSpacing: '-0.03em',
                    flexShrink:    0,
                  }}
                >
                  {m.pct}
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', marginLeft: 2, opacity: 0.7 }}>%</span>
                </span>
              </div>

              {/* Bar track */}
              <div
                style={{
                  height:       8,
                  borderRadius: 4,
                  background:   'rgba(248,244,238,0.05)',
                  overflow:     'hidden',
                }}
              >
                <div
                  style={{
                    height:      '100%',
                    width:       barsPct ? `${m.pct}%` : '0%',
                    background:  `linear-gradient(90deg, ${m.color}55, ${m.color})`,
                    borderRadius: 4,
                    transition:  `width 1.3s cubic-bezier(0.4,0,0.2,1) ${i * 180}ms`,
                  }}
                />
              </div>
            </div>
          ))}

          {/* CTA */}
          <a
            href="#footer"
            style={{
              display:       'inline-flex',
              alignItems:    'center',
              gap:           12,
              padding:       '16px 28px',
              fontFamily:    'var(--font-body)',
              fontSize:      '0.44rem',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              border:        '1px solid rgba(201,168,76,0.4)',
              color:         '#C9A84C',
              textDecoration:'none',
              marginTop:     8,
              alignSelf:     'flex-start',
              transition:    'background 0.3s ease, border-color 0.3s ease, color 0.3s ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.background    = '#C9A84C';
              el.style.color         = '#0A0908';
              el.style.borderColor   = '#C9A84C';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.background    = 'transparent';
              el.style.color         = '#C9A84C';
              el.style.borderColor   = 'rgba(201,168,76,0.4)';
            }}
          >
            Request a BIM Preview
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6h8M6.5 2.5L10 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
