/* ─── Types ──────────────────────────────────────────────── */

export interface StatItem     { raw: number; suffix: string; label: string }
export interface HeadlineWord { text: string; gold?: boolean; break?: boolean }

export interface LandingContent {
  eyebrow:    string;
  headline:   HeadlineWord[];
  tagline:    string;
  heroImages: string[];
  stats:      StatItem[];
  ctaPrimary: string;
  ctaSecondary: string;
}

export interface ServiceItem {
  id:          string;
  number:      string;
  eyebrow:     string;
  title:       string;
  subtitle:    string;
  description: string;
  features:    string[];
  image:       string;
  flip:        boolean;
}

export interface ServicesContent {
  sectionEyebrow:   string;
  sectionTitle:     string;
  sectionTitleGold: string;
  sectionSubtitle:  string;
  items:            ServiceItem[];
}

export interface SuiteElement {
  id:          string;
  icon:        string;
  label:       string;
  category:    string;
  description: string;
  material:    string;
  image:       string;
}

export interface SuiteContent {
  sectionEyebrow:   string;
  sectionTitle:     string;
  sectionTitleGold: string;
  sectionSubtitle:  string;
  elements:         SuiteElement[];
}

export interface PortfolioItem {
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

export interface PortfolioContent {
  sectionEyebrow: string;
  categories:     PortfolioItem[];
}

export interface SiteContent {
  landing:   LandingContent;
  services:  ServicesContent;
  suite:     SuiteContent;
  portfolio: PortfolioContent;
}

/* ─── Defaults (mirrors the hardcoded data in each section) ── */

export const DEFAULT_CONTENT: SiteContent = {

  /* ── Landing ── */
  landing: {
    eyebrow: 'Interior Design Studio · Nairobi, Kenya',
    headline: [
      { text: 'Spaces' },
      { text: 'That' },
      { text: 'Tell', break: true },
      { text: 'Stories', gold: true },
    ],
    tagline: 'Crafting extraordinary interiors through bespoke design, BIM technology, and timeless elegance.',
    heroImages: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1920&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&q=85&auto=format&fit=crop',
      '/renders/Luxurious presidential suite Infinity feel 1.png',
    ],
    stats: [
      { raw: 120, suffix: '+', label: 'Projects Delivered' },
      { raw: 8,   suffix: '+', label: 'Years of Excellence' },
      { raw: 98,  suffix: '%', label: 'Client Satisfaction' },
    ],
    ctaPrimary:   'View Portfolio',
    ctaSecondary: 'Our Process',
  },

  /* ── Services ── */
  services: {
    sectionEyebrow:   'What We Offer',
    sectionTitle:     'Design Services',
    sectionTitleGold: 'Built for You',
    sectionSubtitle:  'Every engagement begins with listening. Whether residential, commercial, or a hybrid of both, we tailor our services to fit your vision, budget, and timeline.',
    items: [
      {
        id: 'residential', number: '01', flip: false,
        eyebrow:     'Where Life Happens',
        title:       'Residential Design',
        subtitle:    'Full-home & bespoke interior design for private residences',
        description: 'From concept to completion, we design homes that are unmistakably yours. We begin by listening — to your lifestyle, your rituals, your aspirations — then translate those into spaces of enduring beauty and function.',
        features: [
          'End-to-end design management',
          'Custom furniture & joinery specification',
          'Material procurement & FF&E sourcing',
          'Site supervision & installation',
        ],
        image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1400&q=85&auto=format&fit=crop',
      },
      {
        id: 'commercial', number: '02', flip: true,
        eyebrow:     'Work & Hospitality',
        title:       'Commercial Interiors',
        subtitle:    'Branded environments for offices, hotels & retail',
        description: 'A well-designed commercial space communicates brand before a word is spoken. We craft environments that perform — attracting clients, energising teams, and creating lasting first impressions.',
        features: [
          'Brand-led space planning & design',
          'BIM coordination with MEP consultants',
          'Hospitality & F&B fit-out',
          'Multi-site rollout capability',
        ],
        image: 'https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?w=1400&q=85&auto=format&fit=crop',
      },
      {
        id: 'bim', number: '03', flip: false,
        eyebrow:     'Built on Technology',
        title:       'BIM Visualisation',
        subtitle:    'Photorealistic renders & BIM models before construction begins',
        description: 'Our BIM-first workflow means every decision is informed, every clash is caught early, and every stakeholder can walk through the finished space digitally — months before a single tile is laid.',
        features: [
          'Photorealistic 3D rendering',
          'Full BIM model with material schedules',
          'Virtual reality walkthroughs',
          'Clash detection & coordination reports',
        ],
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=85&auto=format&fit=crop',
      },
      {
        id: 'turnkey', number: '04', flip: true,
        eyebrow:     'Hands-Free Delivery',
        title:       'Turnkey Project Delivery',
        subtitle:    'From design sign-off to final styling — we handle everything',
        description: 'You should arrive to a finished home, not a construction site. Our turnkey service wraps design, procurement, project management, and styling into a single seamless experience — stress-free by design.',
        features: [
          'Full procurement management',
          'Vetted contractor network',
          'Real-time progress reporting',
          'Final styling & art placement',
        ],
        image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1400&q=85&auto=format&fit=crop',
      },
    ],
  },

