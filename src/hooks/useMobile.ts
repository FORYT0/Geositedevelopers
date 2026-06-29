'use client';
import { useEffect, useState } from 'react';

/**
 * Returns true when the viewport is narrower than `breakpoint` pixels.
 * SSR-safe: starts false, updates after hydration.
 */
export function useMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);
  return isMobile;
}
