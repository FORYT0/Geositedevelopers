'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useAdmin } from '@/src/contexts/AdminContext';
import { EditableText } from '@/src/components/admin/EditableText';
import { EditableImage } from '@/src/components/admin/EditableImage';
import type { BeforeAfterSpace } from '@/src/lib/site-content';

/* ─── Slider ─────────────────────────────────────────────────── */
function Slider({ space }: { space: BeforeAfterSpace }) {
  const containerRef        = useRef<HTMLDivElement>(null);
  const [pct, setPct]       = useState(50);
  const [locked, setLocked] = useState(false);
  const lockedRef           = useRef(false);

  const getPercent = useCallback((clientX: number) => {
    if (!containerRef.current) return 50;
    const rect = containerRef.current.getBoundingClientRect();
    return Math.max(3, Math.min(97, ((clientX - rect.left) / rect.width) * 100));
  }, []);

  useEffect(() => { lockedRef.current = locked; }, [locked]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (!e.isIntersecting) setLocked(false); },
      { threshold: 0.05 }
    );
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

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
      onTouchStart={e => { setPct(getPercent(e.touches[0].clientX)); }}
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
      {/* BEFORE */}
      <img
        src={space.before}
        alt="3D Model — Before"
        draggable={false}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
      />

      {/* AFTER */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', clipPath: `inset(0 ${100 - pct}% 0 0)` }}>
        <img
          src={space.after}
          alt="Photorealistic Render — After"
          draggable={false}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
      </div>

      {/* Before label */}
      <div style={{ position: 'absolute', top: 20, left: 20, padding: '7px 16px', fontFamily: 'var(--font-body)', fontSize: '0.48rem', letterSpacing: '0.42em', textTransform: 'uppercase', background: 'rgba(22,22,22,0.72)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(248,244,238,0.78)', backdropFilter: 'blur(8px)', opacity: pct < 88 ? 1 : 0, transition: 'opacity 0.3s ease', pointerEvents: 'none' }}>
        3D Model
      </div>

      {/* After label */}
      <div style={{ position: 'absolute', top: 20, right: 20, padding: '7px 16px', fontFamily: 'var(--font-body)', fontSize: '0.48rem', letterSpacing: '0.42em', textTransform: 'uppercase', background: 'rgba(10,10,10,0.72)', border: '1px solid rgba(201,168,76,0.45)', color: '#C9A84C', backdropFilter: 'blur(8px)', opacity: pct > 12 ? 1 : 0, transition: 'opacity 0.3s ease', pointerEvents: 'none' }}>
        Final Render
      </div>

      {/* Lock indicator */}
      {locked && (
        <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', padding: '6px 14px', fontFamily: 'var(--font-body)', fontSize: '0.44rem', letterSpacing: '0.4em', textTransform: 'uppercase', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.4)', color: '#C9A84C', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', gap: 8, pointerEvents: 'none' }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <rect x="2" y="4" width="6" height="5" rx="0.5" stroke="#C9A84C" strokeWidth="1"/>
            <path d="M3.5 4 V3 A1.5 1.5 0 0 1 6.5 3 V4" stroke="#C9A84C" strokeWidth="1"/>
          </svg>
          Click to unlock
        </div>
      )}

      {/* Divider */}
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${pct}%`, width: 1, background: 'rgba(255,255,255,0.92)', boxShadow: '0 0 14px rgba(255,255,255,0.45)', pointerEvents: 'none' }} />

      {/* Handle */}
      <div style={{ position: 'absolute', top: '50%', left: `${pct}%`, transform: 'translate(-50%, -50%)', width: 46, height: 46, borderRadius: '50%', background: 'rgba(255,255,255,0.97)', boxShadow: '0 4px 24px rgba(0,0,0,0.32)', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
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

  const { isEditMode, content, removeItem, addItem } = useAdmin();
  const spaces = content.beforeAfter.spaces;

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
    goTo((active - 1 + spaces.length) % spaces.length);
  };

  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    goTo((active + 1) % spaces.length);
  };

  const safeActive = Math.min(active, spaces.length - 1);
  const space = spaces[safeActive] ?? spaces[0];

  /* ── Edit mode: show all spaces as a list ── */
  if (isEditMode) {
    return (
      <section
        id="before-after"
        ref={sectionRef}
        style={{ position: 'relative', width: '100%', background: '#F2EDE6', overflow: 'hidden', padding: 'clamp(64px, 8vw, 120px) 0' }}
      >
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 clamp(24px, 5vw, 64px)' }}>

          {/* Section header edit */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, transparent, #B08422, transparent)' }} />
              <EditableText
                path="beforeAfter.eyebrow"
                as="span"
                style={{ fontFamily: 'var(--font-body)', fontSize: '0.52rem', letterSpacing: '0.55em', textTransform: 'uppercase', color: '#B08422' }}
              >
                {content.beforeAfter.eyebrow}
              </EditableText>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(2.4rem, 5vw, 5rem)', color: '#1A1614', letterSpacing: '-0.02em', lineHeight: 0.93 }}>
              <EditableText path="beforeAfter.heading" as="span">
                {content.beforeAfter.heading}
              </EditableText>
              <br />
              <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>
                <EditableText path="beforeAfter.headingGold" as="span">
                  {content.beforeAfter.headingGold}
                </EditableText>
              </em>
            </h2>
          </div>

          {/* Spaces list */}
          {spaces.map((sp, i) => (
            <div
              key={i}
              style={{
                background:   'rgba(255,255,255,0.7)',
                border:       '1px solid rgba(176,132,34,0.15)',
                marginBottom: 28,
                padding:      '24px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <EditableText
                    path={`beforeAfter.spaces.${i}.label`}
                    as="p"
                    style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(1.2rem, 2vw, 1.8rem)', color: '#1A1614', letterSpacing: '-0.01em' }}
                  >
                    {sp.label}
                  </EditableText>
                  <EditableText
                    path={`beforeAfter.spaces.${i}.location`}
                    as="p"
                    style={{ fontFamily: 'var(--font-body)', fontSize: '0.46rem', letterSpacing: '0.42em', textTransform: 'uppercase', color: '#B08422' }}
                  >
                    {sp.location}
                  </EditableText>
                </div>
                <button
                  onClick={() => removeItem('beforeAfter.spaces', i)}
                  style={{ background: 'rgba(220,50,50,0.1)', border: '1px solid rgba(220,50,50,0.3)', color: 'rgba(220,80,80,0.8)', fontFamily: 'var(--font-body)', fontSize: '0.38rem', letterSpacing: '0.3em', textTransform: 'uppercase', padding: '5px 10px', cursor: 'pointer', flexShrink: 0 }}
                >
                  × Remove
                </button>
              </div>

              {/* Before/After image editors */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.38rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(176,132,34,0.6)', marginBottom: 8 }}>Before (3D Model)</p>
                  <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
                    <EditableImage
                      path={`beforeAfter.spaces.${i}.before`}
                      src={sp.before}
                      alt="Before"
                      draggable={false}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                    />
                  </div>
                </div>
                <div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.38rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(176,132,34,0.6)', marginBottom: 8 }}>After (Final Render)</p>
                  <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
                    <EditableImage
                      path={`beforeAfter.spaces.${i}.after`}
                      src={sp.after}
                      alt="After"
                      draggable={false}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                    />
                  </div>
                </div>
              </div>

              {/* Quote / client */}
              <div style={{ borderTop: '1px solid rgba(176,132,34,0.12)', paddingTop: 16 }}>
                <EditableText
                  path={`beforeAfter.spaces.${i}.quote`}
                  as="p"
                  multiline
                  style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(0.88rem, 1.3vw, 1rem)', color: '#3A2F28', marginBottom: 8 }}
                >
                  {sp.quote}
                </EditableText>
                <EditableText
                  path={`beforeAfter.spaces.${i}.client`}
                  as="span"
                  style={{ fontFamily: 'var(--font-body)', fontSize: '0.46rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#B08422' }}
                >
                  {sp.client}
                </EditableText>
              </div>
            </div>
          ))}

          {/* Add space */}
          <button
            onClick={() => addItem('beforeAfter.spaces', {
              id:       `space-${Date.now()}`,
              label:    'New Project',
              location: 'Project Type · Location',
              before:   '/renders/NOVA Atelica Reception rhino.png',
              after:    '/renders/NOVA Atelica Reception render 1.png',
              quote:    'Client testimonial quote goes here.',
              client:   'Client Name',
            })}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(201,168,76,0.08)', border: '1px dashed rgba(176,132,34,0.35)', color: '#B08422', fontFamily: 'var(--font-body)', fontSize: '0.4rem', letterSpacing: '0.4em', textTransform: 'uppercase', padding: '10px 18px', cursor: 'pointer' }}
          >
            + Add Project
          </button>
        </div>
      </section>
    );
  }

  /* ── View mode ── */
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
            display:        'flex',
            flexWrap:       'wrap',
            alignItems:     'flex-end',
            justifyContent: 'space-between',
            gap:            32,
            marginBottom:   40,
            opacity:        revealed ? 1 : 0,
            transform:      revealed ? 'translateY(0)' : 'translateY(24px)',
            transition:     'opacity 0.9s ease, transform 0.9s ease',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, transparent, #B08422, transparent)' }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.52rem', letterSpacing: '0.55em', textTransform: 'uppercase', color: '#B08422' }}>
                {content.beforeAfter.eyebrow}
              </span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(2.4rem, 5vw, 5rem)', color: '#1A1614', letterSpacing: '-0.02em', lineHeight: 0.93 }}>
              {content.beforeAfter.heading}
              <br />
              <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>{content.beforeAfter.headingGold}</em>
            </h2>
          </div>

          {/* Space label + counter + pips */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.46rem', letterSpacing: '0.42em', textTransform: 'uppercase', color: '#B08422' }}>
              {space.location}
            </p>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(1.2rem, 2.5vw, 2rem)', color: '#1A1614', letterSpacing: '-0.01em', opacity: entering ? 0 : 1, transform: entering ? 'translateY(8px)' : 'translateY(0)', transition: 'opacity 0.26s ease, transform 0.26s ease' }}>
              {space.label}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
              {spaces.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Space ${i + 1}`}
                  style={{ width: i === safeActive ? 22 : 6, height: 6, borderRadius: 3, background: i === safeActive ? '#B08422' : 'rgba(176,132,34,0.22)', border: 'none', padding: 0, cursor: 'pointer', transition: 'width 0.35s ease, background 0.35s ease' }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Slider + edge arrows ── */}
        <div
          style={{
            position:   'relative',
            opacity:    revealed ? (entering ? 0.55 : 1) : 0,
            transform:  revealed ? 'translateY(0)' : 'translateY(32px)',
            transition: 'opacity 0.3s ease, transform 0.9s ease 0.18s',
          }}
        >
          {/* LEFT arrow */}
          <button
            onClick={goPrev}
            aria-label="Previous project"
            style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 20, width: 52, height: 52, borderRadius: '50%', background: 'rgba(250,249,246,0.95)', border: '1px solid rgba(176,132,34,0.25)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.14)', transition: 'background 0.25s ease, border-color 0.25s ease, transform 0.25s ease', marginLeft: -26 }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#B08422'; el.style.borderColor = '#B08422'; el.style.transform = 'translateY(-50%) scale(1.08)'; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(250,249,246,0.95)'; el.style.borderColor = 'rgba(176,132,34,0.25)'; el.style.transform = 'translateY(-50%)'; }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3 L5 8 L10 13" stroke="#1A1614" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* RIGHT arrow */}
          <button
            onClick={goNext}
            aria-label="Next project"
            style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 20, width: 52, height: 52, borderRadius: '50%', background: 'rgba(250,249,246,0.95)', border: '1px solid rgba(176,132,34,0.25)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.14)', transition: 'background 0.25s ease, border-color 0.25s ease, transform 0.25s ease', marginRight: -26 }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#B08422'; el.style.borderColor = '#B08422'; el.style.transform = 'translateY(-50%) scale(1.08)'; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(250,249,246,0.95)'; el.style.borderColor = 'rgba(176,132,34,0.25)'; el.style.transform = 'translateY(-50%)'; }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3 L11 8 L6 13" stroke="#1A1614" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <Slider key={space.id} space={space} />
        </div>

        {/* ── Info strip ── */}
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
          {/* Legend chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 16, borderRadius: 2, background: 'rgba(30,30,30,0.18)', border: '1px solid rgba(255,255,255,0.3)' }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.44rem', letterSpacing: '0.38em', textTransform: 'uppercase', color: '#7A6E60' }}>3D Model</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 16, borderRadius: 2, background: 'rgba(201,168,76,0.18)', border: '1px solid rgba(201,168,76,0.5)' }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.44rem', letterSpacing: '0.38em', textTransform: 'uppercase', color: '#7A6E60' }}>Final Render</span>
            </div>
          </div>

          {/* Quote */}
          <blockquote
            style={{
              borderRight:  '2px solid #B08422',
              paddingRight: 20,
              textAlign:    'right',
              maxWidth:     400,
              opacity:      entering ? 0 : 1,
              transition:   'opacity 0.26s ease',
            }}
          >
            <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)', color: '#3A2F28', marginBottom: 8 }}>
              &ldquo;{space.quote}&rdquo;
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
            Drag to compare · Click to lock · Arrows to browse projects
          </span>
        </div>
      </div>
    </section>
  );
}
