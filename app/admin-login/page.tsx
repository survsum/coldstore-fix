'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@store.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      // Hard redirect so the server sees the new cookie
      window.location.href = '/admin/dashboard';
    } catch (err) {
      setError('Network error — is the server running?');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-xl ring-2 ring-[var(--border)]">
              <img src="/cold-dog-logo.png" alt="Cold Dog" className="w-full h-full object-cover" />
            </div>
            <span
              className="text-xl font-bold tracking-widest text-[var(--text-primary)]"
              style={{ letterSpacing: '0.1em' }}
            >
              COLD DOG
            </span>
          </div>
          <p className="text-sm text-[var(--text-muted)] mt-2">Admin Panel</p>
        </div>

        <div className="p-8 rounded-3xl border border-[var(--border)] bg-[var(--bg-secondary)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-[var(--text-primary)] flex items-center justify-center">
              <Lock size={16} className="text-[var(--bg-primary)]" />
            </div>
            <div>
              <h1 className="font-medium text-[var(--text-primary)]">Sign In</h1>
              <p className="text-xs text-[var(--text-muted)]">Admin access only</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-[var(--text-muted)] mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm outline-none focus:border-[var(--cold-blue)] transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--text-muted)] mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm outline-none focus:border-[var(--cold-blue)] transition-colors pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3.5 rounded-xl bg-[var(--text-primary)] text-[var(--bg-primary)] text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          <div className="mt-5 p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] text-center">
            <p className="text-xs text-[var(--text-muted)] mb-1">Default credentials</p>
            <p className="text-xs text-[var(--text-secondary)]">
              <code className="text-[var(--cold-blue)]">admin@store.com</code>
              {' / '}
              <code className="text-[var(--cold-blue)]">admin123</code>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
