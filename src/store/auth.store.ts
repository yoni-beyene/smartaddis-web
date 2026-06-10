import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User { id: string; name: string; email: string; role: string; }

interface AuthState {
  user: User | null;
  accessToken: string | null;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      login: (user, accessToken, refreshToken) => {
        localStorage.setItem('refreshToken', refreshToken);
        set({ user, accessToken });
      },
      logout: () => {
        localStorage.removeItem('refreshToken');
        set({ user: null, accessToken: null });
      },
    }),
    { name: 'smart-parks-web-auth' },
  ),
);
