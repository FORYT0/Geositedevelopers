'use client';
import { useEffect, useState } from 'react';
import { useAdmin }       from '@/src/contexts/AdminContext';
import { EditableText }   from '@/src/components/admin/EditableText';
import { EditableImage }  from '@/src/components/admin/EditableImage';

function useCountUp(target: number, active: boolean, duration = 2200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return count;
}

function StatBlock({ stat, visible, delay, idx }: {
  stat: { raw: number; suffix: string; label: string };
  visible: boolean; delay: number; idx: number;
}) {
  const { isEditMode, updateField } = useAdmin();
  const count = useCountUp(stat.raw, visible);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(12px)', transition: `opacity 0.9s ease ${delay}s, transform 0.9s ease ${delay}s` }}>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(1.6rem, 3vw, 2.5rem)', color: '#C9A84C', lineHeight: 1, letterSpacing: '-0.01em' }}>
        {isEditMode ? (
          <EditableText path={`landing.stats.${idx}.raw`} as="span" style={{ color: '#C9A84C', fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(1.6rem, 3vw, 2.5rem)' }}>
            {String(stat.raw)}
          </EditableText>
        ) : count}
        <EditableText path={`landing.stats.${idx}.suffix`} as="span" style={{ color: '#C9A84C' }}>
          {stat.suffix}
        </EditableText>
      </span>
      <EditableText path={`landing.stats.${idx}.label`} as="span" style={{ fontFamily: 'var(--font-body)', fontSize: '0.44rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: 'rgba(248,244,238,0.5)' }}>
        {stat.label}
      </EditableText>
    </div>
  );
}

export function LandingSection() {
  const { content } = useAdmin();
  const { heroImages, headline, tagline, stats, ctaPrimary, ctaSecondary, eyebrow } = content.landing;

  const [imgIndex, setImgIndex] = useState(0);
  const [mounted,  setMounted]  = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setImgIndex(i => (i + 1) % heroImages.length), 6000);
    return () => clearInterval(id);
  }, [heroImages.length]);

  const clipReveal = (delay: number, extra?: React.CSSProperties): [React.CSSProperties, React.CSSProperties] => [
    { display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' },
    { display: 'inline-block', transform: mounted ? 'translateY(0)' : 'translateY(105%)', transition: `transform 1.1s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`, ...extra },
  ];

  const fadeIn = (delay: number): React.CSSProperties => ({
    opacity:    mounted ? 1 : 0,
    transform:  mounted ? 'translateY(0)' : 'translateY(18px)',
    transition: `opacity 0.9s ease ${delay}s, transform 0.9s ease ${delay}s`,
  });

  return (
    <section id="landing" style={{ position: 'relative', width: '100%', height: '100vh', minHeight: 640, overflow: 'hidden' }}>

      {/* ── Background images ── */}
      {heroImages.map((src, i) => (
        <div key={i} style={{ position: 'absolute', inset: 0, opacity: i === imgIndex ? 1 : 0, transition: 'opacity 1.8s ease', zIndex: i === imgIndex ? 1 : 0 }}>
          <EditableImage
            path={`landing.heroImages.${i}`}
            src={src}
            alt="Geosite DEVELOPERS Interior Design"
            draggable={false}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>
      ))}

      {/* ── Overlay ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'linear-gradient(to bottom, rgba(8,8,8,0.55) 0%, rgba(8,8,8,0.15) 38%, rgba(8,8,8,0.82) 100%)' }} />

      {/* ── Hero content ── */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 24px', paddingBottom: '130px' }}>

        {/* Eyebrow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 36, ...fadeIn(0.1) }}>
          <div style={{ width: 50, height: 1, background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)' }} />
          <EditableText path="landing.eyebrow" as="span" style={{ fontFamily: 'var(--font-body)', fontSize: '0.5rem', letterSpacing: '0.55em', textTransform: 'uppercase', color: '#C9A84C' }}>
            {eyebrow}
          </EditableText>
          <div style={{ width: 50, height: 1, background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)' }} />
        </div>

        {/* Headline */}
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(4rem, 10vw, 11rem)', color: '#F8F4EE', letterSpacing: '-0.03em', lineHeight: 0.9, marginBottom: 28 }}>
          {headline.map((item, i) => {
            const delay = 0.28 + i * 0.14;
            const [wrapStyle, innerStyle] = clipReveal(delay, item.gold ? { color: '#C9A84C', fontStyle: 'italic' } : undefined);
            return (
              <span key={i}>
                {item.break && <br />}
                {item.break && ' '}
                <span style={wrapStyle}>
                  <EditableText
                    path={`landing.headline.${i}.text`}
                    as="span"
                    style={innerStyle}
                  >
                    {item.text}
                  </EditableText>
                </span>
                {!item.break && i < headline.length - 1 && ' '}
              </span>
            );
          })}
        </h1>

        {/* Tagline */}
        <EditableText
          path="landing.tagline"
          as="p"
          multiline
          style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: 'clamp(0.7rem, 1.1vw, 0.88rem)', color: 'rgba(248,244,238,0.62)', letterSpacing: '0.1em', lineHeight: 2, maxWidth: 520, marginBottom: 48, ...fadeIn(0.75) }}
        >
          {tagline}
        </EditableText>

        {/* CTAs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', ...fadeIn(0.9) }}>
          <a href="#portfolio" style={{ display: 'inline-block', padding: '15px 44px', fontFamily: 'var(--font-body)', fontSize: '0.52rem', letterSpacing: '0.42em', textTransform: 'uppercase', fontWeight: 500, background: '#C9A84C', color: '#0D0D0D', textDecoration: 'none', transition: 'background 0.3s ease' }} onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#E8C97A')} onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#C9A84C')}>
            <EditableText path="landing.ctaPrimary" as="span">{ctaPrimary}</EditableText>
          </a>
          <a href="#process" style={{ display: 'inline-block', padding: '15px 44px', fontFamily: 'var(--font-body)', fontSize: '0.52rem', letterSpacing: '0.42em', textTransform: 'uppercase', fontWeight: 500, border: '1px solid rgba(248,244,238,0.38)', color: 'rgba(248,244,238,0.82)', textDecoration: 'none', transition: 'border-color 0.3s ease, color 0.3s ease' }} onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#C9A84C'; el.style.color = '#C9A84C'; }} onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(248,244,238,0.38)'; el.style.color = 'rgba(248,244,238,0.82)'; }}>
            <EditableText path="landing.ctaSecondary" as="span">{ctaSecondary}</EditableText>
          </a>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div style={{ position: 'absolute', bottom: 40, left: 0, right: 0, zIndex: 4, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', padding: '0 32px' }}>
        {stats.map((stat, i) => (
          <div key={i} style={{ padding: '0 44px', borderLeft: i > 0 ? '1px solid rgba(201,168,76,0.22)' : 'none' }}>
            <StatBlock stat={stat} visible={mounted} delay={1.1 + i * 0.12} idx={i} />
          </div>
        ))}
      </div>

      {/* ── Image dots ── */}
      <div style={{ position: 'absolute', right: 48, top: '50%', transform: 'translateY(-50%)', zIndex: 4, display: 'flex', flexDirection: 'column', gap: 10, opacity: mounted ? 1 : 0, transition: 'opacity 1s ease 1.3s' }}>
        {heroImages.map((_, i) => (
          <button key={i} onClick={() => setImgIndex(i)} aria-label={`Image ${i + 1}`} style={{ width: 2, height: i === imgIndex ? 34 : 12, background: i === imgIndex ? '#C9A84C' : 'rgba(201,168,76,0.3)', border: 'none', padding: 0, cursor: 'pointer', borderRadius: 1, transition: 'height 0.4s ease, background 0.4s ease' }} />
        ))}
      </div>

      {/* ── Scroll cue ── */}
      <div style={{ position: 'absolute', bottom: 40, left: 48, zIndex: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: mounted ? 0.45 : 0, transition: 'opacity 1s ease 1.6s' }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.44rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: 'rgba(248,244,238,0.6)', writingMode: 'vertical-rl' }}>Scroll</span>
        <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, rgba(201,168,76,0.6), transparent)' }} />
      </div>
    </section>
  );
}
