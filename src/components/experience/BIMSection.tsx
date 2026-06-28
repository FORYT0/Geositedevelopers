'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useAdmin } from '@/src/contexts/AdminContext';
import { EditableText } from '@/src/components/admin/EditableText';

/* ─── Tab IDs ─────────────────────────────────────────────── */
type TabId = 'overview' | 'estimator' | 'timeline';

/* ─── Cost Estimator Types ─────────────────────────────────── */
type PropertyType = 'apartment' | 'villa' | 'penthouse' | 'office' | 'hotel';
type FinishLevel  = 'essential' | 'premium' | 'luxury';

interface CostRates {
  designPerSqm:   number;  // KES
  materialsPerSqm: number; // KES
  bimFlat:        number;  // KES (flat fee)
}

const RATES: Record<FinishLevel, CostRates> = {
  essential: { designPerSqm: 3_500,  materialsPerSqm: 18_000, bimFlat: 120_000 },
  premium:   { designPerSqm: 6_500,  materialsPerSqm: 40_000, bimFlat: 180_000 },
  luxury:    { designPerSqm: 12_000, materialsPerSqm: 85_000, bimFlat: 280_000 },
};

const PROPERTY_TYPES: { id: PropertyType; label: string; icon: string; multiplier: number }[] = [
  { id: 'apartment',  label: 'Apartment',   icon: '🏢', multiplier: 1.00 },
  { id: 'villa',      label: 'Villa',        icon: '🏡', multiplier: 1.15 },
  { id: 'penthouse',  label: 'Penthouse',   icon: '🏙', multiplier: 1.30 },
  { id: 'office',     label: 'Office',       icon: '🏛', multiplier: 1.10 },
  { id: 'hotel',      label: 'Hospitality', icon: '🏨', multiplier: 1.40 },
];

const FINISH_LEVELS: { id: FinishLevel; label: string; tagline: string; color: string }[] = [
  { id: 'essential', label: 'Essential', tagline: 'Clean, functional & refined',   color: '#9B8B6E' },
  { id: 'premium',   label: 'Premium',   tagline: 'High-spec materials & bespoke', color: '#C9A84C' },
  { id: 'luxury',    label: 'Luxury',    tagline: 'Uncompromising excellence',      color: '#E8C97A' },
];

