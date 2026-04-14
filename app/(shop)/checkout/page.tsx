'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';
import { Lock, ShoppingBag, ArrowRight, CheckCircle2, Package, Truck } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import RazorpayButton from '@/components/payment/RazorpayButton';
import { useAuthStore } from '@/hooks/useAuthStore';

type Step = 'details' | 'summary' | 'success';

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const total = useCartStore((s) => s.getTotalPrice());
  const { user, openModal } = useAuthStore();
  const [step, setStep] = useState<Step>('details');
  const [successData, setSuccessData] = useState<{ paymentId: string; orderId: string } | null>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-fill form from logged-in user
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
      }));
    }
  }, [user]);

  const shipping = total >= 999 ? 0 : 99;
  const tax = total * 0.18;
  const grandTotal = total + shipping + tax;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = 'Valid email is required';
    if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 10)
      newErrors.phone = 'Valid 10-digit phone required';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.zip.trim()) newErrors.zip = 'PIN code is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) setStep('summary');
  };

  const handleSuccess = (paymentId: string, orderId: string) => {
    clearCart();
    setSuccessData({ paymentId, orderId });
    setStep('success');
    toast.success('Order placed! 🎉');
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-xl border text-sm placeholder:text-[var(--text-muted)] transition-colors bg-[var(--bg-primary)] text-[var(--text-primary)] ${
      errors[field]
        ? 'border-red-400 focus:border-red-400'
        : 'border-[var(--border)] focus:border-[var(--accent)]'
    }`;

  if (!mounted) return (
    <div className="min-h-screen pt-32 pb-24 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[var(--border)] border-t-[var(--cold-blue)] rounded-full animate-spin" />
    </div>
  );

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="min-h-screen pt-32 pb-24 flex flex-col items-center justify-center text-center px-6">
        <ShoppingBag size={48} className="text-[var(--text-muted)] mb-4" />
        <h2 className="text-3xl font-light mb-3" style={{ fontFamily: 'var(--font-display)' }}>
          Your cart is empty
        </h2>
        <p className="text-[var(--text-muted)] text-sm mb-6">Add items before checking out.</p>
        <Link
          href="/products"
          className="px-8 py-3 rounded-full text-white text-sm font-semibold" style={{ background: '#e63030' }}
        >
          Browse Products
        </Link>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen pt-28 pb-24 px-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          className="w-full max-w-md text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', damping: 15 }}
            className="w-24 h-24 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 size={48} className="text-green-500" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-light text-[var(--text-primary)] mb-3"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Order Confirmed!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-[var(--text-secondary)] text-sm mb-8"
          >
            Thank you for your purchase. Your order is being processed.
          </motion.p>
          {successData && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] text-left mb-8 space-y-3"
            >
              <div className="flex items-center gap-2 text-green-500 text-sm font-medium mb-2">
                <Package size={15} /> Order Details
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-muted)]">Payment ID</span>
                <span className="text-[var(--text-primary)] font-mono text-xs break-all">{successData.paymentId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-muted)]">Order ID</span>
                <span className="text-[var(--text-primary)] font-mono text-xs">{successData.orderId}</span>
              </div>
              <div className="flex items-center gap-2 pt-3 border-t border-[var(--border)] text-xs text-[var(--text-muted)]">
                <Truck size={13} /> Estimated delivery: 3–7 business days
              </div>
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col gap-3"
          >
            <Link
              href="/products"
              className="flex items-center justify-center gap-2 py-4 rounded-2xl text-white text-sm font-medium hover:opacity-90 transition-opacity" style={{ background: 'linear-gradient(135deg, #e63030, #c02020)' }}
            >
              Continue Shopping <ArrowRight size={14} />
            </Link>
            <Link
              href="/"
              className="py-3 rounded-2xl border border-[var(--border)] text-[var(--text-secondary)] text-sm hover:text-[var(--text-primary)] transition-colors"
            >
              Go to Home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  const fullAddress = `${form.address}, ${form.city}${form.state ? ', ' + form.state : ''}, ${form.zip}, ${form.country}`;

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-4xl md:text-5xl font-light text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
          Checkout
        </h1>
        <div className="flex items-center gap-3 mt-4">
          {['details', 'summary'].map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <button
                onClick={() => s === 'details' && setStep('details')}
                className={`flex items-center gap-2 text-sm transition-colors ${
                  step === s ? 'text-[var(--accent)] font-medium'
                  : step === 'summary' && s === 'details' ? 'text-[var(--text-muted)] cursor-pointer hover:text-[var(--text-primary)]'
                  : 'text-[var(--text-muted)]'
                }`}
              >
                <span className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-medium ${
                  step === s ? 'bg-[var(--accent)] text-white'
                  : step === 'summary' && s === 'details' ? 'bg-green-500 text-white'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border)]'
                }`}>
                  {step === 'summary' && s === 'details' ? '✓' : i + 1}
                </span>
                {s === 'details' ? 'Your Details' : 'Pay'}
              </button>
              {i === 0 && <span className="w-12 h-px bg-[var(--border)]" />}
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {step === 'details' && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]">
                  <h2 className="text-lg font-medium text-[var(--text-primary)] mb-5">Contact Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-xs text-[var(--text-muted)] mb-1.5 block">Full Name *</label>
                      <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Rahul Sharma" className={inputClass('name')} />
                      {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="text-xs text-[var(--text-muted)] mb-1.5 block">Email *</label>
                      <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="rahul@example.com" className={inputClass('email')} />
                      {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="text-xs text-[var(--text-muted)] mb-1.5 block">Phone *</label>
                      <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="98765 43210" className={inputClass('phone')} />
                      {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]">
                  <h2 className="text-lg font-medium text-[var(--text-primary)] mb-5">Shipping Address</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-xs text-[var(--text-muted)] mb-1.5 block">Street Address *</label>
                      <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="123 MG Road, Apt 4B" className={inputClass('address')} />
                      {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
                    </div>
                    <div>
                      <label className="text-xs text-[var(--text-muted)] mb-1.5 block">City *</label>
                      <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Mumbai" className={inputClass('city')} />
                      {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <label className="text-xs text-[var(--text-muted)] mb-1.5 block">State</label>
                      <input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder="Maharashtra" className={inputClass('state')} />
                    </div>
                    <div>
                      <label className="text-xs text-[var(--text-muted)] mb-1.5 block">PIN Code *</label>
                      <input value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} placeholder="400001" className={inputClass('zip')} maxLength={6} />
                      {errors.zip && <p className="text-red-400 text-xs mt-1">{errors.zip}</p>}
                    </div>
                    <div>
                      <label className="text-xs text-[var(--text-muted)] mb-1.5 block">Country</label>
                      <select value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className={inputClass('country')}>
                        <option>India</option>
                        <option>United States</option>
                        <option>United Kingdom</option>
                        <option>Canada</option>
                        <option>Australia</option>
                        <option>Singapore</option>
                        <option>UAE</option>
                      </select>
                    </div>
                  </div>
                </div>

                <motion.button
                  type="button"
                  onClick={handleContinue}
                  whileTap={{ scale: 0.97 }}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-white text-sm font-medium hover:opacity-90 transition-opacity"
                  style={{ background: 'var(--text-primary)' }}
                >
                  Continue to Payment <ArrowRight size={15} />
                </motion.button>
              </motion.div>
            )}

            {step === 'summary' && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Delivering to</p>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{form.name}</p>
                      <p className="text-sm text-[var(--text-secondary)] mt-0.5">{fullAddress}</p>
                      <p className="text-sm text-[var(--text-secondary)]">{form.email} · {form.phone}</p>
                    </div>
                    <button onClick={() => setStep('details')} className="text-xs text-[var(--accent)] hover:underline underline-offset-2 flex-shrink-0">Edit</button>
                  </div>
                </div>

                <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-[var(--text-primary)]">Payment</h2>
                    <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                      <Lock size={11} /> Secured by Razorpay
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallet'].map((m) => (
                      <span key={m} className="text-xs px-2.5 py-1 rounded-full border border-[var(--border)] text-[var(--text-secondary)]">{m}</span>
                    ))}
                  </div>
                  <RazorpayButton
                    amount={grandTotal}
                    currency="INR"
                    customerName={form.name}
                    email={form.email}
                    address={fullAddress}
                    items={items}
                    total={grandTotal}
                    onSuccess={handleSuccess}
                    onFailure={(err) => console.error('Payment failed:', err)}
                  />
                  <p className="text-xs text-[var(--text-muted)] text-center mt-3">
                    You'll be redirected to a secure Razorpay checkout.<br />
                    Use UPI ID <span className="font-mono text-[var(--text-secondary)]">success@razorpay</span> for test payments.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order Summary sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-2"
        >
          <div className="sticky top-28 p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]">
            <h2 className="font-medium text-[var(--text-primary)] mb-5">
              Order Summary <span className="text-[var(--text-muted)] text-sm font-normal">({items.length} item{items.length !== 1 ? 's' : ''})</span>
            </h2>
            <div className="space-y-4 mb-5 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[var(--bg-primary)] flex-shrink-0">
                    <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] text-[10px] flex items-center justify-center font-medium">{item.quantity}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[var(--text-primary)] truncate">{item.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{formatPrice(item.price)} each</p>
                  </div>
                  <span className="text-sm font-medium text-[var(--text-primary)]">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2.5 py-4 border-t border-[var(--border)]">
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
              {shipping > 0 && <p className="text-xs text-amber-500">Add {formatPrice(999 - total)} more for free shipping</p>}
              <div className="flex justify-between items-baseline pt-3 border-t border-[var(--border)]">
                <span className="font-medium text-[var(--text-primary)]">Total</span>
                <span className="text-2xl font-light text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>{formatPrice(grandTotal)}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-[var(--border)] flex flex-col gap-2">
              {[
                { icon: Lock, text: '256-bit SSL secured checkout' },
                { icon: Package, text: 'Packed & shipped within 24 hrs' },
                { icon: Truck, text: '3–7 business days delivery' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                  <Icon size={12} className="text-[var(--accent)] flex-shrink-0" />{text}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
