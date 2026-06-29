'use client';
import { useEffect, useRef, useState } from 'react';
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

/* ─── Floor Plan Room Data ─────────────────────────────────── */
// ViewBox: 0 0 520 420  |  Scale: 1 m = 26 px  |  Wall gap: 5 px (internal), 8 px (external)
// Building outer face: x=22 y=12 w=476 h=396  →  inner floor: x=30 y=20 → x=490 y=400
//
// COLUMN edges (inner):  30 | 250 | 255 | 385 | 390 | 490
// ROW edges    (inner):  20 | 170 | 175 | 295 | 300 | 400
//
// Room (x,y,w,h) = inner clear area (floor visible, no wall thickness)

interface FPRoom {
  id:        string;
  badge:     string;
  label:     string;
  sqm:       number;
  dims:      string;
  x: number; y: number; w: number; h: number;
  fillHue:   string;  // base color for fill
  exterior?: boolean; // dashed border (terrace)
  note:      string;
  materials: { name: string; spec: string; swatch: string }[];
  lighting:  string;
  costRange: string;
}

const FP_ROOMS: FPRoom[] = [
  {
    id: 'living', badge: '01', label: 'Living & Dining', sqm: 42, dims: '8.5 × 5.0 m open plan',
    x: 30, y: 20, w: 220, h: 150,
    fillHue: '#C9A84C',
    note: 'The social and cultural heart of the residence. Space planning zones living, dining, and circulation through layered materiality — rugs, ceiling treatments, and furniture groupings define each territory without walls.',
    materials: [
      { name: 'Engineered chevron oak',   spec: 'Natural oil finish, 180mm wide',       swatch: '#C4994E' },
      { name: 'Venetian plaster wall',    spec: 'Burnished warm ivory, feature bay',    swatch: '#E8E0D4' },
      { name: 'Coffered ceiling + cove',  spec: 'MDF coffer, concealed LED dim-to-warm', swatch: '#D4C8A8' },
    ],
    lighting: 'Statement pendant over dining table · Cove ambient · Arc floor lamps · Recessed adjustable spots for artwork',
    costRange: 'KES 2.8M – 4.5M',
  },
  {
    id: 'kitchen', badge: '02', label: 'Kitchen', sqm: 18, dims: '4.5 × 4.0 m',
    x: 255, y: 20, w: 130, h: 150,
    fillHue: '#9B8B6E',
    note: 'A culinary studio designed for both function and theatre. Open to dining but visually separated by the island, the kitchen is a showpiece — integrated appliances, 40mm stone island, and task-perfect lighting.',
    materials: [
      { name: 'Calacatta Gold marble',    spec: 'Island waterfall edge, 40mm slab',     swatch: '#E8DCC8' },
      { name: 'Custom walnut joinery',    spec: 'Handleless push-to-open, 2.7m run',    swatch: '#8B6B4A' },
      { name: 'Miele appliance suite',    spec: 'Oven, induction, fridge — integrated', swatch: '#C0C0C4' },
    ],
    lighting: 'Under-cabinet LED strip · Recessed task above worktops · Pendant pair over island',
    costRange: 'KES 1.6M – 3.5M',
  },
  {
    id: 'terrace', badge: '03', label: 'Terrace', sqm: 15, dims: '6.0 × 2.5 m',
    x: 390, y: 20, w: 100, h: 295,
    fillHue: '#7A9070',
    exterior: true,
    note: 'A true outdoor room with panoramic Nairobi skyline views. Teak decking, weather-resistant furniture, and planted screening create a private retreat at height. Structural waterproofing ensures zero maintenance ingress.',
    materials: [
      { name: 'FSC teak hardwood deck',   spec: 'Oiled finish, ipe fixing clips',       swatch: '#8B6B40' },
      { name: 'Toughened glass balustrade', spec: '12mm clear, stainless shoe',         swatch: '#C8D8E0' },
      { name: 'Irrigated green screen',   spec: 'Planted vertical wall, drip system',   swatch: '#5A7A50' },
    ],
    lighting: 'Flush deck lights · Wall-mounted weather-proof lanterns · Recessed soffit strips',
    costRange: 'KES 480K – 980K',
  },
  {
    id: 'master', badge: '04', label: 'Master Suite', sqm: 22, dims: '5.5 × 4.0 m',
    x: 30, y: 175, w: 165, h: 120,
    fillHue: '#C9A84C',
    note: 'A sanctuary for absolute rest. Blackout draping, STC-50 acoustic partition walls, and spa-grade finishes create a genuine retreat. The entire north wall becomes a fitted wardrobe wall — no separate walk-in needed.',
    materials: [
      { name: 'Hand-tufted wool carpet',  spec: '14mm pile height, natural ivory',      swatch: '#E0D8C8' },
      { name: 'Silk-effect wall panels',  spec: 'Sound-absorbing, bespoke upholstery',  swatch: '#C8B898' },
      { name: 'Wardrobe wall joinery',    spec: 'Full height, mirror + lacquer doors',  swatch: '#D4C8B0' },
    ],
    lighting: 'Pendant pair on separate dimmer circuits · Cove ambient · Bedside reading spots',
    costRange: 'KES 1.2M – 2.4M',
  },
  {
    id: 'bed2', badge: '05', label: 'Bedroom 2', sqm: 16, dims: '4.5 × 3.5 m',
    x: 200, y: 175, w: 130, h: 120,
    fillHue: '#9B8B6E',
    note: 'A versatile guest or secondary bedroom. Bespoke joinery conceals a fold-down desk, making this equally a professional home office. Wide-plank flooring and limewash walls create warmth without heaviness.',
    materials: [
      { name: 'Wide-plank white oak',     spec: '220mm boards, UV oil finish',          swatch: '#C4A870' },
      { name: 'Limewash feature wall',    spec: 'Soft sage, layered artisan technique', swatch: '#B8C4A8' },
      { name: 'Upholstered headboard',    spec: 'Bespoke height, integrated wall lights', swatch: '#C8B8A0' },
    ],
    lighting: 'Ceiling pendant · Recessed bedside directional spots · Desk task lamp point',
    costRange: 'KES 780K – 1.4M',
  },
  {
    id: 'study', badge: '06', label: 'Study / WFH', sqm: 12, dims: '3.5 × 3.4 m',
    x: 335, y: 175, w: 50, h: 118,
    fillHue: '#7A8090',
    note: 'A focused, distraction-free workspace calibrated for deep work and professional video calls. Acoustic treatment on the back wall, bookshelving to both sides, and a client-facing backdrop that communicates authority.',
    materials: [
      { name: 'Full-width walnut desk',   spec: 'Fitted, cable-managed trunking below', swatch: '#7A5A38' },
      { name: 'Acoustic felt wall panel', spec: 'Behind desk, timber batten frame',     swatch: '#8A9090' },
      { name: 'Library shelving',         spec: 'Floor-to-ceiling, adjustable pegs',    swatch: '#B0A898' },
    ],
    lighting: 'Daylight-temp LED task (5000K) · Ceiling recessed ambient · Strip lighting in shelves',
    costRange: 'KES 600K – 1.2M',
  },
  {
    id: 'ensuite', badge: '07', label: 'Master En-Suite', sqm: 9, dims: '3.0 × 3.0 m',
    x: 30, y: 300, w: 95, h: 100,
    fillHue: '#8090A0',
    note: 'A spa-grade private bathroom adjoining the master suite. Underfloor heating activates automatically with the first morning step. Rain shower, freestanding stone tub, and dual vanity provide a five-star daily ritual.',
    materials: [
      { name: 'Statuary White marble',    spec: 'Honed 600×300mm, floor & feature wall', swatch: '#F0EDE8' },
      { name: 'Freestanding stone tub',   spec: 'Cast composite, 1700mm, matte white',   swatch: '#E8E4DC' },
      { name: 'Polished brass fixtures',  spec: 'Gessi / Vola spec, PVD coated',         swatch: '#C9A84C' },
    ],
    lighting: 'Backlit mirror · Recessed shower downlight (IP65) · Cove above bath niche',
    costRange: 'KES 800K – 1.6M',
  },
  {
    id: 'wic', badge: '08', label: 'Walk-In Wardrobe', sqm: 7, dims: '2.8 × 2.5 m',
    x: 130, y: 300, w: 65, h: 100,
    fillHue: '#9B8B6E',
    note: 'A dressing room designed with boutique-retail joinery quality. Central island with velvet-lined drawers, hanging rails at two heights, pull-out trouser racks, and a full-length back-lit mirror.',
    materials: [
      { name: 'Lacquered MDF joinery',    spec: 'Bespoke layout, satin white finish',   swatch: '#F0EDEA' },
      { name: 'Velvet drawer liners',     spec: 'Deep sea blue, brass corner clips',    swatch: '#3A4A6A' },
      { name: 'Central island unit',      spec: '900mm wide, 4-drawer stack + shelf',   swatch: '#C8B898' },
    ],
    lighting: 'Track-head adjustable · Integrated LED strips in joinery · Full-length mirror back-light',
    costRange: 'KES 480K – 920K',
  },
  {
    id: 'guestbath', badge: '09', label: 'Guest Bathroom', sqm: 6, dims: '2.5 × 2.4 m',
    x: 200, y: 300, w: 80, h: 100,
    fillHue: '#8090A0',
    note: 'A beautifully appointed guest bathroom that speaks to the standard of the whole residence. Marble surfaces, concealed cistern WC, and a quality basin on a bespoke vanity unit — never an afterthought.',
    materials: [
      { name: 'Grey Emperador marble',    spec: '400×800mm, feature wall + floor',      swatch: '#7A6A58' },
      { name: 'Stone composite basin',    spec: 'Freestanding on brass stand',          swatch: '#D8D0C8' },
      { name: 'Wall-hung WC',             spec: 'Concealed cistern, soft-close seat',   swatch: '#E8E4E0' },
    ],
    lighting: 'Mirror cabinet with integrated strip · Recessed ceiling IP44 · Mood night light',
    costRange: 'KES 420K – 850K',
  },
  {
    id: 'foyer', badge: '10', label: 'Entrance Foyer', sqm: 9, dims: '3.0 × 3.0 m',
    x: 285, y: 300, w: 100, h: 100,
    fillHue: '#A09070',
    note: 'The first impression sets the entire register of the residence. We design foyers as arrival galleries — art-hung walls, statement lighting, and a deliberate sense of ceremony before the main space unfolds.',
    materials: [
      { name: 'Basalt stone flooring',    spec: 'Honed 600×600mm, inset brass trim',   swatch: '#5A5248' },
      { name: 'Millwork console + mirror', spec: 'Walnut with brass inlay detail',      swatch: '#8B6B4A' },
      { name: 'Statement entry light',    spec: 'Sculptural pendant, 400mm diameter',   swatch: '#C9A84C' },
    ],
    lighting: 'Single large pendant as centrepiece · Recessed cans at perimeter · Picture light over key artwork',
    costRange: 'KES 650K – 1.2M',
  },
];