function formatKES(amount: number): string {
  if (amount >= 1_000_000) return `KES ${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000)     return `KES ${(amount / 1_000).toFixed(0)}K`;
  return `KES ${amount.toLocaleString()}`;
}

/* ─── Floor Plan Rooms ─────────────────────────────────────── */
const ROOMS = [
  {
    id: 'living', label: 'Living Room', sqm: 42, x: 40, y: 30, w: 240, h: 160,
    tip: 'The social heart of the home. We prioritise acoustic zoning, bespoke seating, and layered lighting.',
    materials: ['Engineered oak flooring', 'Venetian plaster feature wall', 'Coffered ceiling with cove lighting'],
    keySpec: '42 m² · Open-plan',
  },
  {
    id: 'master', label: 'Master Suite', sqm: 28, x: 40, y: 200, w: 160, h: 120,
    tip: 'A sanctuary for rest. Hidden storage, blackout draping, and spa-grade finishes define this space.',
    materials: ['Hand-tufted wool carpet', 'Silk wall upholstery', 'Integrated walk-in wardrobe'],
    keySpec: '28 m² · En-suite',
  },
  {
    id: 'bed2', label: 'Bedroom 2', sqm: 18, x: 210, y: 200, w: 120, h: 120,
    tip: 'Versatile guest or children\'s space. Multifunctional furniture maximises every metre.',
    materials: ['Engineered timber flooring', 'Painted feature wall', 'Bespoke joinery storage'],
    keySpec: '18 m² · Guest/Study',
  },
  {
    id: 'kitchen', label: 'Kitchen', sqm: 22, x: 290, y: 30, w: 140, h: 120,
    tip: 'Culinary precision meets beautiful design. Integrated appliances, stone islands, and task lighting.',
    materials: ['Calacatta marble worktop', 'Custom walnut joinery', 'Integrated Miele appliances'],
    keySpec: '22 m² · Island layout',
  },
  {
    id: 'bath', label: 'Bathroom', sqm: 8, x: 290, y: 160, w: 140, h: 60,
    tip: 'A private retreat. Heated marble floors, freestanding tubs, and rain showers define the Geosite spa bathroom.',
    materials: ['Statuary marble floor & walls', 'Freestanding stone tub', 'Polished brass hardware'],
    keySpec: '8 m² · Spa-grade',
  },
];

/* ─── Phase Timeline Data ──────────────────────────────────── */
const PHASES = [
  {
    number: '01',
    title:  'Discovery',
    weeks:  '1–2 weeks',
    color:  '#9B8B6E',
    description: 'An immersive briefing session to understand your life, your aesthetic, and your space.',
    deliverables: [
      'Site visit & measured survey',
      'Lifestyle & mood questionnaire',
      'Project scope document',
      'Preliminary budget framework',
      'Signed design agreement',
    ],
    milestone: 'Brief signed off',
  },
  {
    number: '02',
    title:  'Concept & Design',
    weeks:  '3–5 weeks',
    color:  '#A89060',
    description: 'Multiple bespoke design directions presented — mood boards, material palettes, and space plans.',
    deliverables: [
      'Concept mood boards (2–3 directions)',
      'Schematic space plans',
      'Material & finish palette',
      'Preliminary furniture schedule',
      'Design direction sign-off',
    ],
    milestone: 'Concept approved',
  },
  {
    number: '03',
    title:  'BIM & Visualisation',
    weeks:  '3–4 weeks',
    color:  '#C9A84C',
    description: 'Full photorealistic renders and a navigable BIM model so you experience the finished space before a nail is hammered.',
    deliverables: [
      'Full 3D BIM model',
      'Photorealistic room renders',
      'Virtual walkthrough video',
      'Detailed material schedule',
      'Construction documentation set',
    ],
    milestone: 'Design frozen',
  },
  {
    number: '04',
    title:  'Procurement',
    weeks:  '4–8 weeks',
    color:  '#D4B86A',
    description: 'Every specified item sourced, ordered, and tracked — furniture, materials, bespoke joinery, and artwork.',
    deliverables: [
      'Supplier purchase orders',
      'Custom fabrication briefs',
      'Delivery tracking schedule',
      'QC inspection before delivery',
      'Staging warehouse coordination',
    ],
    milestone: 'All items on order',
  },
  {
    number: '05',
    title:  'Installation & Delivery',
    weeks:  '4–12 weeks',
    color:  '#E8C97A',
    description: 'Our trusted contractors and craftsmen execute with surgical precision under our full supervision.',
    deliverables: [
      'Site management & daily reporting',
      'Trade coordination (joinery, electrical, plumbing)',
      'Furniture & artwork installation',
      'Snag list & defect resolution',
      'Final styling & handover walk',
    ],
    milestone: 'Keys handed over',
  },
];

/* ─── Material Catalogue ───────────────────────────────────── */
type MatCategory = 'Flooring' | 'Walls' | 'Kitchen' | 'Bathroom' | 'Lighting' | 'Textiles';

const MATERIAL_CATALOGUE: {
  category: MatCategory;
  items: { name: string; origin: string; finish: string; priceRange: string; best: string; swatch: string }[];
}[] = [
  {
    category: 'Flooring',
    items: [
      { name: 'Engineered Oak',       origin: 'European',  finish: 'Matt lacquer',   priceRange: 'KES 4,500–7,000/m²',  best: 'Living areas, bedrooms', swatch: '#C8A97E' },
      { name: 'Calacatta Marble',     origin: 'Italian',   finish: 'Honed',          priceRange: 'KES 12,000–18,000/m²', best: 'Bathrooms, hallways',   swatch: '#EDE8E0' },
      { name: 'Large Format Porcelain', origin: 'Spanish', finish: 'Polished',       priceRange: 'KES 3,500–6,000/m²',  best: 'Open-plan living',      swatch: '#D4CFC8' },
      { name: 'Terrazzo',             origin: 'Custom cast', finish: 'Ground & sealed', priceRange: 'KES 8,000–14,000/m²', best: 'Feature areas, kitchens', swatch: '#C2BCB0' },
    ],
  },
  {
    category: 'Walls',
    items: [
      { name: 'Venetian Plaster',     origin: 'Italian technique', finish: 'Burnished', priceRange: 'KES 2,800–5,500/m²', best: 'Feature walls, living rooms', swatch: '#E8E0D4' },
      { name: 'Silk Fabric Upholstery', origin: 'East African', finish: 'Panel mounted', priceRange: 'KES 4,500–9,000/m²', best: 'Master suites, studies',  swatch: '#D4C4A8' },
      { name: 'Micro-cement',         origin: 'Belgian',   finish: 'Matte sealed',   priceRange: 'KES 3,000–4,500/m²',  best: 'Bathrooms, kitchens',   swatch: '#B8B0A4' },
      { name: 'Limewash Paint',       origin: 'Artisanal', finish: 'Aged texture',   priceRange: 'KES 900–1,800/m²',    best: 'Bedrooms, dining rooms', swatch: '#E0D8CC' },
    ],
  },
  {
    category: 'Kitchen',
    items: [
      { name: 'Natural Walnut Joinery', origin: 'Kenyan crafted', finish: 'Oil & wax', priceRange: 'KES 85,000–140,000/lin.m', best: 'Island cabinetry, upper units', swatch: '#8B6B4A' },
      { name: 'Nero Marquina Marble', origin: 'Spanish',   finish: 'Honed',          priceRange: 'KES 18,000–28,000/m²', best: 'Islands, splashbacks',   swatch: '#2A2A2A' },
      { name: 'Lacquered MDF',        origin: 'Local craft', finish: 'High-gloss',   priceRange: 'KES 45,000–75,000/lin.m', best: 'Contemporary kitchens',  swatch: '#F0EDE8' },
      { name: 'Brushed Brass Hardware', origin: 'European', finish: 'PVD coated',    priceRange: 'KES 3,500–8,000/unit', best: 'Handles, taps, fixtures', swatch: '#C9A84C' },
    ],
  },
  {
    category: 'Bathroom',
    items: [
      { name: 'Statuary White Marble', origin: 'Italian',  finish: 'Polished',       priceRange: 'KES 22,000–35,000/m²', best: 'Feature walls, floors',  swatch: '#F0EDE8' },
      { name: 'Freestanding Stone Tub', origin: 'Cast stone', finish: 'Matt white',  priceRange: 'KES 280,000–650,000', best: 'Master bathrooms',        swatch: '#E8E4DC' },
      { name: 'Heated Floor System',   origin: 'Warmup',   finish: 'Under tile',     priceRange: 'KES 4,500–7,000/m²',  best: 'All bathrooms',           swatch: '#D4C8B8' },
      { name: 'Polished Chrome Fixtures', origin: 'Grohe / Hansgrohe', finish: 'Chrome', priceRange: 'KES 45,000–180,000/set', best: 'Contemporary bathrooms', swatch: '#C8C8CC' },
    ],
  },
  {
    category: 'Lighting',
    items: [
      { name: 'Cove LED System',      origin: 'Lutron integrated', finish: 'Dimmable RGBW', priceRange: 'KES 8,500–14,000/lin.m', best: 'Living areas, bedrooms', swatch: '#F5E6C0' },
      { name: 'Statement Pendant',    origin: 'Bespoke / Arteriors', finish: 'Brass or matte black', priceRange: 'KES 45,000–280,000', best: 'Dining, entry halls',   swatch: '#C9A84C' },
      { name: 'Recessed Adjustable',  origin: 'Erco / Molto Luce', finish: 'Matt white/black', priceRange: 'KES 4,500–8,500/unit', best: 'Artwork, task zones',   swatch: '#DCDCDC' },
      { name: 'Arc Floor Lamp',       origin: 'Flos / Custom',    finish: 'Marble base + brass', priceRange: 'KES 65,000–180,000', best: 'Reading corners, living', swatch: '#9B8B6E' },
    ],
  },
  {
    category: 'Textiles',
    items: [
      { name: 'Belgian Linen Drapes', origin: 'Belgian',   finish: 'Sheer to blackout', priceRange: 'KES 8,500–16,000/m run', best: 'Floor-to-ceiling windows', swatch: '#E0D4C0' },
      { name: 'NZ Wool Area Rug',     origin: 'New Zealand', finish: 'Hand-tufted',    priceRange: 'KES 45,000–180,000',   best: 'Living rooms, bedrooms', swatch: '#C8B89A' },
      { name: 'Velvet Upholstery',    origin: 'Italian',   finish: 'CATAS tested',     priceRange: 'KES 4,500–9,000/m',    best: 'Sofas, headboards, chairs', swatch: '#4A5A6A' },
      { name: 'East African Kitenge', origin: 'Kenyan craft', finish: 'Custom print',  priceRange: 'KES 1,800–4,000/m',    best: 'Cushions, accent throws', swatch: '#8B4513' },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════════════════════════ */

/* ── Tab bar ── */
function TabBar({ active, onChange }: { active: TabId; onChange: (t: TabId) => void }) {
  const tabs: { id: TabId; label: string; sub: string }[] = [
    { id: 'overview',  label: 'Overview',   sub: 'Plan & Materials' },
    { id: 'estimator', label: 'Estimator',  sub: 'Live Cost Breakdown' },
    { id: 'timeline',  label: 'Phases',     sub: 'Design Journey' },
  ];
  return (
    <div style={{ display: 'flex', borderBottom: '1px solid rgba(248,244,238,0.07)', marginBottom: 0 }}>
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          style={{
            flex:          1,
            padding:       'clamp(16px, 2.5vw, 24px) clamp(12px, 2vw, 28px)',
            background:    'none',
            border:        'none',
            borderBottom:  active === t.id ? '2px solid #C9A84C' : '2px solid transparent',
            cursor:        'pointer',
            textAlign:     'left',
            transition:    'border-color 0.3s ease, background 0.3s ease',
          }}
          onMouseEnter={e => { if (active !== t.id) (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.04)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none'; }}
        >
          <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.5rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: active === t.id ? '#C9A84C' : 'rgba(248,244,238,0.4)', transition: 'color 0.3s ease' }}>
            {t.label}
          </span>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 'clamp(0.85rem, 1.5vw, 1.05rem)', fontWeight: 300, color: active === t.id ? '#F8F4EE' : 'rgba(248,244,238,0.2)', marginTop: 4, transition: 'color 0.3s ease' }}>
            {t.sub}
          </span>
        </button>
      ))}
    </div>
  );
}

/* ── Overview tab ── */
function OverviewTab({ barsPct }: { barsPct: boolean }) {
  const { content, isEditMode, updateField, removeItem, addItem } = useAdmin();
  const stats     = content.bim.stats;
  const materials = content.bim.materials;
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const room = ROOMS.find(r => r.id === activeRoom);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px, 5vw, 64px)', alignItems: 'start' }}>

      {/* Left: SVG floor plan */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.42rem', letterSpacing: '0.45em', textTransform: 'uppercase', color: '#C9A84C' }}>Floor Plan — Level 1</span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.4rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(248,244,238,0.2)' }}>1 : 100 Scale</span>
        </div>

        <div style={{ background: 'rgba(248,244,238,0.02)', border: '1px solid rgba(248,244,238,0.06)', borderRadius: 4, padding: 'clamp(20px, 2.5vw, 32px)', marginBottom: 0 }}>
          <svg viewBox="0 0 480 360" style={{ display: 'block', width: '100%' }}>
            <rect x="30" y="20" width="420" height="320" rx="2" fill="none" stroke="rgba(201,168,76,0.2)" strokeWidth="8" />
            {ROOMS.filter(r => r.id !== 'corridor').map(r => {
              const isAct = activeRoom === r.id;
              return (
                <g key={r.id}>
                  <rect x={r.x} y={r.y} width={r.w} height={r.h} rx="2"
                    fill={isAct ? 'rgba(201,168,76,0.18)' : 'rgba(201,168,76,0.04)'}
                    stroke={isAct ? '#C9A84C' : 'rgba(201,168,76,0.22)'}
                    strokeWidth={isAct ? 2 : 1}
                    style={{ cursor: 'pointer', transition: 'all 0.25s ease' }}
                    onMouseEnter={() => setActiveRoom(r.id)}
                    onMouseLeave={() => setActiveRoom(null)}
                  />
                  <text x={r.x + r.w / 2} y={r.y + r.h / 2 - 8} textAnchor="middle"
                    style={{ fontSize: 8, fontFamily: 'var(--font-body)', fill: isAct ? 'rgba(201,168,76,0.9)' : 'rgba(201,168,76,0.35)', letterSpacing: '0.05em', textTransform: 'uppercase', pointerEvents: 'none', transition: 'fill 0.2s ease' }}>
                    {r.label}
                  </text>
                  <text x={r.x + r.w / 2} y={r.y + r.h / 2 + 8} textAnchor="middle"
                    style={{ fontSize: 7.5, fontFamily: 'var(--font-body)', fill: isAct ? 'rgba(248,244,238,0.75)' : 'rgba(248,244,238,0.2)', pointerEvents: 'none', transition: 'fill 0.2s ease' }}>
                    {r.sqm} m²
                  </text>
                </g>
              );
            })}
            <g transform="translate(440, 40)">
              <circle cx="0" cy="0" r="14" fill="none" stroke="rgba(201,168,76,0.25)" strokeWidth="1" />
              <path d="M0 -10 L-4 4 L0 1 L4 4 Z" fill="rgba(201,168,76,0.55)" />
              <text y="6" textAnchor="middle" style={{ fontSize: 7, fill: 'rgba(201,168,76,0.45)', fontFamily: 'var(--font-body)' }}>N</text>
            </g>
          </svg>

          {/* Room detail panel */}
          <div style={{
            marginTop: 16, padding: '18px 20px',
            background: room ? 'rgba(201,168,76,0.06)' : 'rgba(248,244,238,0.02)',
            border: `1px solid ${room ? 'rgba(201,168,76,0.18)' : 'rgba(248,244,238,0.05)'}`,
            minHeight: 100,
            transition: 'all 0.35s ease',
          }}>
            {room ? (
              <>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.44rem', letterSpacing: '0.42em', textTransform: 'uppercase', color: '#C9A84C' }}>{room.label}</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 300, color: '#F8F4EE' }}>{room.sqm} m²</span>
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'rgba(248,244,238,0.42)', lineHeight: 1.7, marginBottom: 12 }}>{room.tip}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {room.materials.map((m, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 4, height: 4, background: '#C9A84C', borderRadius: '50%', flexShrink: 0 }} />
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.76rem', color: 'rgba(248,244,238,0.5)' }}>{m}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 80 }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.42rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(248,244,238,0.18)' }}>
                  Hover a room to inspect
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right: Stats + Materials */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1, background: 'rgba(248,244,238,0.05)', marginBottom: 40 }}>
          {stats.map((stat, i) => (
            <div key={i} style={{ background: '#0A0908', padding: 'clamp(18px, 2.5vw, 28px)', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
                <EditableText path={`bim.stats.${i}.value`} as="span"
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(2rem, 4vw, 3.8rem)', color: '#C9A84C', lineHeight: 1, letterSpacing: '-0.03em' }}>
                  {stat.value}
                </EditableText>
                <EditableText path={`bim.stats.${i}.unit`} as="span"
                  style={{ fontFamily: 'var(--font-body)', fontSize: '0.44rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.45)' }}>
                  {stat.unit}
                </EditableText>
              </div>
              <EditableText path={`bim.stats.${i}.label`} as="p"
                style={{ fontFamily: 'var(--font-body)', fontSize: '0.42rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(248,244,238,0.22)' }}>
                {stat.label}
              </EditableText>
              {isEditMode && (
                <button onClick={() => removeItem('bim.stats', i)}
                  style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(220,50,50,0.12)', border: '1px solid rgba(220,50,50,0.25)', color: 'rgba(220,80,80,0.7)', fontSize: '0.32rem', letterSpacing: '0.2em', padding: '2px 6px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        {isEditMode && (
          <button onClick={() => addItem('bim.stats', { value: '0', unit: 'unit', label: 'New Stat' })}
            style={{ marginBottom: 32, alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(201,168,76,0.08)', border: '1px dashed rgba(201,168,76,0.35)', color: '#C9A84C', fontFamily: 'var(--font-body)', fontSize: '0.38rem', letterSpacing: '0.35em', textTransform: 'uppercase', padding: '7px 14px', cursor: 'pointer' }}>
            + Add Stat
          </button>
        )}

        {/* Material bars */}
        <h4 style={{ fontFamily: 'var(--font-body)', fontSize: '0.42rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 'clamp(24px, 3vw, 36px)' }}>
          Material Specification
        </h4>
        {materials.map((m, i) => (
          <div key={i} style={{ marginBottom: 28, paddingBottom: 28, borderBottom: i < materials.length - 1 ? '1px solid rgba(248,244,238,0.05)' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 10, gap: 12 }}>
              <EditableText path={`bim.materials.${i}.label`} as="span"
                style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'rgba(248,244,238,0.6)', lineHeight: 1.4 }}>
                {m.label}
              </EditableText>
              <span style={{ display: 'flex', alignItems: 'baseline', gap: 2, flexShrink: 0 }}>
                <EditableText path={`bim.materials.${i}.pct`} as="span" editStyle={{ minWidth: '2ch' }}
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(1.6rem, 2.8vw, 2.4rem)', color: m.color, lineHeight: 1, letterSpacing: '-0.03em' }}>
                  {String(m.pct)}
                </EditableText>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: m.color, opacity: 0.7 }}>%</span>
              </span>
            </div>
            <div style={{ height: 6, borderRadius: 3, background: 'rgba(248,244,238,0.05)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: barsPct ? `${m.pct}%` : '0%', background: `linear-gradient(90deg, ${m.color}55, ${m.color})`, borderRadius: 3, transition: `width 1.4s cubic-bezier(0.4,0,0.2,1) ${i * 200}ms` }} />
            </div>
            {isEditMode && (
              <button onClick={() => removeItem('bim.materials', i)}
                style={{ marginTop: 6, background: 'rgba(220,50,50,0.08)', border: '1px solid rgba(220,50,50,0.22)', color: 'rgba(220,80,80,0.65)', fontFamily: 'var(--font-body)', fontSize: '0.32rem', letterSpacing: '0.22em', padding: '2px 7px', cursor: 'pointer' }}>
                × Remove
              </button>
            )}
          </div>
        ))}
        {isEditMode && (
          <button onClick={() => addItem('bim.materials', { label: 'New Material', pct: 50, color: '#C9A84C' })}
            style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(201,168,76,0.08)', border: '1px dashed rgba(201,168,76,0.35)', color: '#C9A84C', fontFamily: 'var(--font-body)', fontSize: '0.38rem', letterSpacing: '0.35em', textTransform: 'uppercase', padding: '7px 14px', cursor: 'pointer' }}>
            + Add Material
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Estimator tab ── */
function EstimatorTab() {
  const [propertyType, setPropertyType] = useState<PropertyType>('apartment');
  const [sqm,          setSqm]          = useState(150);
  const [finish,       setFinish]       = useState<FinishLevel>('premium');
  const [bedrooms,     setBedrooms]     = useState(3);
  const [bathrooms,    setBathrooms]    = useState(2);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const propMultiplier = PROPERTY_TYPES.find(p => p.id === propertyType)?.multiplier ?? 1;
  const rates          = RATES[finish];

  const designFee   = Math.round(sqm * rates.designPerSqm * propMultiplier);
  const materials   = Math.round(sqm * rates.materialsPerSqm * propMultiplier);
  const ffe         = Math.round(materials * 0.32);        // 32% of materials
  const labour      = Math.round(materials * 0.38);        // 38% of materials
  const bimViz      = Math.round(rates.bimFlat * propMultiplier);
  const pmFee       = Math.round((materials + ffe + labour) * 0.09); // 9% PM
  const subtotal    = designFee + materials + ffe + labour + bimViz + pmFee;
  const contingency = Math.round(subtotal * 0.10);
  const total       = subtotal + contingency;

  // Timeline estimate
  const baseWeeks = finish === 'essential' ? 14 : finish === 'premium' ? 20 : 28;
  const extraWeeks = Math.floor((sqm - 100) / 80);
  const timelineWeeks = Math.max(baseWeeks, baseWeeks + extraWeeks);

  const breakdown = [
    { label: 'Design Fees',           amount: designFee,   pct: (designFee / total) * 100,   color: '#9B8B6E' },
    { label: 'Materials & Finishes',  amount: materials,   pct: (materials / total) * 100,    color: '#C9A84C' },
    { label: 'FF&E',                  amount: ffe,         pct: (ffe / total) * 100,           color: '#A89060' },
    { label: 'Labour & Installation', amount: labour,      pct: (labour / total) * 100,        color: '#8A7860' },
    { label: 'BIM & Visualisation',   amount: bimViz,      pct: (bimViz / total) * 100,        color: '#7A6E60' },
    { label: 'Project Management',    amount: pmFee,       pct: (pmFee / total) * 100,         color: '#6A5E50' },
    { label: 'Contingency (10%)',     amount: contingency, pct: (contingency / total) * 100,   color: '#5A4E40' },
  ];

  return (
    <div>
      {/* Disclaimer */}
      <div style={{ marginBottom: 32, padding: '12px 18px', background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.1)', borderLeft: '3px solid rgba(201,168,76,0.4)' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.76rem', color: 'rgba(248,244,238,0.35)', lineHeight: 1.7 }}>
          Indicative estimates based on current Nairobi market rates. Actual costs depend on specific materials, site conditions, and scope. Use this tool to plan your budget — a detailed quote follows your discovery consultation.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px, 5vw, 64px)' }}>

        {/* ── Left: Inputs ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>

          {/* Property type */}
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.42rem', letterSpacing: '0.45em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 16 }}>
              Property Type
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
              {PROPERTY_TYPES.map(pt => (
                <button key={pt.id} onClick={() => setPropertyType(pt.id)}
                  style={{
                    padding: '12px 6px', background: propertyType === pt.id ? 'rgba(201,168,76,0.12)' : 'rgba(248,244,238,0.03)',
                    border: propertyType === pt.id ? '1px solid rgba(201,168,76,0.5)' : '1px solid rgba(248,244,238,0.07)',
                    cursor: 'pointer', transition: 'all 0.25s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  }}>
                  <span style={{ fontSize: 18 }}>{pt.icon}</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.38rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: propertyType === pt.id ? '#C9A84C' : 'rgba(248,244,238,0.35)', transition: 'color 0.25s ease' }}>
                    {pt.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Size slider */}
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.42rem', letterSpacing: '0.45em', textTransform: 'uppercase', color: '#C9A84C' }}>
                Floor Area
              </label>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 300, color: '#F8F4EE', letterSpacing: '-0.03em' }}>
                {sqm}<span style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: 'rgba(248,244,238,0.4)', marginLeft: 4 }}>m²</span>
              </span>
            </div>
            <input type="range" min={40} max={600} step={10} value={sqm} onChange={e => setSqm(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#C9A84C', cursor: 'pointer' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.36rem', letterSpacing: '0.2em', color: 'rgba(248,244,238,0.2)' }}>40 m²</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.36rem', letterSpacing: '0.2em', color: 'rgba(248,244,238,0.2)' }}>600 m²</span>
            </div>
          </div>

          {/* Finish level */}
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.42rem', letterSpacing: '0.45em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 14 }}>
              Finish Level
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {FINISH_LEVELS.map(fl => (
                <button key={fl.id} onClick={() => setFinish(fl.id)}
                  style={{
                    padding: '14px 18px', background: finish === fl.id ? 'rgba(201,168,76,0.08)' : 'transparent',
                    border: finish === fl.id ? `1px solid ${fl.color}` : '1px solid rgba(248,244,238,0.07)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, transition: 'all 0.25s ease', textAlign: 'left',
                  }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: fl.color, flexShrink: 0 }} />
                  <div>
                    <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.44rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: finish === fl.id ? fl.color : 'rgba(248,244,238,0.45)', transition: 'color 0.25s ease' }}>
                      {fl.label}
                    </span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'rgba(248,244,238,0.25)', marginTop: 2, display: 'block' }}>
                      {fl.tagline}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Rooms */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {([
              { label: 'Bedrooms', value: bedrooms, set: setBedrooms, min: 1, max: 8 },
              { label: 'Bathrooms', value: bathrooms, set: setBathrooms, min: 1, max: 6 },
            ] as const).map(ctrl => (
              <div key={ctrl.label}>
                <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.4rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.6)', marginBottom: 10 }}>
                  {ctrl.label}
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <button onClick={() => ctrl.set(v => Math.max(ctrl.min, v - 1))}
                    style={{ width: 32, height: 32, border: '1px solid rgba(201,168,76,0.3)', background: 'transparent', color: '#C9A84C', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-body)', flexShrink: 0 }}>
                    −
                  </button>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 300, color: '#F8F4EE', minWidth: 24, textAlign: 'center' }}>
                    {ctrl.value}
                  </span>
                  <button onClick={() => ctrl.set(v => Math.min(ctrl.max, v + 1))}
                    style={{ width: 32, height: 32, border: '1px solid rgba(201,168,76,0.3)', background: 'transparent', color: '#C9A84C', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-body)', flexShrink: 0 }}>
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Live output ── */}
        <div>
          {/* Total banner */}
          <div style={{ background: 'rgba(201,168,76,0.07)', border: '1px solid rgba(201,168,76,0.18)', padding: 'clamp(24px, 3vw, 36px)', marginBottom: 24 }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.4rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.6)', marginBottom: 8 }}>
              Total Project Estimate
            </p>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(2.2rem, 4vw, 3.6rem)', color: '#C9A84C', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 12 }}>
              {formatKES(total)}
            </p>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.38rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(248,244,238,0.3)', display: 'block', marginBottom: 3 }}>Timeline</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'rgba(248,244,238,0.6)' }}>{timelineWeeks}–{timelineWeeks + 6} weeks</span>
              </div>
              <div>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.38rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(248,244,238,0.3)', display: 'block', marginBottom: 3 }}>Per m²</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'rgba(248,244,238,0.6)' }}>{formatKES(Math.round(total / sqm))}/m²</span>
              </div>
              <div>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.38rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(248,244,238,0.3)', display: 'block', marginBottom: 3 }}>Scope</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'rgba(248,244,238,0.6)' }}>{sqm}m² · {bedrooms} bed · {bathrooms} bath</span>
              </div>
            </div>
          </div>

          {/* Cost breakdown bars */}
          <div style={{ marginBottom: 24 }}>
            <button
              onClick={() => setShowBreakdown(v => !v)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16, padding: 0 }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.42rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#C9A84C' }}>
                {showBreakdown ? 'Hide' : 'Show'} Full Breakdown
              </span>
              <span style={{ color: '#C9A84C', fontSize: 12, transition: 'transform 0.3s ease', display: 'inline-block', transform: showBreakdown ? 'rotate(180deg)' : 'none' }}>▾</span>
            </button>

            {/* Always visible: stacked bar */}
            <div style={{ height: 10, borderRadius: 5, overflow: 'hidden', display: 'flex', marginBottom: 16 }}>
              {breakdown.map((item, i) => (
                <div key={i} style={{ width: `${item.pct}%`, background: item.color, transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)', flexShrink: 0 }} title={`${item.label}: ${formatKES(item.amount)}`} />
              ))}
            </div>

            {/* Expandable line items */}
            <div style={{ overflow: 'hidden', maxHeight: showBreakdown ? '500px' : '0', transition: 'max-height 0.5s ease' }}>
              {breakdown.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < breakdown.length - 1 ? '1px solid rgba(248,244,238,0.05)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 8, height: 8, background: item.color, borderRadius: 2, flexShrink: 0 }} />
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'rgba(248,244,238,0.5)' }}>{item.label}</span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 300, color: '#F8F4EE' }}>{formatKES(item.amount)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', marginTop: 4, borderTop: '2px solid rgba(201,168,76,0.2)' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.44rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#C9A84C' }}>Total</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 300, color: '#C9A84C' }}>{formatKES(total)}</span>
              </div>
            </div>
          </div>

          {/* Financing note */}
          <div style={{ padding: '14px 16px', background: 'rgba(248,244,238,0.02)', border: '1px solid rgba(248,244,238,0.06)', marginBottom: 24 }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.76rem', color: 'rgba(248,244,238,0.3)', lineHeight: 1.7 }}>
              <span style={{ color: 'rgba(201,168,76,0.6)' }}>Phased payment plans available.</span> Typically: 30% design retainer, 40% on material order, 30% at handover. VAT applicable at 16%.
            </p>
          </div>

          {/* CTA */}
          <a href="#footer"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '16px 28px', background: '#C9A84C', color: '#0A0908', fontFamily: 'var(--font-body)', fontSize: '0.44rem', letterSpacing: '0.42em', textTransform: 'uppercase', fontWeight: 600, textDecoration: 'none', transition: 'background 0.3s ease' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#E8C97A'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#C9A84C'; }}>
            Request a Detailed Quote
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6h8M6.5 2.5L10 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

/* ── Timeline tab ── */
function TimelineTab() {
  const [activePhase, setActivePhase] = useState<string | null>('03');

  return (
    <div>
      {/* Phase cards row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1, marginBottom: 2 }}>
        {PHASES.map(ph => (
          <button
            key={ph.id}
            onClick={() => setActivePhase(activePhase === ph.id ? null : ph.id)}
            style={{
              padding:    'clamp(20px, 2.5vw, 32px) clamp(14px, 1.8vw, 22px)',
              background: activePhase === ph.id ? 'rgba(201,168,76,0.1)' : 'rgba(248,244,238,0.02)',
              border:     'none',
              borderTop:  `3px solid ${activePhase === ph.id ? ph.color : 'rgba(248,244,238,0.08)'}`,
              cursor:     'pointer',
              textAlign:  'left',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => { if (activePhase !== ph.id) (e.currentTarget as HTMLElement).style.background = 'rgba(248,244,238,0.04)'; }}
            onMouseLeave={e => { if (activePhase !== ph.id) (e.currentTarget as HTMLElement).style.background = 'rgba(248,244,238,0.02)'; }}
          >
            <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.38rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: ph.color, marginBottom: 10 }}>
              {ph.number}
            </span>
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 'clamp(0.9rem, 1.6vw, 1.2rem)', fontWeight: 300, color: activePhase === ph.id ? '#F8F4EE' : 'rgba(248,244,238,0.45)', lineHeight: 1.2, marginBottom: 8, transition: 'color 0.3s ease' }}>
              {ph.title}
            </span>
            <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.38rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(248,244,238,0.25)' }}>
              {ph.weeks}
            </span>
          </button>
        ))}
      </div>

      {/* Detail panel */}
      <div style={{ minHeight: 280, overflow: 'hidden', transition: 'all 0.4s ease' }}>
        {PHASES.map(ph => (
          <div
            key={ph.id}
            style={{
              display:    activePhase === ph.id ? 'grid' : 'none',
              gridTemplateColumns: '1fr 1fr',
              gap:        'clamp(32px, 5vw, 60px)',
              padding:    'clamp(28px, 3.5vw, 44px)',
              background: 'rgba(201,168,76,0.04)',
              border:     '1px solid rgba(201,168,76,0.1)',
              borderTop:  `2px solid ${ph.color}`,
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 20 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 5vw, 5rem)', fontWeight: 300, color: ph.color, lineHeight: 1, letterSpacing: '-0.03em', opacity: 0.35 }}>
                  {ph.number}
                </span>
                <div>
                  <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)', fontWeight: 300, color: '#F8F4EE', lineHeight: 1.1 }}>
                    {ph.title}
                  </span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.4rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: ph.color }}>
                    {ph.weeks}
                  </span>
                </div>
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'rgba(248,244,238,0.45)', lineHeight: 1.85, marginBottom: 24 }}>
                {ph.description}
              </p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 18px', border: `1px solid ${ph.color}44`, background: `${ph.color}0A` }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke={ph.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.42rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: ph.color }}>
                  Milestone: {ph.milestone}
                </span>
              </div>
            </div>

            <div>
              <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.4rem', letterSpacing: '0.45em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.45)', marginBottom: 18 }}>
                Deliverables
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {ph.deliverables.map((d, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                    <div style={{ width: 18, height: 18, border: `1px solid ${ph.color}55`, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                        <path d="M1.5 4.5l2.5 2.5 3.5-4" stroke={ph.color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'rgba(248,244,238,0.55)', lineHeight: 1.5 }}>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
        {!activePhase && (
          <div style={{ padding: 'clamp(28px, 3.5vw, 44px)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.44rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(248,244,238,0.18)' }}>
              Select a phase above to view details
            </span>
          </div>
        )}
      </div>

      {/* Gantt-style visual timeline */}
      <div style={{ marginTop: 40, padding: 'clamp(24px, 3vw, 36px)', background: 'rgba(248,244,238,0.02)', border: '1px solid rgba(248,244,238,0.06)' }}>
        <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.4rem', letterSpacing: '0.45em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.45)', marginBottom: 24 }}>
          Typical Project Timeline
        </span>
        {(() => {
          const phaseWidths = [12, 20, 18, 22, 28]; // pct of total
          const phaseOffsets = [0, 8, 22, 34, 48];  // overlap offsets
          return (
            <div style={{ position: 'relative', height: 'auto' }}>
              {PHASES.map((ph, i) => (
                <div key={ph.id} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.38rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(248,244,238,0.3)', width: 90, flexShrink: 0 }}>
                    {ph.title}
                  </span>
                  <div style={{ flex: 1, position: 'relative', height: 22 }}>
                    <div style={{ position: 'absolute', left: `${phaseOffsets[i]}%`, width: `${phaseWidths[i]}%`, height: '100%', background: `linear-gradient(90deg, ${ph.color}90, ${ph.color})`, borderRadius: 2, display: 'flex', alignItems: 'center', paddingLeft: 10, minWidth: 60 }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.34rem', letterSpacing: '0.2em', color: '#0A0908', fontWeight: 600, whiteSpace: 'nowrap' }}>
                        {ph.weeks}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {/* Week markers */}
              <div style={{ display: 'flex', marginTop: 14, paddingLeft: 104 }}>
                {[0, 4, 8, 12, 16, 20, 24, 28, 32].map(w => (
                  <div key={w} style={{ flex: 1, fontFamily: 'var(--font-body)', fontSize: '0.32rem', color: 'rgba(248,244,238,0.18)', letterSpacing: '0.15em' }}>
                    W{w}
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════════════════ */
export function BIMSection() {
  const sectionRef              = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [barsPct,  setBarsPct]  = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const { content, isEditMode } = useAdmin();

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setRevealed(true);
          setTimeout(() => setBarsPct(true), 600);
        }
      },
      { threshold: 0.06 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="bim"
      ref={sectionRef}
      style={{ position: 'relative', width: '100%', background: '#0A0908', overflow: 'hidden' }}
    >
      {/* Radial glow */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 70% 60% at 85% 40%, rgba(201,168,76,0.04) 0%, transparent 70%)' }} />

      {/* ── Section Header ── */}
      <div
        style={{
          maxWidth:   1400,
          margin:     '0 auto',
          padding:    'clamp(80px, 10vw, 120px) clamp(32px, 5vw, 80px) 0',
          opacity:    revealed ? 1 : 0,
          transform:  revealed ? 'translateY(0)' : 'translateY(28px)',
          transition: 'opacity 0.9s ease, transform 0.9s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <div style={{ width: 40, height: 1, background: 'linear-gradient(90deg, transparent, #C9A84C)' }} />
          <EditableText path="bim.eyebrow" as="span"
            style={{ fontFamily: 'var(--font-body)', fontSize: '0.48rem', letterSpacing: '0.55em', textTransform: 'uppercase', color: '#C9A84C' }}>
            {content.bim.eyebrow}
          </EditableText>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, marginBottom: 'clamp(40px, 6vw, 64px)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(2.4rem, 5vw, 5rem)', color: '#F8F4EE', letterSpacing: '-0.025em', lineHeight: 0.93 }}>
            <EditableText path="bim.heading" as="span">{content.bim.heading}</EditableText>
            {' '}
            <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>
              <EditableText path="bim.headingGold" as="span">{content.bim.headingGold}</EditableText>
            </em>
          </h2>
          <EditableText path="bim.description" as="p" multiline
            style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'rgba(248,244,238,0.32)', lineHeight: 1.85, maxWidth: 360, textAlign: 'right' }}>
            {content.bim.description}
          </EditableText>
        </div>

        {/* ── Tab bar ── */}
        {!isEditMode && (
          <TabBar active={activeTab} onChange={setActiveTab} />
        )}
      </div>

      {/* ── Tab Content ── */}
      <div
        style={{
          maxWidth:   1400,
          margin:     '0 auto',
          padding:    'clamp(40px, 5vw, 64px) clamp(32px, 5vw, 80px) clamp(80px, 10vw, 120px)',
          opacity:    revealed ? 1 : 0,
          transition: 'opacity 0.9s ease 0.2s',
        }}
      >
        {isEditMode ? (
          <OverviewTab barsPct={barsPct} />
        ) : (
          <>
            {activeTab === 'overview'  && <OverviewTab barsPct={barsPct} />}
            {activeTab === 'estimator' && <EstimatorTab />}
            {activeTab === 'timeline'  && <TimelineTab />}
          </>
        )}
      </div>
    </section>
  );
}
