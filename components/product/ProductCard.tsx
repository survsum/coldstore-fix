'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShoppingBag, Star } from 'lucide-react';
import { useCartStore } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Product {
  id: string; name: string; price: number;
  image: string; category: string; description: string; stock: number;
}

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore(s => s.addItem);
  const [hovered, setHovered] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image });
    toast.success('Added to cart', { duration: 1500 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.45, ease: [0.22,1,0.36,1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group"
    >
      <Link href={`/products/${product.id}`}>
        {/* Image */}
        <div className="relative rounded-xl overflow-hidden mb-2 sm:mb-3"
          style={{
            aspectRatio: '1/1',
            background: 'var(--shop-card-bg)',
            border: `1px solid ${hovered ? 'var(--border-strong)' : 'var(--shop-card-border)'}`,
            transition: 'border-color 0.2s',
          }}>

          <img src={product.image} alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500"
            style={{ transform: hovered ? 'scale(1.06)' : 'scale(1)' }}
            onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'; }}
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 transition-opacity duration-300"
            style={{ background: 'rgba(0,0,0,0.2)', opacity: hovered ? 1 : 0 }} />

          {/* Category */}
          <div className="absolute top-2 left-2">
            <span className="text-[9px] sm:text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full text-white"
              style={{ background:'rgba(6,16,30,0.7)', backdropFilter:'blur(6px)' }}>
              {product.category}
            </span>
          </div>

          {/* Add to cart — tap-friendly, always visible on mobile */}
          <button
            onClick={handleAdd}
            className="absolute bottom-2 right-2 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white transition-all"
            style={{
              background: '#e63030',
              boxShadow: '0 2px 12px rgba(230,48,48,0.45)',
              opacity: hovered ? 1 : 0.85,
              transform: hovered ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 0.2s',
            }}
          >
            <ShoppingBag size={13} />
          </button>

          {/* Stock */}
          {product.stock > 0 && product.stock < 10 && (
            <div className="absolute top-2 right-2">
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white"
                style={{ background:'rgba(217,119,6,0.9)' }}>
                {product.stock} left
              </span>
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 flex items-center justify-center"
              style={{ background:'rgba(0,0,0,0.55)', backdropFilter:'blur(3px)' }}>
              <span className="text-white text-xs font-bold tracking-wider">SOLD OUT</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="px-0.5">
          <h3 className="text-[12px] sm:text-[13px] font-semibold leading-tight mb-1 line-clamp-2"
            style={{ color: hovered ? '#e63030' : 'var(--shop-text)', transition: 'color 0.2s' }}>
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-[14px] sm:text-[15px] font-bold"
              style={{ fontFamily:'var(--font-display)', color:'var(--shop-text)' }}>
              {formatPrice(product.price)}
            </span>
            <div className="flex items-center gap-0.5">
              <Star size={9} fill="#facc15" className="text-yellow-400" />
              <span className="text-[10px] font-medium" style={{ color:'var(--shop-muted)' }}>4.8</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
