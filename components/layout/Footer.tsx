import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ borderTop:'1px solid var(--shop-border)', background:'var(--footer-bg)', backdropFilter:'blur(24px)' }}>
      <div className="max-w-7xl mx-auto px-6">

        {/* CTA row */}
        <div className="py-20 flex flex-col md:flex-row items-center justify-between gap-8"
          style={{ borderBottom:'1px solid var(--shop-border)' }}>
          <div>
            <p className="text-[11px] font-bold tracking-[0.28em] uppercase mb-3" style={{ color:'#e63030' }}>— Get in touch</p>
            <h2 className="leading-none"
              style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2.2rem,4vw,3.8rem)', fontWeight:800, letterSpacing:'-0.04em', color:'var(--footer-head)' }}>
              Like what you see?
            </h2>
          </div>
          <Link href="/products">
            <div className="group inline-flex items-center gap-3 px-8 py-4 rounded-full text-[15px] font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95"
              style={{ background:'#e63030', boxShadow:'0 0 0 1px rgba(230,48,48,0.3), 0 8px 32px rgba(230,48,48,0.25)' }}>
              Shop the deals <span className="text-lg">→</span>
            </div>
          </Link>
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 py-14"
          style={{ borderBottom:'1px solid var(--shop-border)' }}>
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-xl font-bold tracking-[0.1em]"
                style={{ fontFamily:'var(--font-display)', color:'var(--footer-head)' }}>COLD DOG</span>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background:'#e63030' }} />
            </div>
            <p className="text-[13px] leading-relaxed max-w-xs font-medium" style={{ color:'var(--footer-text)' }}>
              Cold Dog sniffs out the hottest deals on the coolest products.
              Premium quality, unbeatable prices.
            </p>
          </div>

          <div>
            <h4 className="text-[10px] font-bold tracking-[0.25em] uppercase mb-5" style={{ color:'var(--shop-muted)' }}>Shop</h4>
            <ul className="space-y-3">
              {[
                { label:'All Products', href:'/products' },
                { label:'Electronics',  href:'/products?category=Electronics' },
                { label:'Home',         href:'/products?category=Home' },
                { label:'Accessories',  href:'/products?category=Accessories' },
              ].map(item => (
                <li key={item.label}>
                  <Link href={item.href}
                    className="text-[13px] font-medium hover:text-[var(--accent)] transition-colors duration-200"
                    style={{ color:'var(--footer-text)' }}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold tracking-[0.25em] uppercase mb-5" style={{ color:'var(--shop-muted)' }}>Info</h4>
            <ul className="space-y-3">
              {['About','Shipping','Returns','Contact'].map(item => (
                <li key={item}>
                  <Link href="#"
                    className="text-[13px] font-medium hover:text-[var(--accent)] transition-colors duration-200"
                    style={{ color:'var(--footer-text)' }}>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-6">
          <p className="text-[11px] font-medium" style={{ color:'var(--shop-muted)' }}>
            © {new Date().getFullYear()} Cold Dog. All rights reserved. Crafted with ❄️ &amp; 🔥
          </p>
          <div className="flex items-center gap-5">
            <span className="text-[11px] font-medium" style={{ color:'var(--shop-muted)' }}>Secured by Razorpay</span>
            <div className="flex gap-1.5">
              {['Visa','MC','RuPay','UPI'].map(c => (
                <span key={c} className="text-[9px] font-bold px-2 py-0.5 rounded tracking-wider"
                  style={{ border:'1px solid var(--shop-border)', color:'var(--shop-muted)' }}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
