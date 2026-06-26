'use client';
import { useEffect, useRef, useState } from 'react';

const CATEGORIES = ['All', 'Hotel', 'Interior', 'Exterior'];

interface PortfolioItem {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  tags: string[];
  accent: string;
}

const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'suite',
    image: '/renders/Luxurious presidential suite Infinity feel 1.png',
    title: 'Presidential Suite',
    subtitle: 'Luxury Hospitality · Nairobi',
    category: 'Interior',
    year: '2025',
    tags: ['Suite', 'Luxury', 'Hospitality'],
    accent: '#C9A84C',
  },
  {
    id: 'hotel-ground',
    image: '/renders/Blue Spiral Hotel Ground full render.png',
    title: 'Blue Spiral Hotel',
    subtitle: 'Mixed-Use Development · Karen',
    category: 'Hotel',
    year: '2025',
    tags: ['Hotel', 'Commercial', 'BIM'],
    accent: '#8B7355',
  },
  {
    id: 'hotel-render',
    image: '/renders/Blue Spiral Hotel Render.jpg',
    title: 'Spiral Tower Complex',
    subtitle: 'Architectural Concept · Westlands',
    category: 'Exterior',
    year: '2024',
    tags: ['Architecture', 'Concept', '3D Render'],
    accent: '#7A8B8B',
  },
  {
    id: 'hotel-entrance',
    image: '/renders/Blue Spiral Hotel Entrance Final.png',
    title: 'Grand Hotel Entrance',
    subtitle: 'Hospitality Design · Nairobi',
    category: 'Exterior',
    year: '2025',
    tags: ['Entrance', 'Landscape', 'Lighting'],
    accent: '#A0522D',
  },
  {
    id: 'backdrop',
    image: '/renders/Geosite page 1 Backdrop.jpg',
    title: 'Signature Development',
    subtitle: 'Mixed-Use · Runda',
    category: 'Exterior',
    year: '2026',
    tags: ['Development', 'Signature', 'Premium'],
    accent: '#4A6741',
  },
  {
    id: 'suite-2',
    image: '/renders/Luxurious presidential suite Infinity feel 1.png',
    title: 'Infinity Suite',
    subtitle: 'Private Residence · Muthaiga',
    category: 'Interior',
    year: '2026',
    tags: ['Interior', 'Bespoke', 'Private'],
    accent: '#9B7B5A',
  },
];

