import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Providers from '@/components/layout/Providers';
import CustomCursor from '@/components/layout/CustomCursor';

export const metadata: Metadata = {
  title: {
    default: 'Cold Dog — Hot Deals 🐾',
    template: '%s | Cold Dog',
  },
  description:
    'Discover curated premium products. Minimal design, maximum quality. Free shipping on orders over ₹999.',
  keywords: ['premium', 'lifestyle', 'minimalist', 'design', 'shopping'],
  openGraph: {
    title: 'Cold Dog — Hot Deals 🐾',
    description: 'Cold Dog finds the hottest deals on premium products. Free shipping over ₹999.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <CustomCursor />
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
