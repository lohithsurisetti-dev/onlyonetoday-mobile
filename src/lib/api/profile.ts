/**
 * Profile API Service
 */

import { supabase } from '../supabase';
import type { Profile } from '@/types/database.types';

/**
 * Get user profile
 */
export const getProfile = async (userId: string): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error: any) {
    // Only log error if it's not a "no rows" error (expected when no profile exists)
    if (error?.code !== 'PGRST116') {
      console.error('Get profile error:', error);
    }
    return null;
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (
  userId: string,
  updates: Partial<Profile>
) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

/**
 * Get user stats using database function
 */
export const getUserStats = async (userId: string) => {
  try {
    const { data, error } = await supabase.rpc('get_user_stats', {
      p_user_id: userId,
    });

    if (error) {
      throw error;
    }

    return data?.[0] || {
      total_posts: 0,
      elite_posts: 0,
      current_streak: 0,
      total_reactions: 0,
    };
  } catch (error) {
    console.error('Get user stats error:', error);
    return {
      total_posts: 0,
      elite_posts: 0,
      current_streak: 0,
      total_reactions: 0,
    };
  }
};

/**
 * Update push notification token
 */
export const updatePushToken = async (userId: string, token: string) => {
  try {
    await supabase
      .from('profiles')
      .update({ push_token: token })
      .eq('id', userId);
  } catch (error) {
    console.error('Update push token error:', error);
  }
};

