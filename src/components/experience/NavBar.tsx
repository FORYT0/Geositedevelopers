'use client';
import { useEffect, useState } from 'react';
import { useTheme } from '@/src/hooks/useTheme';
import { useAdmin } from '@/src/contexts/AdminContext';
import { EditableText } from '@/src/components/admin/EditableText';

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [liveTime, setLiveTime] = useState('');
  const { toggle, isDark }      = useTheme();
  const { isEditMode, content } = useAdmin();

  const links = content.nav.links;

  // Live Nairobi time
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const dd  = String(now.getUTCDate() + Math.floor((now.getUTCHours() + 3) / 24)).padStart(2, '0');
      const mm  = String(now.getUTCMonth() + 1).padStart(2, '0');
      const yy  = String(now.getUTCFullYear()).slice(2);
      const h   = now.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Nairobi' });
      setLiveTime(`NBI · ${dd}.${mm}.${yy} · ${h}`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const logoText  = scrolled ? (isDark ? '#F8F4EE' : '#1A1614') : '#F8F4EE';
  const linkColor = scrolled ? (isDark ? 'rgba(248,244,238,0.55)' : '#7A6E60') : 'rgba(248,244,238,0.75)';
  const navBg     = scrolled
    ? isDark ? 'rgba(13,13,13,0.96)' : 'rgba(250,249,246,0.96)'
    : 'transparent';

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[100]"
      style={{
        background:     navBg,
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom:   scrolled ? `1px solid ${isDark ? 'rgba(201,168,76,0.1)' : 'rgba(176,132,34,0.12)'}` : 'none',
        transition:     'background 0.5s ease, backdrop-filter 0.5s ease, border-color 0.5s ease',
      }}
    >
      <div className="max-w-[1600px] mx-auto px-8 md:px-16 h-[72px] flex items-center justify-between">

        {/* Logo */}
        <a href="#landing" style={{ display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none' }}>
          <svg viewBox="0 0 34 34" width="30" height="30" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }} aria-hidden="true">
            <path d="M17 3 L31 11 L17 19 L3 11 Z" stroke="#C9A84C" strokeWidth="1.3"/>
            <path d="M3 11 L3 23 L17 31 L17 19 Z" stroke="#C9A84C" strokeWidth="1.3"/>
            <path d="M31 11 L31 23 L17 31 L17 19 Z" stroke="#C9A84C" strokeWidth="1.3" strokeOpacity="0.45"/>
          </svg>
          <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.46rem', letterSpacing: '0.52em', textTransform: 'uppercase', fontWeight: 500, color: '#C9A84C', transition: 'color 0.4s ease' }}>
              Geosite
            </span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 300, color: logoText, transition: 'color 0.4s ease', marginTop: 2 }}>
              Developers
            </span>
          </span>
        </a>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-10">
          {links.map((l, i) => (
            <li key={i}>
              {isEditMode ? (
                <EditableText
                  path={`nav.links.${i}.label`}
                  as="span"
                  className="text-[9px] tracking-[0.28em] uppercase font-body font-medium"
                  style={{ color: linkColor }}
                >
                  {l.label}
                </EditableText>
              ) : (
                <a
                  href={l.href}
                  className="text-[9px] tracking-[0.28em] uppercase font-body font-medium relative group"
                  style={{ color: linkColor, transition: 'color 0.3s ease' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#C9A84C')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = linkColor)}
                >
                  {l.label}
                  <span
                    className="absolute -bottom-1 left-0 h-px w-0 group-hover:w-full transition-all duration-300"
                    style={{ background: '#C9A84C' }}
                  />
                </a>
              )}
            </li>
          ))}
        </ul>

        {/* Live timestamp */}
        <span
          className="hidden lg:block text-[7px] tracking-[0.35em] uppercase font-body"
          style={{ color: scrolled ? (isDark ? 'rgba(248,244,238,0.3)' : 'rgba(26,22,20,0.35)') : 'rgba(248,244,238,0.35)', transition: 'color 0.4s ease' }}
        >
          {liveTime}
        </span>

        {/* Right controls */}
        <div className="hidden md:flex items-center gap-4">
          {/* Theme toggle */}
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300"
            style={{ border: `1px solid ${scrolled ? 'rgba(176,132,34,0.25)' : 'rgba(201,168,76,0.35)'}`, background: 'transparent', color: '#C9A84C', fontSize: 15 }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.12)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
          >
            {isDark ? '☀' : '☾'}
          </button>

          {/* Enquire CTA */}
          {isEditMode ? (
            <EditableText
              path="nav.enquireLabel"
              as="span"
              className="flex items-center gap-2 px-6 py-2.5 text-[8px] tracking-[0.38em] uppercase font-body font-medium"
              style={{ border: '1px solid #C9A84C', color: '#C9A84C' }}
            >
              {content.nav.enquireLabel}
            </EditableText>
          ) : (
            <a
              href="#footer"
              className="flex items-center gap-2 px-6 py-2.5 text-[8px] tracking-[0.38em] uppercase font-body font-medium transition-all duration-300"
              style={{ border: '1px solid #C9A84C', color: '#C9A84C' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#C9A84C'; el.style.color = '#0D0D0D'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.color = '#C9A84C'; }}
            >
              {content.nav.enquireLabel}
            </a>
          )}
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="flex items-center justify-center w-8 h-8 rounded-full"
            style={{ border: '1px solid rgba(201,168,76,0.35)', color: '#C9A84C', background: 'transparent', fontSize: 13 }}
          >
            {isDark ? '☀' : '☾'}
          </button>
          <button
            className="flex flex-col gap-[5px] p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className="block w-5 h-px transition-all duration-300" style={{ background: '#C9A84C', transform: menuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
            <span className="block w-5 h-px transition-all duration-300" style={{ background: '#C9A84C', opacity: menuOpen ? 0 : 1 }} />
            <span className="block w-5 h-px transition-all duration-300" style={{ background: '#C9A84C', transform: menuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-500"
        style={{
          maxHeight:      menuOpen ? '400px' : '0',
          background:     isDark ? 'rgba(13,13,13,0.98)' : 'rgba(250,249,246,0.98)',
          borderTop:      menuOpen ? `1px solid ${isDark ? 'rgba(201,168,76,0.1)' : 'rgba(176,132,34,0.12)'}` : 'none',
          backdropFilter: 'blur(24px)',
        }}
      >
        <div className="px-8 py-8 flex flex-col gap-6">
          {links.map((l, i) => (
            <a
              key={i}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="text-[10px] tracking-[0.35em] uppercase font-body transition-colors duration-200"
              style={{ color: isDark ? 'rgba(248,244,238,0.55)' : '#7A6E60' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#C9A84C')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = isDark ? 'rgba(248,244,238,0.55)' : '#7A6E60')}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#footer"
            onClick={() => setMenuOpen(false)}
            className="mt-1 inline-flex items-center gap-2 px-6 py-3 text-[8px] tracking-[0.38em] uppercase font-body font-medium self-start"
            style={{ border: '1px solid #C9A84C', color: '#C9A84C' }}
          >
            {content.nav.enquireLabel}
          </a>
        </div>
      </div>
    </nav>
  );
}
