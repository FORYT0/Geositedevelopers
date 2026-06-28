'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

/* ─── Spaces data ────────────────────────────────────────────────
   Single `image` URL is used for both sides.
   The "before" side gets a wireframe/blueprint CSS treatment.
   The "after" side shows the full photorealistic colour image.
──────────────────────────────────────────────────────────────── */
const SPACES = [
  {
    id:       'living-room',
    label:    'Living Room',
    location: 'Runda Estate, Nairobi',
    image:    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1800&q=88&auto=format&fit=crop',
    quote:    'Geosite turned our concept into a living masterpiece.',
    client:   'Amara K.',
  },
  {
    id:       'hotel-suite',
    label:    'Presidential Suite',
    location: 'Westlands, Nairobi',
    image:    'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1800&q=88&auto=format&fit=crop',
    quote:    'The before/after is genuinely shocking. Beyond expectation.',
    client:   'Chef M. Kariuki',
  },
  {
    id:       'kitchen',
    label:    'Kitchen & Dining',
    location: 'Karen, Nairobi',
    image:    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1800&q=88&auto=format&fit=crop',
    quote:    'From empty shell to culinary sanctuary — flawless execution.',
    client:   'James & Wanjiru N.',
  },
  {
    id:       'bathroom',
    label:    'Spa Bathroom',
    location: 'Muthaiga, Nairobi',
    image:    'https://images.unsplash.com/photo-1552321554-cd347d2142a7?w=1800&q=88&auto=format&fit=crop',
    quote:    'Every detail was considered. A true sanctuary.',
    client:   'Fatuma H.',
  },
  {
    id:       'library',
    label:    'Home Library',
    location: 'Gigiri, Nairobi',
    image:    'https://images.unsplash.com/photo-1481277542470-5a2176ae8722?w=1800&q=88&auto=format&fit=crop',
    quote:    'Our office now tells our brand story before anyone says a word.',
    client:   'Arch. Kariuki',
  },
];

