'use client';
import { useState } from 'react';
import { useAdmin }      from '@/src/contexts/AdminContext';
import { EditableText }  from '@/src/components/admin/EditableText';
import { EditableImage } from '@/src/components/admin/EditableImage';
import { useMobile }     from '@/src/hooks/useMobile';

/* ─── Static link groups (labels editable via EditableText) ── */
const FOOTER_LINK_GROUPS = ['Studio', 'Explore', 'Services'] as const;
const FOOTER_LINK_DEFAULTS: Record<string, string[]> = {
  Studio:   ['About Us', 'Our Team', 'Design Careers', 'Press & Awards'],
  Explore:  ['Portfolio', 'BIM Projects', 'Style Guide', 'Design Blog'],
  Services: ['Interior Design', '3D Visualisation', 'BIM Modelling', 'Project Management'],
};

const TRUSTED_BY = [
  'Architectural Digest Africa',
  'Business Daily Kenya',
  'Design Indaba',
  'African Architecture Matters',
];

/* ─── Footer Link ───────────────────────────────────────────── */
function FooterLink({ label }: { label: string }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href="#"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display:        'flex',
        alignItems:     'center',
        gap:            10,
        fontFamily:     'var(--font-body)',
        fontSize:       '0.82rem',
        fontWeight:     300,
        color:          hov ? '#C9A84C' : 'rgba(248,244,238,0.3)',
        textDecoration: 'none',
        transition:     'color 0.25s ease',
      }}
    >
      <span
        style={{
          display:    'inline-block',
          width:      hov ? 18 : 8,
          height:     1,
          background: '#C9A84C',
          flexShrink: 0,
          opacity:    hov ? 1 : 0.28,
          transition: 'width 0.3s ease, opacity 0.3s ease',
        }}
      />
      {label}
    </a>
  );
}

