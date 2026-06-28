'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useAdmin } from '@/src/contexts/AdminContext';
import { EditableText } from '@/src/components/admin/EditableText';
import { EditableImage } from '@/src/components/admin/EditableImage';

export function TestimonialsSection() {
  const [active,   setActive]   = useState(0);
  const [fading,   setFading]   = useState(false);
  const [revealed, setRevealed] = useState(false);
  const sectionRef              = useRef<HTMLElement>(null);
  const timerRef                = useRef<ReturnType<typeof setInterval> | null>(null);

  const { isEditMode, content, removeItem, addItem } = useAdmin();
  const testimonials = content.testimonials.items;

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setRevealed(true); },
      { threshold: 0.08 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setActive(a => (a + 1) % testimonials.length);
        setFading(false);
      }, 380);
    }, 6500);
  }, [testimonials.length]);

  const goTo = useCallback((i: number) => {
    setFading(true);
    setTimeout(() => { setActive(i); setFading(false); }, 380);
    startTimer();
  }, [startTimer]);

  useEffect(() => {
    if (isEditMode) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startTimer, isEditMode]);

  const t = testimonials[active] ?? testimonials[0];
  const safeActive = Math.min(active, testimonials.length - 1);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      style={{ position: 'relative', width: '100%', overflow: 'hidden', minHeight: '80vh' }}
    >
      {/* Background */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <EditableImage
          path="testimonials.bgImage"
          src={content.testimonials.bgImage}
          alt="Interior background"
          draggable={false}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,9,8,0.9) 0%, rgba(10,9,8,0.76) 50%, rgba(10,9,8,0.93) 100%)' }} />
      </div>

      {/* Edit mode: all testimonials list */}
      {isEditMode ? (
        <div
          style={{
            position:   'relative',
            zIndex:     10,
            maxWidth:   900,
            margin:     '0 auto',
            padding:    'clamp(60px, 8vw, 100px) clamp(24px, 5vw, 48px)',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 24 }}>
              <div style={{ width: 48, height: 1, background: 'linear-gradient(90deg, transparent, #C9A84C)' }} />
              <EditableText
                path="testimonials.eyebrow"
                as="span"
                style={{ fontFamily: 'var(--font-body)', fontSize: '0.5rem', letterSpacing: '0.55em', textTransform: 'uppercase', color: '#C9A84C' }}
              >
                {content.testimonials.eyebrow}
              </EditableText>
              <div style={{ width: 48, height: 1, background: 'linear-gradient(90deg, #C9A84C, transparent)' }} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(1.8rem, 4vw, 3.5rem)', color: '#F8F4EE', letterSpacing: '-0.025em', lineHeight: 1.1 }}>
              <EditableText path="testimonials.heading" as="span" style={{ display: 'block' }}>
                {content.testimonials.heading}
              </EditableText>
              <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>
                <EditableText path="testimonials.headingGold" as="span">
                  {content.testimonials.headingGold}
                </EditableText>
              </em>
            </h2>
          </div>

          {/* Background image edit */}
          <div style={{ marginBottom: 32, padding: '16px', background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.12)' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.38rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.5)', marginBottom: 10 }}>
              Background Image
            </p>
            <div style={{ position: 'relative', height: 80, overflow: 'hidden' }}>
              <EditableImage
                path="testimonials.bgImage"
                src={content.testimonials.bgImage}
                alt="Background"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
              />
            </div>
          </div>

          {/* Testimonials list */}
          {testimonials.map((tm, i) => (
            <div
              key={i}
              style={{
                background:   'rgba(13,13,13,0.72)',
                border:       '1px solid rgba(201,168,76,0.12)',
                padding:      '28px 32px',
                marginBottom: 20,
                backdropFilter: 'blur(12px)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(201,168,76,0.18)', border: '1px solid rgba(201,168,76,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 500, color: '#C9A84C', flexShrink: 0 }}>
                    <EditableText path={`testimonials.items.${i}.initials`} as="span" style={{ fontSize: '0.85rem', fontFamily: 'var(--font-display)', fontWeight: 500, color: '#C9A84C' }}>
                      {tm.initials}
                    </EditableText>
                  </div>
                  <div>
                    <EditableText path={`testimonials.items.${i}.name`} as="p" style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '0.95rem', color: '#F8F4EE', lineHeight: 1.2, marginBottom: 2 }}>
                      {tm.name}
                    </EditableText>
                    <EditableText path={`testimonials.items.${i}.role`} as="p" style={{ fontFamily: 'var(--font-body)', fontSize: '0.44rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#C9A84C' }}>
                      {tm.role}
                    </EditableText>
                    <EditableText path={`testimonials.items.${i}.project`} as="p" style={{ fontFamily: 'var(--font-body)', fontSize: '0.4rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(248,244,238,0.28)', marginTop: 2 }}>
                      {tm.project}
                    </EditableText>
                  </div>
                </div>
                <button
                  onClick={() => removeItem('testimonials.items', i)}
                  style={{
                    background:    'rgba(220,50,50,0.1)',
                    border:        '1px solid rgba(220,50,50,0.3)',
                    color:         'rgba(220,100,100,0.8)',
                    fontFamily:    'var(--font-body)',
                    fontSize:      '0.38rem',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    padding:       '5px 10px',
                    cursor:        'pointer',
                    flexShrink:    0,
                  }}
                >
                  × Remove
                </button>
              </div>
              <EditableText
                path={`testimonials.items.${i}.quote`}
                as="p"
                multiline
                style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: '1rem', color: 'rgba(248,244,238,0.75)', lineHeight: 1.7, fontStyle: 'italic' }}
              >
                {tm.quote}
              </EditableText>
            </div>
          ))}

          {/* Add testimonial */}
          <button
            onClick={() => addItem('testimonials.items', {
              quote:    'Share your experience with Geosite DEVELOPERS.',
              name:     'Client Name',
              role:     'Role or Title',
              project:  'Project Type · Location',
              initials: 'CN',
            })}
            style={{
              display:       'inline-flex',
              alignItems:    'center',
              gap:           8,
              background:    'rgba(201,168,76,0.08)',
              border:        '1px dashed rgba(201,168,76,0.35)',
              color:         '#C9A84C',
              fontFamily:    'var(--font-body)',
              fontSize:      '0.4rem',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              padding:       '10px 18px',
              cursor:        'pointer',
            }}
          >
            + Add Testimonial
          </button>
        </div>
      ) : (
        /* ── View mode carousel ── */
        <div
          style={{
            position:      'relative',
            zIndex:        10,
            maxWidth:      860,
            margin:        '0 auto',
            padding:       'clamp(80px, 10vw, 140px) clamp(24px, 5vw, 48px)',
            display:       'flex',
            flexDirection: 'column',
            alignItems:    'center',
            textAlign:     'center',
            opacity:       revealed ? 1 : 0,
            transform:     revealed ? 'translateY(0)' : 'translateY(24px)',
            transition:    'opacity 0.9s ease, transform 0.9s ease',
          }}
        >
          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 44 }}>
            <div style={{ width: 48, height: 1, background: 'linear-gradient(90deg, transparent, #C9A84C)' }} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.5rem', letterSpacing: '0.55em', textTransform: 'uppercase', color: '#C9A84C' }}>
              {content.testimonials.eyebrow}
            </span>
            <div style={{ width: 48, height: 1, background: 'linear-gradient(90deg, #C9A84C, transparent)' }} />
          </div>

          {/* Heading */}
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(2rem, 4.5vw, 4.5rem)', color: '#F8F4EE', letterSpacing: '-0.025em', lineHeight: 0.93, marginBottom: 56 }}>
            {content.testimonials.heading}
            <br />
            <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>{content.testimonials.headingGold}</em>
          </h2>

          {/* Quote block */}
          <div
            style={{
              width:      '100%',
              opacity:    fading ? 0 : 1,
              transform:  fading ? 'translateY(8px)' : 'translateY(0)',
              transition: 'opacity 0.38s ease, transform 0.38s ease',
              marginBottom: 44,
            }}
          >
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(4rem, 9vw, 8rem)', color: '#C9A84C', opacity: 0.12, lineHeight: 0.65, marginBottom: 12, userSelect: 'none' }}>
              "
            </div>

            <blockquote style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(1.05rem, 2vw, 1.45rem)', color: 'rgba(248,244,238,0.88)', lineHeight: 1.7, letterSpacing: '0.01em', marginBottom: 36 }}>
              {t?.quote}
            </blockquote>

            {/* Stars */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 28 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} width="13" height="13" viewBox="0 0 13 13" fill="#C9A84C">
                  <path d="M6.5 1 L8.1 4.7 H12.2 L9 7.1 L10.2 11 L6.5 8.7 L2.8 11 L4 7.1 L0.8 4.7 H4.9 Z"/>
                </svg>
              ))}
            </div>

            {/* Client info */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(201,168,76,0.18)', border: '1px solid rgba(201,168,76,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 500, color: '#C9A84C', flexShrink: 0 }}>
                {t?.initials}
              </div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '0.95rem', color: '#F8F4EE', lineHeight: 1.2, marginBottom: 3 }}>
                  {t?.name}
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.46rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: '#C9A84C' }}>
                  {t?.role}
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.42rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(248,244,238,0.28)', marginTop: 3 }}>
                  {t?.project}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <button
              onClick={() => goTo((safeActive - 1 + testimonials.length) % testimonials.length)}
              aria-label="Previous"
              style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(201,168,76,0.3)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.12)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.7)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.3)'; }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 3 L5 7 L9 11" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Review ${i + 1}`}
                  style={{ width: i === safeActive ? 24 : 7, height: 7, borderRadius: 4, background: i === safeActive ? '#C9A84C' : 'rgba(201,168,76,0.22)', border: 'none', padding: 0, cursor: 'pointer', transition: 'width 0.35s ease, background 0.35s ease' }}
                />
              ))}
            </div>

            <button
              onClick={() => goTo((safeActive + 1) % testimonials.length)}
              aria-label="Next"
              style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(201,168,76,0.3)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.12)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.7)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.3)'; }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 3 L9 7 L5 11" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
