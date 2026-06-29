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
  image:       string | string[];
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
  image:       string | string[];
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
  image:       string | string[];
  count:       number;
  tags:        string[];
  description: string;
  gallery:     string[];
}

export interface PortfolioContent {
  sectionEyebrow: string;
  categories:     PortfolioItem[];
}

/* ─── Process ─────────────────────────────────────────────── */

export interface ProcessStep {
  number:      string;
  title:       string;
  subtitle:    string;
  description: string;
  image:       string | string[];
}

export interface ProcessContent {
  eyebrow:     string;
  heading:     string;
  headingGold: string;
  steps:       ProcessStep[];
}

/* ─── Testimonials ────────────────────────────────────────── */

export interface TestimonialItem {
  quote:    string;
  name:     string;
  role:     string;
  project:  string;
  initials: string;
}

export interface TestimonialsContent {
  eyebrow:     string;
  heading:     string;
  headingGold: string;
  bgImage:     string;
  items:       TestimonialItem[];
}

/* ─── BIM ─────────────────────────────────────────────────── */

export interface BIMStat {
  value: string;
  unit:  string;
  label: string;
}

export interface BIMMaterial {
  label: string;
  pct:   number;
  color: string;
}

export interface BIMContent {
  eyebrow:     string;
  heading:     string;
  headingGold: string;
  description: string;
  stats:       BIMStat[];
  materials:   BIMMaterial[];
}

/* ─── Footer ──────────────────────────────────────────────── */

export interface FooterContent {
  tagline:         string;
  ctaEyebrow:      string;
  ctaHeading:      string;
  ctaBody:         string;
  ctaImage:        string;
  contactEmail:    string;
  contactPhone:    string;
  contactHours:    string;
  newsletterLabel: string;
  copyright:       string;
}

/* ─── Nav ─────────────────────────────────────────────────── */

export interface NavLink {
  label: string;
  href:  string;
}

export interface NavContent {
  links:        NavLink[];
  enquireLabel: string;
}

/* ─── Before / After ──────────────────────────────────────── */

export interface BeforeAfterSpace {
  id:       string;
  label:    string;
  location: string;
  before:   string;
  after:    string;
  quote:    string;
  client:   string;
}

export interface BeforeAfterContent {
  eyebrow:     string;
  heading:     string;
  headingGold: string;
  spaces:      BeforeAfterSpace[];
}

/* ─── Root ────────────────────────────────────────────────── */

export interface SiteContent {
  landing:      LandingContent;
  services:     ServicesContent;
  suite:        SuiteContent;
  portfolio:    PortfolioContent;
  process:      ProcessContent;
  testimonials: TestimonialsContent;
  bim:          BIMContent;
  footer:       FooterContent;
  nav:          NavContent;
  beforeAfter:  BeforeAfterContent;
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

  /* ── Process ── */
  process: {
    eyebrow:     'How We Work',
    heading:     'Our Design',
    headingGold: 'Process',
    steps: [
      {
        number:      '01',
        title:       'Discovery',
        subtitle:    'Understanding Your Vision',
        description: 'We begin with an in-depth consultation to understand your lifestyle, aesthetic preferences, and spatial goals. Every detail matters — from morning rituals to entertaining habits.',
        image:       'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=85&auto=format&fit=crop',
      },
      {
        number:      '02',
        title:       'Concept',
        subtitle:    'Design Proposals',
        description: 'Our designers craft multiple bespoke concepts tailored specifically to your space. You receive mood boards, material palettes, and layout options — each a distinct design narrative.',
        image:       'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=85&auto=format&fit=crop',
      },
      {
        number:      '03',
        title:       'Visualise',
        subtitle:    '3D & BIM Rendering',
        description: 'Walk through photorealistic 3D renders and BIM models of your space before a single nail is hammered. Experience your new home virtually — lighting, materials, and all.',
        image:       'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=85&auto=format&fit=crop',
      },
      {
        number:      '04',
        title:       'Deliver',
        subtitle:    'Flawless Execution',
        description: 'Our trusted network of craftsmen and project managers bring the vision to life with surgical precision. We handle procurement, installation, and final styling — you simply arrive.',
        image:       'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=85&auto=format&fit=crop',
      },
    ],
  },

  /* ── Testimonials ── */
  testimonials: {
    eyebrow:     'Client Stories',
    heading:     'Happy Clients.',
    headingGold: 'Beautiful Spaces.',
    bgImage:     'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1920&q=85&auto=format&fit=crop',
    items: [
      {
        quote:    'Geosite DEVELOPERS transformed our family home into something out of a magazine. Every detail was considered. The BIM walkthrough before construction started gave us total confidence.',
        name:     'Amara Okonkwo',
        role:     'CEO, Horizon Capital',
        project:  'Runda Villa — Full Interior',
        initials: 'AO',
      },
      {
        quote:    'Working with the Geosite team was effortless. They understood our brief immediately and delivered a 3D render so detailed we felt like we were already living there.',
        name:     'James & Wanjiru Njoroge',
        role:     'Entrepreneurs',
        project:  'Karen Residence — Living & Master',
        initials: 'JW',
      },
      {
        quote:    "The before/after is genuinely shocking. Our kitchen went from dated to something I'm proud to show off. Delivered on time, on budget, and beyond expectation.",
        name:     'Chef Michael Kariuki',
        role:     'Executive Chef',
        project:  'Westlands Penthouse — Kitchen',
        initials: 'MK',
      },
      {
        quote:    'The attention to Kenyan heritage materials mixed with contemporary design is what sets Geosite apart. Our office now tells our brand story before anyone says a word.',
        name:     'Fatuma Hassan',
        role:     'Co-founder, Nairobi Design Week',
        project:  'CBD Office — Commercial Interior',
        initials: 'FH',
      },
    ],
  },

