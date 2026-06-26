'use client';
import { useEffect, useState } from 'react';
import { useTheme } from '@/src/hooks/useTheme';

export function NavBar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const { theme, toggle, isDark } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Studio',    href: '#landing' },
    { label: 'Process',   href: '#process' },
    { label: 'Projects',  href: '#before-after' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Contact',   href: '#footer' },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[100] transition-all duration-700"
      style={{
        background: scrolled
          ? isDark ? 'rgba(13,13,13,0.95)' : 'rgba(250,250,248,0.95)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : 'none',
      }}
    >
      <div className="max-w-[1600px] mx-auto px-8 md:px-16 h-20 flex items-center justify-between">

        {/* Logo */}
        <a href="#landing" className="flex flex-col leading-none group">
          <span
            className="text-[9px] tracking-[0.4em] uppercase font-body font-medium"
            style={{ color: 'var(--gold)' }}
          >
            GEO SITE
          </span>
          <span
            className="text-[17px] tracking-[0.22em] uppercase font-display font-light"
            style={{ color: 'var(--warm-white)' }}
          >
            DEVELOPERS
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-[10px] tracking-[0.28em] uppercase font-body font-medium relative group"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                {l.label}
                <span
                  className="absolute -bottom-1 left-0 h-px w-0 group-hover:w-full transition-all duration-300"
                  style={{ background: 'var(--gold)' }}
                />
              </a>
            </li>
          ))}
        </ul>

        {/* Right controls */}
        <div className="hidden md:flex items-center gap-4">
          {/* Theme toggle */}
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300"
            style={{
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--gold)',
              fontSize: 16,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.12)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
            }}
          >
            {isDark ? '☀' : '☾'}
          </button>

          {/* CTA */}
          <a
            href="#footer"
            className="flex items-center gap-2 px-6 py-2.5 text-[9px] tracking-[0.35em] uppercase font-body font-medium transition-all duration-300"
            style={{ border: '1px solid var(--gold)', color: 'var(--gold)' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'var(--gold)';
              (e.currentTarget as HTMLElement).style.color = 'var(--charcoal)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
              (e.currentTarget as HTMLElement).style.color = 'var(--gold)';
            }}
          >
            Enquire
          </a>
        </div>

        {/* Mobile: theme + hamburger */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="flex items-center justify-center w-9 h-9 rounded-full"
            style={{ border: '1px solid var(--border)', color: 'var(--gold)', background: 'transparent' }}
          >
            {isDark ? '☀' : '☾'}
          </button>
          <button
            className="flex flex-col gap-[5px] p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className="block w-5 h-px transition-all duration-300"
              style={{
                background: 'var(--gold)',
                transform: menuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none',
              }}
            />
            <span
              className="block w-5 h-px transition-all duration-300"
              style={{
                background: 'var(--gold)',
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="block w-5 h-px transition-all duration-300"
              style={{
                background: 'var(--gold)',
                transform: menuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none',
              }}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-500"
        style={{
          maxHeight: menuOpen ? '400px' : '0',
          background: isDark ? 'rgba(13,13,13,0.98)' : 'rgba(250,250,248,0.98)',
          borderTop: menuOpen ? '1px solid var(--border)' : 'none',
        }}
      >
        <div className="px-8 py-8 flex flex-col gap-6">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="text-[11px] tracking-[0.35em] uppercase font-body transition-colors duration-200"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#footer"
            onClick={() => setMenuOpen(false)}
            className="mt-2 inline-flex items-center justify-center gap-2 px-6 py-3 text-[9px] tracking-[0.35em] uppercase font-body font-medium self-start"
            style={{ border: '1px solid var(--gold)', color: 'var(--gold)' }}
          >
            Enquire
          </a>
        </div>
      </div>
    </nav>
  );
}