/* ─── Spatial Intelligence Engine ─────────────────────────── */

// The 5 moveable slot positions (match FP_ROOMS x/y/w/h exactly)
const SI_SLOTS = [
  { id: 'a', x: 30,  y: 20,  w: 220, h: 150,
    zone: 'North Wing — Left',
    light:   5,  // 1–5 (5 = best north-facing daylight)
    privacy: 1,  // 1–5 (5 = furthest from entry, most secluded)
    noise:   3,  // 1–5 (1 = quietest)
    adjacent: ['b', 'c'],
  },
  { id: 'b', x: 255, y: 20,  w: 130, h: 150,
    zone: 'North Wing — Right',
    light: 4, privacy: 2, noise: 4, adjacent: ['a', 'terrace'],
  },
  { id: 'c', x: 30,  y: 175, w: 165, h: 120,
    zone: 'Mid Wing — Left',
    light: 3, privacy: 4, noise: 2, adjacent: ['a', 'ensuite', 'd'],
  },
  { id: 'd', x: 200, y: 175, w: 130, h: 120,
    zone: 'Mid Wing — Centre',
    light: 2, privacy: 3, noise: 2, adjacent: ['c', 'e', 'guestbath'],
  },
  { id: 'e', x: 335, y: 175, w: 50,  h: 118,
    zone: 'Mid Wing — East',
    light: 2, privacy: 4, noise: 1, adjacent: ['d'],
  },
] as const;

type SlotId = 'a' | 'b' | 'c' | 'd' | 'e';

// Room types that float between slots
interface SIRoom {
  id:          string;
  label:       string;
  sqm:         number;
  lightPref:   number;  // ideal slot.light (1–5)
  privacyPref: number;  // ideal slot.privacy (1–5)
  noiseTol:    number;  // max acceptable slot.noise (lower = more sensitive)
  needsAdjTo:  string[];    // room/fixed IDs that should be adjacent for good flow
  color:       string;
  icon:        string;
}

const SI_ROOMS: SIRoom[] = [
  { id: 'living',  label: 'Living & Dining', sqm: 42, lightPref: 5, privacyPref: 1, noiseTol: 5, needsAdjTo: ['b', 'kitchen'], color: '#C9A84C', icon: '◈' },
  { id: 'kitchen', label: 'Kitchen',         sqm: 18, lightPref: 3, privacyPref: 2, noiseTol: 5, needsAdjTo: ['a', 'living'], color: '#A89060', icon: '◉' },
  { id: 'master',  label: 'Master Suite',    sqm: 22, lightPref: 4, privacyPref: 5, noiseTol: 1, needsAdjTo: ['ensuite'],     color: '#B8A070', icon: '◐' },
  { id: 'bed2',    label: 'Bedroom 2',       sqm: 16, lightPref: 3, privacyPref: 4, noiseTol: 1, needsAdjTo: [],              color: '#9B8B6E', icon: '◑' },
  { id: 'study',   label: 'Study',           sqm: 12, lightPref: 4, privacyPref: 4, noiseTol: 1, needsAdjTo: [],              color: '#8A7A60', icon: '◻' },
];

const DEFAULT_ASSIGNMENT: Record<SlotId, string> = {
  a: 'living', b: 'kitchen', c: 'master', d: 'bed2', e: 'study',
};

function getSIRoom(id: string): SIRoom {
  return SI_ROOMS.find(r => r.id === id) ?? SI_ROOMS[0];
}

interface SIScores {
  light: number; privacy: number; flow: number; quiet: number; overall: number;
}

