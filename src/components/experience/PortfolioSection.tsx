'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

const CATEGORIES = ['All', 'Living Room', 'Bedroom', 'Kitchen', 'Dining', 'Office'];

const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'living-room',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=900&q=85',
    title: 'Contemporary Living Room',
    subtitle: 'Private Residence · Nairobi',
    category: 'Living Room',
    year: '2025',
    description:
      'A modern living space featuring clean lines, neutral palette, and carefully curated furniture pieces. The design emphasises natural light and open flow.',
    tags: ['Modern', 'Neutral', 'Natural Light'],
    accent: '#C9A84C',
  },
  {
    id: 'bedroom',
    image: 'https://images.unsplash.com/photo-1616594039964-40891a9093ca?w=900&q=85',
    title: 'Serene Master Bedroom',
    subtitle: 'Luxury Apartment',
    category: 'Bedroom',
    year: '2025',
    description:
      'A tranquil bedroom retreat with soft textures, calming colours, and bespoke furniture including a custom headboard and layered lighting.',
    tags: ['Serene', 'Custom', 'Layered Lighting'],
    accent: '#8B7355',
  },
  {
    id: 'kitchen',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=85',
    title: 'Chef\'s Kitchen',
    subtitle: 'Family Villa · Karen',
    category: 'Kitchen',
    year: '2025',
    description:
      'Premium appliances, custom cabinetry, and Calacatta marble countertops. Designed for both professional cooking and intimate entertaining.',
    tags: ['Premium', 'Calacatta Marble', 'Custom Cabinetry'],
    accent: '#7A8B8B',
  },
  {
    id: 'dining',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=900&q=85',
    title: 'Elegant Dining Space',
    subtitle: 'Penthouse Suite · Westlands',
    category: 'Dining',
    year: '2025',
    description:
      'A formal dining room with a statement chandelier, bespoke table, and gallery wall. Creates an intimate atmosphere for memorable gatherings.',
    tags: ['Formal', 'Statement Lighting', 'Gallery Wall'],
    accent: '#A0522D',
  },
  {
    id: 'office',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=85',
    title: 'Executive Home Studio',
    subtitle: 'Creative Space · Runda',
    category: 'Office',
    year: '2026',
    description:
      'A productive, inspiring home office with ergonomic furniture, bespoke shelving, and a restrained palette that fosters deep focus.',
    tags: ['Ergonomic', 'Bespoke Shelving', 'Focus'],
    accent: '#4A6741',
  },
  {
    id: 'bedroom-2',
    image: 'https://images.unsplash.com/photo-1618221941010-9a4e2cb01cb2?w=900&q=85',
    title: 'Junior Suite Bedroom',
    subtitle: 'Guest Room · Muthaiga',
    category: 'Bedroom',
    year: '2026',
    description:
      'A warm, welcoming guest suite with heritage timber, hand-woven textiles, and considered proportions that feel both intimate and spacious.',
    tags: ['Heritage Timber', 'Textiles', 'Warm'],
    accent: '#9B7B5A',
  },
];

interface PortfolioItem {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  description: string;
  tags: string[];
  accent: string;
}