/* ─── Main Component ────────────────────────────────────────── */
export function FooterSection() {
  const [email,     setEmail]     = useState('');
  const [submitted, setSubmitted] = useState(false);
  const isMobile = useMobile();
  const { isAdmin, openLogin, toggleEditMode, isEditMode, content } = useAdmin();

  const fc = content.footer;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <footer
      id="footer"
      style={{ position: 'relative', width: '100%', overflow: 'hidden', background: '#060606', borderTop: '1px solid rgba(201,168,76,0.08)' }}
    >

      {/* ── CTA Banner ──────────────────────────────────────────── */}
      <div style={{ position: 'relative', overflow: 'hidden', minHeight: '62vh' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <EditableImage
            path="footer.ctaImage"
            src={fc.ctaImage}
            alt="Geosite DEVELOPERS project"
            draggable={false}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>
        <div
          style={{
            position:   'absolute',
            inset:      0,
            background: 'linear-gradient(90deg, rgba(6,6,6,0.97) 0%, rgba(6,6,6,0.86) 52%, rgba(6,6,6,0.4) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Content row */}
        <div
          style={{
            position:       'relative',
            zIndex:         10,
            maxWidth:       1400,
            margin:         '0 auto',
            padding:        'clamp(56px, 10vw, 120px) clamp(24px, 5vw, 80px)',
            display:        'flex',
            alignItems:     'flex-start',
            justifyContent: 'space-between',
            gap:            isMobile ? 36 : 64,
            flexWrap:       'wrap',
          }}
        >
          {/* Left: headline */}
          <div style={{ maxWidth: 560 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
              <div style={{ width: 40, height: 1, background: 'linear-gradient(90deg, transparent, #C9A84C)' }} />
              <EditableText
                path="footer.ctaEyebrow"
                as="span"
                style={{ fontFamily: 'var(--font-body)', fontSize: '0.48rem', letterSpacing: '0.55em', textTransform: 'uppercase', color: '#C9A84C' }}
              >
                {fc.ctaEyebrow}
              </EditableText>
            </div>
            <h2
              style={{
                fontFamily:    'var(--font-display)',
                fontWeight:    300,
                fontSize:      'clamp(2.4rem, 5.5vw, 5.5rem)',
                color:         '#F8F4EE',
                letterSpacing: '-0.025em',
                lineHeight:    0.9,
                marginBottom:  28,
              }}
            >
              <EditableText
                path="footer.ctaHeading"
                as="span"
                multiline
                style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 300, color: '#F8F4EE' }}
              >
                {fc.ctaHeading}
              </EditableText>
            </h2>
            <EditableText
              path="footer.ctaBody"
              as="p"
              multiline
              style={{
                fontFamily:   'var(--font-body)',
                fontSize:     '0.95rem',
                color:        'rgba(248,244,238,0.45)',
                lineHeight:   1.9,
                marginBottom: 40,
                maxWidth:     400,
              }}
            >
              {fc.ctaBody}
            </EditableText>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <a
                href={`mailto:${fc.contactEmail}`}
                style={{
                  display:       'inline-flex',
                  alignItems:    'center',
                  gap:           10,
                  padding:       '16px 32px',
                  fontFamily:    'var(--font-body)',
                  fontSize:      '0.44rem',
                  letterSpacing: '0.4em',
                  textTransform: 'uppercase',
                  fontWeight:    500,
                  background:    '#C9A84C',
                  color:         '#060606',
                  textDecoration:'none',
                  transition:    'background 0.3s ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#E8C97A'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#C9A84C'; }}
              >
                Begin a Conversation
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6h8M6.5 2.5L10 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a
                href={`tel:${fc.contactPhone.replace(/\s/g,'')}`}
                style={{
                  display:       'inline-flex',
                  alignItems:    'center',
                  gap:           10,
                  padding:       '16px 32px',
                  fontFamily:    'var(--font-body)',
                  fontSize:      '0.44rem',
                  letterSpacing: '0.4em',
                  textTransform: 'uppercase',
                  border:        '1px solid rgba(248,244,238,0.2)',
                  color:         'rgba(248,244,238,0.6)',
                  textDecoration:'none',
                  transition:    'border-color 0.3s ease, color 0.3s ease',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = '#C9A84C';
                  el.style.color       = '#C9A84C';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'rgba(248,244,238,0.2)';
                  el.style.color       = 'rgba(248,244,238,0.6)';
                }}
              >
                Call Us
              </a>
            </div>
          </div>

          {/* Right: contact card */}
          <div
            style={{
              background:    'rgba(13,13,13,0.55)',
              border:        '1px solid rgba(201,168,76,0.12)',
              backdropFilter:'blur(24px)',
              padding:       'clamp(28px, 3.5vw, 40px)',
              display:       'flex',
              flexDirection: 'column',
              gap:           22,
              minWidth:      isMobile ? 0 : 260,
              width:         isMobile ? '100%' : undefined,
              flexShrink:    0,
            }}
          >
            <h4
              style={{
                fontFamily:    'var(--font-body)',
                fontSize:      '0.42rem',
                letterSpacing: '0.5em',
                textTransform: 'uppercase',
                color:         '#C9A84C',
                marginBottom:  4,
              }}
            >
              Contact Us
            </h4>

            {/* Location */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <span style={{ marginTop: 3, flexShrink: 0 }}>
                <svg viewBox="0 0 16 16" fill="none" width="13" height="13" stroke="rgba(201,168,76,0.7)" strokeWidth="1.35" strokeLinecap="round">
                  <path d="M8 1.5 A4 4 0 1 1 8 9.5"/><path d="M8 9.5 L8 14.5"/>
                  <line x1="6" y1="14.5" x2="10" y2="14.5"/>
                  <circle cx="8" cy="5.5" r="1.3" fill="rgba(201,168,76,0.5)" stroke="none"/>
                </svg>
              </span>
              <div>
                <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.38rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.42)', marginBottom: 4 }}>Location</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 300, color: 'rgba(248,244,238,0.52)' }}>Nairobi, Kenya</span>
              </div>
            </div>

            {/* Email */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <span style={{ marginTop: 3, flexShrink: 0 }}>
                <svg viewBox="0 0 16 16" fill="none" width="13" height="13" stroke="rgba(201,168,76,0.7)" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1.5" y="3.5" width="13" height="9" rx="1.5"/>
                  <path d="M1.5 5 L8 9 L14.5 5"/>
                </svg>
              </span>
              <div>
                <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.38rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.42)', marginBottom: 4 }}>Email</span>
                <EditableText
                  path="footer.contactEmail"
                  as="span"
                  style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 300, color: 'rgba(248,244,238,0.52)' }}
                >
                  {fc.contactEmail}
                </EditableText>
              </div>
            </div>

            {/* Phone */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <span style={{ marginTop: 3, flexShrink: 0 }}>
                <svg viewBox="0 0 16 16" fill="none" width="13" height="13" stroke="rgba(201,168,76,0.7)" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 2 H5.5 L7 5 L5.5 6.5 C6.5 8.5 7.5 9.5 9.5 10.5 L11 9 L14 10.5 V13.5 Q11.5 15.5 8.5 13 Q4.5 10.5 2.5 6.5 Q1.5 4 2.5 2 Z"/>
                </svg>
              </span>
              <div>
                <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.38rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.42)', marginBottom: 4 }}>Phone</span>
                <EditableText
                  path="footer.contactPhone"
                  as="span"
                  style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 300, color: 'rgba(248,244,238,0.52)' }}
                >
                  {fc.contactPhone}
                </EditableText>
              </div>
            </div>

            {/* Hours */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <span style={{ marginTop: 3, flexShrink: 0 }}>
                <svg viewBox="0 0 16 16" fill="none" width="13" height="13" stroke="rgba(201,168,76,0.7)" strokeWidth="1.35" strokeLinecap="round">
                  <circle cx="8" cy="8" r="6"/>
                  <path d="M8 4.5 V8 L10.5 10"/>
                </svg>
              </span>
              <div>
                <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.38rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.42)', marginBottom: 4 }}>Hours</span>
                <EditableText
                  path="footer.contactHours"
                  as="span"
                  style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 300, color: 'rgba(248,244,238,0.52)' }}
                >
                  {fc.contactHours}
                </EditableText>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Marquee ─────────────────────────────────────────────── */}
      <div
        style={{
          overflow:    'hidden',
          padding:     '18px 0',
          borderTop:   '1px solid rgba(201,168,76,0.07)',
          borderBottom:'1px solid rgba(201,168,76,0.07)',
        }}
      >
        <div className="marquee-track">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              style={{
                display:       'flex',
                alignItems:    'center',
                gap:           32,
                padding:       '0 32px',
                fontFamily:    'var(--font-body)',
                fontSize:      '0.44rem',
                letterSpacing: '0.5em',
                textTransform: 'uppercase',
                color:         'rgba(201,168,76,0.28)',
                whiteSpace:    'nowrap',
              }}
            >
              <span>Geosite DEVELOPERS</span>
              <span style={{ color: 'rgba(201,168,76,0.1)' }}>◇</span>
              <span>Interior Design Studio</span>
              <span style={{ color: 'rgba(201,168,76,0.1)' }}>◇</span>
              <span>Nairobi, Kenya</span>
              <span style={{ color: 'rgba(201,168,76,0.1)' }}>◇</span>
              <span>Est. 2018</span>
              <span style={{ color: 'rgba(201,168,76,0.1)' }}>◇</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Main Footer Grid ────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 1400,
          margin:   '0 auto',
          padding:  'clamp(64px, 8vw, 96px) clamp(32px, 5vw, 80px)',
        }}
      >
        <div
          style={{
            display:             'grid',
            gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr 1fr',
            gap:                 isMobile ? 40 : 'clamp(40px, 5vw, 80px)',
            marginBottom:        'clamp(48px, 6vw, 72px)',
            alignItems:          'start',
          }}
        >
          {/* Brand column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div>
              <span
                style={{
                  display:       'block',
                  fontFamily:    'var(--font-body)',
                  fontSize:      '0.44rem',
                  letterSpacing: '0.5em',
                  textTransform: 'uppercase',
                  fontWeight:    500,
                  color:         '#C9A84C',
                  marginBottom:  6,
                }}
              >
                Geosite
              </span>
              <span
                style={{
                  display:       'block',
                  fontFamily:    'var(--font-display)',
                  fontSize:      'clamp(1.5rem, 2.5vw, 2rem)',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  fontWeight:    300,
                  color:         '#F8F4EE',
                }}
              >
                Developers
              </span>
            </div>

            <EditableText
              path="footer.tagline"
              as="p"
              multiline
              style={{
                fontFamily: 'var(--font-display)',
                fontStyle:  'italic',
                fontWeight: 300,
                fontSize:   'clamp(0.88rem, 1.2vw, 1rem)',
                color:      'rgba(248,244,238,0.22)',
                lineHeight: 1.7,
                maxWidth:   280,
              }}
            >
              {fc.tagline}
            </EditableText>

            <div style={{ width: 48, height: 1, background: 'linear-gradient(90deg, #C9A84C, transparent)' }} />

            {/* Newsletter */}
            <div>
              <EditableText
                path="footer.newsletterLabel"
                as="span"
                style={{
                  display:       'block',
                  fontFamily:    'var(--font-body)',
                  fontSize:      '0.38rem',
                  letterSpacing: '0.45em',
                  textTransform: 'uppercase',
                  color:         'rgba(201,168,76,0.4)',
                  marginBottom:  14,
                }}
              >
                {fc.newsletterLabel}
              </EditableText>
              {submitted ? (
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: '#C9A84C' }}>
                  ✓ Thank you — we&apos;ll be in touch.
                </p>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex' }}>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    style={{
                      flex:        1,
                      padding:     '12px 16px',
                      fontFamily:  'var(--font-body)',
                      fontSize:    '0.8rem',
                      background:  'transparent',
                      border:      '1px solid rgba(201,168,76,0.18)',
                      borderRight: 'none',
                      color:       'rgba(248,244,238,0.65)',
                      outline:     'none',
                      minWidth:    0,
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding:       '12px 20px',
                      fontFamily:    'var(--font-body)',
                      fontSize:      '0.38rem',
                      letterSpacing: '0.35em',
                      textTransform: 'uppercase',
                      background:    '#C9A84C',
                      color:         '#060606',
                      border:        'none',
                      cursor:        'pointer',
                      fontWeight:    500,
                      flexShrink:    0,
                      transition:    'background 0.3s ease',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#E8C97A'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#C9A84C'; }}
                  >
                    Join
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_LINK_GROUPS.map(group => (
            <div key={group} style={{ display: 'flex', flexDirection: 'column' }}>
              <h4
                style={{
                  fontFamily:    'var(--font-body)',
                  fontSize:      '0.42rem',
                  letterSpacing: '0.5em',
                  textTransform: 'uppercase',
                  color:         '#C9A84C',
                  marginBottom:  20,
                  paddingBottom: 16,
                  borderBottom:  '1px solid rgba(201,168,76,0.1)',
                }}
              >
                {group}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {FOOTER_LINK_DEFAULTS[group].map(link => (
                  <FooterLink key={link} label={link} />
                ))}

                {/* Admin login button — only in Studio column */}
                {group === 'Studio' && (
                  <div style={{ marginTop: 8, paddingTop: 16, borderTop: '1px solid rgba(201,168,76,0.08)' }}>
                    {isAdmin ? (
                      <button
                        onClick={toggleEditMode}
                        style={{
                          display:       'flex',
                          alignItems:    'center',
                          gap:           8,
                          background:    'none',
                          border:        '1px solid rgba(201,168,76,0.25)',
                          padding:       '8px 14px',
                          cursor:        'pointer',
                          fontFamily:    'var(--font-body)',
                          fontSize:      '0.38rem',
                          letterSpacing: '0.38em',
                          textTransform: 'uppercase',
                          color:         isEditMode ? '#C9A84C' : 'rgba(201,168,76,0.45)',
                          transition:    'color 0.25s ease, border-color 0.25s ease',
                        }}
                        onMouseEnter={e => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.color       = '#C9A84C';
                          el.style.borderColor = 'rgba(201,168,76,0.55)';
                        }}
                        onMouseLeave={e => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.color       = isEditMode ? '#C9A84C' : 'rgba(201,168,76,0.45)';
                          el.style.borderColor = 'rgba(201,168,76,0.25)';
                        }}
                      >
                        <svg viewBox="0 0 14 14" fill="none" width="11" height="11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10 6H4V10.5H10V6Z"/>
                          <path d="M5 6V4.5a2 2 0 1 1 4 0V6"/>
                        </svg>
                        {isEditMode ? 'Editing On' : 'Edit Mode'}
                      </button>
                    ) : (
                      <button
                        onClick={openLogin}
                        style={{
                          display:       'flex',
                          alignItems:    'center',
                          gap:           8,
                          background:    'none',
                          border:        'none',
                          padding:       0,
                          cursor:        'pointer',
                          fontFamily:    'var(--font-body)',
                          fontSize:      '0.38rem',
                          letterSpacing: '0.38em',
                          textTransform: 'uppercase',
                          color:         'rgba(201,168,76,0.22)',
                          transition:    'color 0.25s ease',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(201,168,76,0.6)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(201,168,76,0.22)'; }}
                      >
                        <svg viewBox="0 0 14 14" fill="none" width="11" height="11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10 6H4V10.5H10V6Z"/>
                          <path d="M5 6V4.5a2 2 0 1 1 4 0V6"/>
                        </svg>
                        Admin Login
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Trusted by */}
        <div style={{ borderTop: '1px solid rgba(201,168,76,0.07)', paddingTop: 28, marginBottom: 28 }}>
          <span
            style={{
              display:       'block',
              fontFamily:    'var(--font-body)',
              fontSize:      '0.38rem',
              letterSpacing: '0.5em',
              textTransform: 'uppercase',
              color:         'rgba(201,168,76,0.22)',
              marginBottom:  18,
            }}
          >
            Featured &amp; Trusted By
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px 36px' }}>
            {TRUSTED_BY.map(name => (
              <span
                key={name}
                style={{
                  fontFamily:    'var(--font-body)',
                  fontSize:      '0.44rem',
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color:         'rgba(248,244,238,0.14)',
                }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
            flexWrap:       'wrap',
            gap:            16,
            paddingTop:     24,
            borderTop:      '1px solid rgba(201,168,76,0.07)',
          }}
        >
          <EditableText
            path="footer.copyright"
            as="span"
            style={{
              fontFamily:    'var(--font-body)',
              fontSize:      '0.42rem',
              letterSpacing: '0.18em',
              color:         'rgba(201,168,76,0.18)',
            }}
          >
            {fc.copyright}
          </EditableText>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            {['Terms & Support', 'Privacy Policy', 'Cookie Policy'].map(link => (
              <a
                key={link}
                href="#"
                style={{
                  fontFamily:    'var(--font-body)',
                  fontSize:      '0.42rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color:         'rgba(201,168,76,0.18)',
                  textDecoration:'none',
                  transition:    'color 0.25s ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#C9A84C'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(201,168,76,0.18)'; }}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
