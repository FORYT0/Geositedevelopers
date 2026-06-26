'use client';
import { useEffect, useRef } from 'react';

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

interface GlassCardProps {
  data: HotspotData;
  onClose: () => void;
}

export function GlassCard({ data, onClose }: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Determine card position — keep it on screen
  const isRight = data.x > 55;
  const isBottom = data.y > 55;

  return (
    <>
      {/* Backdrop click-away */}
      <div
        className="absolute inset-0 z-30"
        onClick={onClose}
        style={{ background: 'rgba(0,0,0,0.15)' }}
      />

      {/* Card */}
      <div
        ref={cardRef}
        className="absolute z-40 glass rounded-2xl overflow-hidden"
        style={{
          left: isRight ? 'auto' : `${Math.min(data.x + 4, 60)}%`,
          right: isRight ? `${100 - data.x + 4}%` : 'auto',
          top: isBottom ? 'auto' : `${Math.min(data.y + 4, 55)}%`,
          bottom: isBottom ? `${100 - data.y + 4}%` : 'auto',
          width: 'clamp(280px, 28vw, 380px)',
          animation: 'fade-in-up 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
          boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,168,76,0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gold top accent bar */}
        <div
          className="h-[2px] w-full"
          style={{ background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }}
        />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span
                className="flex items-center justify-center w-10 h-10 rounded-full text-lg"
                style={{
                  background: 'rgba(201,168,76,0.12)',
                  border: '1px solid rgba(201,168,76,0.3)',
                }}
              >
                {data.icon}
              </span>
              <div>
                <span
                  className="block text-[8px] tracking-[0.4em] uppercase font-body mb-0.5"
                  style={{ color: 'var(--gold)' }}
                >
                  {data.category}
                </span>
                <h3
                  className="font-display font-medium leading-tight"
                  style={{
                    fontSize: 'clamp(1rem, 2vw, 1.3rem)',
                    color: 'var(--warm-white)',
                  }}
                >
                  {data.label}
                </h3>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 flex-shrink-0"
              style={{
                background: 'rgba(201,168,76,0.1)',
                border: '1px solid rgba(201,168,76,0.2)',
                color: 'var(--gold)',
                fontSize: 14,
              }}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Divider */}
          <div
            className="mb-4"
            style={{ height: '1px', background: 'rgba(201,168,76,0.15)' }}
          />

          {/* Description */}
          <p
            className="font-body font-light leading-relaxed mb-5 text-sm"
            style={{ color: 'rgba(248,244,238,0.75)', lineHeight: 1.75 }}
          >
            {data.description}
          </p>

          {/* Details grid */}
          <div className="flex flex-col gap-3">
            <DetailRow label="Materials" value={data.material} />
            <DetailRow label="Origin"    value={data.origin} />
          </div>

          {/* Design accent tag */}
          <div className="mt-5 flex items-center gap-2">
            <span
              className="text-[7px] tracking-[0.4em] uppercase font-body px-3 py-1.5 rounded-full"
              style={{
                background: 'rgba(201,168,76,0.1)',
                border: '1px solid rgba(201,168,76,0.25)',
                color: 'var(--gold)',
              }}
            >
              ✦ Design Studio Piece
            </span>
          </div>
        </div>

        {/* Bottom gold accent */}
        <div
          className="h-[1px] w-full"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)' }}
        />
      </div>
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span
        className="text-[8px] tracking-[0.35em] uppercase font-body"
        style={{ color: 'var(--gold)' }}
      >
        {label}
      </span>
      <span
        className="text-[11px] font-body font-light"
        style={{ color: 'rgba(248,244,238,0.6)', lineHeight: 1.5 }}
      >
        {value}
      </span>
    </div>
  );
}
