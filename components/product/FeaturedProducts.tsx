'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';

interface Product {
  id: string; name: string; price: number;
  image: string; category: string; description: string; stock: number;
}

export default function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section className="py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22,1,0.36,1] }}
          >
            <p className="text-[11px] font-bold tracking-[0.28em] uppercase mb-4" style={{ color: '#e63030' }}>
              — Handpicked
            </p>
            <h2 className="leading-none"
              style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2.8rem,5.5vw,5rem)', fontWeight:800, letterSpacing:'-0.04em', color:'var(--shop-text)' }}>
              Featured<br />
              <span className="italic" style={{ color:'var(--shop-muted)' }}>Deals</span>
            </h2>
          </motion.div>

          <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} transition={{ delay:0.3 }}
            className="hidden md:block">
            <Link href="/products">
              <motion.div whileHover={{ x:6 }}
                className="group flex items-center gap-3 text-[14px] font-semibold transition-colors"
                style={{ color:'var(--shop-muted)' }}
                onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color='var(--shop-text)'}
                onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color='var(--shop-muted)'}
              >
                View all products
                <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                  style={{ border:'1px solid var(--shop-border)' }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor='var(--shop-text)';(e.currentTarget as HTMLElement).style.background='var(--shop-card-bg)';}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='var(--shop-border)';(e.currentTarget as HTMLElement).style.background='transparent';}}>
                  <ArrowRight size={14} style={{ color:'var(--shop-text)' }}/>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((product, i) => (
            <motion.div key={product.id}
              initial={{ opacity:0, y:32 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true, margin:'-20px' }}
              transition={{ duration:0.6, delay:i*0.09, ease:[0.22,1,0.36,1] }}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
          className="mt-10 flex justify-center md:hidden">
          <Link href="/products">
            <motion.div whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
              className="flex items-center gap-2 px-7 py-3.5 rounded-full text-[14px] font-semibold transition-colors"
              style={{ border:'1px solid var(--shop-border)', color:'var(--shop-sub)' }}>
              View All <ArrowRight size={14} />
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
