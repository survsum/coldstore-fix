'use client';
import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { X, ChevronRight, Zap, Package, Laptop, Home, Watch, User, ShoppingBag, LogOut, Truck, Shield, HelpCircle, Phone, Info } from 'lucide-react';
import { useAuthStore } from '@/hooks/useAuthStore';
import toast from 'react-hot-toast';

interface Props { open: boolean; onClose: () => void; }

const CATEGORIES = [
  { label:'All Products',  href:'/products',                      icon:Package },
  { label:'Electronics',   href:'/products?category=Electronics', icon:Laptop  },
  { label:'Home',          href:'/products?category=Home',        icon:Home    },
  { label:'Accessories',   href:'/products?category=Accessories', icon:Watch   },
];
const INFO_LINKS = [
  { label:'Shipping Policy', href:'#', icon:Truck      },
  { label:'Returns',         href:'#', icon:Shield     },
  { label:'Help & Support',  href:'#', icon:HelpCircle },
  { label:'Contact Us',      href:'#', icon:Phone      },
  { label:'About Cold Dog',  href:'#', icon:Info       },
];

const ROW = ({ icon: Icon, label, href, onClick }: any) => (
  <Link href={href} onClick={onClick}>
    <div className="flex items-center justify-between py-2.5 px-3 rounded-xl group transition-all cursor-pointer"
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background:'var(--bg-primary)' }}>
          <Icon size={15} style={{ color:'var(--text-muted)' }} />
        </div>
        <span className="text-[13px] font-medium" style={{ color:'var(--text-secondary)' }}>{label}</span>
      </div>
      <ChevronRight size={13} style={{ color:'var(--text-muted)' }} />
    </div>
  </Link>
);

