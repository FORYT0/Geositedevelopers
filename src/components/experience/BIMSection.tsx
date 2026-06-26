'use client';
import { useEffect, useRef, useState } from 'react';

const ROOMS = [
  { id: 'living',  label: 'Living Room',  sqm: 42, x: 40, y: 30, w: 240, h: 160 },
  { id: 'master',  label: 'Master Bed',   sqm: 28, x: 40, y: 200, w: 160, h: 120 },
  { id: 'bed2',    label: 'Bedroom 2',    sqm: 18, x: 210, y: 200, w: 120, h: 120 },
  { id: 'kitchen', label: 'Kitchen',      sqm: 22, x: 290, y: 30, w: 140, h: 120 },
  { id: 'bath',    label: 'Bathroom',     sqm: 8,  x: 290, y: 160, w: 140, h: 60 },
  { id: 'corridor',label: 'Corridor',     sqm: 12, x: 200, y: 200, w: 10,  h: 120 },
];

const MATERIALS = [
  { label: 'Engineered Oak Flooring', pct: 85, color: '#C9A84C' },
  { label: 'Italian Marble (Bathrooms)', pct: 60, color: '#8B7355' },
  { label: 'Custom Joinery (Walnut)', pct: 72, color: '#7A6B50' },
  { label: 'Venetian Plaster Walls', pct: 45, color: '#A0906E' },
];