function computeSIScores(assignment: Record<string, string>): SIScores {
  let light = 0, privacy = 0, flow = 0, quiet = 0;
  const n = SI_SLOTS.length;

  SI_SLOTS.forEach(slot => {
    const room = getSIRoom(assignment[slot.id]);
    // Light match
    light += Math.max(0, 100 - Math.abs(room.lightPref - slot.light) * 20);
    // Privacy match
    privacy += Math.max(0, 100 - Math.abs(room.privacyPref - slot.privacy) * 20);
    // Noise tolerance
    const noiseExcess = Math.max(0, slot.noise - room.noiseTol);
    quiet += Math.max(0, 100 - noiseExcess * 30);
    // Flow: check needed adjacencies
    let flowRoom = 100;
    for (const need of room.needsAdjTo) {
      // Does any adjacent slot or this slot's fixed adjacency satisfy the need?
      const isFixedAdj = slot.adjacent.includes(need as never);
      // Is needed room in an adjacent moveable slot?
      const neededSlot = Object.entries(assignment).find(([, r]) => r === need)?.[0];
      const isMoveableAdj = neededSlot ? slot.adjacent.includes(neededSlot as never) : false;
      if (!isFixedAdj && !isMoveableAdj) flowRoom -= 35;
    }
    flow += Math.max(0, flowRoom);
  });

  const scores = {
    light:   Math.round(light / n),
    privacy: Math.round(privacy / n),
    flow:    Math.round(flow / n),
    quiet:   Math.round(quiet / n),
  };
  return { ...scores, overall: Math.round((scores.light + scores.privacy + scores.flow + scores.quiet) / 4) };
}

interface FeedbackMsg { type: 'good' | 'warn' | 'tip'; text: string; delta?: string; }

function getSIFeedback(assignment: Record<string, string>): FeedbackMsg[] {
  const msgs: FeedbackMsg[] = [];

  const slotOf = (roomId: string) => SI_SLOTS.find(s => assignment[s.id] === roomId);
  const living  = slotOf('living');
  const kitchen = slotOf('kitchen');
  const master  = slotOf('master');
  const study   = slotOf('study');

  // Living light
  if (living) {
    if (living.light >= 4) msgs.push({ type: 'good', text: `Living & Dining in ${living.zone} — excellent north-facing daylight for social entertaining.` });
    else msgs.push({ type: 'warn', text: `Living & Dining has suboptimal light (rating ${living.light}/5). Social spaces thrive with north-facing glazing.`, delta: '-18 pts' });
  }

  // Kitchen–Living adjacency
  if (living && kitchen) {
    const adj = living.adjacent.includes(kitchen.id as never);
    if (adj) msgs.push({ type: 'good', text: 'Kitchen is directly adjacent to Living — optimal for entertaining flow and daily use.' });
    else msgs.push({ type: 'warn', text: 'Kitchen is not adjacent to Living & Dining. The serving path is 30–45% longer than optimal.', delta: '-20 pts flow' });
  }

  // Master privacy
  if (master) {
    if (master.privacy >= 4) msgs.push({ type: 'good', text: `Master Suite in ${master.zone} — high-privacy zone, well away from the social and entry areas.` });
    else msgs.push({ type: 'warn', text: 'Master Suite has insufficient privacy from the entry/social zone. Acoustic bleed and visual exposure increase significantly.', delta: '-25 pts' });
  }

  // Master ensuite access (slot 'c' is directly adjacent to ensuite)
  const masterSlotId = Object.entries(assignment).find(([, r]) => r === 'master')?.[0];
  if (masterSlotId === 'c') msgs.push({ type: 'good', text: 'Master Suite in Mid Wing Left — direct en-suite access, no shared corridor. Premium layout.' });
  else {
    const inC = getSIRoom(assignment['c']).label;
    msgs.push({ type: 'tip', text: `Swap Master Suite with ${inC} (Mid Wing Left) to gain direct en-suite access and improve privacy.` });
  }

  // Study light
  if (study && study.light <= 2) {
    msgs.push({ type: 'tip', text: 'Study is in a low-light zone. Productivity research shows natural daylight improves sustained focus by 18%. Move to Slot A or B for best results.' });
  } else if (study && study.light >= 4) {
    msgs.push({ type: 'tip', text: 'Study has good natural light — beneficial for focus, but consider whether a bedroom might benefit more from this prime north-facing position.' });
  }

  // Noise: bedroom in high-noise slot
  SI_SLOTS.forEach(slot => {
    const room = getSIRoom(assignment[slot.id]);
    if (['master', 'bed2', 'study'].includes(room.id) && slot.noise >= 4) {
      msgs.push({ type: 'warn', text: `${room.label} is in a high-noise zone (${slot.zone}). Bedrooms and studies require quiet — acoustic treatment cost increases by ~KES 180K.`, delta: '-15 pts quiet' });
    }
  });

  // Optimal check
  const isOptimal = assignment['a'] === 'living' && assignment['b'] === 'kitchen' && assignment['c'] === 'master';
  if (isOptimal) msgs.push({ type: 'good', text: 'This matches the Geosite Recommended layout — the highest-scoring configuration for this unit.' });

  return msgs;
}

