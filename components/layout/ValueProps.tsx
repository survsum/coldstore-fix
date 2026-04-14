'use client';
import { motion } from 'framer-motion';
import { Truck, Shield, RefreshCcw, Zap } from 'lucide-react';

const props = [
  { icon: Zap,        title: 'Daily Drops',    desc: 'New deals every 24 hours' },
  { icon: Truck,      title: 'Free Shipping',  desc: 'On all orders over ₹999'  },
  { icon: Shield,     title: 'Secure Payments',desc: 'Protected by Razorpay'    },
  { icon: RefreshCcw, title: '30-Day Returns', desc: 'Zero-hassle policy'       },
];

export default function ValueProps() {
  return (
    <section className="py-20 px-6"
      style={{ borderTop: '1px solid var(--shop-border)', borderBottom: '1px solid var(--shop-border)' }}>
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-2">
        {props.map((item, i) => (
          <motion.div key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ y: -2 }}
            className="group flex flex-col items-center text-center gap-4 p-6 rounded-2xl transition-all duration-300 cursor-default"
            style={{ border: '1px solid transparent' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'var(--shop-card-bg)';
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--shop-card-border)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
              (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
            }}
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(230,48,48,0.1)', border: '1px solid rgba(230,48,48,0.2)' }}>
              <item.icon size={20} style={{ color: '#e63030' }} />
            </div>
            <div>
              <p className="text-[14px] font-bold mb-1"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--shop-text)' }}>
                {item.title}
              </p>
              <p className="text-[12px] font-medium" style={{ color: 'var(--shop-sub)' }}>
                {item.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