const PROJECT_STATS = [
  { value: '210', unit: 'sqm', label: 'Total Area' },
  { value: '4', unit: 'beds', label: 'Bedrooms' },
  { value: '3', unit: 'mo', label: 'Timeline' },
  { value: '12', unit: 'wks', label: 'Design Phase' },
];

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
          setTimeout(() => setBarsPct(true), 600);
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const hovered = ROOMS.find(r => r.id === activeRoom);

  return (
    <section
      id="bim"
      ref={sectionRef}
      className="relative w-full py-32 md:py-40 overflow-hidden"
      style={{ background: 'var(--charcoal-mid)' }}
    >
      {/* Background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 80% 50%, rgba(201,168,76,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-[1400px] mx-auto px-8 md:px-16">

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
              BIM Breakdown
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
            Project
            <br />
            <em style={{ color: 'var(--gold-light)', fontStyle: 'italic' }}>Intelligence</em>
          </h2>
          <p
            className="mt-5 font-body font-light max-w-lg"
            style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.9 }}
          >
            Every Geosite project is modelled in full BIM — giving you a precise digital twin
            before the first material is ordered.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Left: SVG floor plan */}
          <div
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed ? 'translateY(0)' : 'translateY(40px)',
              transition: 'opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s',
            }}
          >
            <div
              className="relative rounded-2xl p-6 md:p-10"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-[8px] tracking-[0.45em] uppercase font-body" style={{ color: 'var(--gold)' }}>
                  Floor Plan — Level 1
                </span>
                <span className="text-[8px] tracking-[0.3em] uppercase font-body" style={{ color: 'var(--text-muted)' }}>
                  1 : 100 Scale
                </span>
              </div>

              {/* SVG floor plan */}
              <svg
                viewBox="0 0 480 360"
                className="w-full"
                style={{ display: 'block' }}
              >
                {/* Outer walls */}
                <rect x="30" y="20" width="420" height="320" rx="2"
                  fill="none" stroke="rgba(201,168,76,0.3)" strokeWidth="8" />

                {/* Rooms */}
                {ROOMS.filter(r => r.id !== 'corridor').map(room => {
                  const isActive = activeRoom === room.id;
                  return (
                    <g key={room.id}>
                      <rect
                        x={room.x} y={room.y} width={room.w} height={room.h}
                        rx="2"
                        fill={isActive ? 'rgba(201,168,76,0.15)' : 'rgba(201,168,76,0.04)'}
                        stroke={isActive ? 'rgba(201,168,76,0.8)' : 'rgba(201,168,76,0.25)'}
                        strokeWidth={isActive ? 2 : 1}
                        style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                        onMouseEnter={() => setActiveRoom(room.id)}
                        onMouseLeave={() => setActiveRoom(null)}
                      />
                      <text
                        x={room.x + room.w / 2}
                        y={room.y + room.h / 2 - 6}
                        textAnchor="middle"
                        style={{
                          fontSize: 9,
                          fontFamily: 'var(--font-body)',
                          fill: isActive ? 'rgba(201,168,76,0.9)' : 'rgba(201,168,76,0.4)',
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          transition: 'fill 0.2s ease',
                          pointerEvents: 'none',
                        }}
                      >
                        {room.label}
                      </text>
                      <text
                        x={room.x + room.w / 2}
                        y={room.y + room.h / 2 + 10}
                        textAnchor="middle"
                        style={{
                          fontSize: 8,
                          fontFamily: 'var(--font-body)',
                          fill: isActive ? 'rgba(248,244,238,0.7)' : 'rgba(248,244,238,0.25)',
                          transition: 'fill 0.2s ease',
                          pointerEvents: 'none',
                        }}
                      >
                        {room.sqm} m²
                      </text>
                    </g>
                  );
                })}

                {/* North arrow */}
                <g transform="translate(440, 40)">
                  <circle cx="0" cy="0" r="14" fill="none" stroke="rgba(201,168,76,0.3)" strokeWidth="1" />
                  <path d="M0 -10 L-4 4 L0 1 L4 4 Z" fill="rgba(201,168,76,0.6)" />
                  <text y="6" textAnchor="middle" style={{ fontSize: 7, fill: 'rgba(201,168,76,0.5)', fontFamily: 'var(--font-body)' }}>N</text>
                </g>
              </svg>

              {/* Hovered room tooltip */}
              <div
                className="mt-4 px-5 py-3 rounded-lg transition-all duration-300"
                style={{
                  background: 'rgba(201,168,76,0.08)',
                  border: '1px solid var(--border)',
                  opacity: hovered ? 1 : 0,
                  transform: hovered ? 'translateY(0)' : 'translateY(6px)',
                }}
              >
                {hovered ? (
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] tracking-[0.4em] uppercase font-body" style={{ color: 'var(--gold)' }}>
                      {hovered.label}
                    </span>
                    <span className="font-display text-lg" style={{ color: 'var(--warm-white)' }}>
                      {hovered.sqm} m²
                    </span>
                  </div>
                ) : (
                  <span className="text-[8px] tracking-[0.3em] uppercase font-body" style={{ color: 'var(--text-muted)' }}>
                    Hover a room to inspect
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: stats + materials */}
          <div
            className="flex flex-col gap-8"
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed ? 'translateY(0)' : 'translateY(40px)',
              transition: 'opacity 0.9s ease 0.35s, transform 0.9s ease 0.35s',
            }}
          >
            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              {PROJECT_STATS.map(stat => (
                <div
                  key={stat.label}
                  className="p-6 rounded-xl"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div className="flex items-end gap-1 mb-1">
                    <span
                      className="font-display font-light"
                      style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', color: 'var(--gold-light)', lineHeight: 1 }}
                    >
                      {stat.value}
                    </span>
                    <span
                      className="text-[9px] tracking-[0.3em] uppercase font-body mb-1"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {stat.unit}
                    </span>
                  </div>
                  <p
                    className="text-[8px] tracking-[0.45em] uppercase font-body"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Material breakdown */}
            <div
              className="p-8 rounded-xl"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <h4
                className="text-[8px] tracking-[0.5em] uppercase font-body mb-7"
                style={{ color: 'var(--gold)' }}
              >
                Material Specification
              </h4>
              <div className="flex flex-col gap-5">
                {MATERIALS.map((m, i) => (
                  <div key={m.label}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-body font-light" style={{ color: 'var(--warm-white)' }}>
                        {m.label}
                      </span>
                      <span className="text-[9px] font-body" style={{ color: m.color }}>
                        {m.pct}%
                      </span>
                    </div>
                    <div
                      className="h-px rounded-full overflow-hidden"
                      style={{ background: 'var(--border)' }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: barsPct ? `${m.pct}%` : '0%',
                          background: `linear-gradient(90deg, ${m.color}, ${m.color}99)`,
                          transitionDelay: `${i * 150}ms`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <a
              href="#footer"
              className="inline-flex items-center gap-3 px-8 py-4 text-[9px] tracking-[0.4em] uppercase font-body font-medium transition-all duration-300 self-start"
              style={{ border: '1px solid var(--gold)', color: 'var(--gold)' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'var(--gold)';
                (e.currentTarget as HTMLElement).style.color = '#0D0D0D';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
                (e.currentTarget as HTMLElement).style.color = 'var(--gold)';
              }}
            >
              Request a BIM Preview
              <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
