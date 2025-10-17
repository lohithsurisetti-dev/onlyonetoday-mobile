/**
 * Reactions API Service
 */

import { supabase } from '../supabase';
import type { ReactionType } from '@/types/database.types';

/**
 * Add reaction to a post
 */
export const addReaction = async (postId: string, reactionType: ReactionType) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Not authenticated');
    }

    const { data, error } = await supabase
      .from('reactions')
      .insert({
        post_id: postId,
        user_id: user.id,
        reaction_type: reactionType,
      })
      .select()
      .single();

    if (error) {
      // If duplicate, ignore (user already reacted)
      if (error.code === '23505') {
        return { alreadyReacted: true };
      }
      throw error;
    }

    return { data };
  } catch (error) {
    console.error('Add reaction error:', error);
    throw error;
  }
};

/**
 * Remove reaction from a post
 */
export const removeReaction = async (postId: string, reactionType: ReactionType) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Not authenticated');
    }

    const { error } = await supabase
      .from('reactions')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .eq('reaction_type', reactionType);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Remove reaction error:', error);
    throw error;
  }
};

/**
 * Get user's reaction for a post
 */
export const getUserReaction = async (postId: string): Promise<ReactionType | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from('reactions')
      .select('reaction_type')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data?.reaction_type || null;
  } catch (error) {
    console.error('Get user reaction error:', error);
    return null;
  }
};