  /* ── BIM ── */
  bim: {
    eyebrow:     'BIM Breakdown',
    heading:     'Project',
    headingGold: 'Intelligence',
    description: 'Every Geosite project is modelled in full BIM — giving you a precise digital twin before the first material is ordered.',
    stats: [
      { value: '210', unit: 'sqm',  label: 'Total Area'   },
      { value: '4',   unit: 'beds', label: 'Bedrooms'     },
      { value: '3',   unit: 'mo',   label: 'Timeline'     },
      { value: '12',  unit: 'wks',  label: 'Design Phase' },
    ],
    materials: [
      { label: 'Engineered Oak Flooring',    pct: 85, color: '#C9A84C' },
      { label: 'Italian Marble (Bathrooms)', pct: 60, color: '#9B8B6E' },
      { label: 'Custom Joinery (Walnut)',    pct: 72, color: '#8A7860' },
      { label: 'Venetian Plaster Walls',     pct: 45, color: '#A09278' },
    ],
  },

  /* ── Footer ── */
  footer: {
    tagline:         'Crafting exceptional interiors through bespoke design, BIM technology, and timeless elegance for modern African living.',
    ctaEyebrow:      'Begin Your Transformation',
    ctaHeading:      'Imagine what your space could become.',
    ctaBody:         'We take on a limited number of signature projects each year. Reach out early to secure your slot.',
    ctaImage:        '/renders/Blue Spiral Hotel Ground full render.png',
    contactEmail:    'studio@geositedevelopers.co.ke',
    contactPhone:    '+254 700 000 000',
    contactHours:    'Mon – Fri, 8am – 6pm EAT',
    newsletterLabel: 'Design Insights Newsletter',
    copyright:       '© 2026 Geosite DEVELOPERS. All Rights Reserved. Designed in Nairobi, Kenya.',
  },

  /* ── Nav ── */
  nav: {
    links: [
      { label: 'Studio',    href: '#landing'     },
      { label: 'Process',   href: '#process'     },
      { label: 'Services',  href: '#services'    },
      { label: 'Projects',  href: '#before-after'},
      { label: 'Portfolio', href: '#portfolio'   },
      { label: 'Contact',   href: '#footer'      },
    ],
    enquireLabel: 'Enquire',
  },

  /* ── Before / After ── */
  beforeAfter: {
    eyebrow:     'Project Transformations',
    heading:     'Model to',
    headingGold: 'Reality',
    spaces: [
      {
        id:       'nova-reception',
        label:    'NOVA Atelier Reception',
        location: 'Commercial Interior · Nairobi',
        before:   '/renders/NOVA Atelica Reception rhino.png',
        after:    '/renders/NOVA Atelica Reception render 1.png',
        quote:    'The sinusoidal light wall was our boldest brief — Geosite delivered it flawlessly.',
        client:   'NOVA Atelier',
      },
      {
        id:       'blue-spiral-tower',
        label:    'Blue Spiral Tower',
        location: 'Mixed-Use Development · Karen',
        before:   '/renders/Blue Spiral Hotel Ground.jpg',
        after:    '/renders/Blue Spiral Hotel Ground full render.png',
        quote:    'From structural model to finished landmark — the process was seamless.',
        client:   'Arch. Kariuki',
      },
      {
        id:       'ade-living',
        label:    'Ade Residence — Living Room',
        location: 'Residential Interior · Runda',
        before:   '/renders/Screenshot 2024-11-26 144316.png',
        after:    '/renders/Ade Int_13 - Photo.jpg',
        quote:    'They transformed our vision into a living, breathing space.',
        client:   'Amara O.',
      },
      {
        id:       'hotel-corridor',
        label:    'Hotel Ground Floor',
        location: 'Hospitality · Westlands',
        before:   '/renders/Screenshot 2026-04-07 163957.png',
        after:    '/renders/Blue Spiral Hotel Entrance Final.png',
        quote:    'The BIM walkthrough gave us total confidence before a nail was hammered.',
        client:   'James & Wanjiru N.',
      },
      {
        id:       'presidential-suite',
        label:    'Presidential Suite',
        location: 'Luxury Suite · Westlands',
        before:   '/renders/Screenshot 2026-04-15 162323.png',
        after:    '/renders/Luxurious presidential suite Infinity feel 1.png',
        quote:    'Geosite turned our concept sketch into a living masterpiece.',
        client:   'Amara K.',
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
