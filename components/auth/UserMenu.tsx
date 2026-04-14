'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Package, LogOut, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/hooks/useAuthStore';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function UserMenu() {
  const [mounted, setMounted] = useState(false);
  const { user, logout, openModal } = useAuthStore();
  useEffect(() => setMounted(true), []);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    toast.success('Signed out');
  };

  if (!mounted) return null;

  if (!user) {
    return (
      <button
        onClick={() => openModal()}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200" style={{ color:"var(--nav-text-muted)", border:"1px solid var(--pill-border)", background:"var(--pill-bg)" }}
      >
        <User size={13} />
        Sign In
      </button>
    );
  }

  const initials = (user.name || user.email).slice(0, 2).toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full border border-[var(--border)] hover:border-[var(--cold-blue)] transition-all duration-200"
      >
        {user.avatar ? (
          <img src={user.avatar} alt={user.name || ''} className="w-7 h-7 rounded-full object-cover" />
        ) : (
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: 'linear-gradient(135deg, #e63030, #1565c0)' }}>
            {initials}
          </div>
        )}
        <span className="text-[12px] font-medium text-[var(--text-primary)] max-w-[80px] truncate hidden sm:block">
          {user.name || user.email.split('@')[0]}
        </span>
        <ChevronDown size={12} className={`text-[var(--text-muted)] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-52 rounded-2xl overflow-hidden shadow-xl"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', zIndex: 60 }}
          >
            {/* User info */}
            <div className="px-4 py-3 border-b border-[var(--border)]">
              <p className="text-xs font-medium text-[var(--text-primary)] truncate">{user.name || 'User'}</p>
              <p className="text-[11px] text-[var(--text-muted)] truncate">{user.email}</p>
            </div>

            {/* Menu items */}
            <div className="py-1.5">
              <Link href="/profile" onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors">
                <User size={14} /> My Profile
              </Link>
              <Link href="/my-orders" onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors">
                <Package size={14} /> My Orders
              </Link>
            </div>

            <div className="border-t border-[var(--border)] py-1.5">
              <button onClick={handleLogout}
                className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-red-400 hover:text-red-300 hover:bg-red-50/5 w-full text-left transition-colors">
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