export function PortfolioSection() {
  const sectionRef              = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setRevealed(true); },
      { threshold: 0.06 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const filtered =
    activeCategory === 'All'
      ? PORTFOLIO_ITEMS
      : PORTFOLIO_ITEMS.filter(p => p.category === activeCategory);

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className="relative w-full py-32 md:py-40 overflow-hidden"
      style={{ background: '#FAF9F6' }}
    >
      <div className="max-w-[1400px] mx-auto px-8 md:px-16">

        {/* Header */}
        <div
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14"
          style={{
            opacity:    revealed ? 1 : 0,
            transform:  revealed ? 'translateY(0)' : 'translateY(30px)',
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
                Geosite DEVELOPERS · 2026
              </span>
            </div>
            <h2
              className="font-display font-light"
              style={{
                fontSize:      'clamp(2.4rem, 5vw, 5rem)',
                color:         '#1A1614',
                letterSpacing: '-0.02em',
                lineHeight:    0.95,
              }}
            >
              Design{' '}
              <em style={{ color: 'var(--gold-light)', fontStyle: 'italic' }}>
                Portfolio
              </em>
            </h2>
          </div>

          {/* Category filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-5 py-2.5 text-[8px] tracking-[0.38em] uppercase font-body font-medium transition-all duration-300"
                style={{
                  background: cat === activeCategory ? '#B08422' : 'transparent',
                  color:      cat === activeCategory ? '#FAF9F6' : '#7A6E60',
                  border:     cat === activeCategory ? '1px solid #B08422' : '1px solid rgba(176,132,34,0.25)',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          style={{
            opacity:    revealed ? 1 : 0,
            transform:  revealed ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s',
          }}
        >
          {filtered.map((item, i) => (
            <PortfolioCard key={item.id} item={item} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div
          className="flex justify-center mt-20"
          style={{
            opacity:    revealed ? 1 : 0,
            transition: 'opacity 0.9s ease 0.6s',
          }}
        >
          <a
            href="#footer"
            className="inline-flex items-center gap-4 px-12 py-4 text-[9px] tracking-[0.45em] uppercase font-body font-medium transition-all duration-300"
            style={{ border: '1px solid #B08422', color: '#B08422' }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = '#B08422';
              el.style.color      = '#FAF9F6';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'transparent';
              el.style.color      = '#B08422';
            }}
          >
            Discuss Your Project →
          </a>
        </div>
      </div>
    </section>
  );
}

function PortfolioCard({ item, index }: { item: PortfolioItem; index: number }) {
  const [hovered, setHovered] = useState(false);

  const gsId = `GS ${String(index + 1).padStart(3, '0')}`;

  // Staggered reveal delay
  const delay = `${index * 80}ms`;

  return (
    <div
      className="relative overflow-hidden group"
      style={{
        aspectRatio:     index % 3 === 1 ? '3/4' : '4/3',
        background:      '#E8E0D4',
        animationDelay:  delay,
        cursor:          'pointer',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <img
        src={item.image}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          transform:  hovered ? 'scale(1.07)' : 'scale(1.01)',
          transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        draggable={false}
      />

      {/* Always-on overlay (subtle) */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.15) 50%, transparent 75%)',
        }}
      />

      {/* Hover overlay (extra dark) */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{ background: 'rgba(10,10,10,0.25)', opacity: hovered ? 1 : 0 }}
      />

      {/* Editorial GS identifier — top left */}
      <div className="absolute top-5 left-5 flex items-center gap-2">
        <span
          className="text-[7px] tracking-[0.42em] uppercase font-body"
          style={{ color: 'rgba(248,244,238,0.5)' }}
        >
          {gsId}
        </span>
        <span style={{ width: 16, height: 1, background: 'rgba(248,244,238,0.2)' }} />
        <span
          className="text-[7px] tracking-[0.4em] uppercase font-body px-2.5 py-1"
          style={{
            background:     'rgba(10,10,10,0.65)',
            border:         `1px solid ${item.accent}55`,
            color:          item.accent,
            backdropFilter: 'blur(8px)',
          }}
        >
          {item.category}
        </span>
      </div>

      {/* Year — top right */}
      <div className="absolute top-5 right-5">
        <span className="text-[9px] tracking-[0.3em] font-body" style={{ color: 'rgba(248,244,238,0.4)' }}>
          {item.year}
        </span>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <p
          className="text-[8px] tracking-[0.38em] uppercase font-body mb-1.5"
          style={{ color: item.accent }}
        >
          {item.subtitle}
        </p>
        <h3
          className="font-display font-light mb-3"
          style={{
            fontSize:   'clamp(1.2rem, 2.2vw, 1.7rem)',
            color:      '#F8F4EE',
            lineHeight: 1.1,
          }}
        >
          {item.title}
        </h3>
        <div
          className="flex flex-wrap gap-1.5 overflow-hidden transition-all duration-500"
          style={{ maxHeight: hovered ? '40px' : '0', opacity: hovered ? 1 : 0 }}
        >
          {item.tags.map(tag => (
            <span
              key={tag}
              className="text-[7px] tracking-[0.2em] uppercase font-body px-2 py-1"
              style={{
                background: 'rgba(255,255,255,0.07)',
                color:      'rgba(248,244,238,0.55)',
                border:     '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Gold left border on hover */}
      <div
        className="absolute top-0 left-0 bottom-0 w-[3px] transition-all duration-500"
        style={{
          background: `linear-gradient(to bottom, transparent, ${item.accent}, transparent)`,
          opacity:    hovered ? 1 : 0,
        }}
      />
    </div>
  );
}
