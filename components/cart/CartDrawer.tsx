'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';

export default function CartDrawer() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { items, isOpen, closeCart, removeItem, updateQuantity } = useCartStore();
  const total = useCartStore(s => s.getTotalPrice());
  const shipping = total >= 999 ? 0 : 99;
  const grandTotal = total + shipping;

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div key="cd-bd"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[70]"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }}
          />

          {/* Drawer — right side on desktop, bottom sheet on mobile */}
          <motion.div key="cd-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 bottom-0 z-[71] flex flex-col"
            style={{
              width: 'min(420px, 100vw)',
              background: 'var(--bg-card)',
              borderLeft: '1px solid var(--border)',
              boxShadow: '-4px 0 40px rgba(0,0,0,0.25)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 flex-shrink-0"
              style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2.5">
                <ShoppingBag size={18} style={{ color: 'var(--accent)' }} />
                <h2 className="text-[15px] font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                  Your Cart
                </h2>
                {items.length > 0 && (
                  <span className="w-5 h-5 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                    style={{ background: '#e63030' }}>
                    {items.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                )}
              </div>
              <button onClick={closeCart}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}>
                <X size={16} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ background: 'var(--bg-secondary)' }}>
                    <ShoppingBag size={28} style={{ color: 'var(--text-muted)' }} />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Your cart is empty</p>
                    <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>Add some hot deals!</p>
                  </div>
                  <button onClick={closeCart}
                    className="mt-2 px-6 py-2.5 rounded-full text-[13px] font-bold text-white"
                    style={{ background: '#e63030' }}>
                    Browse Products
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map(item => (
                    <motion.div key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 30 }}
                      className="flex items-center gap-3 p-3 rounded-2xl"
                      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                      {/* Image */}
                      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0"
                        style={{ background: 'var(--bg-hover)' }}>
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{item.name}</p>
                        <p className="text-[13px] font-bold mt-0.5" style={{ color: 'var(--accent)' }}>
                          {formatPrice(item.price)}
                        </p>
                        {/* Qty controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-lg flex items-center justify-center transition-all"
                            style={{ background: 'var(--bg-hover)', color: 'var(--text-muted)' }}>
                            <Minus size={11} />
                          </button>
                          <span className="text-[12px] font-bold w-5 text-center" style={{ color: 'var(--text-primary)' }}>
                            {item.quantity}
                          </span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-lg flex items-center justify-center transition-all"
                            style={{ background: 'var(--bg-hover)', color: 'var(--text-muted)' }}>
                            <Plus size={11} />
                          </button>
                        </div>
                      </div>
                      {/* Remove */}
                      <button onClick={() => removeItem(item.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
                        style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--accent-light)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}>
                        <Trash2 size={13} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="flex-shrink-0 px-5 py-4" style={{ borderTop: '1px solid var(--border)' }}>
                {/* Totals */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex justify-between text-[12px]">
                    <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-[12px]">
                    <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
                    <span style={{ color: shipping === 0 ? 'var(--success)' : 'var(--text-primary)', fontWeight: 600 }}>
                      {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      Add {formatPrice(999 - total)} more for free shipping
                    </p>
                  )}
                  <div className="flex justify-between pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                    <span className="text-[13px] font-bold" style={{ color: 'var(--text-primary)' }}>Total</span>
                    <span className="text-[15px] font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                      {formatPrice(grandTotal)}
                    </span>
                  </div>
                </div>
                <Link href="/checkout" onClick={closeCart}>
                  <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[14px] font-bold text-white transition-all"
                    style={{ background: '#e63030', boxShadow: '0 4px 20px rgba(230,48,48,0.3)' }}>
                    Checkout <ArrowRight size={15} />
                  </button>
                </Link>
                <Link href="/cart" onClick={closeCart}>
                  <button className="w-full mt-2 py-2.5 rounded-2xl text-[12px] font-semibold transition-all"
                    style={{ color: 'var(--text-muted)' }}>
                    View full cart
                  </button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
