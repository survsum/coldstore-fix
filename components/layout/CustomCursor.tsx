'use client';

import { useEffect, useRef, useState } from 'react';

interface Trail { x: number; y: number; id: number; opacity: number; scale: number; }

function CursorInner() {
  const cursorRef  = useRef<HTMLDivElement>(null);
  const ringRef    = useRef<HTMLDivElement>(null);
  const pos        = useRef({ x: -200, y: -200 });
  const ringPos    = useRef({ x: -200, y: -200 });
  const frameRef   = useRef<number>(0);
  const counterRef = useRef(0);
  const [trails,     setTrails]     = useState<Trail[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    // Triple-check: no cursor on touch/mobile devices
    const isTouch = (
      window.matchMedia('(hover: none)').matches ||
      window.matchMedia('(pointer: coarse)').matches ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0
    );
    if (isTouch) return; // exit — no cursor on mobile

    document.documentElement.style.cursor = 'none';

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      const id = counterRef.current++;
      setTrails(prev => [...prev.slice(-15), { x: e.clientX, y: e.clientY, id, opacity: 1, scale: 1 }]);
    };
    const onDown = () => setIsClicking(true);
    const onUp   = () => setIsClicking(false);
    const onOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a,button,[role="button"],input,textarea,select')) setIsHovering(true);
    };
    const onOut = () => setIsHovering(false);

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);

    const animate = () => {
      const dot  = cursorRef.current;
      const ring = ringRef.current;
      if (dot) dot.style.transform = `translate(${pos.current.x - 5}px,${pos.current.y - 5}px) scale(${isClicking ? 0.6 : 1})`;
      if (ring) {
        ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.12;
        ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.12;
        const s = isHovering ? 2.2 : isClicking ? 0.8 : 1;
        ring.style.transform = `translate(${ringPos.current.x - 20}px,${ringPos.current.y - 20}px) scale(${s})`;
      }
      frameRef.current = requestAnimationFrame(animate);
    };
    animate();

    const fade = setInterval(() => {
      setTrails(prev => prev.map(t => ({ ...t, opacity: t.opacity - 0.09, scale: t.scale * 0.93 })).filter(t => t.opacity > 0));
    }, 30);

    return () => {
      document.documentElement.style.cursor = '';
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      cancelAnimationFrame(frameRef.current);
      clearInterval(fade);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 9999 }}>
      {trails.map((t, i) => (
        <div key={t.id} className="absolute rounded-full" style={{
          left: t.x - 3, top: t.y - 3, width: 6, height: 6,
          opacity: t.opacity * 0.55, transform: `scale(${t.scale})`,
          background: i % 5 === 0 ? `rgba(230,48,48,${t.opacity})` : `rgba(21,101,192,${t.opacity})`,
        }} />
      ))}
      <div ref={cursorRef} className="absolute rounded-full" style={{
        width: 10, height: 10, top: 0, left: 0, willChange: 'transform',
        background: isHovering ? '#e63030' : '#1565c0',
        boxShadow: isHovering ? '0 0 12px rgba(230,48,48,0.9)' : '0 0 12px rgba(21,101,192,0.9)',
        transition: 'background 0.2s, box-shadow 0.2s',
      }} />
      <div ref={ringRef} className="absolute rounded-full border-2" style={{
        width: 40, height: 40, top: 0, left: 0, willChange: 'transform',
        borderColor: isHovering ? 'rgba(230,48,48,0.7)' : 'rgba(21,101,192,0.6)',
        transition: 'border-color 0.3s, transform 0.15s ease-out',
      }} />
    </div>
  );
}

export default function CustomCursor() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    // Only mount cursor component on true pointer devices
    const isPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (isPointer) setShow(true);
  }, []);
  if (!show) return null;
  return <CursorInner />;
}
