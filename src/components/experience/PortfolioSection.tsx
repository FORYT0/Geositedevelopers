'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

/* ─── Types ─────────────────────────────────────────────────── */
interface PortfolioCategory {
  id:          string;
  title:       string;
  subtitle:    string;
  type:        'Project' | 'Element';
  image:       string;
  count:       number;
  tags:        string[];
  description: string;
  gallery:     string[];
}

/* ─── Data — 12 categories: 4 Projects + 8 Elements ────────── */
const PORTFOLIO_CATEGORIES: PortfolioCategory[] = [
  /* PROJECTS */
  {
    id:          'presidential-suite',
    title:       'Presidential Suite',
    subtitle:    'Full Interior Redesign · Westlands',
    type:        'Project',
    image:       'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=900&q=85&auto=format&fit=crop',
    count:       8,
    tags:        ['Suite', 'Luxury', 'Full Interior', 'Bespoke'],
    description: 'A complete transformation of a presidential suite. Custom furniture, integrated lighting, hand-selected marble and velvet — every detail considered from floor plan to final finish.',
    gallery: [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1400&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=1400&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1400&q=85&auto=format&fit=crop',
    ],
  },
  {
    id:          'blue-spiral-hotel',
    title:       'Blue Spiral Hotel',
    subtitle:    'Lobby & Common Areas · Karen',
    type:        'Project',
    image:       'https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=900&q=85&auto=format&fit=crop',
    count:       12,
    tags:        ['Hotel', 'Commercial', 'BIM', 'Hospitality'],
    description: 'A landmark hospitality project balancing grandeur with warmth. A spiral motif threads through every space — from entrance canopy to corridor ceilings — unifying the entire property.',
    gallery: [
      'https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=1400&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1400&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522771739578-362641e070e1?w=1400&q=85&auto=format&fit=crop',
    ],
  },
  {
    id:          'spiral-tower',
    title:       'Spiral Tower Complex',
    subtitle:    'Architectural Concept · Runda',
    type:        'Project',
    image:       'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=85&auto=format&fit=crop',
    count:       6,
    tags:        ['Architecture', 'Mixed-Use', 'Concept', '3D Render'],
    description: 'An architectural concept exploring organic spiral form within a mixed-use programme. BIM-modelled in full, allowing stakeholders to walk through every floor before breaking ground.',
    gallery: [
      'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1400&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1628745277895-5ddd3fa6e98e?w=1400&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa490c3?w=1400&q=85&auto=format&fit=crop',
    ],
  },
  {
    id:          'signature-development',
    title:       'Signature Development',
    subtitle:    'Mixed-Use Premium · Muthaiga',
    type:        'Project',
    image:       'https://images.unsplash.com/photo-1545324418-cc1a3fa490c3?w=900&q=85&auto=format&fit=crop',
    count:       9,
    tags:        ['Development', 'Premium', 'Residential', 'Retail'],
    description: 'A signature mixed-use development featuring premium residences above curated retail. Material palette draws from Kenyan stone, reclaimed timber, and locally crafted metalwork.',
    gallery: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa490c3?w=1400&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1400&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=1400&q=85&auto=format&fit=crop',
    ],
  },

  /* ELEMENTS */
  {
    id:          'bespoke-furniture',
    title:       'Bespoke Furniture',
    subtitle:    'Custom Pieces & Upholstery',
    type:        'Element',
    image:       'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=85&auto=format&fit=crop',
    count:       24,
    tags:        ['Sofas', 'Dining Tables', 'Chairs', 'Ottomans'],
    description: 'Every furniture piece in our projects is custom-designed and locally fabricated. We work with Nairobi\'s finest craftsmen to produce pieces that cannot be bought off a showroom floor.',
    gallery: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1567538851905-a0c19df4a09d?w=1400&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=1400&q=85&auto=format&fit=crop',
    ],
  },
  {
    id:          'wall-units',
    title:       'Custom Wall Units',
    subtitle:    'Built-In Joinery & Shelving',
    type:        'Element',
    image:       'https://images.unsplash.com/photo-1481277542470-5a2176ae8722?w=900&q=85&auto=format&fit=crop',
    count:       16,
    tags:        ['Entertainment Units', 'Library Walls', 'Storage', 'Walnut'],
    description: 'Custom-built wall units that combine storage with sculpture. From floor-to-ceiling library walls to integrated entertainment systems, each unit is designed to the millimetre.',
    gallery: [
      'https://images.unsplash.com/photo-1481277542470-5a2176ae8722?w=1400&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1400&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1400&q=85&auto=format&fit=crop',
    ],
  },
  {
    id:          'statement-lighting',
    title:       'Statement Lighting',
    subtitle:    'Ambient, Feature & Task Layers',
    type:        'Element',
    image:       'https://images.unsplash.com/photo-1616594039964-ae9023a7d6a4?w=900&q=85&auto=format&fit=crop',
    count:       20,
    tags:        ['Pendants', 'Arc Lamps', 'Recessed', 'Cove Lighting'],
    description: 'Lighting transforms space from the functional to the theatrical. We layer ambient, task, and accent sources — each dimmable, each precisely positioned to sculpt the room after dark.',
    gallery: [
      'https://images.unsplash.com/photo-1616594039964-ae9023a7d6a4?w=1400&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1567767292278-a204ad538b7f?w=1400&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1400&q=85&auto=format&fit=crop',
    ],
  },
  {
    id:          'premium-flooring',
    title:       'Premium Flooring',
    subtitle:    'Oak, Marble & Hand-Tufted Rugs',
    type:        'Element',
    image:       'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=85&auto=format&fit=crop',
    count:       14,
    tags:        ['Engineered Oak', 'Italian Marble', 'NZ Wool Rugs', 'Terrazzo'],
    description: 'The foundation of any great interior. We specify flooring for feel underfoot as much as for visual beauty — from wide-plank engineered oak to book-matched Calacatta marble.',
    gallery: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1400&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1400&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400&q=85&auto=format&fit=crop',
    ],
  },
  {
    id:          'curated-artwork',
    title:       'Curated Artwork',
    subtitle:    'Paintings, Sculptures & Prints',
    type:        'Element',
    image:       'https://images.unsplash.com/photo-1547826039-a1ae4008de14?w=900&q=85&auto=format&fit=crop',
    count:       32,
    tags:        ['Abstract', 'Sculptures', 'Photography', 'Ceramics'],
    description: 'Art is the soul of an interior. We source and commission works by emerging and established African artists, placing each piece to create a conversation between art and architecture.',
    gallery: [
      'https://images.unsplash.com/photo-1547826039-a1ae4008de14?w=1400&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1481277542470-5a2176ae8722?w=1400&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1400&q=85&auto=format&fit=crop',
    ],
  },
  {
    id:          'bathroom-design',
    title:       'Bathroom Design',
    subtitle:    'Spa-Level Residential Finishes',
    type:        'Element',
    image:       'https://images.unsplash.com/photo-1552321554-cd347d2142a7?w=900&q=85&auto=format&fit=crop',
    count:       18,
    tags:        ['Freestanding Tubs', 'Rain Showers', 'Heated Floors', 'Marble'],
    description: 'We design bathrooms as private sanctuaries. Freestanding tubs, rain showers, heated marble floors, and integrated steam — every finish chosen to transform the daily ritual.',
    gallery: [
      'https://images.unsplash.com/photo-1552321554-cd347d2142a7?w=1400&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=1400&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1400&q=85&auto=format&fit=crop',
    ],
  },
  {
    id:          'kitchen-dining',
    title:       'Kitchen & Dining',
    subtitle:    'Custom Culinary Spaces',
    type:        'Element',
    image:       'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=85&auto=format&fit=crop',
    count:       11,
    tags:        ['Custom Joinery', 'Stone Islands', 'Integrated Appliances', 'Dining'],
    description: 'The heart of the home, reimagined. Island joinery in natural walnut, stone-topped surfaces, and integrated appliances that disappear into the architecture — made for people who cook.',
    gallery: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1400&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=1400&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1400&q=85&auto=format&fit=crop',
    ],
  },
  {
    id:          'textiles-drapery',
    title:       'Textiles & Drapery',
    subtitle:    'Soft Furnishings & Window Treatments',
    type:        'Element',
    image:       'https://images.unsplash.com/photo-1567767292278-a204ad538b7f?w=900&q=85&auto=format&fit=crop',
    count:       28,
    tags:        ['Floor-to-Ceiling Drapes', 'Cushions', 'Throws', 'Upholstery'],
    description: 'Textiles bring warmth, texture, and character to any interior. We source from specialist weavers across East Africa — linen, silk, and hand-loomed cotton — each chosen for hand feel first.',
    gallery: [
      'https://images.unsplash.com/photo-1567767292278-a204ad538b7f?w=1400&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1400&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400&q=85&auto=format&fit=crop',
    ],
  },
];

