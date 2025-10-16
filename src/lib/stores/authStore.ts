/**
 * Auth Store - Global authentication state
 * Using Zustand for simple state management
 */

import { create } from 'zustand';

type User = {
  firstName: string;
  lastName: string;
  username: string;
  contact: string;
  method: 'phone' | 'email';
  isAnonymous: boolean;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  setAnonymous: () => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  setAnonymous: () => set({ 
    user: { 
      firstName: 'Guest',
      lastName: '',
      username: 'anonymous',
      contact: '',
      method: 'email',
      isAnonymous: true 
    }, 
    isAuthenticated: true 
  }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));

