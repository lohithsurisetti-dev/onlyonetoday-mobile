/**
 * Auth Store - Global authentication state
 * Using Zustand for simple state management
 * Now integrated with Supabase
 */

import { create } from 'zustand';
import { supabase, getCurrentUser, signOut as supabaseSignOut } from '../supabase';
import { getProfile } from '../api/profile';

type User = {
  id: string; // Supabase user ID
  firstName: string;
  lastName: string;
  username: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  isAnonymous: boolean;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User) => void;
  setAnonymous: () => void;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  
  setUser: (user) => set({ user, isAuthenticated: true, isLoading: false }),
  
  setAnonymous: () => set({ 
    user: { 
      id: 'anonymous',
      firstName: 'Guest',
      lastName: '',
      username: 'anonymous',
      isAnonymous: true 
    }, 
    isAuthenticated: true,
    isLoading: false
  }),
  
  logout: async () => {
    try {
      await supabaseSignOut();
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
  
  initialize: async () => {
    try {
      const { user, error } = await getCurrentUser();
      
      if (error || !user) {
        set({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }

      // Get profile data
      const profile = await getProfile(user.id);
      
      if (profile) {
        set({
          user: {
            id: user.id,
            firstName: profile.first_name,
            lastName: profile.last_name,
            username: profile.username,
            email: user.email,
            phone: user.phone,
            avatarUrl: profile.avatar_url,
            isAnonymous: false,
          },
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      console.error('Initialize auth error:', error);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));


