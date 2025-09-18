// src/stores/auth.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode'; // We will need a library to decode the token

interface UserPayload {
  username: string;
  sub: number; // userId
  roleId: number;
}

interface AuthState {
  token: string | null;
  user: UserPayload | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (token: string) => {
        try {
          const decoded = jwtDecode<UserPayload>(token);
          set({ token, user: decoded, isAuthenticated: true });
        } catch (error) {
          console.error("Failed to decode token", error);
          set({ token: null, user: null, isAuthenticated: false });
        }
      },
      logout: () => {
        set({ token: null, user: null, isAuthenticated: false });
        // The redirection will be handled by the API interceptor or components
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
