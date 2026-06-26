'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

const PROJECTS = [
  {
    id: 'living',
    label: 'Living Room',
    location: 'Westlands, Nairobi',
    before: 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=1200&q=80',
    after:  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80',
    quote: 'Geosite transformed our bare walls into a warm sanctuary.',
    client: 'Amara K.',
  },
  {
    id: 'bedroom',
    label: 'Master Bedroom',
    location: 'Karen, Nairobi',
    before: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    after:  'https://images.unsplash.com/photo-1616594039964-40891a9093ca?w=1200&q=80',
    quote: 'We never imagined our bedroom could feel this luxurious.',
    client: 'James & Wanjiru N.',
  },
  {
    id: 'kitchen',
    label: 'Kitchen',
    location: 'Runda, Nairobi',
    before: 'https://images.unsplash.com/photo-1556909211-36987daf7b4d?w=1200&q=80',
    after:  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80',
    quote: 'Cooking became a joy in our new Geosite kitchen.',
    client: 'Chef Kariuki',
  },
];

function Slider({ project }: { project: typeof PROJECTS[0] }) {
  const containerRef  = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(50);
  const dragging      = useRef(false);

  const getPercent = useCallback((clientX: number) => {
    if (!containerRef.current) return 50;
    const rect = containerRef.current.getBoundingClientRect();
    return Math.max(3, Math.min(97, ((clientX - rect.left) / rect.width) * 100));
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
  };
  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging.current) return;
    setPct(getPercent(e.clientX));
  }, [getPercent]);
  const onMouseUp = useCallback(() => { dragging.current = false; }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    dragging.current = true;
  };
  const onTouchMove = useCallback((e: TouchEvent) => {
    if (!dragging.current) return;
    setPct(getPercent(e.touches[0].clientX));
  }, [getPercent]);
  const onTouchEnd = useCallback(() => { dragging.current = false; }, []);

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [onMouseMove, onMouseUp, onTouchMove, onTouchEnd]);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-2xl select-none"
      style={{ aspectRatio: '16/9', cursor: 'col-resize', touchAction: 'none' }}
      onMouseDown={(e) => {
        dragging.current = true;
        setPct(getPercent(e.clientX));
      }}
      onTouchStart={(e) => {
        dragging.current = true;
        setPct(getPercent(e.touches[0].clientX));
      }}
    >
      {/* BEFORE image */}
      <img
        src={project.before}
        alt="Before"
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* AFTER image — clipped */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}
      >
        <img
          src={project.after}
          alt="After"
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {/* Before label */}
      <div
        className="absolute top-5 left-5 px-4 py-2 rounded-full text-[9px] tracking-[0.4em] uppercase font-body"
        style={{
          background: 'rgba(13,13,13,0.75)',
          border: '1px solid rgba(255,255,255,0.15)',
          color: 'rgba(248,244,238,0.7)',
          backdropFilter: 'blur(8px)',
          opacity: pct < 85 ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      >
        Before
      </div>

      {/* After label */}
      <div
        className="absolute top-5 right-5 px-4 py-2 rounded-full text-[9px] tracking-[0.4em] uppercase font-body"
        style={{
          background: 'rgba(13,13,13,0.75)',
          border: '1px solid rgba(201,168,76,0.35)',
          color: 'var(--gold-light)',
          backdropFilter: 'blur(8px)',
          opacity: pct > 15 ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      >
        After
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-px pointer-events-none"
        style={{
          left: `${pct}%`,
          background: 'rgba(255,255,255,0.9)',
          boxShadow: '0 0 12px rgba(255,255,255,0.4)',
        }}
      />

      {/* Drag handle */}
      <button
        onMouseDown={onMouseDown}
        onTouchStart={(e) => { dragging.current = true; }}
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center rounded-full z-10"
        style={{
          left: `${pct}%`,
          width: 48,
          height: 48,
          background: 'rgba(255,255,255,0.95)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
          cursor: 'col-resize',
          border: 'none',
        }}
        aria-label="Drag to compare"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M7 5l-4 5 4 5M13 5l4 5-4 5" stroke="#0D0D0D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}

export function BeforeAfterSection() {
  const [active, setActive]     = useState(0);
  const [revealed, setRevealed] = useState(false);
  const sectionRef              = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setRevealed(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const proj = PROJECTS[active];

  return (
    <section
      id="before-after"
      ref={sectionRef}
      className="relative w-full py-32 md:py-40 overflow-hidden"
      style={{ background: 'var(--charcoal)' }}
    >
      <div className="max-w-[1400px] mx-auto px-8 md:px-16">

        {/* Header */}
        <div
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.9s ease, transform 0.9s ease',
          }}
        >
          <div>
            <div className="flex items-center gap-4 mb-5">
              <div className="gold-line" />
              <span
                className="text-[9px] tracking-[0.55em] uppercase font-body"
                style={{ color: 'var(--gold)' }}
              >
                Project Transformations
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
              See the
              <br />
              <em style={{ color: 'var(--gold-light)', fontStyle: 'italic' }}>Difference</em>
            </h2>
          </div>

          {/* Project tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            {PROJECTS.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setActive(i)}
                className="px-5 py-2.5 text-[9px] tracking-[0.35em] uppercase font-body font-medium transition-all duration-300 rounded-full"
                style={{
                  background: i === active ? 'var(--gold)' : 'transparent',
                  color: i === active ? '#0D0D0D' : 'var(--text-muted)',
                  border: i === active ? '1px solid var(--gold)' : '1px solid var(--border)',
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
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s',
          }}
        >
          <Slider key={proj.id} project={proj} />
        </div>

        {/* Project info + quote */}
        <div
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mt-8"
          style={{
            opacity: revealed ? 1 : 0,
            transition: 'opacity 0.9s ease 0.4s',
          }}
        >
          <div>
            <p
              className="text-[8px] tracking-[0.45em] uppercase font-body mb-1"
              style={{ color: 'var(--gold)' }}
            >
              {proj.location}
            </p>
            <h3
              className="font-display font-light"
              style={{ fontSize: 'clamp(1.2rem, 2vw, 1.8rem)', color: 'var(--warm-white)' }}
            >
              {proj.label} Transformation
            </h3>
          </div>

          <blockquote
            className="max-w-sm text-right"
            style={{ borderRight: '2px solid var(--gold)', paddingRight: 20 }}
          >
            <p
              className="font-display italic font-light mb-2"
              style={{ fontSize: 'clamp(1rem, 1.5vw, 1.2rem)', color: 'rgba(248,244,238,0.75)' }}
            >
              "{proj.quote}"
            </p>
            <cite
              className="text-[8px] tracking-[0.4em] uppercase font-body not-italic"
              style={{ color: 'var(--gold)' }}
            >
              — {proj.client}
            </cite>
          </blockquote>
        </div>

        {/* Drag hint */}
        <div
          className="flex items-center justify-center gap-3 mt-6"
          style={{
            opacity: revealed ? 0.5 : 0,
            transition: 'opacity 0.9s ease 0.6s',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M5 4l-3 4 3 4M11 4l3 4-3 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold)' }}/>
          </svg>
          <span className="text-[8px] tracking-[0.4em] uppercase font-body" style={{ color: 'var(--text-muted)' }}>
            Drag to compare
          </span>
        </div>
      </div>
    </section>
  );
}
