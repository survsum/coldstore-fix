'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, X, ChevronRight, Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useCartStore } from '@/hooks/useCart';
import UserMenu from '@/components/auth/UserMenu';
import SidebarMenu from './SidebarMenu';

export default function Navbar() {
  const [scrolled, setScrolled]       = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted]         = useState(false);
  const { theme, setTheme }           = useTheme();
  const _total     = useCartStore(s => s.getTotalItems());
  const toggleCart = useCartStore(s => s.toggleCart);
  const total      = mounted ? _total : 0;
  const router     = useRouter();
  const searchRef  = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 60);
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery(''); setSearchOpen(false);
  };

  const links = [
    { href: '/products',                      label: 'Shop'        },
    { href: '/products?category=Electronics', label: 'Electronics' },
    { href: '/products?category=Home',        label: 'Home'        },
    { href: '/products?category=Accessories', label: 'Accessories' },
  ];

  return (
    <>
      <SidebarMenu open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? 'var(--nav-bg-scrolled)' : 'transparent',
          backdropFilter: 'blur(24px) saturate(1.6)',
          borderBottom: scrolled ? '1px solid var(--nav-border)' : '1px solid transparent',
          padding: scrolled ? '8px 0' : '14px 0',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-3">

          {/* Hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 flex-shrink-0"
            style={{
              background: 'var(--pill-bg)',
              border: '1px solid var(--pill-border)',
              color: 'var(--nav-text)',
            }}
          >
            <Menu size={16} />
            <span className="hidden sm:block text-[12px] font-bold tracking-wide">All</span>
          </button>

          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2.5 flex-shrink-0 mr-1">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0"
              style={{ border: '1px solid var(--nav-border)' }}>
              <Image src="/cold-dog-logo.png" alt="Cold Dog" width={32} height={32} className="object-cover" />
            </div>
            <div className="hidden sm:block">
              <div className="text-[14px] font-bold tracking-[0.1em] leading-none"
                style={{ color: 'var(--nav-text)', fontFamily: 'var(--font-display)' }}>
                COLD DOG
              </div>
              <div className="text-[8px] tracking-[0.22em] uppercase font-bold leading-none mt-0.5"
                style={{ color: '#e63030' }}>
                Hot Deals
              </div>
            </div>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1 flex items-center">
            <div className="relative w-full flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search Cold Dog…"
                className="w-full py-2.5 pl-4 pr-12 rounded-xl text-[13px] outline-none transition-all"
                style={{
                  background: 'var(--search-bg)',
                  border: '1px solid var(--search-border)',
                  color: 'var(--nav-text)',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--cold-blue)')}
                onBlur={e => (e.target.style.borderColor = 'var(--search-border)')}
              />
              <button type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: '#e63030' }}>
                <Search size={13} className="text-white" />
              </button>
            </div>
          </form>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-shrink-0">
            {links.map(l => (
              <Link key={l.href} href={l.href}
                className="px-3 py-2 rounded-lg text-[12px] font-semibold transition-all tracking-wide whitespace-nowrap"
                style={{ color: 'var(--nav-text-muted)' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.color = 'var(--nav-text)';
                  (e.currentTarget as HTMLElement).style.background = 'var(--nav-item-hover)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.color = 'var(--nav-text-muted)';
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
                style={{ color: 'var(--nav-text-muted)' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = 'var(--nav-item-hover)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--nav-text)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = 'var(--nav-text-muted)';
                }}
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            )}

            <UserMenu />

            <motion.button whileTap={{ scale: 0.9 }} onClick={toggleCart}
              className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all"
              style={{
                border: '1px solid var(--pill-border)',
                background: 'var(--pill-bg)',
                color: 'var(--nav-text-muted)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.color = 'var(--nav-text)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.color = 'var(--nav-text-muted)';
              }}
            >
              <ShoppingBag size={15} />
              <span className="hidden sm:block text-[12px] font-bold">Cart</span>
              <AnimatePresence>
                {total > 0 && (
                  <motion.span key="b" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] rounded-full text-[9px] font-bold text-white flex items-center justify-center"
                    style={{ background: '#e63030' }}>
                    {total}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-start justify-center pt-24 px-6"
            style={{ background: 'rgba(6,16,30,0.9)', backdropFilter: 'blur(20px)' }}
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }} onClick={e => e.stopPropagation()}
              className="w-full max-w-2xl"
            >
              <form onSubmit={handleSearch}>
                <div className="flex items-center gap-4 px-6 py-4 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)' }}>
                  <Search size={20} className="text-white/30" />
                  <input ref={searchRef} value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search products…"
                    className="flex-1 bg-transparent text-white text-xl outline-none placeholder:text-white/20"
                  />
                  <button type="button" onClick={() => setSearchOpen(false)} className="text-white/30 hover:text-white/70">
                    <X size={18} />
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