/* ─── Slider (same UX as before: follow-mouse, click-to-lock) ─── */
function Slider({ space }: { space: (typeof SPACES)[0] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pct, setPct]       = useState(50);
  const [locked, setLocked] = useState(false);
  const lockedRef           = useRef(false);

  const getPercent = useCallback((clientX: number) => {
    if (!containerRef.current) return 50;
    const rect = containerRef.current.getBoundingClientRect();
    return Math.max(3, Math.min(97, ((clientX - rect.left) / rect.width) * 100));
  }, []);

  useEffect(() => { lockedRef.current = locked; }, [locked]);

  // Reset lock when off-screen
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (!e.isIntersecting) setLocked(false); },
      { threshold: 0.05 }
    );
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  // Touch drag
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
    (e: React.MouseEvent) => { if (!lockedRef.current) setPct(getPercent(e.clientX)); },
    [getPercent]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      setLocked(prev => {
        const next = !prev;
        if (!next) setPct(getPercent(e.clientX));
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
      {/* ── BEFORE: same image with wireframe/blueprint CSS treatment ── */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <img
          src={space.image}
          alt="Before — Concept State"
          draggable={false}
          style={{
            width:      '100%',
            height:     '100%',
            objectFit:  'cover',
            objectPosition: 'center',
            filter:     'grayscale(1) brightness(1.55) contrast(0.62) opacity(0.88)',
          }}
        />
        {/* Blueprint blue tint overlay */}
        <div
          style={{
            position:   'absolute',
            inset:      0,
            background: 'rgba(16, 38, 80, 0.32)',
            mixBlendMode: 'multiply',
            pointerEvents: 'none',
          }}
        />
        {/* Subtle grid lines for blueprint feel */}
        <div
          style={{
            position:   'absolute',
            inset:      0,
            backgroundImage: `
              linear-gradient(rgba(140,180,255,0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(140,180,255,0.06) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
            pointerEvents:  'none',
          }}
        />
      </div>

      {/* ── AFTER: full photorealistic colour image, clipped to right of divider ── */}
      <div
        style={{
          position: 'absolute',
          inset:    0,
          overflow: 'hidden',
          clipPath: `inset(0 ${100 - pct}% 0 0)`,
        }}
      >
        <img
          src={space.image}
          alt="After — Photorealistic Render"
          draggable={false}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
        {/* Subtle warm gloss to make "after" pop vs. ghosted before */}
        <div
          style={{
            position:   'absolute',
            inset:      0,
            background: 'linear-gradient(135deg, rgba(201,168,76,0.04) 0%, transparent 60%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* ── Before label ── */}
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
          background:     'rgba(16,38,80,0.72)',
          border:         '1px solid rgba(140,180,255,0.3)',
          color:          'rgba(180,210,255,0.9)',
          backdropFilter: 'blur(8px)',
          opacity:        pct < 88 ? 1 : 0,
          transition:     'opacity 0.3s ease',
          pointerEvents:  'none',
        }}
      >
        Concept
      </div>

      {/* ── After label ── */}
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
          background:     'rgba(10,10,10,0.72)',
          border:         '1px solid rgba(201,168,76,0.45)',
          color:          '#C9A84C',
          backdropFilter: 'blur(8px)',
          opacity:        pct > 12 ? 1 : 0,
          transition:     'opacity 0.3s ease',
          pointerEvents:  'none',
        }}
      >
        Render
      </div>

      {/* ── Lock indicator ── */}
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
            pointerEvents:  'none',
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <rect x="2" y="4" width="6" height="5" rx="0.5" stroke="#C9A84C" strokeWidth="1"/>
            <path d="M3.5 4 V3 A1.5 1.5 0 0 1 6.5 3 V4" stroke="#C9A84C" strokeWidth="1"/>
          </svg>
          Click to unlock
        </div>
      )}

      {/* ── Divider line ── */}
      <div
        style={{
          position:      'absolute',
          top:           0,
          bottom:        0,
          left:          `${pct}%`,
          width:         1,
          background:    'rgba(255,255,255,0.92)',
          boxShadow:     '0 0 14px rgba(255,255,255,0.45)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Drag handle ── */}
      <div
        style={{
          position:       'absolute',
          top:            '50%',
          left:           `${pct}%`,
          transform:      'translate(-50%, -50%)',
          width:          46,
          height:         46,
          borderRadius:   '50%',
          background:     'rgba(255,255,255,0.97)',
          boxShadow:      '0 4px 24px rgba(0,0,0,0.32)',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          pointerEvents:  'none',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M6 4l-4 5 4 5M12 4l4 5-4 5" stroke="#0D0D0D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}

/* ─── Main section ──────────────────────────────────────────────── */
export function BeforeAfterSection() {
  const [active,   setActive]   = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [entering, setEntering] = useState(false);
  const sectionRef              = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setRevealed(true); },
      { threshold: 0.06 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const goTo = (index: number) => {
    setEntering(true);
    setTimeout(() => {
      setActive(index);
      setEntering(false);
    }, 260);
  };

  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    goTo((active - 1 + SPACES.length) % SPACES.length);
  };

  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    goTo((active + 1) % SPACES.length);
  };

  const space = SPACES[active];

  return (
    <section
      id="before-after"
      ref={sectionRef}
      style={{ position: 'relative', width: '100%', background: '#F2EDE6', overflow: 'hidden', padding: 'clamp(64px, 8vw, 120px) 0' }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 clamp(24px, 5vw, 64px)' }}>

        {/* ── Header ── */}
        <div
          style={{
            display:    'flex',
            flexWrap:   'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap:        32,
            marginBottom: 40,
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
              Concept to
              <br />
              <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>Reality</em>
            </h2>
          </div>

          {/* Space counter + label */}
          <div
            style={{
              display:       'flex',
              flexDirection: 'column',
              alignItems:    'flex-end',
              gap:           6,
            }}
          >
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.46rem', letterSpacing: '0.42em', textTransform: 'uppercase', color: '#B08422' }}>
              {space.location}
            </p>
            <p
              style={{
                fontFamily:    'var(--font-display)',
                fontWeight:    300,
                fontSize:      'clamp(1.2rem, 2.5vw, 2rem)',
                color:         '#1A1614',
                letterSpacing: '-0.01em',
                opacity:       entering ? 0 : 1,
                transform:     entering ? 'translateY(8px)' : 'translateY(0)',
                transition:    'opacity 0.26s ease, transform 0.26s ease',
              }}
            >
              {space.label}
            </p>
            {/* Progress pips */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
              {SPACES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Space ${i + 1}`}
                  style={{
                    width:        i === active ? 22 : 6,
                    height:       6,
                    borderRadius: 3,
                    background:   i === active ? '#B08422' : 'rgba(176,132,34,0.22)',
                    border:       'none',
                    padding:      0,
                    cursor:       'pointer',
                    transition:   'width 0.35s ease, background 0.35s ease',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Slider container with edge arrow buttons ── */}
        <div
          style={{
            position:   'relative',
            opacity:    revealed ? (entering ? 0.6 : 1) : 0,
            transform:  revealed ? 'translateY(0)' : 'translateY(32px)',
            transition: 'opacity 0.3s ease, transform 0.9s ease 0.18s',
          }}
        >
          {/* LEFT edge arrow */}
          <button
            onClick={goPrev}
            aria-label="Previous space"
            style={{
              position:       'absolute',
              left:           0,
              top:            '50%',
              transform:      'translateY(-50%)',
              zIndex:         20,
              width:          52,
              height:         52,
              borderRadius:   '50%',
              background:     'rgba(250,249,246,0.92)',
              border:         '1px solid rgba(176,132,34,0.25)',
              cursor:         'pointer',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              boxShadow:      '0 4px 20px rgba(0,0,0,0.14)',
              transition:     'background 0.25s ease, border-color 0.25s ease, transform 0.25s ease',
              marginLeft:     -26,
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.background    = '#B08422';
              el.style.borderColor   = '#B08422';
              el.style.transform     = 'translateY(-50%) scale(1.08)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.background  = 'rgba(250,249,246,0.92)';
              el.style.borderColor = 'rgba(176,132,34,0.25)';
              el.style.transform   = 'translateY(-50%)';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3 L5 8 L10 13" stroke="#1A1614" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* RIGHT edge arrow */}
          <button
            onClick={goNext}
            aria-label="Next space"
            style={{
              position:       'absolute',
              right:          0,
              top:            '50%',
              transform:      'translateY(-50%)',
              zIndex:         20,
              width:          52,
              height:         52,
              borderRadius:   '50%',
              background:     'rgba(250,249,246,0.92)',
              border:         '1px solid rgba(176,132,34,0.25)',
              cursor:         'pointer',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              boxShadow:      '0 4px 20px rgba(0,0,0,0.14)',
              transition:     'background 0.25s ease, border-color 0.25s ease, transform 0.25s ease',
              marginRight:    -26,
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.background    = '#B08422';
              el.style.borderColor   = '#B08422';
              el.style.transform     = 'translateY(-50%) scale(1.08)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.background  = 'rgba(250,249,246,0.92)';
              el.style.borderColor = 'rgba(176,132,34,0.25)';
              el.style.transform   = 'translateY(-50%)';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3 L11 8 L6 13" stroke="#1A1614" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <Slider key={space.id} space={space} />
        </div>

        {/* ── Info + quote ── */}
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
          {/* Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 28, height: 16, borderRadius: 2,
                  background: 'rgba(16,38,80,0.22)',
                  border: '1px solid rgba(140,180,255,0.4)',
                }}
              />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.44rem', letterSpacing: '0.38em', textTransform: 'uppercase', color: '#7A6E60' }}>
                Concept State
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 28, height: 16, borderRadius: 2,
                  background: 'rgba(201,168,76,0.2)',
                  border: '1px solid rgba(201,168,76,0.5)',
                }}
              />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.44rem', letterSpacing: '0.38em', textTransform: 'uppercase', color: '#7A6E60' }}>
                Final Render
              </span>
            </div>
          </div>

          <blockquote
            style={{
              borderRight:  '2px solid #B08422',
              paddingRight: 20,
              textAlign:    'right',
              maxWidth:     380,
              opacity:      entering ? 0 : 1,
              transition:   'opacity 0.26s ease',
            }}
          >
            <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)', color: '#3A2F28', marginBottom: 8 }}>
              "{space.quote}"
            </p>
            <cite style={{ fontFamily: 'var(--font-body)', fontSize: '0.48rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#B08422', fontStyle: 'normal' }}>
              — {space.client}
            </cite>
          </blockquote>
        </div>

        {/* ── Hint ── */}
        <div
          style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            gap:            10,
            marginTop:      20,
            opacity:        revealed ? 0.52 : 0,
            transition:     'opacity 0.9s ease 0.5s',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M4 3.5 L1 7 L4 10.5 M10 3.5 L13 7 L10 10.5" stroke="#B08422" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.46rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#7A6E60' }}>
            Move mouse to compare · Click to lock · Arrows to browse spaces
          </span>
        </div>
      </div>
    </section>
  );
}