export function PortfolioSection() {
  const sectionRef              = useRef<HTMLElement>(null);
  const trackRef                = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [activeItem, setActiveItem] = useState<PortfolioItem | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? PORTFOLIO_ITEMS
    : PORTFOLIO_ITEMS.filter(p => p.category === activeCategory);

  // Vertical scroll → horizontal translate
  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
      setProgress(p);
      if (p > 0.02) setRevealed(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Apply horizontal translation
  useEffect(() => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const maxTranslate = track.scrollWidth - window.innerWidth;
    const translateX = -(progress * Math.max(0, maxTranslate));
    track.style.transform = `translateX(${translateX}px)`;
  }, [progress, filtered]);

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className="relative w-full"
      style={{ height: `${(filtered.length + 1) * 100}vh` }}
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden">

        {/* Background */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, var(--charcoal) 0%, var(--charcoal-mid) 100%)' }}
        />
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, var(--gold) 0px, var(--gold) 1px, transparent 1px, transparent 60px)`,
          }}
        />

        {/* Header + filters */}
        <div
          className="absolute top-0 left-0 right-0 z-20 px-8 md:px-20 pt-24 pb-6"
          style={{ background: 'linear-gradient(to bottom, var(--charcoal) 50%, transparent 100%)' }}
        >
          <div
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.8s ease, transform 0.8s ease',
            }}
          >
            <div className="flex flex-wrap items-end justify-between gap-6 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="gold-line" />
                  <span className="text-[9px] tracking-[0.5em] uppercase font-body" style={{ color: 'var(--gold)' }}>
                    Geosite DEVELOPERS · 2026
                  </span>
                </div>
                <h2
                  className="font-display font-light"
                  style={{
                    fontSize: 'clamp(2rem, 5vw, 4rem)',
                    color: 'var(--warm-white)',
                    letterSpacing: '-0.01em',
                    lineHeight: 1,
                  }}
                >
                  Design{' '}
                  <em className="font-display" style={{ color: 'var(--gold-light)', fontStyle: 'italic' }}>
                    Portfolio
                  </em>
                </h2>
              </div>

              {/* Progress indicator */}
              <div className="hidden md:flex items-center gap-3">
                <span className="text-[9px] tracking-[0.3em] uppercase font-body" style={{ color: 'var(--text-muted)' }}>
                  {Math.min(Math.round(progress * (filtered.length - 1)) + 1, filtered.length)} / {filtered.length}
                </span>
                <div className="w-24 h-px" style={{ background: 'rgba(201,168,76,0.2)' }}>
                  <div
                    className="h-full transition-all duration-200"
                    style={{ width: `${progress * 100}%`, background: 'var(--gold)' }}
                  />
                </div>
              </div>
            </div>

            {/* Category filters */}
            <div className="flex items-center gap-2 flex-wrap">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setActiveItem(null); }}
                  className="px-4 py-2 text-[8px] tracking-[0.4em] uppercase font-body font-medium transition-all duration-300 rounded-full"
                  style={{
                    background: cat === activeCategory ? 'var(--gold)' : 'transparent',
                    color: cat === activeCategory ? '#0D0D0D' : 'var(--text-muted)',
                    border: cat === activeCategory ? '1px solid var(--gold)' : '1px solid var(--border)',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Horizontal track */}
        <div
          ref={trackRef}
          className="absolute top-0 left-0 flex items-center h-full"
          style={{
            willChange: 'transform',
            transition: 'transform 0.06s linear',
            paddingLeft: '8vw',
            paddingRight: '8vw',
            paddingTop: '160px',
            gap: '3vw',
          }}
        >
          {filtered.map((item, i) => (
            <PortfolioCard
              key={item.id}
              item={item}
              index={i}
              progress={progress}
              totalItems={filtered.length}
              onClick={() => setActiveItem(activeItem?.id === item.id ? null : item)}
              isActive={activeItem?.id === item.id}
            />
          ))}
        </div>

        {/* Scroll hint */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3"
          style={{ opacity: revealed && progress < 0.05 ? 1 : 0, transition: 'opacity 0.5s ease' }}
        >
          <div className="w-8 h-px" style={{ background: 'var(--gold)' }} />
          <span className="text-[8px] tracking-[0.4em] uppercase font-body" style={{ color: 'var(--gold)' }}>
            Scroll to browse
          </span>
          <div className="w-8 h-px" style={{ background: 'var(--gold)' }} />
        </div>

        {/* Expanded detail panel */}
        {activeItem && (
          <ExpandedPanel item={activeItem} onClose={() => setActiveItem(null)} />
        )}
      </div>
    </section>
  );
}

function PortfolioCard({
  item, index, progress, totalItems, onClick, isActive,
}: {
  item: PortfolioItem;
  index: number;
  progress: number;
  totalItems: number;
  onClick: () => void;
  isActive: boolean;
}) {
  const cardProgress  = progress * (totalItems - 1);
  const distFromActive = Math.abs(cardProgress - index);
  const isCurrent     = distFromActive < 0.5;
  const scale         = isCurrent ? 1 : 0.93 - Math.min(distFromActive, 2) * 0.025;
  const opacity       = Math.max(0.35, 1 - distFromActive * 0.22);

  return (
    <button
      onClick={onClick}
      className="relative flex-shrink-0 card-lift overflow-hidden rounded-2xl cursor-gold"
      style={{
        width: 'clamp(280px, 30vw, 460px)',
        height: 'clamp(400px, 62vh, 660px)',
        transform: `scale(${scale})`,
        opacity,
        transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.5s ease',
        border: isActive ? '1px solid rgba(201,168,76,0.6)' : '1px solid rgba(201,168,76,0.1)',
        boxShadow: isActive ? '0 0 0 1px rgba(201,168,76,0.4), 0 40px 80px rgba(0,0,0,0.8)' : '0 20px 60px rgba(0,0,0,0.5)',
        background: 'none',
        padding: 0,
        textAlign: 'left',
      }}
    >
      {/* Image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-700"
          style={{ transform: isActive ? 'scale(1.06)' : 'scale(1.01)' }}
          draggable={false}
        />
      </div>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to top, rgba(13,13,13,0.97) 0%, rgba(13,13,13,0.4) 45%, transparent 70%)`,
        }}
      />

      {/* Top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(90deg, transparent, ${item.accent}, transparent)` }}
      />

      {/* Category badge */}
      <div className="absolute top-5 left-5">
        <span
          className="text-[7px] tracking-[0.4em] uppercase font-body px-3 py-1.5 rounded-full"
          style={{
            background: 'rgba(13,13,13,0.7)',
            border: `1px solid ${item.accent}50`,
            color: item.accent,
            backdropFilter: 'blur(8px)',
          }}
        >
          {item.category}
        </span>
      </div>

      {/* Year */}
      <div className="absolute top-5 right-5">
        <span className="text-[9px] tracking-[0.3em] font-body" style={{ color: 'rgba(248,244,238,0.35)' }}>
          {item.year}
        </span>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <p className="text-[8px] tracking-[0.35em] uppercase font-body mb-2" style={{ color: item.accent }}>
          {item.subtitle}
        </p>
        <h3
          className="font-display font-light mb-3"
          style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.9rem)', color: '#F8F4EE', lineHeight: 1.1 }}
        >
          {item.title}
        </h3>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {item.tags.map(tag => (
            <span
              key={tag}
              className="text-[7px] tracking-[0.2em] uppercase font-body px-2 py-1 rounded"
              style={{
                background: 'rgba(255,255,255,0.06)',
                color: 'rgba(248,244,238,0.4)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] tracking-[0.3em] uppercase font-body" style={{ color: 'var(--gold)' }}>
            {isActive ? 'Close' : 'View Details'}
          </span>
          <div
            className="h-px flex-1 max-w-[40px] transition-all duration-300"
            style={{ background: 'var(--gold)', opacity: isActive ? 1 : 0.5, maxWidth: isActive ? 60 : 40 }}
          />
        </div>
      </div>
    </button>
  );
}

function ExpandedPanel({ item, onClose }: { item: PortfolioItem; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-end pr-8 md:pr-20" style={{ pointerEvents: 'none' }}>
      <div className="absolute inset-0" style={{ pointerEvents: 'auto' }} onClick={onClose} />
      <div
        className="relative glass rounded-2xl overflow-hidden"
        style={{
          width: 'clamp(300px, 30vw, 430px)',
          maxHeight: '72vh',
          overflowY: 'auto',
          pointerEvents: 'auto',
          animation: 'fade-in-up 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
          boxShadow: '0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(201,168,76,0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${item.accent}, transparent)` }} />
        <div className="p-7">
          <div className="flex items-start justify-between mb-5">
            <div>
              <span className="block text-[8px] tracking-[0.45em] uppercase font-body mb-1" style={{ color: item.accent }}>
                {item.category} · {item.year}
              </span>
              <h3 className="font-display font-light" style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: 'var(--warm-white)', lineHeight: 1 }}>
                {item.title}
              </h3>
              <p className="text-[10px] tracking-[0.2em] font-body mt-1" style={{ color: 'var(--text-muted)' }}>
                {item.subtitle}
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 ml-4"
              style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', color: 'var(--gold)', fontSize: 13 }}
            >
              ✕
            </button>
          </div>
          <div className="mb-5" style={{ height: '1px', background: 'rgba(201,168,76,0.12)' }} />
          <p className="font-body font-light text-sm leading-relaxed mb-6" style={{ color: 'rgba(248,244,238,0.7)', lineHeight: 1.8 }}>
            {item.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {item.tags.map(tag => (
              <span
                key={tag}
                className="text-[8px] tracking-[0.3em] uppercase font-body px-3 py-1.5 rounded-full"
                style={{ background: `${item.accent}15`, border: `1px solid ${item.accent}35`, color: item.accent }}
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3 pt-4" style={{ borderTop: '1px solid rgba(201,168,76,0.1)' }}>
            <div className="gold-line" />
            <span className="text-[8px] tracking-[0.4em] uppercase font-body" style={{ color: 'var(--gold)' }}>
              Geosite DEVELOPERS · Nairobi
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
