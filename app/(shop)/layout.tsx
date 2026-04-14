import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import AnimatedBackground from '@/components/layout/AnimatedBackground';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnimatedBackground />
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <CartDrawer />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
      </div>
    </>
  );
}
