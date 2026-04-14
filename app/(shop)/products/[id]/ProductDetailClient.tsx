'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShoppingBag, Minus, Plus, Star, ArrowLeft, Check, Truck, Shield, RefreshCcw } from 'lucide-react';
import { useCartStore } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';
import ProductCard from '@/components/product/ProductCard';

interface Product {
  id: string; name: string; description: string;
  price: number; image: string; category: string; stock: number;
}

export default function ProductDetailClient({ product, related }: { product: Product; related: Product[] }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore(s => s.addItem);
  const openCart = useCartStore(s => s.openCart);

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({ id: product.id, name: product.name, price: product.price, image: product.image });
    }
    setAdded(true);
    openCart();
    toast.success(`${quantity}× ${product.name} added!`);
    setTimeout(() => setAdded(false), 2000);
  };

  const guarantees = [
    { icon: Truck,       text: 'Free shipping over ₹999' },
    { icon: Shield,      text: '2-year warranty'          },
    { icon: RefreshCcw,  text: '30-day free returns'      },
  ];

  return (
    <div className="min-h-screen pb-32 sm:pb-24" style={{ paddingTop: '72px' }}>
      {/* Back */}
      <div className="px-4 sm:px-6 pt-5 max-w-7xl mx-auto">
        <Link href="/products">
          <button className="flex items-center gap-2 text-[12px] font-semibold transition-colors mb-6"
            style={{ color: 'var(--shop-muted)' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--shop-text)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--shop-muted)'}>
            <ArrowLeft size={14} /> Back to products
          </button>
        </Link>
      </div>

      {/* Main product — stacked on mobile, side-by-side on md+ */}
      <div className="px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 mb-16">

          {/* Image */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="relative rounded-2xl overflow-hidden"
              style={{ aspectRatio: '1/1', background: 'var(--shop-card-bg)', border: '1px solid var(--shop-card-border)' }}>
              <img src={product.image} alt={product.name} className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'; }}
              />
              {/* Category badge */}
              <div className="absolute top-4 left-4">
                <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full text-white"
                  style={{ background: 'rgba(6,16,30,0.7)', backdropFilter: 'blur(8px)' }}>
                  {product.category}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col">

            {/* Rating */}
            <div className="flex items-center gap-1.5 mb-3">
              {[1,2,3,4,5].map(n => <Star key={n} size={14} fill="#facc15" className="text-yellow-400" />)}
              <span className="text-[12px] font-semibold ml-1" style={{ color: 'var(--shop-muted)' }}>4.8 (124 reviews)</span>
            </div>

            {/* Name */}
            <h1 className="mb-3 leading-tight"
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.7rem,4vw,2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--shop-text)' }}>
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-5">
              <span className="font-bold" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,3.5vw,2.2rem)', color: 'var(--accent)' }}>
                {formatPrice(product.price)}
              </span>
              <span className="text-[12px] line-through" style={{ color: 'var(--shop-muted)' }}>
                {formatPrice(product.price * 1.3)}
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
                23% OFF
              </span>
            </div>

            {/* Description */}
            <p className="text-[14px] leading-relaxed mb-6" style={{ color: 'var(--shop-sub)' }}>
              {product.description}
            </p>

            {/* Stock indicator */}
            {product.stock > 0 && product.stock < 15 && (
              <div className="flex items-center gap-2 mb-5 px-3 py-2 rounded-xl"
                style={{ background: 'var(--warning-light)', border: '1px solid rgba(217,119,6,0.2)' }}>
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--warning)' }} />
                <p className="text-[12px] font-bold" style={{ color: 'var(--warning)' }}>
                  Only {product.stock} left in stock — order soon!
                </p>
              </div>
            )}

            {/* Quantity + Add to cart */}
            <div className="flex items-center gap-3 mb-6">
              {/* Qty */}
              <div className="flex items-center rounded-2xl overflow-hidden"
                style={{ border: '1px solid var(--shop-card-border)', background: 'var(--shop-card-bg)' }}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-11 h-11 flex items-center justify-center transition-all"
                  style={{ color: 'var(--shop-sub)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                  <Minus size={15} />
                </button>
                <span className="w-10 text-center text-[14px] font-bold" style={{ color: 'var(--shop-text)' }}>
                  {quantity}
                </span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-11 h-11 flex items-center justify-center transition-all"
                  style={{ color: 'var(--shop-sub)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                  <Plus size={15} />
                </button>
              </div>

              {/* Add to cart */}
              <motion.button
                onClick={handleAdd}
                disabled={product.stock === 0}
                whileTap={{ scale: 0.97 }}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[14px] font-bold text-white transition-all disabled:opacity-50"
                style={{ background: '#e63030', boxShadow: '0 4px 20px rgba(230,48,48,0.3)' }}
                animate={added ? { scale: [1, 1.04, 1] } : {}}
              >
                {added
                  ? <><Check size={16} /> Added!</>
                  : <><ShoppingBag size={16} /> Add to Cart — {formatPrice(product.price * quantity)}</>
                }
              </motion.button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-2">
              {guarantees.map(g => (
                <div key={g.text} className="flex flex-col items-center text-center gap-1.5 p-3 rounded-xl"
                  style={{ background: 'var(--shop-card-bg)', border: '1px solid var(--shop-card-border)' }}>
                  <g.icon size={16} style={{ color: 'var(--accent)' }} />
                  <p className="text-[10px] font-semibold leading-tight" style={{ color: 'var(--shop-sub)' }}>{g.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 className="mb-6" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--shop-text)' }}>
              You might also like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
              {related.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 inset-x-0 z-40 p-4 sm:hidden"
        style={{ background: 'var(--nav-bg-scrolled)', backdropFilter: 'blur(20px)', borderTop: '1px solid var(--shop-border)' }}>
        <motion.button
          onClick={handleAdd}
          disabled={product.stock === 0}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-[15px] font-bold text-white disabled:opacity-50"
          style={{ background: '#e63030', boxShadow: '0 4px 20px rgba(230,48,48,0.35)' }}
        >
          {added ? <><Check size={16} /> Added to Cart!</> : <><ShoppingBag size={16} /> Add to Cart — {formatPrice(product.price * quantity)}</>}
        </motion.button>
      </div>
    </div>
  );
}
