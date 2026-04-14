'use client';

import { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef<number>(0);
  const scrollRef = useRef(0);
  const mouseRef  = useRef({ x: 0.5, y: 0.5 });
  const isMobileRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const context: CanvasRenderingContext2D = ctx;

    // Detect mobile once — no parallax/mouse on touch devices
    isMobileRef.current = window.matchMedia('(hover: none), (pointer: coarse)').matches;

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width  = W;
    canvas.height = H;

    const isDark = () => document.documentElement.classList.contains('dark');

    // Mouse — desktop only
    const onMouse = (e: MouseEvent) => {
      if (isMobileRef.current) return;
      mouseRef.current = { x: e.clientX / W, y: e.clientY / H };
    };
    window.addEventListener('mousemove', onMouse, { passive: true });

    const onScroll = () => { scrollRef.current = window.scrollY; };
    window.addEventListener('scroll', onScroll, { passive: true });

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        W = window.innerWidth; H = window.innerHeight;
        canvas.width = W; canvas.height = H;
        isMobileRef.current = window.matchMedia('(hover: none), (pointer: coarse)').matches;
        buildMountains();
      }, 150); // debounce resize to stop glitch
    };
    window.addEventListener('resize', onResize);

    // ── Snowflakes ─────────────────────────────────────────────
    interface Flake {
      x: number; y: number; r: number; speed: number;
      drift: number; phase: number; opacity: number; layer: number;
    }

    // Fewer flakes on mobile for performance
    const FLAKE_COUNT = isMobileRef.current ? 80 : 200;
    const flakes: Flake[] = [];

    function makeFlake(): Flake {
      const layer = Math.floor(Math.random() * 3);
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        r: layer === 0 ? 0.8 + Math.random() * 1.2
         : layer === 1 ? 1.5 + Math.random() * 2
         :               2.5 + Math.random() * 3,
        speed: layer === 0 ? 0.3 + Math.random() * 0.4
             : layer === 1 ? 0.6 + Math.random() * 0.6
             :               1.0 + Math.random() * 1.2,
        drift: (Math.random() - 0.5) * 0.4,
        phase: Math.random() * Math.PI * 2,
        opacity: layer === 0 ? 0.25 + Math.random() * 0.3
               : layer === 1 ? 0.4 + Math.random() * 0.35
               :               0.6 + Math.random() * 0.3,
        layer,
      };
    }
    for (let i = 0; i < FLAKE_COUNT; i++) flakes.push(makeFlake());

    // ── Mountain layers ────────────────────────────────────────
    interface MountainLayer {
      points: { x: number; y: number }[];
      fillDark: string; fillLight: string;
      parallaxX: number; parallaxY: number;
    }
    let mountains: MountainLayer[] = [];

    function makePts(count: number, yBase: number, yRange: number, rough: number) {
      const pts: { x: number; y: number }[] = [];
      const step = W / (count - 1);
      for (let i = 0; i < count; i++) {
        const x = i * step;
        let y: number;
        if (i === 0 || i === count - 1) { y = H; }
        else {
          const t = i / (count - 1);
          const wave = Math.sin(t * Math.PI * (2 + Math.random())) * yRange * H;
          y = yBase * H - Math.abs(wave) + (Math.random() - 0.3) * rough * H;
          y = Math.max(yBase * H - yRange * H * 1.2, Math.min(yBase * H + 20, y));
        }
        pts.push({ x, y });
      }
      return pts;
    }

    function buildMountains() {
      mountains = [
        { points: makePts(14, 0.52, 0.28, 0.04), fillDark: '#1a2535', fillLight: '#8aa4c8', parallaxX: 10, parallaxY: 5 },
        { points: makePts(10, 0.62, 0.22, 0.03), fillDark: '#111c2a', fillLight: '#5a7ba4', parallaxX: 18, parallaxY: 8 },
        { points: makePts(8,  0.72, 0.18, 0.025), fillDark: '#0a1320', fillLight: '#3a5a80', parallaxX: 28, parallaxY: 12 },
        { points: makePts(6,  0.82, 0.08, 0.015), fillDark: '#070e1a', fillLight: '#2a4060', parallaxX: 40, parallaxY: 16 },
      ];
    }
    buildMountains();

    function drawMountain(layer: MountainLayer, mx: number, my: number, dark: boolean) {
      // No parallax on mobile — prevents scroll glitch
      const mobile = isMobileRef.current;
      const ox = mobile ? 0 : (mx - 0.5) * layer.parallaxX;
      const oy = mobile ? 0 : (my - 0.5) * layer.parallaxY;
      const pts = layer.points;
      context.save();
      context.translate(ox, oy);
      context.beginPath();
      context.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        const prev = pts[i - 1], curr = pts[i];
        const cpx = (prev.x + curr.x) / 2;
        context.bezierCurveTo(cpx, prev.y, cpx, curr.y, curr.x, curr.y);
      }
      context.lineTo(W + 60, H + 60);
      context.lineTo(-60, H + 60);
      context.closePath();
      context.fillStyle = dark ? layer.fillDark : layer.fillLight;
      context.fill();

      // Snow caps
      for (let i = 1; i < pts.length - 1; i++) {
        const p = pts[i], prev = pts[i - 1], next = pts[i + 1];
        if (p.y < prev.y && p.y < next.y) {
          const snowDepth = Math.min(((prev.y + next.y) / 2 - p.y) * 0.55, 60);
          context.beginPath();
          context.moveTo(prev.x + (p.x - prev.x) * 0.35, p.y + snowDepth * 0.8);
          context.bezierCurveTo(p.x - 30, p.y + snowDepth * 0.3, p.x - 10, p.y - 8, p.x, p.y - 4);
          context.bezierCurveTo(p.x + 10, p.y - 8, p.x + 30, p.y + snowDepth * 0.3, next.x - (next.x - p.x) * 0.35, p.y + snowDepth * 0.8);
          context.closePath();
          const sg = context.createLinearGradient(p.x, p.y - 10, p.x, p.y + snowDepth);
          sg.addColorStop(0, dark ? 'rgba(230,245,255,0.95)' : 'rgba(255,255,255,1)');
          sg.addColorStop(1, 'rgba(255,255,255,0)');
          context.fillStyle = sg;
          context.fill();
        }
      }
      context.restore();
    }

    function drawSky(dark: boolean) {
      const g = context.createLinearGradient(0, 0, 0, H);
      if (dark) {
        g.addColorStop(0, '#020c1a'); g.addColorStop(0.4, '#051830');
        g.addColorStop(0.7, '#0a2240'); g.addColorStop(1, '#0d1f35');
      } else {
        g.addColorStop(0, '#b8d4f0'); g.addColorStop(0.4, '#d4e8f8');
        g.addColorStop(0.75, '#eaf4ff'); g.addColorStop(1, '#f5faff');
      }
      context.fillStyle = g;
      context.fillRect(0, 0, W, H);
    }

    const stars: { x: number; y: number; r: number; tw: number }[] = [];
    for (let i = 0; i < 80; i++) {
      stars.push({ x: Math.random() * W, y: Math.random() * H * 0.6, r: Math.random() * 1.2, tw: Math.random() * Math.PI * 2 });
    }

    function drawStars(t: number, dark: boolean) {
      if (!dark) return;
      stars.forEach(s => {
        context.beginPath();
        context.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        context.fillStyle = `rgba(220,235,255,${0.3 + Math.sin(t * 0.8 + s.tw) * 0.2})`;
        context.fill();
      });
    }

    function drawCelestial(dark: boolean) {
      if (dark) {
        const mx2 = W * 0.82, my2 = H * 0.12;
        const mg = context.createRadialGradient(mx2, my2, 0, mx2, my2, 40);
        mg.addColorStop(0, 'rgba(240,248,255,0.95)'); mg.addColorStop(1, 'rgba(180,210,240,0)');
        context.beginPath(); context.arc(mx2, my2, 40, 0, Math.PI * 2);
        context.fillStyle = mg; context.fill();
      } else {
        const sx = W * 0.78, sy = H * 0.14;
        const sg = context.createRadialGradient(sx, sy, 0, sx, sy, 55);
        sg.addColorStop(0, 'rgba(255,248,210,1)'); sg.addColorStop(1, 'rgba(255,220,100,0)');
        context.beginPath(); context.arc(sx, sy, 55, 0, Math.PI * 2);
        context.fillStyle = sg; context.fill();
      }
    }

    function drawGround(dark: boolean) {
      const gg = context.createLinearGradient(0, H * 0.85, 0, H);
      gg.addColorStop(0, dark ? 'rgba(180,210,240,0.9)' : 'rgba(240,250,255,1)');
      gg.addColorStop(1, dark ? 'rgba(150,190,225,1)' : 'rgba(220,240,255,1)');
      context.beginPath();
      context.moveTo(-60, H * 0.88);
      context.bezierCurveTo(W * 0.2, H * 0.82, W * 0.5, H * 0.85, W * 0.8, H * 0.83);
      context.bezierCurveTo(W, H * 0.84, W + 30, H * 0.86, W + 60, H * 0.88);
      context.lineTo(W + 60, H + 60); context.lineTo(-60, H + 60); context.closePath();
      context.fillStyle = gg; context.fill();
    }

    // Smooth mouse (desktop only)
    const smooth = { x: 0.5, y: 0.5 };
    let t = 0;

    const draw = () => {
      t += 0.007;
      context.clearRect(0, 0, W, H);

      const dark = isDark();
      const scroll = scrollRef.current;
      const solidify = Math.min(1, scroll / 700);
      const mobile = isMobileRef.current;

      if (!mobile) {
        smooth.x += (mouseRef.current.x - smooth.x) * 0.05;
        smooth.y += (mouseRef.current.y - smooth.y) * 0.05;
      }
      const mx = mobile ? 0.5 : smooth.x;
      const my = mobile ? 0.5 : smooth.y;

      drawSky(dark);

      if (solidify < 1) {
        const fade = 1 - solidify;
        context.save();
        context.globalAlpha = fade;
        drawStars(t, dark);
        drawCelestial(dark);
        mountains.forEach(m => drawMountain(m, mx, my, dark));
        drawGround(dark);

        // Snowflakes — no parallax on mobile
        flakes.forEach(f => {
          f.y += f.speed;
          f.x += f.drift + Math.sin(t * 0.6 + f.phase) * 0.3;
          if (f.y > H + 10) { f.y = -10; f.x = Math.random() * W; }
          if (f.x > W + 20) f.x = -10;
          if (f.x < -20) f.x = W + 10;

          const px = mobile ? 0 : (smooth.x - 0.5) * (f.layer === 0 ? 8 : f.layer === 1 ? 18 : 30);
          const py = mobile ? 0 : (smooth.y - 0.5) * (f.layer === 0 ? 3 : f.layer === 1 ? 7 : 12);

          context.globalAlpha = f.opacity * fade;
          context.beginPath();
          context.arc(f.x + px, f.y + py, f.r, 0, Math.PI * 2);
          context.fillStyle = dark ? 'rgba(200,225,255,0.9)' : 'rgba(255,255,255,0.95)';
          context.fill();
        });
        context.restore();
      }

      if (solidify > 0) {
        context.fillStyle = dark ? '#0d0d0d' : '#f2f6fc';
        context.globalAlpha = Math.min(solidify, 1);
        context.fillRect(0, 0, W, H);
        context.globalAlpha = 1;
      }

      frameRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0,
        // Critical: use transform3d to prevent scroll repaint glitch on mobile
        transform: 'translateZ(0)',
        willChange: 'transform',
      }}
    />
  );
}