/* ─── Phase Timeline Data ──────────────────────────────────── */
const PHASES = [
  {
    id: '01',
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
    id: '02',
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
    id: '03',
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
    id: '04',
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
    id: '05',
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

/* ── Floor Plan SVG ── */
// Slot ID → FP_ROOM id mapping (for static view)
const SLOT_TO_FP: Record<string, string> = {
  a: 'living', b: 'kitchen', c: 'master', d: 'bed2', e: 'study',
};
const FP_TO_SLOT: Record<string, string> = Object.fromEntries(
  Object.entries(SLOT_TO_FP).map(([k, v]) => [v, k])
);

function FloorPlan({ activeRoom, setActiveRoom, rearrangeMode = false, assignment, swapSource, onSlotClick }: {
  activeRoom:    string | null;
  setActiveRoom: (id: string | null) => void;
  rearrangeMode?: boolean;
  assignment?:   Record<string, string>;
  swapSource?:   string | null;
  onSlotClick?:  (slotId: string) => void;
}) {
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);

  const getFill = (r: FPRoom) => {
    const slotId    = FP_TO_SLOT[r.id];
    const isSource  = rearrangeMode && swapSource === slotId;
    const isActive  = !rearrangeMode && activeRoom === r.id;
    const isHovered = hoveredRoom === r.id;
    if (r.exterior) return isActive || isHovered ? 'rgba(122,144,112,0.18)' : 'rgba(122,144,112,0.06)';
    if (isSource)   return 'rgba(201,168,76,0.30)';
    if (rearrangeMode && swapSource && isHovered && slotId && swapSource !== slotId) return 'rgba(201,168,76,0.18)';
    if (isActive)   return 'rgba(201,168,76,0.20)';
    if (isHovered)  return rearrangeMode && slotId ? 'rgba(201,168,76,0.10)' : 'rgba(201,168,76,0.12)';
    return 'rgba(201,168,76,0.04)';
  };
  const getStroke = (r: FPRoom) => {
    const slotId   = FP_TO_SLOT[r.id];
    const isSource = rearrangeMode && swapSource === slotId;
    const isActive = !rearrangeMode && activeRoom === r.id;
    const isHovered = hoveredRoom === r.id;
    if (r.exterior) return isActive || isHovered ? 'rgba(122,144,112,0.7)' : 'rgba(122,144,112,0.3)';
    if (isSource)   return '#E8C97A';
    if (rearrangeMode && swapSource && isHovered && slotId) return 'rgba(201,168,76,0.8)';
    if (isActive)   return '#C9A84C';
    if (isHovered)  return 'rgba(201,168,76,0.6)';
    return 'rgba(201,168,76,0.18)';
  };

  return (
    <svg viewBox="0 0 520 420" style={{ display: 'block', width: '100%' }}>
      {/* ── Outer wall (building envelope) ── */}
      {/* Shadow */}
      <rect x="26" y="16" width="476" height="396" fill="rgba(0,0,0,0.4)" />
      {/* Wall body */}
      <rect x="22" y="12" width="476" height="396" fill="#1A1612" />
      {/* Floor field */}
      <rect x="30" y="20" width="460" height="380" fill="rgba(248,244,238,0.025)" />

      {/* ── Internal partition lines (walls between rooms) ── */}
      {/* Vertical wall between living/kitchen and bedroom/study zone (x≈250) */}
      {/* Already gap is 5px. Just draw a subtle hairline on the wall center */}
      {/* Horizontal wall between row 1 and row 2 (y=170-175) */}
      {/* Row 2 and row 3 (y=295-300) */}
      {/* These are implied by the gaps between room rects */}

      {/* ── Room fills ── */}
      {FP_ROOMS.map(r => {
        const slotId   = FP_TO_SLOT[r.id];
        const isMoveable = !!slotId;
        // In rearrange mode, show the room currently assigned to this slot
        const displayRoom = (rearrangeMode && isMoveable && assignment)
          ? getSIRoom(assignment[slotId])
          : null;
        const isSource  = rearrangeMode && swapSource === slotId;
        const isSelected = !rearrangeMode && activeRoom === r.id;
        return (
          <g key={r.id}
            style={{ cursor: rearrangeMode && isMoveable ? 'crosshair' : 'pointer' }}
            onClick={() => {
              if (rearrangeMode && isMoveable && onSlotClick) {
                onSlotClick(slotId);
              } else if (!rearrangeMode) {
                setActiveRoom(activeRoom === r.id ? null : r.id);
              }
            }}
            onMouseEnter={() => setHoveredRoom(r.id)}
            onMouseLeave={() => setHoveredRoom(null)}
          >
            <rect
              x={r.x} y={r.y} width={r.w} height={r.h}
              fill={getFill(r)}
              stroke={getStroke(r)}
              strokeWidth={isSource ? 2 : isSelected ? 1.5 : 1}
              strokeDasharray={r.exterior ? '6 3' : isSource ? '8 3' : undefined}
            />

            {/* In rearrange mode: show dynamic room name from assignment */}
            {rearrangeMode && isMoveable && displayRoom ? (
              <>
                {/* Slot letter badge */}
                <text x={r.x + 8} y={r.y + 11}
                  style={{ fontSize: 5.5, fontFamily: 'var(--font-body)', fill: isSource ? '#E8C97A' : 'rgba(201,168,76,0.5)', pointerEvents: 'none' }}>
                  {slotId.toUpperCase()}
                </text>
                {/* Room name */}
                <text x={r.x + r.w / 2} y={r.y + r.h / 2 - 8} textAnchor="middle"
                  style={{ fontSize: r.w < 70 ? 5 : 7, fontFamily: 'var(--font-body)',
                    fill: isSource ? '#E8C97A' : 'rgba(201,168,76,0.75)',
                    letterSpacing: '0.04em', textTransform: 'uppercase', pointerEvents: 'none' }}>
                  {displayRoom.label}
                </text>
                <text x={r.x + r.w / 2} y={r.y + r.h / 2 + 7} textAnchor="middle"
                  style={{ fontSize: 6, fontFamily: 'var(--font-body)', fill: 'rgba(248,244,238,0.35)', pointerEvents: 'none' }}>
                  {displayRoom.sqm} m²
                </text>
                {/* Swap prompt */}
                {swapSource && swapSource !== slotId && (
                  <text x={r.x + r.w / 2} y={r.y + r.h / 2 + 20} textAnchor="middle"
                    style={{ fontSize: 5.5, fontFamily: 'var(--font-body)', fill: 'rgba(201,168,76,0.55)', letterSpacing: '0.2em', pointerEvents: 'none' }}>
                    SWAP HERE
                  </text>
                )}
                {/* Source glow ring */}
                {isSource && (
                  <rect x={r.x + 2} y={r.y + 2} width={r.w - 4} height={r.h - 4}
                    fill="none" stroke="rgba(232,201,122,0.25)" strokeWidth="1.5" />
                )}
              </>
            ) : (
              <>
                {/* Normal mode: static badge + label */}
                <circle cx={r.x + 10} cy={r.y + 10} r="8"
                  fill={isSelected ? '#C9A84C' : 'rgba(201,168,76,0.18)'} />
                <text x={r.x + 10} y={r.y + 14} textAnchor="middle"
                  style={{ fontSize: 6, fontFamily: 'var(--font-body)', fontWeight: 700,
                    fill: isSelected ? '#0A0908' : 'rgba(201,168,76,0.8)', pointerEvents: 'none' }}>
                  {r.badge}
                </text>
                <text x={r.x + r.w / 2} y={r.y + r.h / 2 - 7} textAnchor="middle"
                  style={{ fontSize: r.w < 80 ? 5.5 : 7, fontFamily: 'var(--font-body)',
                    fill: isSelected ? 'rgba(201,168,76,0.95)' : 'rgba(201,168,76,0.42)',
                    letterSpacing: '0.05em', textTransform: 'uppercase', pointerEvents: 'none' }}>
                  {r.label}
                </text>
                <text x={r.x + r.w / 2} y={r.y + r.h / 2 + 8} textAnchor="middle"
                  style={{ fontSize: 6.5, fontFamily: 'var(--font-body)',
                    fill: isSelected ? 'rgba(248,244,238,0.8)' : 'rgba(248,244,238,0.22)', pointerEvents: 'none' }}>
                  {r.sqm} m²
                </text>
              </>
            )}
          </g>
        );
      })}

      {/* ── Furniture silhouettes ── */}
      {/* Living room — L-sofa */}
      <rect x="40" y="110" width="80" height="30" rx="2" fill="none" stroke="rgba(201,168,76,0.12)" strokeWidth="1" />
      <rect x="40" y="110" width="22" height="52" rx="2" fill="none" stroke="rgba(201,168,76,0.12)" strokeWidth="1" />
      {/* Coffee table */}
      <rect x="70" y="122" width="34" height="20" rx="1" fill="none" stroke="rgba(201,168,76,0.1)" strokeWidth="0.8" />
      {/* TV unit (living, north wall) */}
      <rect x="45" y="25" width="100" height="8" rx="1" fill="none" stroke="rgba(201,168,76,0.1)" strokeWidth="0.8" />
      {/* Dining table + 4 chairs */}
      <rect x="155" y="82" width="50" height="30" rx="2" fill="none" stroke="rgba(201,168,76,0.12)" strokeWidth="1" />
      <rect x="158" y="76" width="14" height="6" rx="1" fill="none" stroke="rgba(201,168,76,0.09)" strokeWidth="0.8" />
      <rect x="178" y="76" width="14" height="6" rx="1" fill="none" stroke="rgba(201,168,76,0.09)" strokeWidth="0.8" />
      <rect x="158" y="112" width="14" height="6" rx="1" fill="none" stroke="rgba(201,168,76,0.09)" strokeWidth="0.8" />
      <rect x="178" y="112" width="14" height="6" rx="1" fill="none" stroke="rgba(201,168,76,0.09)" strokeWidth="0.8" />

      {/* Kitchen — island + counter L */}
      <rect x="263" y="32" width="55" height="18" rx="1" fill="none" stroke="rgba(201,168,76,0.12)" strokeWidth="1" />
      {/* counter along top wall */}
      <rect x="263" y="25" width="114" height="6" rx="0" fill="none" stroke="rgba(201,168,76,0.1)" strokeWidth="0.8" />
      {/* sink symbol */}
      <rect x="330" y="28" width="16" height="10" rx="1" fill="none" stroke="rgba(201,168,76,0.15)" strokeWidth="0.8" />
      {/* cooktop circles */}
      <circle cx="273" cy="41" r="4" fill="none" stroke="rgba(201,168,76,0.15)" strokeWidth="0.8" />
      <circle cx="285" cy="41" r="4" fill="none" stroke="rgba(201,168,76,0.15)" strokeWidth="0.8" />
      <circle cx="297" cy="41" r="4" fill="none" stroke="rgba(201,168,76,0.15)" strokeWidth="0.8" />

      {/* Master bedroom — bed */}
      <rect x="44" y="195" width="82" height="58" rx="2" fill="none" stroke="rgba(201,168,76,0.12)" strokeWidth="1" />
      {/* Pillows */}
      <rect x="47" y="198" width="18" height="12" rx="2" fill="none" stroke="rgba(201,168,76,0.1)" strokeWidth="0.8" />
      <rect x="70" y="198" width="18" height="12" rx="2" fill="none" stroke="rgba(201,168,76,0.1)" strokeWidth="0.8" />
      {/* nightstands */}
      <rect x="33" y="200" width="10" height="14" rx="1" fill="none" stroke="rgba(201,168,76,0.1)" strokeWidth="0.7" />
      <rect x="127" y="200" width="10" height="14" rx="1" fill="none" stroke="rgba(201,168,76,0.1)" strokeWidth="0.7" />
      {/* wardrobe strip (north wall of master) */}
      <rect x="33" y="178" width="159" height="9" rx="0" fill="none" stroke="rgba(201,168,76,0.12)" strokeWidth="0.8" />

      {/* Bedroom 2 — bed */}
      <rect x="214" y="193" width="68" height="50" rx="2" fill="none" stroke="rgba(201,168,76,0.12)" strokeWidth="1" />
      <rect x="218" y="196" width="14" height="10" rx="2" fill="none" stroke="rgba(201,168,76,0.09)" strokeWidth="0.7" />
      <rect x="238" y="196" width="14" height="10" rx="2" fill="none" stroke="rgba(201,168,76,0.09)" strokeWidth="0.7" />

      {/* Study — desk */}
      <rect x="340" y="182" width="38" height="12" rx="1" fill="none" stroke="rgba(201,168,76,0.1)" strokeWidth="0.8" />
      {/* Chair */}
      <circle cx="360" cy="204" r="6" fill="none" stroke="rgba(201,168,76,0.09)" strokeWidth="0.7" />

      {/* En-suite — bath + WC + shower */}
      <rect x="38" y="318" width="32" height="54" rx="4" fill="none" stroke="rgba(201,168,76,0.12)" strokeWidth="1" />
      {/* Shower */}
      <rect x="76" y="318" width="28" height="26" rx="1" fill="none" stroke="rgba(201,168,76,0.1)" strokeWidth="0.8" />
      <line x1="76" y1="318" x2="104" y2="344" stroke="rgba(201,168,76,0.08)" strokeWidth="0.6" />
      <line x1="104" y1="318" x2="76" y2="344" stroke="rgba(201,168,76,0.08)" strokeWidth="0.6" />
      {/* WC symbol */}
      <rect x="76" y="352" width="20" height="28" rx="4" fill="none" stroke="rgba(201,168,76,0.1)" strokeWidth="0.8" />

      {/* Guest Bath — WC + basin */}
      <rect x="208" y="318" width="18" height="24" rx="4" fill="none" stroke="rgba(201,168,76,0.1)" strokeWidth="0.8" />
      <rect x="232" y="318" width="16" height="12" rx="2" fill="none" stroke="rgba(201,168,76,0.1)" strokeWidth="0.7" />

      {/* ── Door swings ── */}
      {/* Front door (entry to foyer from right/south) */}
      <line x1="285" y1="400" x2="285" y2="385" stroke="rgba(201,168,76,0.22)" strokeWidth="1" />
      <path d="M 285 385 A 15 15 0 0 1 300 400" fill="none" stroke="rgba(201,168,76,0.18)" strokeWidth="0.8" strokeDasharray="3 2"/>
      {/* Foyer → Living (passage opening, no door — just opening mark) */}
      <line x1="255" y1="300" x2="255" y2="350" stroke="rgba(201,168,76,0.1)" strokeWidth="3" />
      {/* Master → Ensuite */}
      <line x1="30" y1="300" x2="50" y2="300" stroke="rgba(201,168,76,0.22)" strokeWidth="1" />
      <path d="M 30 300 A 20 20 0 0 0 50 280" fill="none" stroke="rgba(201,168,76,0.18)" strokeWidth="0.8" strokeDasharray="3 2"/>
      {/* Kitchen to living (open plan – show as no wall, just threshold line) */}
      <line x1="250" y1="20" x2="250" y2="170" stroke="rgba(201,168,76,0.1)" strokeWidth="1.5" strokeDasharray="4 3" />

      {/* ── Windows (on north outer wall y=20) ── */}
      {/* Living room north window band */}
      <line x1="55" y1="20" x2="215" y2="20" stroke="rgba(248,244,238,0.25)" strokeWidth="2.5" />
      <line x1="55" y1="15" x2="215" y2="15" stroke="rgba(248,244,238,0.12)" strokeWidth="1" />
      {/* Master bedroom north window */}
      <line x1="45" y1="175" x2="175" y2="175" stroke="rgba(248,244,238,0.2)" strokeWidth="2.5" />
      <line x1="45" y1="170" x2="175" y2="170" stroke="rgba(248,244,238,0.1)" strokeWidth="1" />
      {/* Kitchen north window */}
      <line x1="265" y1="20" x2="370" y2="20" stroke="rgba(248,244,238,0.2)" strokeWidth="2.5" />
      <line x1="265" y1="15" x2="370" y2="15" stroke="rgba(248,244,238,0.1)" strokeWidth="1" />

      {/* ── Dimension lines ── */}
      {/* Overall width: below building */}
      <line x1="22" y1="412" x2="498" y2="412" stroke="rgba(201,168,76,0.2)" strokeWidth="0.8" />
      <line x1="22" y1="408" x2="22" y2="416" stroke="rgba(201,168,76,0.2)" strokeWidth="0.8" />
      <line x1="498" y1="408" x2="498" y2="416" stroke="rgba(201,168,76,0.2)" strokeWidth="0.8" />
      <text x="260" y="417" textAnchor="middle"
        style={{ fontSize: 6, fontFamily: 'var(--font-body)', fill: 'rgba(201,168,76,0.35)', letterSpacing: '0.15em' }}>
        18.3 m
      </text>
      {/* Overall height: right side */}
      <line x1="504" y1="12" x2="504" y2="408" stroke="rgba(201,168,76,0.2)" strokeWidth="0.8" />
      <line x1="500" y1="12" x2="508" y2="12" stroke="rgba(201,168,76,0.2)" strokeWidth="0.8" />
      <line x1="500" y1="408" x2="508" y2="408" stroke="rgba(201,168,76,0.2)" strokeWidth="0.8" />
      <text x="514" y="213" textAnchor="middle"
        style={{ fontSize: 6, fontFamily: 'var(--font-body)', fill: 'rgba(201,168,76,0.35)', letterSpacing: '0.15em', writingMode: 'vertical-rl' }}>
        15.2 m
      </text>

      {/* ── North compass ── */}
      <g transform="translate(505, 38)">
        <circle cx="0" cy="0" r="13" fill="rgba(10,9,8,0.7)" stroke="rgba(201,168,76,0.2)" strokeWidth="0.8" />
        <path d="M0 -9 L-3 4 L0 1 L3 4 Z" fill="#C9A84C" opacity="0.7" />
        <path d="M0 -9 L3 4 L0 1 L-3 4 Z" fill="rgba(248,244,238,0.15)" />
        <text y="5.5" textAnchor="middle" style={{ fontSize: 6, fill: 'rgba(201,168,76,0.55)', fontFamily: 'var(--font-body)', fontWeight: 700 }}>N</text>
      </g>

      {/* ── Scale bar ── */}
      <g transform="translate(33, 411)">
        <line x1="0" y1="0" x2="52" y2="0" stroke="rgba(201,168,76,0.3)" strokeWidth="1" />
        <line x1="0" y1="-3" x2="0" y2="3" stroke="rgba(201,168,76,0.3)" strokeWidth="1" />
        <line x1="26" y1="-2" x2="26" y2="2" stroke="rgba(201,168,76,0.2)" strokeWidth="0.7" />
        <line x1="52" y1="-3" x2="52" y2="3" stroke="rgba(201,168,76,0.3)" strokeWidth="1" />
        <text x="26" y="-5" textAnchor="middle" style={{ fontSize: 5, fill: 'rgba(201,168,76,0.4)', fontFamily: 'var(--font-body)' }}>2 m</text>
      </g>

      {/* ── Legend: exterior label ── */}
      <text x="395" y="120" textAnchor="middle"
        style={{ fontSize: 5.5, fontFamily: 'var(--font-body)', fill: 'rgba(122,144,112,0.5)', letterSpacing: '0.1em', writingMode: 'vertical-rl' }}>
        TERRACE / EXTERIOR
      </text>
    </svg>
  );
}

/* ── Spatial Score Panel ── */
function SpatialScorePanel({
  scores, prevScores, feedback, assignment, swapSource, onReset,
}: {
  scores:     SIScores;
  prevScores: SIScores | null;
  feedback:   FeedbackMsg[];
  assignment: Record<string, string>;
  swapSource: string | null;
  onReset:    () => void;
}) {
  const metrics: { key: keyof SIScores; label: string; icon: string; desc: string }[] = [
    { key: 'light',   label: 'Natural Light',    icon: '◈', desc: "How well north-facing daylight serves each room's needs" },
    { key: 'privacy', label: 'Privacy',           icon: '◉', desc: 'Separation of private rooms from entry and social zones' },
    { key: 'flow',    label: 'Circulation Flow',  icon: '◐', desc: 'Efficiency of the paths between functionally linked rooms' },
    { key: 'quiet',   label: 'Acoustic Comfort',  icon: '◑', desc: 'Protection of sensitive rooms from noise sources' },
  ];

  const isOptimal = assignment['a'] === 'living' && assignment['b'] === 'kitchen' && assignment['c'] === 'master';
  const getScoreColor = (s: number) => s >= 85 ? '#7AB870' : s >= 65 ? '#C9A84C' : '#C8624A';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Header + overall score */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', background: 'rgba(201,168,76,0.06)', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
        <div>
          <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.38rem', letterSpacing: '0.45em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.55)', marginBottom: 4 }}>
            Spatial Intelligence Score
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem, 4vw, 3.6rem)', fontWeight: 300, color: getScoreColor(scores.overall), lineHeight: 1, letterSpacing: '-0.04em', transition: 'color 0.5s ease' }}>
              {scores.overall}
            </span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'rgba(248,244,238,0.25)' }}>/100</span>
            {prevScores && prevScores.overall !== scores.overall && (
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: scores.overall > prevScores.overall ? '#7AB870' : '#C8624A', fontWeight: 600 }}>
                {scores.overall > prevScores.overall ? '↑' : '↓'}{Math.abs(scores.overall - prevScores.overall)}
              </span>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
          {!isOptimal && (
            <button onClick={onReset}
              style={{ padding: '7px 14px', background: 'transparent', border: '1px solid rgba(201,168,76,0.3)', color: 'rgba(201,168,76,0.7)', fontFamily: 'var(--font-body)', fontSize: '0.38rem', letterSpacing: '0.3em', textTransform: 'uppercase', cursor: 'pointer' }}>
              Reset to Recommended
            </button>
          )}
          {isOptimal && (
            <span style={{ padding: '5px 12px', background: 'rgba(122,184,112,0.12)', border: '1px solid rgba(122,184,112,0.3)', fontFamily: 'var(--font-body)', fontSize: '0.36rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#7AB870' }}>
              ✓ Optimal Layout
            </span>
          )}
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.36rem', color: 'rgba(248,244,238,0.22)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            {swapSource ? 'Select room to swap with →' : 'Click any room to select'}
          </span>
        </div>
      </div>

      {/* Metric bars */}
      <div style={{ padding: '18px 22px 14px', borderBottom: '1px solid rgba(201,168,76,0.08)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 32px' }}>
          {metrics.map(m => {
            const val  = scores[m.key];
            const prev = prevScores ? prevScores[m.key] : null;
            const delta = prev !== null && prev !== val ? val - prev : null;
            return (
              <div key={m.key}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 9, color: 'rgba(201,168,76,0.5)' }}>{m.icon}</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.38rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(248,244,238,0.38)' }}>{m.label}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {delta !== null && (
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.36rem', color: delta > 0 ? '#7AB870' : '#C8624A', fontWeight: 600 }}>
                        {delta > 0 ? '+' : ''}{delta}
                      </span>
                    )}
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: getScoreColor(val) }}>{val}</span>
                  </div>
                </div>
                <div style={{ height: 4, background: 'rgba(248,244,238,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${val}%`, background: `linear-gradient(90deg, ${getScoreColor(val)}55, ${getScoreColor(val)})`, borderRadius: 2, transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)' }} />
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.64rem', color: 'rgba(248,244,238,0.2)', marginTop: 4, lineHeight: 1.4 }}>{m.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Room-slot table */}
      <div style={{ padding: '14px 22px', borderBottom: '1px solid rgba(201,168,76,0.08)' }}>
        <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.36rem', letterSpacing: '0.42em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.4)', marginBottom: 10 }}>
          Current Assignment
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4 }}>
          {SI_SLOTS.map(slot => {
            const room = getSIRoom(assignment[slot.id]);
            const isSelected = swapSource === slot.id;
            return (
              <div key={slot.id} style={{ padding: '8px 6px', background: isSelected ? 'rgba(201,168,76,0.14)' : 'rgba(248,244,238,0.03)', border: `1px solid ${isSelected ? '#C9A84C' : 'rgba(248,244,238,0.07)'}`, textAlign: 'center' }}>
                <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.34rem', letterSpacing: '0.25em', color: 'rgba(201,168,76,0.5)', marginBottom: 3 }}>
                  {slot.id.toUpperCase()}
                </span>
                <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.62rem', color: isSelected ? '#C9A84C' : 'rgba(248,244,238,0.45)', lineHeight: 1.2 }}>
                  {room.label}
                </span>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 3, marginTop: 4 }}>
                  {[
                    { v: slot.light,   p: room.lightPref },
                    { v: slot.privacy, p: room.privacyPref },
                    { v: 5 - slot.noise, p: room.noiseTol <= 2 ? 4 : 2 },
                  ].map((pair, di) => (
                    <div key={di} style={{ width: 4, height: 4, borderRadius: '50%', background: Math.abs(pair.v - pair.p) <= 1 ? '#7AB870' : 'rgba(200,98,74,0.6)' }} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.62rem', color: 'rgba(248,244,238,0.2)', marginTop: 8 }}>
          Dots: <span style={{ color: '#7AB870' }}>● Light</span> · <span style={{ color: '#7AB870' }}>● Privacy</span> · <span style={{ color: '#7AB870' }}>● Quiet</span> — green = preference matched
        </p>
      </div>

      {/* Feedback messages */}
      <div style={{ padding: '14px 22px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.36rem', letterSpacing: '0.42em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.4)', marginBottom: 4 }}>
          Design Analysis
        </span>
        {feedback.map((f, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 14px', background: f.type === 'good' ? 'rgba(122,184,112,0.06)' : f.type === 'warn' ? 'rgba(200,98,74,0.06)' : 'rgba(201,168,76,0.04)', borderLeft: `2px solid ${f.type === 'good' ? '#7AB870' : f.type === 'warn' ? '#C8624A' : '#C9A84C'}` }}>
            <span style={{ fontSize: 10, flexShrink: 0, color: f.type === 'good' ? '#7AB870' : f.type === 'warn' ? '#C8624A' : '#C9A84C', lineHeight: 1.5 }}>
              {f.type === 'good' ? '✓' : f.type === 'warn' ? '⚠' : '→'}
            </span>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.74rem', color: 'rgba(248,244,238,0.45)', lineHeight: 1.65 }}>{f.text}</p>
              {f.delta && <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.62rem', color: '#C8624A', fontWeight: 600 }}>{f.delta}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Room detail panel ── */
function RoomDetailPanel({ room }: { room: FPRoom | null }) {
  if (!room) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 140, border: '1px solid rgba(248,244,238,0.05)', background: 'rgba(248,244,238,0.015)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 32, height: 1, background: 'rgba(201,168,76,0.2)', margin: '0 auto 12px' }} />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.4rem', letterSpacing: '0.42em', textTransform: 'uppercase', color: 'rgba(248,244,238,0.18)' }}>
            Select a room to inspect
          </span>
        </div>
      </div>
    );
  }
  return (
    <div style={{ border: '1px solid rgba(201,168,76,0.18)', background: 'rgba(201,168,76,0.04)' }}>
      {/* Header */}
      <div style={{ padding: '18px 22px 14px', borderBottom: '1px solid rgba(201,168,76,0.1)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{ width: 22, height: 22, background: '#C9A84C', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.4rem', fontWeight: 700, color: '#0A0908' }}>{room.badge}</span>
            </div>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.44rem', letterSpacing: '0.42em', textTransform: 'uppercase', color: '#C9A84C' }}>{room.label}</span>
          </div>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'rgba(248,244,238,0.3)' }}>{room.dims}</span>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 300, color: '#F8F4EE', lineHeight: 1, letterSpacing: '-0.03em' }}>
            {room.sqm}
          </span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.42rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(248,244,238,0.3)' }}>m²</span>
        </div>
      </div>
      {/* Design note */}
      <div style={{ padding: '14px 22px', borderBottom: '1px solid rgba(201,168,76,0.08)' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'rgba(248,244,238,0.4)', lineHeight: 1.78 }}>
          {room.note}
        </p>
      </div>
      {/* Materials */}
      <div style={{ padding: '14px 22px', borderBottom: '1px solid rgba(201,168,76,0.08)' }}>
        <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.38rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.45)', marginBottom: 10 }}>
          Specified Finishes
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {room.materials.map((mat, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 22, height: 14, background: mat.swatch, borderRadius: 1, flexShrink: 0, border: '1px solid rgba(248,244,238,0.08)' }} />
              <div>
                <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'rgba(248,244,238,0.6)', lineHeight: 1.3 }}>{mat.name}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'rgba(248,244,238,0.28)' }}>{mat.spec}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Lighting + Cost */}
      <div style={{ padding: '12px 22px 14px', display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'start' }}>
        <div>
          <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.38rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.4)', marginBottom: 5 }}>
            Lighting Strategy
          </span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'rgba(248,244,238,0.35)', lineHeight: 1.6 }}>{room.lighting}</span>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.36rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.4)', marginBottom: 4 }}>
            Fit-out Range
          </span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 300, color: '#C9A84C', whiteSpace: 'nowrap' }}>{room.costRange}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Overview tab ── */
