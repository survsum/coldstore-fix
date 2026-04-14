'use client';

import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle2, ExternalLink, Copy, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface TrackOrder {
  id: string;
  customerName: string;
  status: string;
  trackingId: string | null;
  courier: string | null;
  total: number;
  createdAt: string;
  shippedAt: string | null;
  deliveredAt: string | null;
}

const STATUS_CONFIG: Record<string, {
  label: string;
  color: string;
  bg: string;
  ring: string;
  icon: any;
  step: number;
}> = {
  pending: {
    label: 'Order Placed',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    ring: 'ring-amber-500/30',
    icon: Package,
    step: 0,
  },
  paid: {
    label: 'Payment Confirmed',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    ring: 'ring-amber-500/30',
    icon: Package,
    step: 1,
  },
  shipped: {
    label: 'Shipped',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    ring: 'ring-blue-500/30',
    icon: Truck,
    step: 2,
  },
  delivered: {
    label: 'Delivered',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    ring: 'ring-green-500/30',
    icon: CheckCircle2,
    step: 3,
  },
};

const COURIER_LINKS: Record<string, string> = {
  shiprocket: 'https://www.shiprocket.in/shipment-tracking/',
  delhivery:  'https://www.delhivery.com/track/package/',
  bluedart:   'https://www.bluedart.com/tracking',
  dtdc:       'https://www.dtdc.in/trace.asp',
  ecom:       'https://ecomexpress.in/tracking/',
  xpressbees: 'https://www.xpressbees.com/shipment/tracking',
  fedex:      'https://www.fedex.com/fedextrack/',
  dhl:        'https://www.dhl.com/in-en/home/tracking.html',
};

function getCourierLink(courier: string, trackingId: string): string {
  const key = courier.toLowerCase().replace(/\s+/g, '');
  const base = COURIER_LINKS[key];
  if (!base) return `https://www.google.com/search?q=${encodeURIComponent(courier + ' tracking ' + trackingId)}`;
  return base + trackingId;
}

const steps = [
  { key: 'placed',    label: 'Order Placed',   icon: Package },
  { key: 'paid',      label: 'Payment Verified', icon: CheckCircle2 },
  { key: 'shipped',   label: 'Shipped',         icon: Truck },
  { key: 'delivered', label: 'Delivered',        icon: MapPin },
];

function getStepIndex(status: string) {
  const map: Record<string, number> = { pending: 0, paid: 1, shipped: 2, delivered: 3 };
  return map[status] ?? 0;
}

