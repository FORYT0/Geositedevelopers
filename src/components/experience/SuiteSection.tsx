'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

interface HotspotData {
  id: string;
  x: number;
  y: number;
  label: string;
  category: string;
  description: string;
  material: string;
  origin: string;
  icon: string;
}

const HOTSPOTS: HotspotData[] = [
  {
    id: 'sofa',
    x: 50,
    y: 55,
    label: 'Modular Sectional',
    category: 'Furniture',
    description: 'Contemporary modular sofa with deep seating and premium velvet upholstery. Features customizable configuration and hidden storage compartments.',
    material: 'Premium Velvet · Solid Oak Frame · High-Density Foam',
    origin: 'Design Studio, 2025',
    icon: '🛋',
  },
  {
    id: 'lighting',
    x: 25,
    y: 30,
    label: 'Arc Floor Lamp',
    category: 'Lighting',
    description: 'Sleek arc floor lamp with marble base and brushed brass finish. Adjustable height and dimmable LED bulb provide warm ambient lighting.',
    material: 'Marble Base · Brushed Brass · LED Technology',
    origin: 'Studio Collection, 2025',
    icon: '✦',
  },
  {
    id: 'coffee-table',
    x: 50,
    y: 75,
    label: 'Coffee Table',
    category: 'Furniture',
    description: 'Minimalist coffee table with tempered glass top and walnut wood legs. Features a lower shelf for magazines and decorative items.',
    material: 'Tempered Glass · Walnut Wood · Metal Hardware',
    origin: 'Craft Workshop, 2025',
    icon: '🪑',
  },
  {
    id: 'art',
    x: 75,
    y: 35,
    label: 'Abstract Wall Art',
    category: 'Artwork',
    description: 'Large-scale abstract painting with geometric forms and subtle texture. Hand-painted on canvas with acrylics.',
    material: 'Acrylic on Canvas · Floating Wood Frame',
    origin: 'Artist Studio, 2024',
    icon: '🖼',
  },
  {
    id: 'plant',
    x: 15,
    y: 65,
    label: 'Statement Plant',
    category: 'Decor',
    description: 'Large fiddle leaf fig tree in ceramic planter. Brings life and natural beauty to indoor spaces.',
    material: 'Live Plant · Handcrafted Ceramic Planter',
    origin: 'Botanical Collection, 2025',
    icon: '🌿',
  },
  {
    id: 'rug',
    x: 50,
    y: 85,
    label: 'Area Rug',
    category: 'Textiles',
    description: 'Hand-tufted wool rug with subtle geometric pattern. Soft underfoot and durable for high-traffic areas.',
    material: 'New Zealand Wool · Cotton Backing · Natural Dyes',
    origin: 'Textile Atelier, 2025',
    icon: '🟫',
  },
];

