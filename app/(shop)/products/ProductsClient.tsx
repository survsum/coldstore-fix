'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X, Grid2X2, Grid3X3, ChevronDown } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';

interface Product {
  id: string; name: string; price: number;
  image: string; category: string; description: string; stock: number;
}

export default function ProductsClient({
  products, categories, activeCategory, searchQuery,
}: {
  products: Product[]; categories: string[];
  activeCategory?: string; searchQuery?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [cols, setCols] = useState<2 | 3>(2); // mobile: 2 cols default

  const updateQuery = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value); else params.delete(key);
    router.push(`/products?${params.toString()}`);
  };

  const sortOptions = [
    { value: '',           label: 'Newest'            },
    { value: 'price_asc',  label: 'Price: Low → High' },
    { value: 'price_desc', label: 'Price: High → Low' },
    { value: 'name',       label: 'Name A–Z'          },
  ];

  const currentSort = searchParams.get('sort') || '';

  return (
    <div className="min-h-screen pb-24" style={{ paddingTop: '80px' }}>
      {/* ── Page header ── */}
      <div className="px-4 sm:px-6 pt-8 pb-6 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase mb-2" style={{ color: '#e63030' }}>
            {searchQuery ? 'Search Results' : activeCategory ?? 'All Items'}
          </p>
          <div className="flex items-end justify-between gap-4">
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,6vw,4rem)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--shop-text)', lineHeight: 1 }}>
              {searchQuery ? `"${searchQuery}"` : activeCategory ?? 'Shop All'}
            </h1>
            <p className="text-[12px] font-medium flex-shrink-0 mb-1" style={{ color: 'var(--shop-muted)' }}>
              {products.length} item{products.length !== 1 ? 's' : ''}
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── Sticky toolbar ── */}
      <div className="sticky top-[60px] z-30 px-4 sm:px-6 py-3"
        style={{ background: 'var(--nav-bg-scrolled)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--shop-border)' }}>
        <div className="max-w-7xl mx-auto">

          {/* Row 1: Category pills — horizontal scroll on mobile */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
            <button
              onClick={() => updateQuery('category', null)}
              className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-bold transition-all"
              style={{
                background: !activeCategory ? 'var(--accent)' : 'var(--pill-bg)',
                color: !activeCategory ? 'white' : 'var(--shop-sub)',
                border: `1px solid ${!activeCategory ? 'transparent' : 'var(--pill-border)'}`,
              }}
            >
              All
            </button>
            {categories.map(cat => (
              <button key={cat}
                onClick={() => updateQuery('category', activeCategory === cat ? null : cat)}
                className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-bold transition-all"
                style={{
                  background: activeCategory === cat ? 'var(--accent)' : 'var(--pill-bg)',
                  color: activeCategory === cat ? 'white' : 'var(--shop-sub)',
                  border: `1px solid ${activeCategory === cat ? 'transparent' : 'var(--pill-border)'}`,
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Row 2: Sort + Filter + Grid toggle */}
          <div className="flex items-center gap-2 mt-2">
            {/* Sort dropdown */}
            <div className="relative flex-1 max-w-[160px]">
              <select
                value={currentSort}
                onChange={e => updateQuery('sort', e.target.value || null)}
                className="w-full pl-3 pr-8 py-2 rounded-xl text-[12px] font-semibold appearance-none outline-none cursor-pointer"
                style={{ background: 'var(--pill-bg)', border: '1px solid var(--pill-border)', color: 'var(--shop-text)' }}
              >
                {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--shop-muted)' }} />
            </div>

            {/* Filter */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-bold transition-all flex-shrink-0"
              style={{
                background: showFilters ? 'var(--accent-light)' : 'var(--pill-bg)',
                border: `1px solid ${showFilters ? 'var(--accent)' : 'var(--pill-border)'}`,
                color: showFilters ? 'var(--accent)' : 'var(--shop-sub)',
              }}
            >
              <SlidersHorizontal size={12} /> Filters
            </button>

            {/* Grid cols toggle — mobile only */}
            <div className="ml-auto flex items-center gap-1 sm:hidden">
              <button onClick={() => setCols(2)}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                style={{ background: cols === 2 ? 'var(--accent-light)' : 'var(--pill-bg)', color: cols === 2 ? 'var(--accent)' : 'var(--shop-muted)' }}>
                <Grid2X2 size={14} />
              </button>
              <button onClick={() => setCols(3)}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                style={{ background: cols === 3 ? 'var(--accent-light)' : 'var(--pill-bg)', color: cols === 3 ? 'var(--accent)' : 'var(--shop-muted)' }}>
                <Grid3X3 size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filter panel ── */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} className="overflow-hidden"
            style={{ borderBottom: '1px solid var(--shop-border)' }}
          >
            <div className="px-4 sm:px-6 py-4 max-w-7xl mx-auto">
              <div className="flex flex-wrap items-end gap-3">
                <div className="flex-1 min-w-[120px]">
                  <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--shop-muted)' }}>Min Price (₹)</label>
                  <input type="number" defaultValue={searchParams.get('minPrice') || ''} placeholder="0"
                    onBlur={e => updateQuery('minPrice', e.target.value || null)}
                    className="w-full px-3 py-2 rounded-xl text-[13px] outline-none"
                    style={{ background: 'var(--pill-bg)', border: '1px solid var(--pill-border)', color: 'var(--shop-text)' }}
                  />
                </div>
                <div className="flex-1 min-w-[120px]">
                  <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--shop-muted)' }}>Max Price (₹)</label>
                  <input type="number" defaultValue={searchParams.get('maxPrice') || ''} placeholder="99999"
                    onBlur={e => updateQuery('maxPrice', e.target.value || null)}
                    className="w-full px-3 py-2 rounded-xl text-[13px] outline-none"
                    style={{ background: 'var(--pill-bg)', border: '1px solid var(--pill-border)', color: 'var(--shop-text)' }}
                  />
                </div>
                <button
                  onClick={() => { updateQuery('minPrice', null); updateQuery('maxPrice', null); }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold transition-all"
                  style={{ background: 'var(--pill-bg)', border: '1px solid var(--pill-border)', color: 'var(--shop-muted)' }}>
                  <X size={12} /> Clear
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Product grid ── */}
      <div className="px-4 sm:px-6 pt-6 max-w-7xl mx-auto">
        {products.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--shop-text)' }}>
              No products found
            </h3>
            <p className="text-[13px]" style={{ color: 'var(--shop-muted)' }}>Try adjusting your filters</p>
          </motion.div>
        ) : (
          <motion.div layout
            className="product-grid grid gap-3 sm:gap-5"
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            }}
          >
            {/* Override to 3-4 cols on larger screens via inline media isn't possible,
                so use sm/md/lg classes with the CSS grid trick */}
            <style>{`
              @media (min-width: 640px) { .product-grid { grid-template-columns: repeat(2, minmax(0,1fr)) !important; } }
              @media (min-width: 768px) { .product-grid { grid-template-columns: repeat(3, minmax(0,1fr)) !important; } }
              @media (min-width: 1024px) { .product-grid { grid-template-columns: repeat(4, minmax(0,1fr)) !important; } }
            `}</style>
            <AnimatePresence mode="popLayout">
              {products.map((product, i) => (
                <motion.div key={product.id} layout
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.3) }}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
