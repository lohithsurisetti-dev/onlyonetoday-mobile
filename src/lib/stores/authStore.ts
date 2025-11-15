/**
 * Auth Store - Global authentication state
 * Using Zustand for simple state management
 * Now integrated with Supabase
 */

import { create } from 'zustand';
import { supabase, getCurrentUser, signOut as supabaseSignOut } from '../supabase';
import { getProfile } from '../api/profile';

// Initialize auth state listener
let authListenerInitialized = false;

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
      console.log('🔐 Initializing auth session...');
      
      // Set up auth state listener (only once)
      if (!authListenerInitialized) {
        supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('🔐 Auth state changed:', event, session?.user?.id);
          
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            if (session?.user) {
              const profile = await getProfile(session.user.id);
              if (profile) {
                set({
                  user: {
                    id: session.user.id,
                    firstName: profile.first_name,
                    lastName: profile.last_name,
                    username: profile.username,
                    email: session.user.email,
                    phone: session.user.phone,
                    avatarUrl: profile.avatar_url,
                    isAnonymous: false,
                  },
                  isAuthenticated: true,
                  isLoading: false,
                });
              }
            }
          } else if (event === 'SIGNED_OUT') {
            set({ user: null, isAuthenticated: false, isLoading: false });
          }
        });
        authListenerInitialized = true;
      }
      
      // Try to get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.log('⚠️ No session found:', sessionError.message);
        set({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }
      
      if (!session?.user) {
        console.log('⚠️ No user in session');
        set({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }

      console.log('✅ Session found, user ID:', session.user.id);
      
      // Get profile data
      const profile = await getProfile(session.user.id);
      
      if (profile) {
        console.log('✅ Profile loaded:', profile.username);
        set({
          user: {
            id: session.user.id,
            firstName: profile.first_name,
            lastName: profile.last_name,
            username: profile.username,
            email: session.user.email,
            phone: session.user.phone,
            avatarUrl: profile.avatar_url,
            isAnonymous: false,
          },
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        console.log('⚠️ Profile not found for user:', session.user.id);
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      console.error('❌ Initialize auth error:', error);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));


