'use client';
import { useState } from 'react';

const FOOTER_LINKS = {
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

export function FooterSection() {
  const [email, setEmail]     = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubmitted(true); }
  };

  return (
    <footer id="footer" className="relative w-full overflow-hidden" style={{ background: '#060606', borderTop: '1px solid rgba(201,168,76,0.1)' }}>

      {/* ── CTA split banner ───────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ minHeight: '60vh' }}>
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80"
          alt="Luxury interior"
          className="absolute inset-0 w-full h-full object-cover object-center"
          draggable={false}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, rgba(6,6,6,0.97) 0%, rgba(6,6,6,0.85) 55%, rgba(6,6,6,0.5) 100%)',
          }}
        />

        <div className="relative z-10 max-w-[1400px] mx-auto px-8 md:px-20 py-24 md:py-32 flex flex-col md:flex-row items-center md:items-start justify-between gap-16">
          <div className="max-w-xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="gold-line" />
              <span className="text-[9px] tracking-[0.55em] uppercase font-body" style={{ color: 'var(--gold)' }}>
                Begin Your Transformation
              </span>
            </div>
            <h2
              className="font-display font-light mb-8"
              style={{
                fontSize: 'clamp(2.2rem, 5vw, 5rem)',
                color: '#F8F4EE',
                letterSpacing: '-0.02em',
                lineHeight: 0.95,
              }}
            >
              Imagine what
              <br />
              <em style={{ color: 'var(--gold-light)', fontStyle: 'italic' }}>your space</em>
              <br />
              could become.
            </h2>
            <p
              className="font-body font-light mb-10 max-w-md"
              style={{ fontSize: '0.95rem', color: 'rgba(248,244,238,0.55)', lineHeight: 1.9 }}
            >
              We take on a limited number of signature projects each year.
              Reach out early to secure your slot.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <a
                href="mailto:studio@geositedevelopers.co.ke"
                className="inline-flex items-center gap-3 px-8 py-4 text-[9px] tracking-[0.4em] uppercase font-body font-medium transition-all duration-300"
                style={{ background: 'var(--gold)', color: '#0D0D0D' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#E8C97A'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--gold)'; }}
              >
                Begin a Conversation →
              </a>
              <a
                href="tel:+254700000000"
                className="inline-flex items-center gap-3 px-8 py-4 text-[9px] tracking-[0.4em] uppercase font-body font-medium transition-all duration-300"
                style={{ border: '1px solid rgba(248,244,238,0.25)', color: 'rgba(248,244,238,0.7)' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--gold)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(248,244,238,0.25)';
                  (e.currentTarget as HTMLElement).style.color = 'rgba(248,244,238,0.7)';
                }}
              >
                Call Us
              </a>
            </div>
          </div>

          {/* Right: enquiry info */}
          <div
            className="flex flex-col gap-5 min-w-[260px]"
            style={{
              background: 'rgba(13,13,13,0.6)',
              border: '1px solid rgba(201,168,76,0.15)',
              backdropFilter: 'blur(20px)',
              borderRadius: 16,
              padding: '32px',
            }}
          >
            <h4 className="text-[8px] tracking-[0.5em] uppercase font-body" style={{ color: 'var(--gold)' }}>
              Contact Us
            </h4>
            {[
              { icon: '📍', label: 'Location',  value: 'Nairobi, Kenya' },
              { icon: '✉', label: 'Email',     value: 'studio@geositedevelopers.co.ke' },
              { icon: '☎', label: 'Phone',     value: '+254 700 000 000' },
              { icon: '⏱', label: 'Hours',     value: 'Mon – Fri, 8am – 6pm EAT' },
            ].map(item => (
              <div key={item.label} className="flex items-start gap-3">
                <span style={{ fontSize: 14, marginTop: 1 }}>{item.icon}</span>
                <div>
                  <span className="block text-[7px] tracking-[0.4em] uppercase font-body mb-0.5" style={{ color: 'rgba(201,168,76,0.5)' }}>
                    {item.label}
                  </span>
                  <span className="text-[11px] font-body font-light" style={{ color: 'rgba(248,244,238,0.6)' }}>
                    {item.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Marquee ─────────────────────────────────────────────── */}
      <div className="overflow-hidden py-5" style={{ borderBottom: '1px solid rgba(201,168,76,0.08)', borderTop: '1px solid rgba(201,168,76,0.08)' }}>
        <div className="marquee-track">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="flex items-center gap-8 px-8 text-[10px] tracking-[0.5em] uppercase font-body whitespace-nowrap"
              style={{ color: 'rgba(201,168,76,0.3)' }}
            >
              <span>Geosite DEVELOPERS</span>
              <span style={{ color: 'rgba(201,168,76,0.15)' }}>✦</span>
              <span>Interior Design Studio</span>
              <span style={{ color: 'rgba(201,168,76,0.15)' }}>✦</span>
              <span>Nairobi, Kenya</span>
              <span style={{ color: 'rgba(201,168,76,0.15)' }}>✦</span>
              <span>Est. 2018</span>
              <span style={{ color: 'rgba(201,168,76,0.15)' }}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Main footer grid ────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-8 md:px-20 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">

          {/* Brand column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div>
              <span className="block text-[9px] tracking-[0.5em] uppercase font-body font-medium mb-1" style={{ color: 'var(--gold)' }}>
                GEO SITE
              </span>
              <span className="block text-[26px] tracking-[0.15em] uppercase font-display font-light" style={{ color: '#F8F4EE' }}>
                DEVELOPERS
              </span>
            </div>
            <p className="font-body font-light text-sm leading-relaxed max-w-xs" style={{ color: 'rgba(248,244,238,0.4)', lineHeight: 1.85 }}>
              Crafting exceptional interiors through bespoke design, BIM technology,
              and timeless elegance for modern African living.
            </p>
            {/* Newsletter */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <span className="text-[7px] tracking-[0.45em] uppercase font-body" style={{ color: 'rgba(201,168,76,0.5)' }}>
                Design Insights Newsletter
              </span>
              {submitted ? (
                <p className="text-[10px] tracking-[0.2em] font-body" style={{ color: 'var(--gold)' }}>
                  ✓ Thank you — we'll be in touch.
                </p>
              ) : (
                <div className="flex">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 px-4 py-2.5 text-[10px] font-body bg-transparent outline-none"
                    style={{
                      border: '1px solid rgba(201,168,76,0.2)',
                      borderRight: 'none',
                      color: 'rgba(248,244,238,0.7)',
                    }}
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-[8px] tracking-[0.3em] uppercase font-body transition-all duration-300"
                    style={{ background: 'var(--gold)', color: '#0D0D0D', border: 'none', cursor: 'pointer' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#E8C97A'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--gold)'; }}
                  >
                    Join
                  </button>
                </div>
              )}
            </form>
            <div className="gold-line" />
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group} className="flex flex-col gap-4">
              <h4 className="text-[8px] tracking-[0.5em] uppercase font-body" style={{ color: 'var(--gold)' }}>
                {group}
              </h4>
              {links.map(link => (
                <a
                  key={link}
                  href="#"
                  className="text-[11px] font-body font-light transition-colors duration-200"
                  style={{ color: 'rgba(248,244,238,0.35)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(248,244,238,0.35)')}
                >
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>

        {/* Trusted by */}
        <div className="mb-10" style={{ borderTop: '1px solid rgba(201,168,76,0.08)', paddingTop: 32 }}>
          <span className="text-[7px] tracking-[0.5em] uppercase font-body" style={{ color: 'rgba(201,168,76,0.3)' }}>
            Featured & Trusted By
          </span>
          <div className="flex flex-wrap items-center gap-x-10 gap-y-3 mt-5">
            {TRUSTED_BY.map(name => (
              <span key={name} className="text-[9px] tracking-[0.25em] uppercase font-body" style={{ color: 'rgba(248,244,238,0.2)' }}>
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6"
          style={{ borderTop: '1px solid rgba(201,168,76,0.08)' }}
        >
          <span className="text-[8px] tracking-[0.25em] font-body" style={{ color: 'rgba(201,168,76,0.25)' }}>
            © 2026 Geosite DEVELOPERS. All Rights Reserved. | Designed with Pride in Nairobi, Kenya
          </span>
          <div className="flex items-center gap-6">
            {['Terms & Support', 'Privacy Policy', 'Cookie Policy'].map(link => (
              <a
                key={link}
                href="#"
                className="text-[8px] tracking-[0.2em] uppercase font-body transition-colors duration-200"
                style={{ color: 'rgba(201,168,76,0.25)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(201,168,76,0.25)')}
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