/* ─── Layout constants ──────────────────────────────────────── */
const COL_OFFSET   = [0, 60, 30, 80];   // px top stagger per column
const COL_ROTATION = [-0.45, 0.35, -0.3, 0.55]; // deg per column
const DWELL_MS     = 5000;
const TICK_MS      = 50;
const TIMER_R      = 22;
const TIMER_C      = 2 * Math.PI * TIMER_R;

/* ─── Circular timer ────────────────────────────────────────── */
function CircularTimer({ progress }: { progress: number }) {
  const offset = TIMER_C * (1 - progress / 100);
  return (
    <svg width={60} height={60} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={30} cy={30} r={TIMER_R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={2} />
      <circle
        cx={30} cy={30} r={TIMER_R}
        fill="none"
        stroke="#C9A84C"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeDasharray={TIMER_C}
        strokeDashoffset={offset}
        style={{ transition: `stroke-dashoffset ${TICK_MS}ms linear` }}
      />
    </svg>
  );
}

/* ─── Portfolio card ────────────────────────────────────────── */
function PortfolioCard({
  cat,
  index,
  isAnyExpanded,
  onExpand,
}: {
  cat:           PortfolioCategory;
  index:         number;
  isAnyExpanded: boolean;
  onExpand:      (id: string, rect: DOMRect) => void;
}) {
  const cardRef   = useRef<HTMLDivElement>(null);
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef  = useRef(0);

  const [hovered,  setHovered]  = useState(false);
  const [progress, setProgress] = useState(0);
  const [tilt,     setTilt]     = useState({ x: 0, y: 0 });

  const col = index % 4;

  /* start dwell timer */
  const startTimer = useCallback(() => {
    if (timerRef.current) return;
    startRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const p = Math.min(100, (elapsed / DWELL_MS) * 100);
      setProgress(p);
      if (p >= 100) {
        clearInterval(timerRef.current!);
        timerRef.current = null;
        if (cardRef.current) onExpand(cat.id, cardRef.current.getBoundingClientRect());
      }
    }, TICK_MS);
  }, [cat.id, onExpand]);

  /* stop & reset */
  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    setProgress(0);
  }, []);

  /* 3-D tilt */
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const r  = cardRef.current.getBoundingClientRect();
    const dx = (e.clientX - r.left  - r.width  / 2) / (r.width  / 2);
    const dy = (e.clientY - r.top   - r.height / 2) / (r.height / 2);
    setTilt({ x: -dy * 7, y: dx * 7 });
  }, []);

  /* cleanup */
  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const gsId = `GS ${String(index + 1).padStart(3, '0')}`;

  /* build transform */
  const baseRotation  = `rotate(${COL_ROTATION[col]}deg)`;
  const activeTransform = isAnyExpanded
    ? `scale(0.86) ${baseRotation}`
    : hovered
      ? `perspective(700px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.04)`
      : `perspective(700px) scale(1) ${baseRotation}`;

  return (
    <div
      ref={cardRef}
      style={{
        position:    'relative',
        marginTop:   COL_OFFSET[col],
        marginBottom: -32,
        zIndex:       hovered ? 30 : 12 - index,
        transform:    activeTransform,
        opacity:      isAnyExpanded ? 0.32 : 1,
        transition:   'transform 0.45s cubic-bezier(0.16,1,0.3,1), opacity 0.45s ease',
        cursor:       'pointer',
      }}
      onMouseEnter={() => { setHovered(true);  startTimer(); }}
      onMouseLeave={() => { setHovered(false); stopTimer();  setTilt({ x: 0, y: 0 }); }}
      onMouseMove={handleMouseMove}
      onClick={() => {
        if (cardRef.current) onExpand(cat.id, cardRef.current.getBoundingClientRect());
      }}
    >
      {/* Card face */}
      <div
        style={{
          position:     'relative',
          overflow:     'hidden',
          aspectRatio:  '3/4',
          background:   '#1A1814',
          boxShadow:    hovered
            ? '0 28px 60px rgba(0,0,0,0.28), 0 8px 20px rgba(0,0,0,0.18)'
            : '0 8px 24px rgba(0,0,0,0.14)',
          transition:   'box-shadow 0.4s ease',
        }}
      >
        {/* Image */}
        <img
          src={cat.image}
          alt={cat.title}
          draggable={false}
          style={{
            position:       'absolute',
            inset:          0,
            width:          '100%',
            height:         '100%',
            objectFit:      'cover',
            objectPosition: 'center',
            transform:      hovered ? 'scale(1.09)' : 'scale(1.01)',
            transition:     'transform 0.9s cubic-bezier(0.16,1,0.3,1)',
          }}
        />

        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,8,6,0.93) 0%, rgba(8,8,6,0.18) 50%, transparent 75%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: `rgba(8,8,6,${hovered ? 0.28 : 0})`, transition: 'background 0.4s ease' }} />

        {/* Top: GS id + type badge */}
        <div style={{ position: 'absolute', top: 14, left: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.37rem', letterSpacing: '0.42em', textTransform: 'uppercase', color: 'rgba(248,244,238,0.42)' }}>
            {gsId}
          </span>
          <span style={{ display: 'inline-block', width: 10, height: 1, background: 'rgba(248,244,238,0.15)' }} />
          <span
            style={{
              fontFamily:    'var(--font-body)',
              fontSize:      '0.35rem',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              padding:       '3px 9px',
              background:    'rgba(8,8,6,0.7)',
              border:        '1px solid rgba(201,168,76,0.4)',
              color:         '#C9A84C',
              backdropFilter:'blur(8px)',
            }}
          >
            {cat.type}
          </span>
        </div>

        {/* Top-right: count */}
        <div style={{ position: 'absolute', top: 14, right: 14 }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.37rem', letterSpacing: '0.3em', color: 'rgba(248,244,238,0.32)' }}>
            {cat.count} items
          </span>
        </div>

        {/* Circular dwell timer — centred */}
        <div
          style={{
            position:   'absolute',
            top:        '50%',
            left:       '50%',
            transform:  'translate(-50%, -50%)',
            opacity:    progress > 0 ? 1 : 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
            zIndex:     10,
          }}
        >
          <CircularTimer progress={progress} />
        </div>

        {/* Hold hint */}
        <div
          style={{
            position:      'absolute',
            bottom:        8,
            right:         14,
            fontFamily:    'var(--font-body)',
            fontSize:      '0.34rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color:         '#C9A84C',
            opacity:       progress > 0 ? 0.9 : 0,
            transition:    'opacity 0.3s ease',
            pointerEvents: 'none',
          }}
        >
          Hold to expand
        </div>

        {/* Card content — bottom */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '18px 18px 20px' }}>
          <p
            style={{
              fontFamily:    'var(--font-body)',
              fontSize:      '0.38rem',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color:         '#C9A84C',
              marginBottom:  8,
            }}
          >
            {cat.subtitle}
          </p>
          <h3
            style={{
              fontFamily:    'var(--font-display)',
              fontWeight:    300,
              fontSize:      'clamp(0.95rem, 1.6vw, 1.25rem)',
              color:         '#F8F4EE',
              lineHeight:    1.1,
              letterSpacing: '-0.01em',
              marginBottom:  10,
            }}
          >
            {cat.title}
          </h3>

          {/* Tags — reveal on hover */}
          <div
            style={{
              display:    'flex',
              flexWrap:   'wrap',
              gap:        5,
              maxHeight:  hovered ? '36px' : '0',
              overflow:   'hidden',
              opacity:    hovered ? 1 : 0,
              transition: 'max-height 0.4s ease, opacity 0.4s ease',
            }}
          >
            {cat.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                style={{
                  fontFamily:    'var(--font-body)',
                  fontSize:      '0.34rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  padding:       '3px 7px',
                  background:    'rgba(255,255,255,0.07)',
                  border:        '1px solid rgba(255,255,255,0.07)',
                  color:         'rgba(248,244,238,0.45)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Left gold accent line */}
        <div
          style={{
            position:   'absolute',
            top:        0,
            left:       0,
            bottom:     0,
            width:      3,
            background: 'linear-gradient(to bottom, transparent, #C9A84C 40%, transparent)',
            opacity:    hovered ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        />
      </div>
    </div>
  );
}

/* ─── Full-screen expanded view ─────────────────────────────── */
function ExpandedView({
  cat,
  expandFrom,
  isExpanded,
  onClose,
}: {
  cat:        PortfolioCategory;
  expandFrom: DOMRect;
  isExpanded: boolean;
  onClose:    () => void;
}) {
  const [contentVisible, setContentVisible] = useState(false);

  /* fade in content after the expansion animation completes */
  useEffect(() => {
    if (isExpanded) {
      const t = setTimeout(() => setContentVisible(true), 600);
      return () => clearTimeout(t);
    } else {
      setContentVisible(false);
    }
  }, [isExpanded]);

  /* scroll-down closes */
  useEffect(() => {
    const handler = (e: WheelEvent) => { if (e.deltaY > 12) onClose(); };
    window.addEventListener('wheel', handler, { passive: true });
    return () => window.removeEventListener('wheel', handler);
  }, [onClose]);

  /* Escape closes */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  /* lock body scroll while expanded */
  useEffect(() => {
    document.body.style.overflow = isExpanded ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isExpanded]);

  return (
    <div
      style={{
        position:   'fixed',
        zIndex:     999,
        overflow:   'hidden',
        background: '#0A0908',
        /* FLIP: start at card rect, animate to full viewport */
        top:        isExpanded ? 0                 : expandFrom.top,
        left:       isExpanded ? 0                 : expandFrom.left,
        width:      isExpanded ? '100vw'           : expandFrom.width,
        height:     isExpanded ? '100vh'           : expandFrom.height,
        opacity:    isExpanded ? 1                 : 0,
        transition: [
          'top 0.65s cubic-bezier(0.16,1,0.3,1)',
          'left 0.65s cubic-bezier(0.16,1,0.3,1)',
          'width 0.65s cubic-bezier(0.16,1,0.3,1)',
          'height 0.65s cubic-bezier(0.16,1,0.3,1)',
          'opacity 0.4s ease',
        ].join(', '),
      }}
    >
      <div
        style={{
          width:    '100%',
          height:   '100%',
          overflow: isExpanded ? 'auto' : 'hidden',
          opacity:  contentVisible ? 1 : 0,
          transition:'opacity 0.5s ease',
        }}
      >
        {/* Hero */}
        <div style={{ position: 'relative', height: '56vh', minHeight: 380 }}>
          <img
            src={cat.image}
            alt={cat.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0A0908 0%, rgba(10,9,8,0.25) 45%, rgba(10,9,8,0.55) 100%)' }} />

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position:       'absolute',
              top:            24,
              right:          24,
              width:          48,
              height:         48,
              borderRadius:   '50%',
              border:         '1px solid rgba(201,168,76,0.4)',
              background:     'rgba(10,9,8,0.65)',
              backdropFilter: 'blur(12px)',
              color:          '#C9A84C',
              fontSize:       18,
              cursor:         'pointer',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              zIndex:         10,
              transition:     'background 0.3s ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.18)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(10,9,8,0.65)'; }}
          >
            ✕
          </button>

          {/* Scroll-to-close hint */}
          <div
            style={{
              position:       'absolute',
              bottom:         20,
              left:           '50%',
              transform:      'translateX(-50%)',
              display:        'flex',
              flexDirection:  'column',
              alignItems:     'center',
              gap:            6,
            }}
          >
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.38rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.45)' }}>
              Scroll to close
            </span>
            <div style={{ width: 1, height: 20, background: 'linear-gradient(to bottom, #C9A84C, transparent)' }} />
          </div>
        </div>

        {/* Content body */}
        <div
          style={{
            maxWidth: 1200,
            margin:   '0 auto',
            padding:  'clamp(48px, 6vw, 72px) clamp(32px, 5vw, 80px) clamp(64px, 8vw, 96px)',
          }}
        >
          {/* Header row */}
          <div
            style={{
              display:        'flex',
              alignItems:     'flex-start',
              justifyContent: 'space-between',
              flexWrap:       'wrap',
              gap:            40,
              marginBottom:   48,
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                <span
                  style={{
                    fontFamily:    'var(--font-body)',
                    fontSize:      '0.42rem',
                    letterSpacing: '0.45em',
                    textTransform: 'uppercase',
                    padding:       '6px 14px',
                    border:        '1px solid rgba(201,168,76,0.4)',
                    color:         '#C9A84C',
                  }}
                >
                  {cat.type}
                </span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.4rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(248,244,238,0.28)' }}>
                  {cat.count} Works
                </span>
              </div>
              <h2
                style={{
                  fontFamily:    'var(--font-display)',
                  fontWeight:    300,
                  fontSize:      'clamp(2.5rem, 5vw, 5rem)',
                  color:         '#F8F4EE',
                  letterSpacing: '-0.025em',
                  lineHeight:    0.9,
                  marginBottom:  14,
                }}
              >
                {cat.title}
              </h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.44rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#C9A84C' }}>
                {cat.subtitle}
              </p>
            </div>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize:   '0.92rem',
                color:      'rgba(248,244,238,0.42)',
                lineHeight: 1.9,
                maxWidth:   420,
              }}
            >
              {cat.description}
            </p>
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 48, paddingBottom: 40, borderBottom: '1px solid rgba(248,244,238,0.06)' }}>
            {cat.tags.map(tag => (
              <span
                key={tag}
                style={{
                  fontFamily:    'var(--font-body)',
                  fontSize:      '0.42rem',
                  letterSpacing: '0.35em',
                  textTransform: 'uppercase',
                  padding:       '8px 18px',
                  border:        '1px solid rgba(201,168,76,0.16)',
                  color:         'rgba(248,244,238,0.4)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Gallery — 3-column with first image spanning 2 cols */}
          <div
            style={{
              display:             'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gridTemplateRows:    'auto',
              gap:                 16,
              marginBottom:        56,
            }}
          >
            {cat.gallery.map((img, gi) => (
              <div
                key={gi}
                style={{
                  overflow:   'hidden',
                  aspectRatio: gi === 0 ? '16/10' : '4/3',
                  gridColumn:  gi === 0 ? '1 / span 2' : 'auto',
                }}
              >
                <img
                  src={img}
                  alt={`${cat.title} — ${gi + 1}`}
                  style={{
                    width:      '100%',
                    height:     '100%',
                    objectFit:  'cover',
                    objectPosition: 'center',
                    transition: 'transform 0.6s ease',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.04)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }}
                />
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <a
              href="#footer"
              onClick={onClose}
              style={{
                display:       'inline-flex',
                alignItems:    'center',
                gap:           12,
                padding:       '18px 44px',
                fontFamily:    'var(--font-body)',
                fontSize:      '0.44rem',
                letterSpacing: '0.42em',
                textTransform: 'uppercase',
                fontWeight:    500,
                background:    '#C9A84C',
                color:         '#0A0908',
                textDecoration:'none',
                transition:    'background 0.3s ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#E8C97A'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#C9A84C'; }}
            >
              Discuss This Project
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6h8M6.5 2.5L10 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main section ──────────────────────────────────────────── */
export function PortfolioSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [revealed,    setRevealed]    = useState(false);
  const [filter,      setFilter]      = useState<'All' | 'Project' | 'Element'>('All');
  const [expandedId,  setExpandedId]  = useState<string | null>(null);
  const [expandFrom,  setExpandFrom]  = useState<DOMRect | null>(null);
  const [isExpanded,  setIsExpanded]  = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setRevealed(true); },
      { threshold: 0.04 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const handleExpand = useCallback((id: string, rect: DOMRect) => {
    setExpandedId(id);
    setExpandFrom(rect);
    /* double rAF to ensure DOM has painted before triggering transition */
    requestAnimationFrame(() => requestAnimationFrame(() => setIsExpanded(true)));
  }, []);

  const handleClose = useCallback(() => {
    setIsExpanded(false);
    setTimeout(() => { setExpandedId(null); setExpandFrom(null); }, 700);
  }, []);

  const filtered = filter === 'All'
    ? PORTFOLIO_CATEGORIES
    : PORTFOLIO_CATEGORIES.filter(c => c.type === filter);

  const expandedCat = PORTFOLIO_CATEGORIES.find(c => c.id === expandedId);

  const FILTER_LABELS: Record<string, string> = {
    All: 'All Works', Project: 'Projects', Element: 'Elements',
  };

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      style={{ position: 'relative', width: '100%', background: '#F4F0EA', overflow: 'hidden' }}
    >

      {/* ── Header ────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth:  1400,
          margin:    '0 auto',
          padding:   'clamp(80px, 10vw, 120px) clamp(32px, 5vw, 80px) 0',
          opacity:   revealed ? 1 : 0,
          transform: revealed ? 'none' : 'translateY(24px)',
          transition:'opacity 0.9s ease, transform 0.9s ease',
        }}
      >
        <div
          style={{
            display:        'flex',
            alignItems:     'flex-end',
            justifyContent: 'space-between',
            flexWrap:       'wrap',
            gap:            32,
            marginBottom:   56,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <div style={{ width: 40, height: 1, background: 'linear-gradient(90deg, transparent, #B08422, transparent)' }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.48rem', letterSpacing: '0.55em', textTransform: 'uppercase', color: '#B08422' }}>
                Geosite DEVELOPERS · 2026
              </span>
            </div>
            <h2
              style={{
                fontFamily:    'var(--font-display)',
                fontWeight:    300,
                fontSize:      'clamp(2.4rem, 5vw, 5rem)',
                color:         '#1A1614',
                letterSpacing: '-0.025em',
                lineHeight:    0.93,
              }}
            >
              Design{' '}
              <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>Portfolio</em>
            </h2>
          </div>

          {/* Filter pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {(['All', 'Project', 'Element'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding:       '10px 22px',
                  fontFamily:    'var(--font-body)',
                  fontSize:      '0.44rem',
                  letterSpacing: '0.38em',
                  textTransform: 'uppercase',
                  fontWeight:    500,
                  background:    f === filter ? '#B08422' : 'transparent',
                  color:         f === filter ? '#F4F0EA' : '#7A6E60',
                  border:        f === filter ? '1px solid #B08422' : '1px solid rgba(176,132,34,0.25)',
                  cursor:        'pointer',
                  transition:    'all 0.3s ease',
                }}
              >
                {FILTER_LABELS[f]}
              </button>
            ))}
          </div>
        </div>

        {/* Instruction hint */}
        <p
          style={{
            fontFamily:    'var(--font-body)',
            fontSize:      '0.42rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color:         'rgba(26,22,20,0.32)',
            marginBottom:  40,
          }}
        >
          Hover to explore · Hold 5s to expand · Scroll to close
        </p>
      </div>

      {/* ── Cascading 4-col grid ──────────────────────────────── */}
      <div
        style={{
          maxWidth:  1400,
          margin:    '0 auto',
          padding:   '0 clamp(32px, 5vw, 80px) clamp(80px, 10vw, 120px)',
          opacity:   revealed ? 1 : 0,
          transform: revealed ? 'none' : 'translateY(40px)',
          transition:'opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s',
        }}
      >
        <div
          style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            columnGap:           16,
            rowGap:              0,
          }}
        >
          {filtered.map((cat, i) => (
            <PortfolioCard
              key={cat.id}
              cat={cat}
              index={i}
              isAnyExpanded={!!expandedId}
              onExpand={handleExpand}
            />
          ))}
        </div>
      </div>

      {/* ── Bottom CTA ───────────────────────────────────────── */}
      <div
        style={{
          display:        'flex',
          justifyContent: 'center',
          paddingBottom:  'clamp(80px, 10vw, 120px)',
          opacity:        revealed ? 1 : 0,
          transition:     'opacity 0.9s ease 0.6s',
        }}
      >
        <a
          href="#footer"
          style={{
            display:       'inline-flex',
            alignItems:    'center',
            gap:           14,
            padding:       '16px 44px',
            fontFamily:    'var(--font-body)',
            fontSize:      '0.44rem',
            letterSpacing: '0.45em',
            textTransform: 'uppercase',
            fontWeight:    500,
            border:        '1px solid #B08422',
            color:         '#B08422',
            textDecoration:'none',
            transition:    'background 0.3s ease, color 0.3s ease',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = '#B08422';
            el.style.color      = '#F4F0EA';
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = 'transparent';
            el.style.color      = '#B08422';
          }}
        >
          Discuss Your Project
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6h8M6.5 2.5L10 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>

      {/* ── Expanded full-screen overlay ─────────────────────── */}
      {expandedCat && expandFrom && (
        <ExpandedView
          cat={expandedCat}
          expandFrom={expandFrom}
          isExpanded={isExpanded}
          onClose={handleClose}
        />
      )}
    </section>
  );
}
