/**
 * Authentication API Service
 * Handles all auth-related operations with Supabase
 */

import { supabase } from '../supabase';

export interface SignUpParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
  dateOfBirth?: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

/**
 * Sign up with email and password
 */
export const signUp = async (params: SignUpParams) => {
  try {
    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: params.email,
      password: params.password,
    });

    if (authError) {
      throw authError;
    }

    if (!authData.user) {
      throw new Error('User creation failed');
    }

    // 2. Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        username: params.username,
        first_name: params.firstName,
        last_name: params.lastName,
        date_of_birth: params.dateOfBirth,
        signup_source: 'mobile',
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Don't throw - user is created, profile can be created later
    }

    return { user: authData.user, session: authData.session };
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
};

/**
 * Sign in with email and password
 */
export const signIn = async (params: SignInParams) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: params.email,
      password: params.password,
    });

    if (error) {
      throw error;
    }

    return { user: data.user, session: data.session };
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

/**
 * Sign in with phone OTP
 */
export const signInWithPhone = async (phone: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone,
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Phone sign in error:', error);
    throw error;
  }
};

/**
 * Verify OTP
 */
export const verifyOTP = async (phone: string, token: string) => {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms',
    });

    if (error) {
      throw error;
    }

    return { user: data.user, session: data.session };
  } catch (error) {
    console.error('OTP verification error:', error);
    throw error;
  }
};

/**
 * Sign out
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
};

/**
 * Get current user
 */
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

/**
 * Listen to auth state changes
 */
export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  return supabase.auth.onAuthStateChange(callback);
};

