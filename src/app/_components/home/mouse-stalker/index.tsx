'use client';

import { useEffect, useRef } from 'react';
import './styles.scss';

interface MouseStalkerProps {
  ready: boolean;
}

const MouseStalker = ({ ready }: MouseStalkerProps) => {
  const stalkerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!stalkerRef.current || !ready) return;

    const stalker = stalkerRef.current;

    let x = 0;
    let y = 0;
    let rafId: null | number = null;

    const handleMouseMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;

      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          stalker.style.transform = `translate3d(${x}px, ${y}px, 0)`;
          rafId = null;
        });
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('.swiper-slide a')) {
        stalker.classList.add('isActive');
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('.swiper-slide a')) {
        stalker.classList.remove('isActive');
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [ready]);

  return (
    <div className="mouseStalker" ref={stalkerRef}>
      <span aria-hidden="true"></span>
    </div>
  );
};

export default MouseStalker;