function GlowingHotspot({
  data,
  visible,
  active,
  mousePos,
  onClick,
}: {
  data: HotspotData;
  visible: boolean;
  active: boolean;
  mousePos: { x: number; y: number };
  onClick: () => void;
}) {
  const hotspotRef = useRef<HTMLButtonElement>(null);
  const [hotspotRect, setHotspotRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (hotspotRef.current) {
      setHotspotRect(hotspotRef.current.getBoundingClientRect());
    }
  }, []);

  const distance = hotspotRect
    ? Math.sqrt(
        Math.pow(mousePos.x - (hotspotRect.left + hotspotRect.width / 2), 2) +
        Math.pow(mousePos.y - (hotspotRect.top + hotspotRect.height / 2), 2)
      )
    : 1000;

  const maxDistance = 300;
  const proximity = Math.max(0, 1 - distance / maxDistance);
  const glowIntensity = active ? 1 : 0.3 + proximity * 0.7;
  const glowSize = active ? 60 : 30 + proximity * 30;

  return (
    <button
      ref={hotspotRef}
      onClick={onClick}
      className="absolute cursor-gold group"
      style={{
        left: `${data.x}%`,
        top: `${data.y}%`,
        transform: 'translate(-50%, -50%)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.8s ease',
        zIndex: 20,
        background: 'none',
        border: 'none',
        padding: 0,
      }}
      aria-label={`View details: ${data.label}`}
    >
      <div
        className="absolute rounded-full transition-all duration-300 ease-out"
        style={{
          width: glowSize,
          height: glowSize,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, rgba(201,168,76,${glowIntensity * 0.4}) 0%, rgba(201,168,76,${glowIntensity * 0.1}) 50%, transparent 70%)`,
          animation: active ? 'pulse 1.5s ease-in-out infinite' : 'none',
        }}
      />
      <div
        className="relative flex items-center justify-center rounded-full transition-all duration-300"
        style={{
          width: 16,
          height: 16,
          background: active ? 'var(--gold)' : `rgba(201,168,76,${0.6 + proximity * 0.4})`,
          border: '2px solid rgba(255,255,255,0.8)',
          boxShadow: active
            ? `0 0 0 6px rgba(201,168,76,${0.4 + proximity * 0.3}), 0 4px 20px rgba(201,168,76,${0.5 + proximity * 0.3})`
            : `0 0 0 3px rgba(201,168,76,${proximity * 0.4}), 0 2px 12px rgba(0,0,0,${0.3 + proximity * 0.2})`,
        }}
      />
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-full mb-4 whitespace-nowrap px-4 py-2 rounded-lg text-[10px] tracking-[0.25em] uppercase font-body pointer-events-none transition-all duration-300"
        style={{
          background: 'rgba(13,13,13,0.9)',
          color: 'var(--gold-light)',
          border: `1px solid rgba(201,168,76,${0.3 + proximity * 0.4})`,
          backdropFilter: 'blur(10px)',
          opacity: proximity > 0.2 ? 1 : 0,
          transform: `translateY(${proximity > 0.2 ? 0 : 10}px) scale(${proximity > 0.2 ? 1 : 0.9})`,
        }}
      >
        {data.label}
      </div>
    </button>
  );
}

function GlassCard({ data, onClose }: { data: HotspotData; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const isRight = data.x > 55;
  const isBottom = data.y > 55;

  return (
    <>
      <div
        className="absolute inset-0 z-30"
        onClick={onClose}
        style={{ background: 'rgba(0,0,0,0.3)' }}
      />
      <div
        className="absolute z-40 glass rounded-2xl overflow-hidden"
        style={{
          left: isRight ? 'auto' : `${Math.min(data.x + 5, 55)}%`,
          right: isRight ? `${100 - data.x + 5}%` : 'auto',
          top: isBottom ? 'auto' : `${Math.min(data.y + 5, 50)}%`,
          bottom: isBottom ? `${100 - data.y + 5}%` : 'auto',
          width: 'clamp(320px, 35vw, 420px)',
          animation: 'fade-in-up 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
          boxShadow: '0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(201,168,76,0.3)',
          backdropFilter: 'blur(20px)',
          background: 'rgba(13,13,13,0.85)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="h-[3px] w-full"
          style={{ background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }}
        />
        <div className="p-7">
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-4">
              <span
                className="flex items-center justify-center w-12 h-12 rounded-full text-2xl"
                style={{
                  background: 'rgba(201,168,76,0.15)',
                  border: '2px solid rgba(201,168,76,0.4)',
                }}
              >
                {data.icon}
              </span>
              <div>
                <span
                  className="block text-[9px] tracking-[0.45em] uppercase font-body mb-1"
                  style={{ color: 'var(--gold)' }}
                >
                  {data.category}
                </span>
                <h3
                  className="font-display font-medium leading-tight"
                  style={{
                    fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
                    color: 'var(--warm-white)',
                  }}
                >
                  {data.label}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 flex-shrink-0"
              style={{
                background: 'rgba(201,168,76,0.15)',
                border: '2px solid rgba(201,168,76,0.3)',
                color: 'var(--gold)',
                fontSize: 16,
              }}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="mb-5" style={{ height: '1px', background: 'rgba(201,168,76,0.2)' }} />
          <p
            className="font-body font-light leading-relaxed mb-6 text-base"
            style={{ color: 'rgba(248,244,238,0.8)', lineHeight: 1.85 }}
          >
            {data.description}
          </p>
          <div className="flex flex-col gap-4">
            <DetailRow label="Materials" value={data.material} />
            <DetailRow label="Origin" value={data.origin} />
          </div>
          <div className="mt-6 flex items-center gap-3">
            <span
              className="text-[8px] tracking-[0.45em] uppercase font-body px-4 py-2 rounded-full"
              style={{
                background: 'rgba(201,168,76,0.15)',
                border: '1px solid rgba(201,168,76,0.35)',
                color: 'var(--gold)',
              }}
            >
              ✦ Design Studio Piece
            </span>
          </div>
        </div>
        <div
          className="h-[2px] w-full"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)' }}
        />
      </div>
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span
        className="text-[9px] tracking-[0.4em] uppercase font-body"
        style={{ color: 'var(--gold)' }}
      >
        {label}
      </span>
      <span
        className="text-[12px] font-body font-light"
        style={{ color: 'rgba(248,244,238,0.65)', lineHeight: 1.6 }}
      >
        {value}
      </span>
    </div>
  );
}

export function SuiteSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<HotspotData | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
      setProgress(p);
      if (p > 0.05) setRevealed(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  const closeCard = useCallback(() => setActiveHotspot(null), []);

  const imageScale = Math.max(1, 1.35 - progress * 0.35);
  const brightness = 0.5 + progress * 0.5;

  return (
    <section
      id="suite"
      ref={sectionRef}
      className="relative w-full"
      style={{ height: '280vh' }}
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        <div
          className="absolute inset-0 zoom-image"
          style={{
            transform: `scale(${imageScale})`,
            filter: `brightness(${brightness})`,
            transition: 'transform 0.08s linear, filter 0.08s linear',
          }}
        >
          <img
            src="/renders/Luxurious presidential suite Infinity feel 1.png"
            alt="Modern Living Space — Interior Design"
            className="w-full h-full object-cover object-center"
            draggable={false}
          />
        </div>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, transparent 40%, rgba(13,13,13,0.7) 100%)`,
          }}
        />
        <div
          className="absolute inset-x-0 top-0 h-32 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(13,13,13,0.8), transparent)' }}
        />
        <div
          className="absolute top-28 left-8 md:left-20 flex flex-col gap-2"
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 1s ease, transform 1s ease',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="gold-line" />
            <span
              className="text-[9px] tracking-[0.5em] uppercase font-body"
              style={{ color: 'var(--gold)' }}
            >
              Interior Design Studio · Living Space
            </span>
          </div>
          <h2
            className="font-display font-light"
            style={{
              fontSize: 'clamp(2rem, 5vw, 4.5rem)',
              color: 'var(--warm-white)',
              letterSpacing: '-0.01em',
              lineHeight: 1,
            }}
          >
            Modern
            <br />
            <em style={{ color: 'var(--gold-light)', fontStyle: 'italic' }}>Living</em>
          </h2>
        </div>
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{
            opacity: revealed && progress < 0.7 ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}
        >
          <span
            className="text-[9px] tracking-[0.4em] uppercase font-body"
            style={{ color: 'var(--gold)' }}
          >
            Tap the hotspots to explore
          </span>
          <div
            className="w-px h-8"
            style={{ background: 'linear-gradient(to bottom, var(--gold), transparent)' }}
          />
        </div>
        {HOTSPOTS.map((spot) => (
          <GlowingHotspot
            key={spot.id}
            data={spot}
            visible={revealed && progress > 0.1}
            active={activeHotspot?.id === spot.id}
            mousePos={mousePos}
            onClick={() => setActiveHotspot(activeHotspot?.id === spot.id ? null : spot)}
          />
        ))}
        {activeHotspot && (
          <GlassCard data={activeHotspot} onClose={closeCard} />
        )}
      </div>
    </section>
  );
}
