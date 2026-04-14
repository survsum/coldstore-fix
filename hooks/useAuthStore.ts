'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  avatar?: string | null;
  provider: string;
}

interface AuthStore {
  user: AuthUser | null;
  modalOpen: boolean;
  modalCallback: (() => void) | null;
  setUser: (user: AuthUser | null) => void;
  openModal: (callback?: () => void) => void;
  closeModal: () => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      modalOpen: false,
      modalCallback: null,

      setUser: (user) => set({ user }),

      openModal: (callback) =>
        set({ modalOpen: true, modalCallback: callback ?? null }),

      closeModal: () => set({ modalOpen: false, modalCallback: null }),

      logout: async () => {
        try {
          await fetch('/api/auth/user/logout', { method: 'POST' });
        } catch {}
        set({ user: null, modalOpen: false, modalCallback: null });
      },
    }),
    {
      name: 'cd-auth',
      partialize: (state) => ({ user: state.user }),
    }
  )
);

/** Call this to require auth before running an action */
export function useRequireAuth() {
  const { user, openModal } = useAuthStore();
  return (action: () => void) => {
    if (user) action();
    else openModal(action);
  };
}
