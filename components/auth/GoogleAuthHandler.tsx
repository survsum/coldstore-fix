'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/hooks/useAuthStore';
import toast from 'react-hot-toast';

// Placed inside the shop layout — handles Google OAuth redirect results
export default function GoogleAuthHandler() {
  const params = useSearchParams();
  const router = useRouter();
  const { setUser } = useAuthStore();

  useEffect(() => {
    const success = params.get('auth_success');
    const error = params.get('auth_error');

    if (!success && !error) return;

    // Clean URL immediately
    const clean = window.location.pathname;
    router.replace(clean);

    if (success) {
      // Fetch updated user from cookie that was just set
      fetch('/api/auth/user/me')
        .then(r => r.json())
        .then(data => {
          if (data.user) {
            setUser(data.user);
            toast.success(`Welcome, ${data.user.name || data.user.email}! 🎉`);
          }
        })
        .catch(() => {});
    }

    if (error) {
      const messages: Record<string, string> = {
        access_denied: 'Sign in was cancelled.',
        token_failed: 'Google sign-in failed. Try again.',
        no_email: 'Could not get email from Google.',
        server_error: 'Something went wrong. Try again.',
      };
      toast.error(messages[error] || 'Sign in failed.');
    }
  }, [params, router, setUser]);

  return null;
}
