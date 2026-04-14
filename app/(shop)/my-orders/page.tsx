'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/hooks/useAuthStore';
import { motion } from 'framer-motion';
import { Package, ExternalLink } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  trackingId?: string;
  courier?: string;
  items: string;
}

export default function MyOrdersPage() {
  const { user, openModal } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) { openModal(); return; }
    setLoading(true);
    fetch('/api/auth/user/my-orders')
      .then(r => r.json())
      .then(d => setOrders(d.orders || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, openModal]);

  const STATUS_STYLES: Record<string, string> = {
    pending:   'bg-gray-500/10 text-gray-400 border-gray-500/20',
    paid:      'bg-amber-500/10 text-amber-400 border-amber-500/20',
    shipped:   'bg-blue-500/10 text-blue-400 border-blue-500/20',
    delivered: 'bg-green-500/10 text-green-400 border-green-500/20',
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center text-center px-6">
        <Package size={40} className="text-[var(--text-muted)] mb-4" />
        <h2 className="text-2xl font-light text-[var(--text-primary)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Sign in to view your orders
        </h2>
        <p className="text-[var(--text-muted)] text-sm">Your order history will appear here.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-light text-[var(--text-primary)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>My Orders</h1>
        <p className="text-[var(--text-muted)] text-sm mb-10">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>

        {loading && (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-24 rounded-2xl skeleton" />)}
          </div>
        )}

        {!loading && orders.length === 0 && (
          <div className="py-20 flex flex-col items-center text-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]">
            <Package size={36} className="text-[var(--text-muted)]" />
            <div>
              <p className="text-[var(--text-primary)] font-medium mb-1">No orders yet</p>
              <p className="text-[var(--text-muted)] text-sm">Your orders will appear here after checkout.</p>
            </div>
            <Link href="/products" className="px-6 py-2.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] text-sm font-medium hover:opacity-90 transition-opacity">
              Start Shopping
            </Link>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div className="space-y-3">
            {orders.map((order, i) => {
              let parsedItems = [];
              try { parsedItems = JSON.parse(order.items); } catch {}
              return (
                <motion.div key={order.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] flex flex-wrap items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-medium text-[var(--text-primary)]">#{order.id.slice(-8).toUpperCase()}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium capitalize ${STATUS_STYLES[order.status] || STATUS_STYLES.pending}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)]">
                      {parsedItems.length} item{parsedItems.length !== 1 ? 's' : ''} · {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-light text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
                      {formatPrice(order.total)}
                    </span>
                    <Link href={`/track/${order.id}`} target="_blank" className="flex items-center gap-1 text-[11px] text-[var(--cold-blue)] hover:underline">
                      Track <ExternalLink size={10} />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
