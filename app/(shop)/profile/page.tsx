'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/hooks/useAuthStore';
import { motion } from 'framer-motion';
import { User, Mail, Package, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, openModal } = useAuthStore();

  useEffect(() => {
    if (!user) openModal();
  }, [user, openModal]);

  if (!user) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center text-center px-6">
        <User size={40} className="text-[var(--text-muted)] mb-4" />
        <h2 className="text-2xl font-light text-[var(--text-primary)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Sign in to view your profile
        </h2>
        <p className="text-[var(--text-muted)] text-sm">Your profile will appear here after you sign in.</p>
      </div>
    );
  }

  const initials = (user.name || user.email).slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-light text-[var(--text-primary)] mb-10" style={{ fontFamily: 'var(--font-display)' }}>
          My Profile
        </h1>

        {/* Avatar + basic info */}
        <div className="flex items-center gap-5 p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] mb-6">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name || ''} className="w-16 h-16 rounded-full object-cover ring-2 ring-[var(--border)]" />
          ) : (
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg, #e63030, #1565c0)' }}>
              {initials}
            </div>
          )}
          <div>
            <h2 className="text-xl font-medium text-[var(--text-primary)]">{user.name || 'User'}</h2>
            <p className="text-sm text-[var(--text-muted)]">{user.email}</p>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--accent-light)] text-[var(--accent)] font-medium uppercase tracking-wider mt-1 inline-block">
              {user.provider}
            </span>
          </div>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: Mail, label: 'Email', value: user.email },
            { icon: User, label: 'Name', value: user.name || '—' },
            { icon: Package, label: 'Provider', value: user.provider },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-3 p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]">
              <item.icon size={16} className="text-[var(--text-muted)] flex-shrink-0" />
              <div>
                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-0.5">{item.label}</p>
                <p className="text-sm text-[var(--text-primary)]">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Link href="/my-orders" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[var(--border)] text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--cold-blue)] transition-all">
            <Package size={15} /> View My Orders
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