function OverviewTab({ barsPct }: { barsPct: boolean }) {
  const { content, isEditMode, removeItem, addItem } = useAdmin(); // eslint-disable-line @typescript-eslint/no-unused-vars
  const stats     = content.bim.stats;
  const materials = content.bim.materials;

  // Inspect mode state
  const [activeRoom,   setActiveRoom]   = useState<string | null>('living');
  const room = FP_ROOMS.find(r => r.id === activeRoom) ?? null;

  // Rearrange / Spatial Intelligence state
  const [rearrangeMode, setRearrangeMode] = useState(false);
  const [assignment, setAssignment] = useState<Record<string, string>>({ ...DEFAULT_ASSIGNMENT });
  const [prevAssignment, setPrevAssignment] = useState<Record<string, string> | null>(null);
  const [swapSource,  setSwapSource]  = useState<string | null>(null);

  const scores     = computeSIScores(assignment);
  const prevScores = prevAssignment ? computeSIScores(prevAssignment) : null;
  const feedback   = getSIFeedback(assignment);

  const handleSlotClick = (slotId: string) => {
    if (!swapSource) {
      setSwapSource(slotId);
    } else if (swapSource === slotId) {
      setSwapSource(null);
    } else {
      // Perform swap
      setPrevAssignment({ ...assignment });
      setAssignment(prev => {
        const next = { ...prev };
        const tmp = next[swapSource];
        next[swapSource] = next[slotId];
        next[slotId] = tmp;
        return next;
      });
      setSwapSource(null);
    }
  };

  const handleReset = () => {
    setPrevAssignment({ ...assignment });
    setAssignment({ ...DEFAULT_ASSIGNMENT });
    setSwapSource(null);
  };

  const totalFloor = FP_ROOMS.filter(r => !r.exterior).reduce((s, r) => s + r.sqm, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(40px, 5vw, 56px)' }}>

      {/* ── Floor plan ── */}
      <div>
        {/* Header row — full width */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.42rem', letterSpacing: '0.45em', textTransform: 'uppercase', color: '#C9A84C' }}>Floor Plan — Level 1</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.38rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(248,244,238,0.2)', padding: '3px 8px', border: '1px solid rgba(248,244,238,0.08)' }}>Unit GS-14B</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 300, color: 'rgba(201,168,76,0.6)' }}>{totalFloor} m² net</span>
            <button
              onClick={() => { setRearrangeMode(v => !v); setSwapSource(null); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '7px 16px',
                background: rearrangeMode ? 'rgba(201,168,76,0.14)' : 'transparent',
                border: rearrangeMode ? '1px solid #C9A84C' : '1px solid rgba(248,244,238,0.15)',
                color: rearrangeMode ? '#C9A84C' : 'rgba(248,244,238,0.45)',
                fontFamily: 'var(--font-body)', fontSize: '0.38rem', letterSpacing: '0.3em', textTransform: 'uppercase',
                cursor: 'pointer', transition: 'all 0.25s ease',
              }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1 3h8M1 7h8M3 1v8M7 1v8" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
              </svg>
              {rearrangeMode ? 'Exit Rearrange' : 'Rearrange Rooms'}
            </button>
          </div>
        </div>

        {/* 2-column: left = plan, right = detail / score panel */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,3fr) minmax(280px,2fr)', gap: 20, alignItems: 'start' }}>

          {/* ── LEFT: legend + instruction + SVG ── */}
          <div>
            {/* Legend */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
              {[
                { color: 'rgba(201,168,76,0.22)', label: 'Selected' },
                { color: 'rgba(201,168,76,0.08)', label: 'Interior' },
                { color: 'rgba(122,144,112,0.12)', label: 'Terrace' },
                { color: 'rgba(248,244,238,0.25)', label: 'Windows' },
              ].map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 12, height: 8, background: l.color, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 1 }} />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.34rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(248,244,238,0.22)' }}>{l.label}</span>
                </div>
              ))}
            </div>

            {/* Rearrange mode instruction banner */}
            {rearrangeMode && (
              <div style={{ marginBottom: 8, padding: '8px 14px', background: 'rgba(201,168,76,0.07)', border: '1px solid rgba(201,168,76,0.18)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 13, color: '#C9A84C', flexShrink: 0 }}>↔</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'rgba(248,244,238,0.45)', lineHeight: 1.45 }}>
                  {swapSource
                    ? `${getSIRoom(assignment[swapSource]).label} selected — click another room to swap`
                    : 'Click a highlighted room to select, then click another to swap. Scores update instantly.'}
                </span>
                {swapSource && (
                  <button onClick={() => setSwapSource(null)}
                    style={{ marginLeft: 'auto', padding: '3px 9px', background: 'transparent', border: '1px solid rgba(248,244,238,0.15)', color: 'rgba(248,244,238,0.4)', fontFamily: 'var(--font-body)', fontSize: '0.32rem', letterSpacing: '0.22em', cursor: 'pointer', flexShrink: 0 }}>
                    Cancel
                  </button>
                )}
              </div>
            )}

            {/* SVG container — constrained so whole plan is visible */}
            <div style={{ background: 'rgba(10,9,8,0.6)', border: `1px solid ${rearrangeMode ? 'rgba(201,168,76,0.2)' : 'rgba(201,168,76,0.08)'}`, padding: '6px 6px 3px', lineHeight: 0 }}>
              <FloorPlan
                activeRoom={activeRoom}
                setActiveRoom={setActiveRoom}
                rearrangeMode={rearrangeMode}
                assignment={assignment}
                swapSource={swapSource}
                onSlotClick={handleSlotClick}
              />
            </div>

            {/* Room selector strip (inspect mode only) */}
            {!rearrangeMode && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 10 }}>
                {FP_ROOMS.map(r => (
                  <button
                    key={r.id}
                    onClick={() => setActiveRoom(activeRoom === r.id ? null : r.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      padding: '4px 9px',
                      background: activeRoom === r.id ? 'rgba(201,168,76,0.12)' : 'transparent',
                      border: activeRoom === r.id ? '1px solid rgba(201,168,76,0.4)' : '1px solid rgba(248,244,238,0.07)',
                      cursor: 'pointer', transition: 'all 0.2s ease',
                    }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.33rem', letterSpacing: '0.12em', color: activeRoom === r.id ? '#C9A84C' : 'rgba(248,244,238,0.3)' }}>{r.badge}</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.36rem', letterSpacing: '0.12em', color: activeRoom === r.id ? '#F8F4EE' : 'rgba(248,244,238,0.38)' }}>{r.label}</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.34rem', color: 'rgba(248,244,238,0.18)' }}>{r.sqm}m²</span>
                </button>
              ))}
            </div>
            )}
          </div>{/* end left column */}

          {/* ── RIGHT: detail or score panel ── */}
          <div style={{ position: 'sticky', top: 100 }}>
            {!rearrangeMode && (
              <RoomDetailPanel room={room} />
            )}
            {rearrangeMode && (
              <div style={{ border: '1px solid rgba(201,168,76,0.12)', background: 'rgba(10,9,8,0.4)' }}>
                <SpatialScorePanel
                  scores={scores}
                  prevScores={prevScores}
                  feedback={feedback}
                  assignment={assignment}
                  swapSource={swapSource}
                  onReset={handleReset}
                />
              </div>
            )}
          </div>{/* end right column */}

        </div>{/* end 2-col grid */}
      </div>{/* end floor plan section */}

      {/* ── Stats grid ── */}
      <div>
        <h4 style={{ fontFamily: 'var(--font-body)', fontSize: '0.42rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 'clamp(16px, 2vw, 24px)' }}>
          Project Intelligence
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'rgba(248,244,238,0.05)' }}>
          {stats.map((stat, i) => (
            <div key={i} style={{ background: '#0A0908', padding: 'clamp(16px, 2vw, 24px)', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 5 }}>
                <EditableText path={`bim.stats.${i}.value`} as="span"
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(1.8rem, 3vw, 3rem)', color: '#C9A84C', lineHeight: 1, letterSpacing: '-0.03em' }}>
                  {stat.value}
                </EditableText>
                <EditableText path={`bim.stats.${i}.unit`} as="span"
                  style={{ fontFamily: 'var(--font-body)', fontSize: '0.38rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.4)' }}>
                  {stat.unit}
                </EditableText>
              </div>
              <EditableText path={`bim.stats.${i}.label`} as="p"
                style={{ fontFamily: 'var(--font-body)', fontSize: '0.38rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(248,244,238,0.2)' }}>
                {stat.label}
              </EditableText>
              {isEditMode && (
                <button onClick={() => removeItem('bim.stats', i)}
                  style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(220,50,50,0.12)', border: '1px solid rgba(220,50,50,0.25)', color: 'rgba(220,80,80,0.7)', fontSize: '0.3rem', padding: '2px 5px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        {isEditMode && (
          <button onClick={() => addItem('bim.stats', { value: '0', unit: 'unit', label: 'New Stat' })}
            style={{ marginTop: 12, alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(201,168,76,0.08)', border: '1px dashed rgba(201,168,76,0.35)', color: '#C9A84C', fontFamily: 'var(--font-body)', fontSize: '0.38rem', letterSpacing: '0.35em', textTransform: 'uppercase', padding: '7px 14px', cursor: 'pointer' }}>
            + Add Stat
          </button>
        )}
      </div>

      {/* ── Material bars ── */}
      <div>
        <h4 style={{ fontFamily: 'var(--font-body)', fontSize: '0.42rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 'clamp(24px, 3vw, 36px)' }}>
          Material Specification
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 48px' }}>
          {materials.map((m, i) => (
            <div key={i}>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 8, gap: 12 }}>
                <EditableText path={`bim.materials.${i}.label`} as="span"
                  style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'rgba(248,244,238,0.55)', lineHeight: 1.4 }}>
                  {m.label}
                </EditableText>
                <span style={{ display: 'flex', alignItems: 'baseline', gap: 2, flexShrink: 0 }}>
                  <EditableText path={`bim.materials.${i}.pct`} as="span" editStyle={{ minWidth: '2ch' }}
                    style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', color: m.color, lineHeight: 1, letterSpacing: '-0.03em' }}>
                    {String(m.pct)}
                  </EditableText>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.55rem', color: m.color, opacity: 0.7 }}>%</span>
                </span>
              </div>
              <div style={{ height: 5, borderRadius: 2, background: 'rgba(248,244,238,0.05)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: barsPct ? `${m.pct}%` : '0%', background: `linear-gradient(90deg, ${m.color}55, ${m.color})`, borderRadius: 2, transition: `width 1.4s cubic-bezier(0.4,0,0.2,1) ${i * 180}ms` }} />
              </div>
              {isEditMode && (
                <button onClick={() => removeItem('bim.materials', i)}
                  style={{ marginTop: 4, background: 'rgba(220,50,50,0.08)', border: '1px solid rgba(220,50,50,0.2)', color: 'rgba(220,80,80,0.6)', fontFamily: 'var(--font-body)', fontSize: '0.3rem', letterSpacing: '0.2em', padding: '2px 6px', cursor: 'pointer' }}>
                  × Remove
                </button>
              )}
            </div>
          ))}
        </div>
        {isEditMode && (
          <button onClick={() => addItem('bim.materials', { label: 'New Material', pct: 50, color: '#C9A84C' })}
            style={{ marginTop: 20, alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(201,168,76,0.08)', border: '1px dashed rgba(201,168,76,0.35)', color: '#C9A84C', fontFamily: 'var(--font-body)', fontSize: '0.38rem', letterSpacing: '0.35em', textTransform: 'uppercase', padding: '7px 14px', cursor: 'pointer' }}>
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