export default function TrackingClient({ order }: { order: TrackOrder }) {
  const [copied, setCopied] = useState(false);
  const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const stepIndex = getStepIndex(order.status);
  const StatusIcon = config.icon;

  const copyOrderId = () => {
    navigator.clipboard.writeText(order.id);
    setCopied(true);
    toast.success('Order ID copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const fmt = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : null;

  return (
    <div className="min-h-screen bg-[#050a12] text-white px-4 py-12">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-blue-600/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-cyan-500/5 blur-3xl" />
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <Link href="/" className="inline-flex items-center gap-2 mb-6 text-white/40 hover:text-white/70 text-sm transition-colors">
            ← Back to store
          </Link>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Track Your Order</h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-white/40 text-sm font-mono">
              #{order.id.slice(-12).toUpperCase()}
            </span>
            <button onClick={copyOrderId} className="text-white/30 hover:text-white/60 transition-colors">
              <Copy size={13} />
            </button>
          </div>
        </motion.div>

        {/* Status Hero Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className={`relative rounded-3xl border p-8 mb-6 overflow-hidden ${config.ring} ring-1`}
          style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255,255,255,0.07)' }}
        >
          {/* Glow */}
          <div className={`absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-20 ${
            order.status === 'delivered' ? 'bg-green-500' :
            order.status === 'shipped'   ? 'bg-blue-500' : 'bg-amber-500'
          }`} />

          <div className="flex items-center gap-5 relative">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center ${config.bg} ring-1 ${config.ring}`}
            >
              <StatusIcon size={28} className={config.color} />
            </motion.div>
            <div>
              <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Current Status</p>
              <div className={`text-2xl font-bold ${config.color}`}>{config.label}</div>
              <p className="text-white/40 text-sm mt-0.5">
                Hello, {order.customerName}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl p-6 mb-6"
          style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-6">
            Order Progress
          </h2>
          <div className="relative">
            {/* Progress line */}
            <div className="absolute left-5 top-5 bottom-5 w-px bg-white/10" />
            <motion.div
              className="absolute left-5 top-5 w-px bg-gradient-to-b from-blue-500 to-cyan-400"
              initial={{ height: 0 }}
              animate={{ height: `${(stepIndex / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 1, ease: 'easeInOut', delay: 0.4 }}
            />

            <div className="space-y-6">
              {steps.map((step, i) => {
                const done = i <= stepIndex;
                const active = i === stepIndex;
                const StepIcon = step.icon;

                const timestamps: Record<string, string | null> = {
                  placed:    fmt(order.createdAt),
                  paid:      fmt(order.createdAt),
                  shipped:   fmt(order.shippedAt),
                  delivered: fmt(order.deliveredAt),
                };

                return (
                  <motion.div
                    key={step.key}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    className="flex items-start gap-4 relative"
                  >
                    {/* Step dot */}
                    <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                      active
                        ? 'bg-blue-500 ring-4 ring-blue-500/20 shadow-lg shadow-blue-500/30'
                        : done
                        ? 'bg-white/10'
                        : 'bg-white/5 border border-white/10'
                    }`}>
                      <StepIcon size={16} className={done ? 'text-white' : 'text-white/20'} />
                      {active && (
                        <motion.div
                          className="absolute inset-0 rounded-full bg-blue-500/30"
                          animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className="pt-1.5">
                      <p className={`text-sm font-medium ${done ? 'text-white' : 'text-white/25'}`}>
                        {step.label}
                      </p>
                      {timestamps[step.key] && done && (
                        <p className="text-xs text-white/35 mt-0.5">{timestamps[step.key]}</p>
                      )}
                      {/* Tracking info under shipped step */}
                      {step.key === 'shipped' && order.status === 'shipped' && order.trackingId && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20 font-mono">
                            {order.trackingId}
                          </span>
                          {order.courier && (
                            <span className="text-xs text-white/40 capitalize">{order.courier}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Tracking Details + Button */}
        {order.trackingId && order.courier && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="rounded-3xl p-6 mb-6"
            style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-4">
              Shipping Details
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="rounded-2xl bg-white/5 p-4 border border-white/5">
                <p className="text-xs text-white/35 mb-1">Tracking ID</p>
                <p className="text-sm font-mono font-medium text-white">{order.trackingId}</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4 border border-white/5">
                <p className="text-xs text-white/35 mb-1">Courier</p>
                <p className="text-sm font-medium text-white capitalize">{order.courier}</p>
              </div>
            </div>

            <motion.a
              href={getCourierLink(order.courier, order.trackingId)}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-2xl text-sm font-semibold text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #1565c0, #0d47a1)', boxShadow: '0 4px 24px rgba(21,101,192,0.35)' }}
            >
              <Truck size={16} />
              Track on {order.courier.charAt(0).toUpperCase() + order.courier.slice(1)}
              <ExternalLink size={13} className="opacity-70" />
            </motion.a>
          </motion.div>
        )}

        {/* No tracking yet */}
        {!order.trackingId && order.status === 'paid' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="rounded-3xl p-5 text-center"
            style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)' }}
          >
            <p className="text-amber-400/80 text-sm">
              📦 Your order is being prepared for shipment. Tracking info will appear here once shipped.
            </p>
          </motion.div>
        )}

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-white/20 text-xs mt-8"
        >
          Need help? Contact support with your order ID
        </motion.p>
      </div>
    </div>
  );
}