  /* ── Suite ── */
  suite: {
    sectionEyebrow:   'Interior Design Studio',
    sectionTitle:     'Crafted',
    sectionTitleGold: 'Elements',
    sectionSubtitle:  'Every piece is curated for form and function — selected with precision and placed with intent.',
    elements: [
      {
        id: 'sofa', icon: 'sofa',
        label: 'Modular Sectional', category: 'Furniture',
        description: 'Contemporary modular sofa with deep seating and premium velvet upholstery. Features customizable configuration and hidden storage compartments.',
        material: 'Premium Velvet · Solid Oak Frame · High-Density Foam',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400&q=90&auto=format&fit=crop',
      },
      {
        id: 'lighting', icon: 'lighting',
        label: 'Arc Floor Lamp', category: 'Lighting',
        description: 'Sleek arc floor lamp with marble base and brushed brass finish. Adjustable height and dimmable LED provides warm ambient lighting.',
        material: 'Marble Base · Brushed Brass · LED Technology',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1400&q=90&auto=format&fit=crop',
      },
      {
        id: 'coffee-table', icon: 'coffee-table',
        label: 'Bespoke Coffee Table', category: 'Furniture',
        description: 'Minimalist coffee table with tempered glass top and walnut legs. A lower shelf adds function without sacrificing form.',
        material: 'Tempered Glass · Walnut Wood · Metal Hardware',
        image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=1400&q=90&auto=format&fit=crop',
      },
      {
        id: 'art', icon: 'art',
        label: 'Abstract Wall Art', category: 'Artwork',
        description: 'Large-scale abstract painting with geometric forms and subtle texture. Hand-painted on canvas with archival acrylics.',
        material: 'Acrylic on Canvas · Floating Wood Frame',
        image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1400&q=90&auto=format&fit=crop',
      },
      {
        id: 'plant', icon: 'plant',
        label: 'Statement Greenery', category: 'Botanicals',
        description: 'Large fiddle leaf fig in a handcrafted ceramic planter. Brings life and natural scale to the interior composition.',
        material: 'Live Plant · Handcrafted Ceramic Planter',
        image: 'https://images.unsplash.com/photo-1459156212016-c812468e2115?w=1400&q=90&auto=format&fit=crop',
      },
      {
        id: 'rug', icon: 'rug',
        label: 'Hand-Tufted Area Rug', category: 'Textiles',
        description: 'New Zealand wool rug with a subtle geometric pattern. Defines the conversation zone and anchors the entire space.',
        material: 'NZ Wool · Cotton Backing · Natural Dyes',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1400&q=90&auto=format&fit=crop',
      },
    ],
  },

