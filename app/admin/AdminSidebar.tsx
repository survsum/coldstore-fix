'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, ShoppingCart, LogOut, ExternalLink,
  BarChart2, Users, Megaphone, Truck, Target, ShoppingBag,
  ChevronLeft, ChevronRight, Sun, Moon, Menu, X,
} from 'lucide-react';
import { useTheme } from 'next-themes';

const links = [
  { href: '/admin/dashboard', label: 'Overview',   icon: LayoutDashboard },
  { href: '/admin/analytics', label: 'Analytics',  icon: BarChart2 },
  { href: '/admin/orders',    label: 'Orders',     icon: ShoppingCart },
  { href: '/admin/customers', label: 'Customers',  icon: Users },
  { href: '/admin/marketing', label: 'Marketing',  icon: Megaphone },
  { href: '/admin/products',  label: 'Products',   icon: Package },
  { href: '/admin/abandoned', label: 'Abandoned',  icon: ShoppingBag },
  { href: '/admin/shipping',  label: 'Shipping',   icon: Truck },
  { href: '/admin/profit',    label: 'Profit',     icon: Target },
];

function NavLink({ href, label, icon: Icon, active, collapsed, onClick }: any) {
  return (
    <Link href={href} onClick={onClick}>
      <div
        className="flex items-center gap-3 mx-2 my-0.5 px-3 py-2.5 rounded-xl transition-all duration-150 cursor-pointer"
        style={{
          background: active ? 'var(--accent-light)' : 'transparent',
          color: active ? 'var(--accent)' : 'var(--text-muted)',
        }}
        onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'; }}
        onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
      >
        <Icon size={16} className="flex-shrink-0" />
        {!collapsed && (
          <span className="text-[13px] font-semibold whitespace-nowrap">{label}</span>
        )}
        {active && !collapsed && (
          <div className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--accent)' }} />
        )}
      </div>
    </Link>
  );
}

export default function AdminSidebar() {
  const pathname   = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const handleSignOut = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin-login';
  };

  const SidebarContent = ({ onLinkClick }: { onLinkClick?: () => void }) => (
    <>
      {/* Logo */}
      <div className="px-4 py-4 flex items-center justify-between flex-shrink-0"
        style={{ borderBottom: '1px solid var(--border)', minHeight: 60 }}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0"
            style={{ border: '1px solid var(--border)' }}>
            <img src="/cold-dog-logo.png" alt="" className="w-full h-full object-cover" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-[12px] font-bold tracking-widest truncate"
                style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                COLD DOG
              </div>
              <div className="text-[9px] font-bold tracking-widest" style={{ color: 'var(--accent)' }}>
                ADMIN
              </div>
            </div>
          )}
        </div>
        {/* Collapse button — desktop only */}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="hidden md:flex w-6 h-6 rounded-md items-center justify-center flex-shrink-0 transition-all"
          style={{ background: 'var(--bg-hover)', color: 'var(--text-muted)' }}>
          {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
        {links.map(({ href, label, icon }) => (
          <NavLink
            key={href}
            href={href}
            label={label}
            icon={icon}
            active={pathname === href || pathname.startsWith(href + '/')}
            collapsed={collapsed}
            onClick={onLinkClick}
          />
        ))}
      </nav>

      {/* Bottom */}
      <div className="py-3 px-2 space-y-0.5 flex-shrink-0"
        style={{ borderTop: '1px solid var(--border)' }}>
        {/* Theme toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            {theme === 'dark'
              ? <Sun size={16} className="flex-shrink-0" />
              : <Moon size={16} className="flex-shrink-0" />
            }
            {!collapsed && (
              <span className="text-[13px] font-semibold whitespace-nowrap">
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </span>
            )}
          </button>
        )}

        {/* View store */}
        <Link href="/" target="_blank">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            <ExternalLink size={16} className="flex-shrink-0" />
            {!collapsed && <span className="text-[13px] font-semibold">View Store</span>}
          </div>
        </Link>

        {/* Sign out */}
        <button onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer"
          style={{ color: 'var(--accent)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-light)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
          <LogOut size={16} className="flex-shrink-0" />
          {!collapsed && <span className="text-[13px] font-semibold">Sign Out</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* ── Mobile top bar ── */}
      <div className="md:hidden fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 py-3"
        style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', height: 56 }}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <img src="/cold-dog-logo.png" alt="" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="text-[12px] font-bold tracking-widest" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
              COLD DOG
            </div>
            <div className="text-[9px] font-bold tracking-widest" style={{ color: 'var(--accent)' }}>ADMIN</div>
          </div>
        </div>
        <button onClick={() => setMobileOpen(true)}
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'var(--bg-hover)', color: 'var(--text-primary)' }}>
          <Menu size={18} />
        </button>
      </div>

      {/* ── Mobile drawer overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div key="mob-bd"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="md:hidden fixed inset-0 z-[60]"
              style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            />
            <motion.div key="mob-panel"
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="md:hidden fixed left-0 top-0 bottom-0 z-[61] flex flex-col w-64"
              style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)' }}>
              {/* Close btn */}
              <button onClick={() => setMobileOpen(false)}
                className="absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--bg-hover)', color: 'var(--text-muted)' }}>
                <X size={16} />
              </button>
              <SidebarContent onLinkClick={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Desktop sidebar ── */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 220 }}
        transition={{ duration: 0.25, ease: [0.22,1,0.36,1] }}
        className="admin-sidebar hidden md:flex flex-col flex-shrink-0 overflow-hidden"
        style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)', zIndex: 10 }}>
        <SidebarContent />
      </motion.aside>
    </>
  );
}
