'use client';
import { useEffect, useRef, useState } from 'react';
import { useAdmin }      from '@/src/contexts/AdminContext';
import { EditableText }  from '@/src/components/admin/EditableText';
import { EditableImage } from '@/src/components/admin/EditableImage';

/* ─── SVG icons (unchanged) ─────────────────────────────────── */
const HOTSPOT_ICONS: Record<string, React.ReactElement> = {
  sofa: (
    <svg viewBox="0 0 22 22" fill="none" width="18" height="18" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="16" height="8" rx="1.5"/>
      <path d="M3 11.5 V9.5 Q3 7 1.5 7 V15"/>
      <path d="M19 11.5 V9.5 Q19 7 20.5 7 V15"/>
      <line x1="5" y1="16" x2="5" y2="19"/>
      <line x1="17" y1="16" x2="17" y2="19"/>
    </svg>
  ),
  lighting: (
    <svg viewBox="0 0 22 22" fill="none" width="18" height="18" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round">
      <path d="M8.5 3.5 Q11 2 13.5 3.5 L12 10 H10 Z"/>
      <line x1="11" y1="10" x2="11" y2="17"/>
      <line x1="8" y1="17" x2="14" y2="17"/>
      <ellipse cx="11" cy="19.5" rx="3" ry="1" strokeOpacity="0.4"/>
    </svg>
  ),
  'coffee-table': (
    <svg viewBox="0 0 22 22" fill="none" width="18" height="18" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round">
      <rect x="2" y="8.5" width="18" height="4" rx="1"/>
      <line x1="5" y1="12.5" x2="5" y2="18"/>
      <line x1="17" y1="12.5" x2="17" y2="18"/>
    </svg>
  ),
  art: (
    <svg viewBox="0 0 22 22" fill="none" width="18" height="18" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round">
      <rect x="2.5" y="3" width="17" height="15" rx="1"/>
      <rect x="5" y="5.5" width="12" height="9" rx="0.5" strokeOpacity="0.45"/>
      <path d="M5 11.5 L8 8.5 L10.5 11 L13.5 7.5 L17 11.5" strokeOpacity="0.7"/>
    </svg>
  ),
  plant: (
    <svg viewBox="0 0 22 22" fill="none" width="18" height="18" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round">
      <line x1="11" y1="19" x2="11" y2="10"/>
      <path d="M11 15 Q8 12 5 13 Q6.5 8.5 11 11"/>
      <path d="M11 12.5 Q14 9.5 17 10.5 Q15.5 6 11 9.5"/>
      <line x1="8.5" y1="19" x2="13.5" y2="19"/>
    </svg>
  ),
  rug: (
    <svg viewBox="0 0 22 22" fill="none" width="18" height="18" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round">
      <rect x="2" y="6" width="18" height="10" rx="1"/>
      <rect x="5" y="9" width="12" height="4" rx="0.5" strokeOpacity="0.45"/>
      <line x1="2" y1="9" x2="5" y2="9"/><line x1="17" y1="9" x2="20" y2="9"/>
      <line x1="2" y1="13" x2="5" y2="13"/><line x1="17" y1="13" x2="20" y2="13"/>
    </svg>
  ),
};