  /* ── Portfolio ── */
  portfolio: {
    sectionEyebrow: 'Geosite DEVELOPERS · 2026',
    categories: [
      {
        id: 'presidential-suite', title: 'Presidential Suite', type: 'Project',
        subtitle: 'Full Interior Redesign · Westlands', count: 8,
        tags: ['Suite', 'Luxury', 'Full Interior', 'Bespoke'],
        description: 'A complete transformation of a presidential suite. Custom furniture, integrated lighting, hand-selected marble and velvet — every detail considered from floor plan to final finish.',
        image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=900&q=85&auto=format&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1400&q=85&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=1400&q=85&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1400&q=85&auto=format&fit=crop',
        ],
      },
      {
        id: 'blue-spiral-hotel', title: 'Blue Spiral Hotel', type: 'Project',
        subtitle: 'Lobby & Common Areas · Karen', count: 12,
        tags: ['Hotel', 'Commercial', 'BIM', 'Hospitality'],
        description: 'A landmark hospitality project balancing grandeur with warmth. A spiral motif threads through every space — from entrance canopy to corridor ceilings — unifying the entire property.',
        image: 'https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=900&q=85&auto=format&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=1400&q=85&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1400&q=85&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1400&q=85&auto=format&fit=crop',
        ],
      },
      {
        id: 'spiral-tower', title: 'Spiral Tower Complex', type: 'Project',
        subtitle: 'Architectural Concept · Runda', count: 6,
        tags: ['Architecture', 'Mixed-Use', 'Concept', '3D Render'],
        description: 'An architectural concept exploring organic spiral form within a mixed-use programme. BIM-modelled in full, allowing stakeholders to walk through every floor before breaking ground.',
        image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=85&auto=format&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1400&q=85&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1400&q=85&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1400&q=85&auto=format&fit=crop',
        ],
      },
      {
        id: 'signature-development', title: 'Signature Development', type: 'Project',
        subtitle: 'Mixed-Use Premium · Muthaiga', count: 9,
        tags: ['Development', 'Premium', 'Residential', 'Retail'],
        description: 'A signature mixed-use development featuring premium residences above curated retail. Material palette draws from Kenyan stone, reclaimed timber, and locally crafted metalwork.',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=85&auto=format&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1400&q=85&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1400&q=85&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=1400&q=85&auto=format&fit=crop',
        ],
      },
      {
        id: 'bespoke-furniture', title: 'Bespoke Furniture', type: 'Element',
        subtitle: 'Custom Pieces & Upholstery', count: 24,
        tags: ['Sofas', 'Dining Tables', 'Chairs', 'Ottomans'],
        description: "Every furniture piece in our projects is custom-designed and locally fabricated. We work with Nairobi's finest craftsmen to produce pieces that cannot be bought off a showroom floor.",
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=85&auto=format&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400&q=85&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1400&q=85&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=1400&q=85&auto=format&fit=crop',
        ],
      },
      {
        id: 'wall-units', title: 'Custom Wall Units', type: 'Element',
        subtitle: 'Built-In Joinery & Shelving', count: 16,
        tags: ['Entertainment Units', 'Library Walls', 'Storage', 'Walnut'],
        description: 'Custom-built wall units that combine storage with sculpture. From floor-to-ceiling library walls to integrated entertainment systems, each unit is designed to the millimetre.',
        image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=900&q=85&auto=format&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1400&q=85&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1400&q=85&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1400&q=85&auto=format&fit=crop',
        ],
      },
      {
        id: 'statement-lighting', title: 'Statement Lighting', type: 'Element',
        subtitle: 'Ambient, Feature & Task Layers', count: 20,
        tags: ['Pendants', 'Arc Lamps', 'Recessed', 'Cove Lighting'],
        description: 'Lighting transforms space from the functional to the theatrical. We layer ambient, task, and accent sources — each dimmable, each precisely positioned to sculpt the room after dark.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=85&auto=format&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1400&q=85&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1400&q=85&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1400&q=85&auto=format&fit=crop',
        ],
      },
      {
        id: 'premium-flooring', title: 'Premium Flooring', type: 'Element',
        subtitle: 'Oak, Marble & Hand-Tufted Rugs', count: 14,
        tags: ['Engineered Oak', 'Italian Marble', 'NZ Wool Rugs', 'Terrazzo'],
        description: 'The foundation of any great interior. We specify flooring for feel underfoot as much as for visual beauty — from wide-plank engineered oak to book-matched Calacatta marble.',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=85&auto=format&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1400&q=85&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1400&q=85&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400&q=85&auto=format&fit=crop',
        ],
      },
      {
        id: 'curated-artwork', title: 'Curated Artwork', type: 'Element',
        subtitle: 'Paintings, Sculptures & Prints', count: 32,
        tags: ['Abstract', 'Sculptures', 'Photography', 'Ceramics'],
        description: 'Art is the soul of an interior. We source and commission works by emerging and established African artists, placing each piece to create a conversation between art and architecture.',
        image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=900&q=85&auto=format&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1400&q=85&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1400&q=85&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1400&q=85&auto=format&fit=crop',
        ],
      },
      {
        id: 'bathroom-design', title: 'Bathroom Design', type: 'Element',
        subtitle: 'Spa-Level Residential Finishes', count: 18,
        tags: ['Freestanding Tubs', 'Rain Showers', 'Heated Floors', 'Marble'],
        description: 'We design bathrooms as private sanctuaries. Freestanding tubs, rain showers, heated marble floors, and integrated steam — every finish chosen to transform the daily ritual.',
        image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=900&q=85&auto=format&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1400&q=85&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=1400&q=85&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1400&q=85&auto=format&fit=crop',
        ],
      },
      {
        id: 'kitchen-dining', title: 'Kitchen & Dining', type: 'Element',
        subtitle: 'Custom Culinary Spaces', count: 11,
        tags: ['Custom Joinery', 'Stone Islands', 'Integrated Appliances', 'Dining'],
        description: 'The heart of the home, reimagined. Island joinery in natural walnut, stone-topped surfaces, and integrated appliances that disappear into the architecture — made for people who cook.',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=85&auto=format&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1400&q=85&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=1400&q=85&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1400&q=85&auto=format&fit=crop',
        ],
      },
      {
        id: 'textiles-drapery', title: 'Textiles & Drapery', type: 'Element',
        subtitle: 'Soft Furnishings & Window Treatments', count: 28,
        tags: ['Floor-to-Ceiling Drapes', 'Cushions', 'Throws', 'Upholstery'],
        description: 'Textiles bring warmth, texture, and character to any interior. We source from specialist weavers across East Africa — linen, silk, and hand-loomed cotton — each chosen for hand feel first.',
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=85&auto=format&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1400&q=85&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1400&q=85&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400&q=85&auto=format&fit=crop',
        ],
      },
    ],
  },
};

