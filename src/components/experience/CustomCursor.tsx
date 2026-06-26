'use client';
import { useEffect, useState } from 'react';

export function CustomCursor() {
  const [pos,       setPos]       = useState({ x: -100, y: -100 });
  const [trail,     setTrail]     = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [visible,   setVisible]   = useState(false);

  useEffect(() => {
    let animId: number;
    let tx = -100, ty = -100;
    let cx = -100, cy = -100;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
      const el = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(el).cursor === 'pointer' ||
        !!el.closest('button, a, [role="button"], input, select, textarea, label')
      );
    };

    const onLeave  = () => setVisible(false);
    const onEnter  = () => setVisible(true);

    // Lag the ring behind the dot
    const animate = () => {
      cx += (tx - cx) * 0.11;
      cy += (ty - cy) * 0.11;
      setTrail({ x: cx, y: cy });
      animId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Only show on non-touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return null;

  return (
    <>
      {/* Lagging outer ring */}
      <div
        aria-hidden="true"
        style={{
          position:      'fixed',
          pointerEvents: 'none',
          zIndex:        99999,
          left:          trail.x,
          top:           trail.y,
          width:         isPointer ? 48 : 34,
          height:        isPointer ? 48 : 34,
          borderRadius:  '50%',
          border:        `1px solid rgba(201,168,76,${isPointer ? 0.85 : 0.5})`,
          transform:     'translate(-50%, -50%)',
          transition:    'width 0.25s ease, height 0.25s ease, border-color 0.25s ease, opacity 0.3s ease',
          opacity:       visible ? 1 : 0,
          backdropFilter: 'none',
        }}
      />
      {/* Precise inner dot */}
      <div
        aria-hidden="true"
        style={{
          position:      'fixed',
          pointerEvents: 'none',
          zIndex:        99999,
          left:          pos.x,
          top:           pos.y,
          width:         isPointer ? 7 : 4,
          height:        isPointer ? 7 : 4,
          borderRadius:  '50%',
          background:    '#C9A84C',
          transform:     'translate(-50%, -50%)',
          transition:    'width 0.2s ease, height 0.2s ease, opacity 0.3s ease',
          opacity:       visible ? 1 : 0,
        }}
      />
    </>
  );
}
