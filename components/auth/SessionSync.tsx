'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/hooks/useAuthStore';

export default function SessionSync() {
  const { setUser, user } = useAuthStore();

  useEffect(() => {
    // Validate session on mount — syncs cookie → Zustand
    fetch('/api/auth/user/me')
      .then(r => r.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
        } else {
          // Cookie expired/invalid — clear local state
          setUser(null);
        }
      })
      .catch(() => {
        // Network error — keep existing state
      });
  }, [setUser]);

  return null;
}