/* ─── Component ──────────────────────────────────────────────── */
export function SuiteSection() {
  const { content, isEditMode, updateField, removeItem, addItem } = useAdmin();
  const { elements, sectionEyebrow, sectionTitle, sectionTitleGold, sectionSubtitle } = content.suite;

  const sectionRef               = useRef<HTMLElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [revealed,  setRevealed]  = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setRevealed(true); }, { threshold: 0.05 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const active = elements[Math.min(activeIdx, elements.length - 1)];

  return (
    <section id="suite" ref={sectionRef} style={{ background: '#080806', width: '100%', position: 'relative', overflow: 'hidden' }}>

      {/* ── Header ── */}
      <div style={{ padding: 'clamp(64px, 7vw, 96px) clamp(32px, 5vw, 80px) 0', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32, opacity: revealed ? 1 : 0, transform: revealed ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.7s ease, transform 0.7s ease' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
            <div style={{ width: 40, height: 1, background: 'linear-gradient(90deg, transparent, #C9A84C)' }} />
            <EditableText path="suite.sectionEyebrow" as="span" style={{ fontFamily: 'var(--font-body)', fontSize: '0.48rem', letterSpacing: '0.55em', textTransform: 'uppercase', color: '#C9A84C' }}>
              {sectionEyebrow}
            </EditableText>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(2.2rem, 4vw, 4.2rem)', color: '#F8F4EE', letterSpacing: '-0.025em', lineHeight: 0.93 }}>
            <EditableText path="suite.sectionTitle" as="span">{sectionTitle}</EditableText>
            {' '}
            <EditableText path="suite.sectionTitleGold" as="em" style={{ color: '#C9A84C', fontStyle: 'italic' }}>{sectionTitleGold}</EditableText>
          </h2>
        </div>
        <EditableText path="suite.sectionSubtitle" as="p" multiline style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'rgba(248,244,238,0.32)', lineHeight: 1.85, maxWidth: 300, textAlign: 'right' }}>
          {sectionSubtitle}
        </EditableText>
      </div>

      {/* ── 2-column grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '55% 45%', minHeight: '82vh', marginTop: 40 }}>

        {/* Left: image cross-fade */}
        <div style={{ position: 'relative', overflow: 'hidden', minHeight: 520 }}>
          {elements.map((el, i) => (
            <div key={el.id} style={{ position: 'absolute', inset: 0, opacity: i === activeIdx ? 1 : 0, transition: 'opacity 0.75s ease' }}>
              <EditableImage
                path={`suite.elements.${i}.image`}
                src={el.image}
                alt={el.label}
                draggable={false}
                style={{
                  position: 'absolute', inset: 0, width: '100%', height: '100%',
                  objectFit: 'cover', objectPosition: 'center',
                  transform: i === activeIdx ? (revealed ? 'scale(1)' : 'scale(1.05)') : 'scale(1.04)',
                  transition: 'transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                }}
              />
            </div>
          ))}

          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 50%, rgba(8,8,6,0.55) 100%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,8,6,0.65) 0%, transparent 45%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(8,8,6,0.5) 0%, transparent 30%)', pointerEvents: 'none' }} />

          <div style={{ position: 'absolute', bottom: 0, left: 0, fontFamily: 'var(--font-display)', fontSize: 'clamp(9rem, 18vw, 16rem)', fontWeight: 300, color: 'rgba(201,168,76,0.07)', lineHeight: 0.78, letterSpacing: '-0.06em', userSelect: 'none', paddingLeft: 28, pointerEvents: 'none' }}>
            0{activeIdx + 1}
          </div>

          {active && (
            <div style={{ position: 'absolute', bottom: 44, left: 44, opacity: revealed ? 1 : 0, transform: revealed ? 'translateY(0)' : 'translateY(12px)', transition: 'opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s' }}>
              <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.42rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 10 }}>{active.category}</span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(1.6rem, 3vw, 2.6rem)', color: '#F8F4EE', lineHeight: 1.05, letterSpacing: '-0.02em' }}>{active.label}</h3>
            </div>
          )}
        </div>

        {/* Right: element list */}
        <div style={{ background: '#080806', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(48px, 5vw, 72px) clamp(32px, 4vw, 60px)', borderLeft: '1px solid rgba(248,244,238,0.04)' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.44rem', letterSpacing: '0.45em', textTransform: 'uppercase', color: 'rgba(248,244,238,0.2)', marginBottom: 32, opacity: revealed ? 1 : 0, transition: 'opacity 0.6s ease' }}>
            {isEditMode ? 'Click text to edit · Click images to replace' : 'Hover to explore'}
          </p>

          <div style={{ borderTop: '1px solid rgba(248,244,238,0.07)' }}>
            {elements.map((el, i) => {
              const isActive = i === activeIdx;
              return (
                <div
                  key={el.id}
                  onMouseEnter={() => setActiveIdx(i)}
                  onClick={() => setActiveIdx(i)}
                  style={{ borderBottom: '1px solid rgba(248,244,238,0.07)', padding: '18px 0', cursor: 'pointer', opacity: revealed ? 1 : 0, transform: revealed ? 'translateY(0)' : 'translateY(14px)', transition: `opacity 0.55s ease ${i * 65}ms, transform 0.55s ease ${i * 65}ms`, position: 'relative' }}
                >
                  {/* Admin: delete */}
                  {isEditMode && (
                    <button
                      onClick={e => { e.stopPropagation(); removeItem('suite.elements', i); if (activeIdx >= elements.length - 1) setActiveIdx(Math.max(0, elements.length - 2)); }}
                      style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,60,60,0.12)', border: '1px solid rgba(255,60,60,0.3)', color: 'rgba(255,100,100,0.7)', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5 }}
                    >×</button>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.4rem', letterSpacing: '0.4em', color: isActive ? '#C9A84C' : 'rgba(201,168,76,0.22)', transition: 'color 0.3s ease', minWidth: 22, flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}</span>
                    <span style={{ color: isActive ? '#C9A84C' : 'rgba(248,244,238,0.16)', transition: 'color 0.3s ease', flexShrink: 0, display: 'flex', alignItems: 'center' }}>{HOTSPOT_ICONS[el.icon] ?? HOTSPOT_ICONS['sofa']}</span>
                    <EditableText path={`suite.elements.${i}.label`} as="span" style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(0.95rem, 1.6vw, 1.3rem)', color: isActive ? '#F8F4EE' : 'rgba(248,244,238,0.2)', transition: 'color 0.3s ease', flex: 1, letterSpacing: '-0.01em' }}>
                      {el.label}
                    </EditableText>
                    <EditableText path={`suite.elements.${i}.category`} as="span" style={{ fontFamily: 'var(--font-body)', fontSize: '0.37rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: isActive ? 'rgba(201,168,76,0.65)' : 'rgba(248,244,238,0.08)', transition: 'color 0.3s ease', flexShrink: 0 }}>
                      {el.category}
                    </EditableText>
                  </div>

                  {/* Expanding detail */}
                  <div style={{ maxHeight: isActive ? '130px' : '0', overflow: 'hidden', transition: 'max-height 0.5s cubic-bezier(0.4,0,0.2,1)', paddingLeft: 36 }}>
                    <EditableText path={`suite.elements.${i}.description`} as="p" multiline style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'rgba(248,244,238,0.4)', lineHeight: 1.85, marginTop: 12, marginBottom: 8 }}>
                      {el.description}
                    </EditableText>
                    <EditableText path={`suite.elements.${i}.material`} as="span" style={{ fontFamily: 'var(--font-body)', fontSize: '0.38rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.45)' }}>
                      {el.material}
                    </EditableText>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Admin: add element */}
          {isEditMode && (
            <button
              onClick={() => addItem('suite.elements', { id: `elem-${Date.now()}`, icon: 'sofa', label: 'New Element', category: 'Furniture', description: 'Description of this design element.', material: 'Material · Specification', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400&q=90&auto=format&fit=crop' })}
              style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8, padding: '12px 0', background: 'transparent', border: 'none', borderTop: '1px dashed rgba(201,168,76,0.25)', color: '#C9A84C', fontFamily: 'var(--font-body)', fontSize: '0.42rem', letterSpacing: '0.4em', textTransform: 'uppercase', cursor: 'pointer' }}
            >
              <span style={{ fontSize: 16 }}>+</span> Add Element
            </button>
          )}

          {/* CTA */}
          <a href="#footer" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 36, fontFamily: 'var(--font-body)', fontSize: '0.44rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#C9A84C', textDecoration: 'none', opacity: revealed ? 1 : 0, transition: 'opacity 0.6s ease 0.5s' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#E8C97A'; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#C9A84C'; }}>
            <div style={{ width: 28, height: 1, background: '#C9A84C' }} />
            Begin a project conversation
          </a>
        </div>
      </div>
    </section>
  );
}
