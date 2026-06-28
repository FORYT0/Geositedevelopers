'use client';
import { useEffect, useRef, useState } from 'react';
import { useAdmin }      from '@/src/contexts/AdminContext';
import { EditableText }  from '@/src/components/admin/EditableText';
import { EditableImage } from '@/src/components/admin/EditableImage';
import type { ServiceItem } from '@/src/lib/site-content';

/* ─── Service row ───────────────────────────────────────────── */
function ServiceRow({ service, revealed, index }: { service: ServiceItem; revealed: boolean; index: number }) {
  const { isEditMode, updateField, removeItem } = useAdmin();
  const [hovered, setHovered] = useState(false);
  const delay = 0.1 + index * 0.08;

  return (
    <div
      style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, minHeight: '540px', opacity: revealed ? 1 : 0, transform: revealed ? 'translateY(0)' : 'translateY(40px)', transition: `opacity 0.9s ease ${delay}s, transform 0.9s ease ${delay}s`, position: 'relative' }}
    >
      {/* Photo panel */}
      <div style={{ order: service.flip ? 2 : 1, position: 'relative', overflow: 'hidden' }}>
        <EditableImage
          path={`services.items.${index}.image`}
          src={service.image}
          alt={service.title}
          draggable={false}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', transform: hovered ? 'scale(1.04)' : 'scale(1)', transition: 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,8,6,0.22)' }} />
        <div style={{ position: 'absolute', top: 32, left: service.flip ? 'auto' : 32, right: service.flip ? 32 : 'auto', fontFamily: 'var(--font-display)', fontSize: 'clamp(4rem, 8vw, 9rem)', fontWeight: 300, color: 'rgba(248,244,238,0.07)', lineHeight: 1, letterSpacing: '-0.05em', userSelect: 'none', pointerEvents: 'none' }}>
          {service.number}
        </div>
        <div style={{ position: 'absolute', bottom: 28, left: service.flip ? 'auto' : 28, right: service.flip ? 28 : 'auto', width: 44, height: 44, borderBottom: '1px solid rgba(201,168,76,0.55)', borderLeft: service.flip ? 'none' : '1px solid rgba(201,168,76,0.55)', borderRight: service.flip ? '1px solid rgba(201,168,76,0.55)' : 'none' }} />
      </div>

      {/* Content panel */}
      <div
        style={{ order: service.flip ? 1 : 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(48px, 6vw, 96px) clamp(32px, 5vw, 72px)', background: '#0A0908', position: 'relative' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Admin: remove button */}
        {isEditMode && (
          <button
            onClick={() => removeItem('services.items', index)}
            title="Remove this service"
            style={{ position: 'absolute', top: 16, right: 16, width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,60,60,0.15)', border: '1px solid rgba(255,60,60,0.4)', color: 'rgba(255,100,100,0.8)', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}
          >×</button>
        )}

        {/* Eyebrow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
          <div style={{ width: 30, height: 1, background: '#C9A84C', opacity: 0.6 }} />
          <EditableText path={`services.items.${index}.eyebrow`} as="span" style={{ fontFamily: 'var(--font-body)', fontSize: '0.47rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: '#C9A84C' }}>
            {service.eyebrow}
          </EditableText>
        </div>

        {/* Title */}
        <EditableText path={`services.items.${index}.title`} as="h3" style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(2.2rem, 4vw, 4.5rem)', color: '#F8F4EE', letterSpacing: '-0.03em', lineHeight: 0.95, marginBottom: 16 }}>
          {service.title}
        </EditableText>

        {/* Subtitle */}
        <EditableText path={`services.items.${index}.subtitle`} as="p" style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'rgba(201,168,76,0.75)', letterSpacing: '0.04em', marginBottom: 28, lineHeight: 1.5 }}>
          {service.subtitle}
        </EditableText>

        <div style={{ width: '100%', height: 1, background: 'rgba(248,244,238,0.07)', marginBottom: 28 }} />

        {/* Description */}
        <EditableText path={`services.items.${index}.description`} as="p" multiline style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'rgba(248,244,238,0.48)', lineHeight: 1.9, marginBottom: 36, maxWidth: 480 }}>
          {service.description}
        </EditableText>

        {/* Features */}
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 44px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {service.features.map((feat, fi) => (
            <li key={fi} style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'rgba(248,244,238,0.55)', lineHeight: 1.5 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                <path d="M2 7 L5.5 10.5 L12 3.5" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <EditableText path={`services.items.${index}.features.${fi}`} as="span" style={{ color: 'rgba(248,244,238,0.55)', fontFamily: 'var(--font-body)', fontSize: '0.78rem' }}>
                {feat}
              </EditableText>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div>
          <a href="#footer" style={{ display: 'inline-flex', alignItems: 'center', gap: 14, fontFamily: 'var(--font-body)', fontSize: '0.5rem', letterSpacing: '0.42em', textTransform: 'uppercase', color: '#C9A84C', textDecoration: 'none', transition: 'gap 0.3s ease' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.gap = '22px'; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.gap = '14px'; }}>
            Enquire About This Service
            <span style={{ display: 'block', width: 44, height: 1, background: '#C9A84C' }} />
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── Main export ───────────────────────────────────────────── */
export function ServicesSection() {
  const { content, isEditMode, addItem } = useAdmin();
  const { items, sectionEyebrow, sectionTitle, sectionTitleGold, sectionSubtitle } = content.services;
  const [revealed, setRevealed] = useState(false);
  const sectionRef              = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setRevealed(true); }, { threshold: 0.04 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const handleAddService = () => {
    addItem('services.items', {
      id:          `service-${Date.now()}`,
      number:      String(items.length + 1).padStart(2, '0'),
      eyebrow:     'New Category',
      title:       'New Service',
      subtitle:    'Brief description of this service',
      description: 'Detailed description of what this service entails and the value it provides to clients.',
      features:    ['Feature one', 'Feature two', 'Feature three'],
      image:       'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1400&q=85&auto=format&fit=crop',
      flip:        items.length % 2 !== 0,
    });
  };

  return (
    <section id="services" ref={sectionRef} style={{ background: '#0A0908', position: 'relative', overflow: 'hidden' }}>

      {/* Section header */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: 'clamp(80px, 10vw, 130px) clamp(24px, 5vw, 80px) clamp(56px, 7vw, 80px)', opacity: revealed ? 1 : 0, transform: revealed ? 'translateY(0)' : 'translateY(24px)', transition: 'opacity 0.9s ease, transform 0.9s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)' }} />
          <EditableText path="services.sectionEyebrow" as="span" style={{ fontFamily: 'var(--font-body)', fontSize: '0.52rem', letterSpacing: '0.55em', textTransform: 'uppercase', color: '#C9A84C' }}>
            {sectionEyebrow}
          </EditableText>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 40, flexWrap: 'wrap' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(2.6rem, 5.5vw, 6rem)', color: '#F8F4EE', letterSpacing: '-0.03em', lineHeight: 0.91 }}>
            <EditableText path="services.sectionTitle" as="span">{sectionTitle}</EditableText>
            <br />
            <EditableText path="services.sectionTitleGold" as="em" style={{ color: '#C9A84C', fontStyle: 'italic' }}>
              {sectionTitleGold}
            </EditableText>
          </h2>
          <EditableText path="services.sectionSubtitle" as="p" multiline style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'rgba(248,244,238,0.38)', lineHeight: 1.9, maxWidth: 420, paddingBottom: 8 }}>
            {sectionSubtitle}
          </EditableText>
        </div>
      </div>

      {/* Service rows */}
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {items.map((service, i) => (
          <div key={service.id} style={{ borderTop: '1px solid rgba(248,244,238,0.06)' }}>
            <ServiceRow service={service} revealed={revealed} index={i} />
          </div>
        ))}

        {/* Admin: add service */}
        {isEditMode && (
          <div style={{ borderTop: '1px solid rgba(248,244,238,0.06)', padding: '24px', display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={handleAddService}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 32px', background: 'transparent', border: '1px dashed rgba(201,168,76,0.4)', color: '#C9A84C', fontFamily: 'var(--font-body)', fontSize: '0.44rem', letterSpacing: '0.4em', textTransform: 'uppercase', cursor: 'pointer', transition: 'border-color 0.2s ease, background 0.2s ease' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#C9A84C'; el.style.background = 'rgba(201,168,76,0.06)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(201,168,76,0.4)'; el.style.background = 'transparent'; }}
            >
              <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Add Service
            </button>
          </div>
        )}
      </div>

      {/* Bottom CTA strip */}
      <div style={{ borderTop: '1px solid rgba(248,244,238,0.06)', padding: 'clamp(48px, 6vw, 80px) clamp(24px, 5vw, 80px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap', maxWidth: 1400, margin: '0 auto', opacity: revealed ? 1 : 0, transition: 'opacity 0.9s ease 0.5s' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.48rem', letterSpacing: '0.48em', textTransform: 'uppercase', color: 'rgba(248,244,238,0.3)', marginBottom: 10 }}>Not sure where to start?</p>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 3vw, 2.5rem)', fontWeight: 300, color: '#F8F4EE', letterSpacing: '-0.02em' }}>Let's talk about your project.</p>
        </div>
        <a href="#footer" style={{ display: 'inline-block', padding: '18px 52px', fontFamily: 'var(--font-body)', fontSize: '0.5rem', letterSpacing: '0.42em', textTransform: 'uppercase', fontWeight: 500, background: '#C9A84C', color: '#0D0D0D', textDecoration: 'none', transition: 'background 0.3s ease', flexShrink: 0 }} onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#E8C97A')} onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#C9A84C')}>
          Start a Conversation
        </a>
      </div>
    </section>
  );
}