export default function SidebarMenu({ open, onClose }: Props) {
  const { user, openModal, logout } = useAuthStore();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const fn = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    setTimeout(() => document.addEventListener('mousedown', fn), 100);
    return () => document.removeEventListener('mousedown', fn);
  }, [open, onClose]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  const handleLogout = async () => {
    onClose();
    await logout();
    toast.success('Signed out');
  };

  const initials = user ? (user.name || user.email).slice(0, 2).toUpperCase() : '';

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div key="sb-bd"
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            transition={{ duration:0.25 }}
            className="fixed inset-0 z-[80]"
            style={{ background:'rgba(0,0,0,0.45)', backdropFilter:'blur(6px)' }}
          />

          <motion.div ref={ref} key="sb-panel"
            initial={{ x:'-100%' }} animate={{ x:0 }} exit={{ x:'-100%' }}
            transition={{ type:'spring', damping:28, stiffness:280 }}
            className="fixed left-0 top-0 bottom-0 z-[81] w-[330px] max-w-[90vw] flex flex-col overflow-hidden"
            style={{
              background:'var(--bg-card)',
              borderRight:'1px solid var(--border)',
              boxShadow:'4px 0 40px rgba(0,0,0,0.25)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom:'1px solid var(--border)' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg overflow-hidden" style={{ border:'1px solid var(--border)' }}>
                  <Image src="/cold-dog-logo.png" alt="Cold Dog" width={32} height={32} className="object-cover" />
                </div>
                <div>
                  <div className="text-[13px] font-bold tracking-[0.1em]"
                    style={{ fontFamily:'var(--font-display)', color:'var(--text-primary)' }}>COLD DOG</div>
                  <div className="text-[9px] tracking-[0.2em] uppercase font-bold" style={{ color:'#e63030' }}>Hot Deals</div>
                </div>
              </div>
              <button onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                style={{ color:'var(--text-muted)' }}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='var(--bg-hover)';(e.currentTarget as HTMLElement).style.color='var(--text-primary)';}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='transparent';(e.currentTarget as HTMLElement).style.color='var(--text-muted)';}}>
                <X size={15} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">

              {/* Account block */}
              <div className="px-5 py-4" style={{ borderBottom:'1px solid var(--border)' }}>
                {user ? (
                  <div className="flex items-center gap-3 p-3 rounded-2xl"
                    style={{ background:'var(--bg-secondary)', border:'1px solid var(--border)' }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold text-white flex-shrink-0"
                      style={{ background:'linear-gradient(135deg,#e63030,#1456b0)' }}>
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold truncate" style={{ color:'var(--text-primary)' }}>{user.name||'User'}</p>
                      <p className="text-[11px] truncate" style={{ color:'var(--text-muted)' }}>{user.email}</p>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => { onClose(); openModal(); }}
                    className="w-full flex items-center justify-between p-3 rounded-2xl transition-all"
                    style={{ background:'var(--accent-light)', border:'1px solid rgba(230,48,48,0.2)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background:'var(--accent-light)' }}>
                        <User size={18} style={{ color:'#e63030' }} />
                      </div>
                      <div className="text-left">
                        <p className="text-[13px] font-bold" style={{ color:'var(--text-primary)' }}>Hello, Sign In</p>
                        <p className="text-[11px]" style={{ color:'var(--text-muted)' }}>Access orders & profile</p>
                      </div>
                    </div>
                    <ChevronRight size={15} style={{ color:'var(--text-muted)' }} />
                  </button>
                )}
              </div>

              {/* Trending pills */}
              <div className="px-5 py-4" style={{ borderBottom:'1px solid var(--border)' }}>
                <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-3" style={{ color:'var(--text-muted)' }}>Trending</p>
                <div className="flex flex-wrap gap-2">
                  {['New Arrivals','Best Sellers','Flash Sale ⚡','Under ₹999'].map(tag => (
                    <Link key={tag} href="/products" onClick={onClose}>
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors cursor-pointer"
                        style={{ background:'var(--bg-secondary)', border:'1px solid var(--border)', color:'var(--text-secondary)' }}
                        onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color='var(--text-primary)'}
                        onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color='var(--text-secondary)'}>
                        {tag}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="px-5 py-4" style={{ borderBottom:'1px solid var(--border)' }}>
                <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-3" style={{ color:'var(--text-muted)' }}>Shop by Category</p>
                <div className="space-y-0.5">
                  {CATEGORIES.map((cat, i) => (
                    <motion.div key={cat.label}
                      initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }}
                      transition={{ delay:i*0.05+0.1 }}>
                      <ROW {...cat} onClick={onClose} />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* My Account */}
              {user && (
                <div className="px-5 py-4" style={{ borderBottom:'1px solid var(--border)' }}>
                  <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-3" style={{ color:'var(--text-muted)' }}>My Account</p>
                  <div className="space-y-0.5">
                    <ROW label="My Profile"  href="/profile"   icon={User}       onClick={onClose} />
                    <ROW label="My Orders"   href="/my-orders" icon={ShoppingBag} onClick={onClose} />
                  </div>
                </div>
              )}

              {/* Help */}
              <div className="px-5 py-4" style={{ borderBottom:'1px solid var(--border)' }}>
                <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-3" style={{ color:'var(--text-muted)' }}>Help & Settings</p>
                <div className="space-y-0.5">
                  {INFO_LINKS.map(item => <ROW key={item.label} {...item} onClick={onClose} />)}
                </div>
              </div>
            </div>

            {/* Sign out */}
            <div className="px-5 py-4" style={{ borderTop:'1px solid var(--border)' }}>
              {user ? (
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-3 py-2.5 px-3 rounded-xl transition-all"
                  onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background='var(--accent-light)'}
                  onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background='transparent'}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background:'var(--accent-light)' }}>
                    <LogOut size={15} style={{ color:'#e63030' }} />
                  </div>
                  <span className="text-[13px] font-bold" style={{ color:'#e63030' }}>Sign Out</span>
                </button>
              ) : (
                <p className="text-[10px] text-center tracking-wider" style={{ color:'var(--text-muted)' }}>
                  © {new Date().getFullYear()} Cold Dog — Hot Deals
                </p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
