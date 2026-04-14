'use client';
import { ThemeProvider } from 'next-themes';
import LoginModal from '@/components/auth/LoginModal';
import SessionSync from '@/components/auth/SessionSync';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <SessionSync />
      {children}
      <LoginModal />
    </ThemeProvider>
  );
}
