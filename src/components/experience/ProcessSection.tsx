'use client';
import { useEffect, useRef, useState } from 'react';
import { useAdmin } from '@/src/contexts/AdminContext';
import { EditableText } from '@/src/components/admin/EditableText';
import { EditableImage } from '@/src/components/admin/EditableImage';
import { useMobile }    from '@/src/hooks/useMobile';

export function ProcessSection() {
  const [active,   setActive]   = useState(0);
  const [revealed, setRevealed] = useState(false);
  const sectionRef              = useRef<HTMLElement>(null);
  const isMobile                = useMobile();
  const { isEditMode, content, removeItem, addItem } = useAdmin();

  const steps = content.process.steps;

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setRevealed(true); },
      { threshold: 0.06 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="process"
      ref={sectionRef}
      style={{ background: '#0B0B09', position: 'relative', overflow: 'hidden' }}
    >
      {/* Very subtle noise texture overlay */}
      <div
        style={{
          position:      'absolute',
          inset:         0,
          pointerEvents: 'none',
          background:    'radial-gradient(ellipse at 80% 20%, rgba(201,168,76,0.04) 0%, transparent 65%)',
        }}
      />

      <div
        style={{
          maxWidth: 1400,
          margin:   '0 auto',
          padding:  'clamp(80px, 10vw, 140px) clamp(24px, 5vw, 80px)',
          position: 'relative',
        }}
      >
        {/* ── Section header ────────────────────────────── */}
        <div
          style={{
            marginBottom: 72,
            opacity:      revealed ? 1 : 0,
            transform:    revealed ? 'translateY(0)' : 'translateY(24px)',
            transition:   'opacity 0.9s ease, transform 0.9s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)' }} />
            <EditableText
              path="process.eyebrow"
              as="span"
              style={{
                fontFamily:    'var(--font-body)',
                fontSize:      '0.52rem',
                letterSpacing: '0.55em',
                textTransform: 'uppercase',
                color:         '#C9A84C',
              }}
            >
              {content.process.eyebrow}
            </EditableText>
          </div>
          <h2
            style={{
              fontFamily:    'var(--font-display)',
              fontWeight:    300,
              fontSize:      'clamp(2.6rem, 5.5vw, 6rem)',
              color:         '#F8F4EE',
              letterSpacing: '-0.03em',
              lineHeight:    0.91,
            }}
          >
            <EditableText path="process.heading" as="span" style={{ display: 'block' }}>
              {content.process.heading}
            </EditableText>
            <br />
            <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>
              <EditableText path="process.headingGold" as="span">
                {content.process.headingGold}
              </EditableText>
            </em>
          </h2>
        </div>

        {/* ── Main grid ─────────────────────────────────── */}
        <div
          style={{
            display:             'grid',
            gridTemplateColumns: (isEditMode || isMobile) ? '1fr' : '1fr 1fr',
            gap:                 isMobile ? 40 : 80,
            alignItems:          'start',
          }}
        >
          {/* ── Left: large numbered list ─────────────── */}
          <div
            style={{
              opacity:    revealed ? 1 : 0,
              transition: 'opacity 0.9s ease 0.18s',
            }}
          >
            {steps.map((step, i) => {
              const isActive = i === active;
              return (
                <div
                  key={i}
                  style={{ position: 'relative', cursor: isEditMode ? 'default' : 'pointer' }}
                  onMouseEnter={() => { if (!isEditMode) setActive(i); }}
                  onClick={() => { if (!isEditMode) setActive(i); }}
                >
                  {/* Top border */}
                  <div style={{ position: 'relative', height: 1, background: 'rgba(248,244,238,0.08)' }}>
                    <div
                      style={{
                        position:   'absolute',
                        top:        0,
                        left:       0,
                        height:     1,
                        width:      isActive ? '100%' : '0%',
                        background: '#C9A84C',
                        transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    />
                  </div>

                  <div style={{ padding: '28px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 20 }}>
                        {/* Number */}
                        <EditableText
                          path={`process.steps.${i}.number`}
                          as="span"
                          style={{
                            fontFamily:    'var(--font-body)',
                            fontSize:      '0.5rem',
                            letterSpacing: '0.38em',
                            textTransform: 'uppercase',
                            color:         '#C9A84C',
                            flexShrink:    0,
                            paddingTop:    4,
                          }}
                        >
                          {step.number}
                        </EditableText>

                        {/* Title */}
                        <EditableText
                          path={`process.steps.${i}.title`}
                          as="h3"
                          style={{
                            fontFamily:    'var(--font-display)',
                            fontWeight:    300,
                            fontSize:      'clamp(2rem, 3.2vw, 4.2rem)',
                            color:         isActive ? '#F8F4EE' : 'rgba(248,244,238,0.18)',
                            lineHeight:    1.02,
                            letterSpacing: '-0.025em',
                            transition:    'color 0.45s ease',
                          }}
                        >
                          {step.title}
                        </EditableText>
                      </div>

                      {/* Expandable description */}
                      <div
                        style={{
                          overflow:   'hidden',
                          maxHeight:  (isActive || isEditMode) ? '260px' : '0px',
                          transition: 'max-height 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                      >
                        {/* Subtitle */}
                        <EditableText
                          path={`process.steps.${i}.subtitle`}
                          as="p"
                          style={{
                            fontFamily:    'var(--font-body)',
                            fontSize:      '0.5rem',
                            letterSpacing: '0.3em',
                            textTransform: 'uppercase',
                            color:         '#C9A84C',
                            marginTop:     14,
                            paddingLeft:   40,
                          }}
                        >
                          {step.subtitle}
                        </EditableText>

                        <EditableText
                          path={`process.steps.${i}.description`}
                          as="p"
                          multiline
                          style={{
                            fontFamily:  'var(--font-body)',
                            fontSize:    '0.82rem',
                            lineHeight:  1.9,
                            color:       'rgba(248,244,238,0.42)',
                            marginTop:   10,
                            paddingLeft: 40,
                            maxWidth:    480,
                          }}
                        >
                          {step.description}
                        </EditableText>

                        {/* Image editor inline — only in edit mode */}
                        {isEditMode && (
                          <div style={{ paddingLeft: 40, marginTop: 16 }}>
                            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.38rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.4)', marginBottom: 8 }}>
                              Step Image
                            </p>
                            <div style={{ position: 'relative', width: 180, height: 110, overflow: 'hidden' }}>
                              <EditableImage
                                path={`process.steps.${i}.image`}
                                src={step.image}
                                alt={step.title}
                                draggable={false}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Delete step button */}
                        {isEditMode && (
                          <button
                            onClick={() => removeItem('process.steps', i)}
                            style={{
                              marginTop:     12,
                              marginLeft:    40,
                              display:       'inline-flex',
                              alignItems:    'center',
                              gap:           6,
                              background:    'rgba(220,50,50,0.1)',
                              border:        '1px solid rgba(220,50,50,0.3)',
                              color:         'rgba(220,100,100,0.8)',
                              fontFamily:    'var(--font-body)',
                              fontSize:      '0.38rem',
                              letterSpacing: '0.3em',
                              textTransform: 'uppercase',
                              padding:       '6px 12px',
                              cursor:        'pointer',
                            }}
                          >
                            × Remove Step
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Arrow */}
                    {!isEditMode && (
                      <span
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize:   '1.25rem',
                          color:      '#C9A84C',
                          opacity:    isActive ? 1 : 0,
                          transform:  isActive ? 'translateX(0)' : 'translateX(-12px)',
                          transition: 'opacity 0.35s ease, transform 0.35s ease',
                          paddingTop: 6,
                          flexShrink: 0,
                        }}
                      >
                        →
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Final border */}
            <div style={{ height: 1, background: 'rgba(248,244,238,0.08)' }} />

            {/* Add Step (edit mode only) */}
            {isEditMode && (
              <button
                onClick={() => addItem('process.steps', {
                  number:      `0${steps.length + 1}`,
                  title:       'New Step',
                  subtitle:    'Step Subtitle',
                  description: 'Describe this step of the design process.',
                  image:       'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=85&auto=format&fit=crop',
                })}
                style={{
                  marginTop:     20,
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
                + Add Step
              </button>
            )}

            {/* CTA */}
            {!isEditMode && (
              <div style={{ marginTop: 44 }}>
                <a
                  href="#footer"
                  style={{
                    display:        'inline-flex',
                    alignItems:     'center',
                    gap:            14,
                    fontFamily:     'var(--font-body)',
                    fontSize:       '0.52rem',
                    letterSpacing:  '0.42em',
                    textTransform:  'uppercase',
                    color:          '#C9A84C',
                    textDecoration: 'none',
                    transition:     'gap 0.3s ease',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.gap = '22px'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.gap = '14px'; }}
                >
                  Start Your Project
                  <span style={{ display: 'block', width: 44, height: 1, background: '#C9A84C' }} />
                </a>
              </div>
            )}
          </div>

          {/* ── Right: sticky image panel (desktop + view mode only) ───── */}
          {!isEditMode && !isMobile && (
            <div
              style={{
                position:   'sticky',
                top:        100,
                overflow:   'hidden',
                aspectRatio:'4/3',
                opacity:    revealed ? 1 : 0,
                transition: 'opacity 0.9s ease 0.35s',
              }}
            >
              {steps.map((step, i) => (
                <img
                  key={i}
                  src={Array.isArray(step.image) ? step.image[0] : step.image}
                  alt={step.title}
                  draggable={false}
                  style={{
                    position:       'absolute',
                    inset:          0,
                    width:          '100%',
                    height:         '100%',
                    objectFit:      'cover',
                    objectPosition: 'center',
                    opacity:        i === active ? 1 : 0,
                    transition:     'opacity 0.75s ease',
                    transform:      i === active ? 'scale(1.02)' : 'scale(1)',
                  }}
                />
              ))}

              {/* Step label overlay */}
              <div
                style={{
                  position:   'absolute',
                  bottom:     0,
                  left:       0,
                  right:      0,
                  padding:    '20px 24px',
                  background: 'linear-gradient(to top, rgba(11,11,9,0.95), transparent)',
                  display:    'flex',
                  alignItems: 'center',
                  gap:        14,
                }}
              >
                <span
                  style={{
                    fontFamily:    'var(--font-display)',
                    fontSize:      '2.2rem',
                    fontWeight:    300,
                    color:         '#C9A84C',
                    lineHeight:    1,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {steps[active]?.number ?? '01'}
                </span>
                <div style={{ width: 1, height: 22, background: 'rgba(201,168,76,0.35)' }} />
                <div>
                  <span
                    style={{
                      fontFamily:    'var(--font-body)',
                      fontSize:      '0.48rem',
                      letterSpacing: '0.4em',
                      textTransform: 'uppercase',
                      color:         '#F8F4EE',
                      opacity:       0.7,
                    }}
                  >
                    {steps[active]?.subtitle ?? ''}
                  </span>
                </div>
              </div>

              {/* Gold corner accent */}
              <div
                style={{
                  position:     'absolute',
                  top:          20,
                  right:        20,
                  width:        40,
                  height:       40,
                  borderBottom: '1px solid rgba(201,168,76,0.4)',
                  borderLeft:   '1px solid rgba(201,168,76,0.4)',
                }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
