'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const total = useCartStore((s) => s.getTotalPrice());

  if (!mounted) return (
    <div className="min-h-screen pt-32 pb-24 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[var(--border)] border-t-[var(--cold-blue)] rounded-full animate-spin" />
    </div>
  );

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex flex-col items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-5"
        >
          <div className="w-24 h-24 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center">
            <ShoppingBag size={36} className="text-[var(--text-muted)]" />
          </div>
          <h2
            className="text-3xl font-light text-[var(--text-primary)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Your cart is empty
          </h2>
          <p className="text-[var(--text-muted)] text-sm">Start adding products you love.</p>
          <Link
            href="/products"
            className="mt-4 flex items-center gap-2 px-8 py-3.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Shop Now <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    );
  }

  const shipping = total >= 999 ? 0 : 99;
  const tax = total * 0.18; // 18% GST
  const grandTotal = total + shipping + tax;

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 max-w-6xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-light text-[var(--text-primary)] mb-12"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Your Cart
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex gap-5 p-5 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]"
            >
              <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-[var(--bg-primary)] flex-shrink-0">
                <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-[var(--text-primary)] mb-1 truncate">{item.name}</h3>
                <p className="text-[var(--accent)] text-sm mb-4">{formatPrice(item.price)}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-1.5">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                      <Minus size={13} />
                    </button>
                    <span className="text-sm font-medium w-6 text-center text-[var(--text-primary)]">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                      <Plus size={13} />
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-[var(--text-primary)]">{formatPrice(item.price * item.quantity)}</span>
                    <button onClick={() => removeItem(item.id)} className="text-[var(--text-muted)] hover:text-red-400 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <div className="sticky top-28 p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]">
            <h2 className="font-medium text-[var(--text-primary)] mb-5">Order Summary</h2>
            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm text-[var(--text-secondary)]">
                <span>Subtotal</span><span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm text-[var(--text-secondary)]">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-green-500">Free</span> : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-sm text-[var(--text-secondary)]">
                <span>GST (18%)</span><span>{formatPrice(tax)}</span>
              </div>
              <div className="pt-3 border-t border-[var(--border)] flex justify-between items-baseline">
                <span className="font-medium text-[var(--text-primary)]">Total</span>
                <span className="text-2xl font-light text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
                  {formatPrice(grandTotal)}
                </span>
              </div>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-[var(--text-muted)] mb-4">
                Add {formatPrice(999 - total)} more for free shipping
              </p>
            )}
            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-white text-sm font-medium bg-[var(--text-primary)] hover:opacity-90 transition-opacity"
            >
              Checkout <ArrowRight size={15} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
