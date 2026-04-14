'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';

const MARQUEE_ITEMS = [
  'Cold Deals', '❄️', 'Hot Prices', '🐾', 'Premium Products', '⚡',
  'Free Shipping', '❄️', 'Cold Deals', '🔥', 'Hot Prices', '🐾',
  'Premium Products', '⚡', 'Free Shipping', '❄️',
];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const yText    = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const opacity  = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const LINES = [
    { text: 'Cold Deals.',  red: false },
    { text: 'Blazing',      red: true,  italic: true },
    { text: 'Hot Prices.',  red: false },
  ];

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Vignette — subtle, adapts to both modes */}
      <div className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, rgba(0,0,0,0.18) 100%)' }} />

      <motion.div style={{ y: yText, opacity }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-28 pb-12">

        {/* Eyebrow pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center mb-10"
        >
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full"
            style={{
              background: 'var(--pill-bg)',
              border: '1px solid var(--pill-border)',
              backdropFilter: 'blur(12px)',
            }}>
            <Zap size={12} fill="#e63030" className="text-[#e63030]" />
            <span className="text-[11px] font-bold tracking-[0.22em] uppercase"
              style={{ color: 'var(--pill-text)' }}>
              Cold Dog · Est. 2024 · Hot Deals Daily
            </span>
          </div>
        </motion.div>

        {/* Big headline */}
        <div className="text-center mb-8 overflow-hidden">
          {LINES.map((line, i) => (
            <div key={i} className="overflow-hidden">
              <motion.div
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <span
                  className={`block leading-[0.95] ${line.italic ? 'italic' : ''}`}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(3.6rem, 10vw, 8.5rem)',
                    fontWeight: 800,
                    letterSpacing: '-0.04em',
                    color: line.red ? '#e63030' : 'var(--hero-text)',
                  }}
                >
                  {line.text}
                </span>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-center max-w-lg mx-auto mb-12 leading-relaxed"
          style={{ fontSize: '1.0625rem', fontWeight: 400, color: 'var(--hero-sub)' }}
        >
          Premium products, unbeatable prices. Cold Dog sniffs out the best
          deals so you never overpay again.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-16"
        >
          <Link href="/products">
            <motion.div
              whileHover={{ scale: 1.03, x: 4 }} whileTap={{ scale: 0.97 }}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full text-[15px] font-semibold text-white"
              style={{ background: '#e63030', boxShadow: '0 0 0 1px rgba(230,48,48,0.4), 0 8px 32px rgba(230,48,48,0.28)' }}
            >
              Shop Hot Deals
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
            </motion.div>
          </Link>

          <Link href="/products?category=Electronics">
            <motion.div
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-[15px] font-semibold transition-all duration-300"
              style={{
                border: '1px solid var(--pill-border)',
                background: 'var(--pill-bg)',
                color: 'var(--hero-sub)',
              }}
            >
              Browse Categories
            </motion.div>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex items-center justify-center gap-10 pt-10 flex-wrap"
          style={{ borderTop: '1px solid var(--shop-border)' }}
        >
          {[
            { val: '500+', label: 'Hot Products' },
            { val: '12k+', label: 'Happy Customers' },
            { val: '4.9★', label: 'Rating' },
            { val: '₹0',   label: 'Hidden Fees' },
          ].map(s => (
            <div key={s.label} className="text-center group cursor-default">
              <div className="text-2xl font-bold group-hover:text-[#e63030] transition-colors duration-300"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--hero-text)' }}>
                {s.val}
              </div>
              <div className="text-[11px] tracking-widest uppercase mt-1"
                style={{ color: 'var(--hero-sub)' }}>
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ scaleY: [1, 0.3, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="w-px h-10 rounded-full"
          style={{ background: 'linear-gradient(to bottom, var(--hero-sub), transparent)' }}
        />
      </motion.div>

      {/* Marquee ticker */}
      <div className="absolute bottom-0 inset-x-0 overflow-hidden py-3"
        style={{ borderTop: '1px solid var(--shop-border)', background: 'var(--marquee-bg)', backdropFilter: 'blur(12px)' }}>
        <div className="flex marquee-track whitespace-nowrap select-none">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-6 px-8 text-[11px] font-bold tracking-[0.18em] uppercase"
              style={{ color: 'var(--marquee-text)' }}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
