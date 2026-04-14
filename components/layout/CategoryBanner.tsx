'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const categories = [
  { name:'Electronics', tagline:'Cutting-edge tech', image:'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=900&q=85', num:'01' },
  { name:'Home',        tagline:'Live beautifully',  image:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=85', num:'02' },
  { name:'Accessories', tagline:'Finish every look', image:'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&q=85', num:'03' },
];

export default function CategoryBanner() {
  return (
    <section className="py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-16">
          <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} transition={{ duration:0.7, ease:[0.22,1,0.36,1] }}>
            <p className="text-[11px] font-bold tracking-[0.28em] uppercase mb-4" style={{ color:'#e63030' }}>— Categories</p>
            <h2 className="leading-none"
              style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2.8rem,5.5vw,5rem)', fontWeight:800, letterSpacing:'-0.04em', color:'var(--shop-text)' }}>
              Shop by<br/>
              <span className="italic" style={{ color:'var(--shop-muted)' }}>Category</span>
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map((cat, i) => (
            <motion.div key={cat.name}
              initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ duration:0.65, delay:i*0.1, ease:[0.22,1,0.36,1] }}>
              <Link href={`/products?category=${cat.name}`}>
                <div className="group relative rounded-3xl overflow-hidden cursor-pointer"
                  style={{ aspectRatio:'3/4', border:'1px solid var(--shop-card-border)' }}>
                  <img src={cat.image} alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ opacity:0.6 }} />
                  <div className="absolute inset-0"
                    style={{ background:'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 55%, rgba(0,0,0,0.05) 100%)' }} />
                  <div className="absolute top-5 left-6">
                    <span className="text-[11px] font-bold tracking-[0.2em] text-white/40">{cat.num}</span>
                  </div>
                  <div className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                    style={{ border:'1px solid rgba(255,255,255,0.3)', background:'rgba(255,255,255,0.1)', backdropFilter:'blur(8px)' }}
                    onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='white';}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.1)';}}>
                    <ArrowUpRight size={15} className="text-white group-hover:text-black transition-colors duration-200" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-white/40 mb-2">{cat.tagline}</p>
                    <h3 className="text-white leading-none mb-4"
                      style={{ fontFamily:'var(--font-display)', fontSize:'2.1rem', fontWeight:800, letterSpacing:'-0.03em' }}>
                      {cat.name}
                    </h3>
                    <div className="flex items-center gap-2 text-[12px] font-bold text-white/40 group-hover:text-white/70 transition-colors duration-300">
                      <span>Explore</span>
                      <div className="flex-1 h-px bg-white/15 group-hover:bg-white/35 transition-colors duration-500" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