/* ─── Deep-update utility ─────────────────────────────────── */
export function setAtPath(obj: unknown, path: string, value: unknown): unknown {
  const parts = path.split('.');
  return _set(obj, parts, value);
}

function _set(obj: unknown, parts: string[], value: unknown): unknown {
  if (parts.length === 0) return value;
  const [head, ...tail] = parts;
  if (Array.isArray(obj)) {
    const idx = parseInt(head, 10);
    if (isNaN(idx)) return obj;
    const copy = [...obj];
    copy[idx] = _set(copy[idx], tail, value);
    return copy;
  }
  if (obj && typeof obj === 'object') {
    const rec = obj as Record<string, unknown>;
    return { ...rec, [head]: _set(rec[head], tail, value) };
  }
  return { [head]: _set(undefined, tail, value) };
}

/* ─── Deep merge: overrides on top of defaults ─────────────── */
export function deepMerge<T>(defaults: T, overrides: Partial<T>): T {
  if (!overrides || typeof overrides !== 'object') return defaults;
  const result: Record<string, unknown> = { ...(defaults as Record<string, unknown>) };
  for (const key of Object.keys(overrides)) {
    const ov = (overrides as Record<string, unknown>)[key];
    const df = (defaults as Record<string, unknown>)[key];
    if (ov && typeof ov === 'object' && !Array.isArray(ov) && df && typeof df === 'object') {
      result[key] = deepMerge(df, ov as Partial<typeof df>);
    } else if (ov !== undefined) {
      result[key] = ov;
    }
  }
  return result as T;
}
