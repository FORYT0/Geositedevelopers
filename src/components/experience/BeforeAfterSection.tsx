'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

const PROJECTS = [
  {
    id:       'suite',
    label:    'Presidential Suite',
    location: 'Westlands, Nairobi',
    before:   '/renders/Blue Spiral Hotel Ground full render.png',
    after:    '/renders/Luxurious presidential suite Infinity feel 1.png',
    quote:    'Geosite turned our concept into a living masterpiece.',
    client:   'Amara K.',
  },
  {
    id:       'hotel',
    label:    'Blue Spiral Hotel',
    location: 'Karen, Nairobi',
    before:   '/renders/Blue Spiral Hotel Render.jpg',
    after:    '/renders/Blue Spiral Hotel Entrance Final.png',
    quote:    'The attention to detail was unlike anything we experienced.',
    client:   'James & Wanjiru N.',
  },
  {
    id:       'exterior',
    label:    'Hotel Complex',
    location: 'Runda, Nairobi',
    before:   '/renders/Blue Spiral Hotel Render.jpg',
    after:    '/renders/Blue Spiral Hotel Ground full render.png',
    quote:    'From concept to completion — flawless.',
    client:   'Arch. Kariuki',
  },
];

function Slider({ project }: { project: (typeof PROJECTS)[0] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pct, setPct]     = useState(50);
  const [locked, setLocked] = useState(false);
  const lockedRef = useRef(false); // sync ref for event handlers

  const getPercent = useCallback((clientX: number) => {
    if (!containerRef.current) return 50;
    const rect = containerRef.current.getBoundingClientRect();
    return Math.max(3, Math.min(97, ((clientX - rect.left) / rect.width) * 100));
  }, []);

  // Keep ref in sync with state
  useEffect(() => { lockedRef.current = locked; }, [locked]);

  // Reset lock when slider scrolls off screen
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (!e.isIntersecting) { setLocked(false); } },
      { threshold: 0.05 }
    );
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  // Touch drag — needs global listeners for precision when finger moves fast
  useEffect(() => {
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      setPct(getPercent(e.touches[0].clientX));
    };
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => container.removeEventListener('touchmove', onTouchMove);
  }, [getPercent]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!lockedRef.current) setPct(getPercent(e.clientX));
    },
    [getPercent]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      setLocked(prev => {
        const next = !prev;
        if (!next) setPct(getPercent(e.clientX)); // unlock: snap to current position
        return next;
      });
    },
    [getPercent]
  );

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      onTouchStart={e => setPct(getPercent(e.touches[0].clientX))}
      style={{
        position:   'relative',
        width:      '100%',
        aspectRatio:'16/9',
        overflow:   'hidden',
        userSelect: 'none',
        touchAction:'none',
        cursor:     locked ? 'col-resize' : 'crosshair',
      }}
    >
      {/* BEFORE image */}
      <img
        src={project.before}
        alt="Before"
        draggable={false}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />

      {/* AFTER image — clipped to left of divider */}
      <div
        style={{
          position: 'absolute',
          inset:    0,
          overflow: 'hidden',
          clipPath: `inset(0 ${100 - pct}% 0 0)`,
        }}
      >
        <img
          src={project.after}
          alt="After"
          draggable={false}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Before label */}
      <div
        style={{
          position:       'absolute',
          top:            20,
          left:           20,
          padding:        '7px 16px',
          fontFamily:     'var(--font-body)',
          fontSize:       '0.48rem',
          letterSpacing:  '0.42em',
          textTransform:  'uppercase',
          background:     'rgba(10,10,10,0.7)',
          border:         '1px solid rgba(255,255,255,0.1)',
          color:          'rgba(248,244,238,0.75)',
          backdropFilter: 'blur(8px)',
          opacity:        pct < 88 ? 1 : 0,
          transition:     'opacity 0.3s ease',
        }}
      >
        Before
      </div>

      {/* After label */}
      <div
        style={{
          position:       'absolute',
          top:            20,
          right:          20,
          padding:        '7px 16px',
          fontFamily:     'var(--font-body)',
          fontSize:       '0.48rem',
          letterSpacing:  '0.42em',
          textTransform:  'uppercase',
          background:     'rgba(10,10,10,0.7)',
          border:         '1px solid rgba(201,168,76,0.4)',
          color:          '#C9A84C',
          backdropFilter: 'blur(8px)',
          opacity:        pct > 12 ? 1 : 0,
          transition:     'opacity 0.3s ease',
        }}
      >
        After
      </div>

      {/* Lock indicator */}
      {locked && (
        <div
          style={{
            position:       'absolute',
            bottom:         20,
            left:           '50%',
            transform:      'translateX(-50%)',
            padding:        '6px 14px',
            fontFamily:     'var(--font-body)',
            fontSize:       '0.44rem',
            letterSpacing:  '0.4em',
            textTransform:  'uppercase',
            background:     'rgba(201,168,76,0.15)',
            border:         '1px solid rgba(201,168,76,0.4)',
            color:          '#C9A84C',
            backdropFilter: 'blur(10px)',
            display:        'flex',
            alignItems:     'center',
            gap:            8,
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <rect x="2" y="4" width="6" height="5" rx="0.5" stroke="#C9A84C" strokeWidth="1"/>
            <path d="M3.5 4 V3 A1.5 1.5 0 0 1 6.5 3 V4" stroke="#C9A84C" strokeWidth="1"/>
          </svg>
          Click to unlock
        </div>
      )}

      {/* Divider line */}
      <div
        style={{
          position:   'absolute',
          top:        0,
          bottom:     0,
          left:       `${pct}%`,
          width:      1,
          background: 'rgba(255,255,255,0.9)',
          boxShadow:  '0 0 12px rgba(255,255,255,0.5)',
          pointerEvents: 'none',
        }}
      />

      {/* Drag handle */}
      <div
        style={{
          position:         'absolute',
          top:              '50%',
          left:             `${pct}%`,
          transform:        'translate(-50%, -50%)',
          width:            44,
          height:           44,
          borderRadius:     '50%',
          background:       'rgba(255,255,255,0.96)',
          boxShadow:        '0 4px 20px rgba(0,0,0,0.3)',
          display:          'flex',
          alignItems:       'center',
          justifyContent:   'center',
          pointerEvents:    'none',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M6 4l-4 5 4 5M12 4l4 5-4 5" stroke="#0D0D0D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}

export function BeforeAfterSection() {
  const [active,   setActive]   = useState(0);
  const [revealed, setRevealed] = useState(false);
  const sectionRef              = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setRevealed(true); },
      { threshold: 0.06 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const proj = PROJECTS[active];

  return (
    <section
      id="before-after"
      ref={sectionRef}
      style={{ position: 'relative', width: '100%', background: '#F2EDE6', overflow: 'hidden', padding: 'clamp(64px, 8vw, 120px) 0' }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 clamp(24px, 5vw, 64px)' }}>

        {/* Header */}
        <div
          style={{
            display:    'flex',
            flexWrap:   'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap:        32,
            marginBottom: 48,
            opacity:    revealed ? 1 : 0,
            transform:  revealed ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.9s ease, transform 0.9s ease',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, transparent, #B08422, transparent)' }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.52rem', letterSpacing: '0.55em', textTransform: 'uppercase', color: '#B08422' }}>
                Project Transformations
              </span>
            </div>
            <h2
              style={{
                fontFamily:    'var(--font-display)',
                fontWeight:    300,
                fontSize:      'clamp(2.4rem, 5vw, 5rem)',
                color:         '#1A1614',
                letterSpacing: '-0.02em',
                lineHeight:    0.93,
              }}
            >
              See the
              <br />
              <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>Difference</em>
            </h2>
          </div>

          {/* Project tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {PROJECTS.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setActive(i)}
                style={{
                  padding:        '10px 20px',
                  fontFamily:     'var(--font-body)',
                  fontSize:       '0.48rem',
                  letterSpacing:  '0.35em',
                  textTransform:  'uppercase',
                  fontWeight:     500,
                  background:     i === active ? '#B08422' : 'transparent',
                  color:          i === active ? '#FAF9F6' : '#7A6E60',
                  border:         i === active ? '1px solid #B08422' : '1px solid rgba(176,132,34,0.25)',
                  cursor:         'pointer',
                  transition:     'all 0.3s ease',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Slider */}
        <div
          style={{
            opacity:    revealed ? 1 : 0,
            transform:  revealed ? 'translateY(0)' : 'translateY(32px)',
            transition: 'opacity 0.9s ease 0.18s, transform 0.9s ease 0.18s',
          }}
        >
          <Slider key={proj.id} project={proj} />
        </div>

        {/* Info + quote below slider */}
        <div
          style={{
            display:        'flex',
            flexWrap:       'wrap',
            alignItems:     'center',
            justifyContent: 'space-between',
            gap:            24,
            marginTop:      28,
            opacity:        revealed ? 1 : 0,
            transition:     'opacity 0.9s ease 0.35s',
          }}
        >
          <div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.48rem', letterSpacing: '0.45em', textTransform: 'uppercase', color: '#B08422', marginBottom: 6 }}>
              {proj.location}
            </p>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(1.1rem, 2vw, 1.6rem)', color: '#1A1614' }}>
              {proj.label} Transformation
            </h3>
          </div>

          <blockquote style={{ borderRight: '2px solid #B08422', paddingRight: 20, textAlign: 'right', maxWidth: 360 }}>
            <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)', color: '#3A2F28', marginBottom: 8 }}>
              "{proj.quote}"
            </p>
            <cite style={{ fontFamily: 'var(--font-body)', fontSize: '0.48rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#B08422', fontStyle: 'normal' }}>
              — {proj.client}
            </cite>
          </blockquote>
        </div>

        {/* Mouse hint */}
        <div
          style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            gap:            10,
            marginTop:      20,
            opacity:        revealed ? 0.55 : 0,
            transition:     'opacity 0.9s ease 0.5s',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M4 3.5 L1 7 L4 10.5 M10 3.5 L13 7 L10 10.5" stroke="#B08422" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.46rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#7A6E60' }}>
            Move mouse to compare · click to lock
          </span>
        </div>
      </div>
    </section>
  );
}
