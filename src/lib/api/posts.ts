/**
 * Posts API Service
 * Handles all post-related operations with Supabase
 */

import { supabase } from '../supabase';
import type { Post, TierType, ScopeType, PostType } from '@/types/database.types';

export interface CreatePostParams {
  content: string;
  inputType: PostType;
  scope: ScopeType;
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
}

export interface CreatePostResponse {
  success: boolean;
  post: {
    id: string;
    content: string;
    tier: TierType;
    percentile: number;
    displayText: string;
    matchCount: number;
    createdAt: string;
  };
  analytics: {
    processingTime: number;
    embeddingTime: number;
    searchTime: number;
  };
}

export interface FeedPost extends Post {
  username?: string;
  avatar_url?: string;
  reactions?: {
    funny: number;
    creative: number;
    must_try: number;
  };
}

/**
 * Create a new post with uniqueness matching (via Edge Function)
 */
export const createPost = async (params: CreatePostParams): Promise<CreatePostResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('create-post', {
      body: {
        content: params.content,
        inputType: params.inputType,
        scope: params.scope,
        location: params.location,
      },
    });

    if (error) {
      throw new Error(error.message || 'Failed to create post');
    }

    return data as CreatePostResponse;
  } catch (error) {
    console.error('Create post error:', error);
    throw error;
  }
};

/**
 * Get feed posts with filters
 */
export const getFeedPosts = async ({
  scope,
  tier,
  inputType,
  limit = 20,
  offset = 0,
}: {
  scope?: ScopeType;
  tier?: TierType;
  inputType?: PostType;
  limit?: number;
  offset?: number;
} = {}): Promise<FeedPost[]> => {
  try {
    let query = supabase
      .from('posts')
      .select(`
        *,
        profiles:user_id (
          username,
          avatar_url
        ),
        post_reaction_counts (
          funny_count,
          creative_count,
          must_try_count
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (scope) {
      query = query.eq('scope', scope);
    }
    if (tier) {
      query = query.eq('tier', tier);
    }
    if (inputType) {
      query = query.eq('input_type', inputType);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // Transform data
    return (data || []).map(post => ({
      ...post,
      username: post.profiles?.username,
      avatar_url: post.profiles?.avatar_url,
      reactions: {
        funny: post.post_reaction_counts?.funny_count || 0,
        creative: post.post_reaction_counts?.creative_count || 0,
        must_try: post.post_reaction_counts?.must_try_count || 0,
      },
    })) as FeedPost[];
  } catch (error) {
    console.error('Get feed error:', error);
    throw error;
  }
};

/**
 * Get user's posts
 */
export const getUserPosts = async (userId: string): Promise<FeedPost[]> => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        post_reaction_counts (
          funny_count,
          creative_count,
          must_try_count
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return (data || []).map(post => ({
      ...post,
      reactions: {
        funny: post.post_reaction_counts?.funny_count || 0,
        creative: post.post_reaction_counts?.creative_count || 0,
        must_try: post.post_reaction_counts?.must_try_count || 0,
      },
    })) as FeedPost[];
  } catch (error) {
    console.error('Get user posts error:', error);
    throw error;
  }
};

/**
 * Delete a post
 */
export const deletePost = async (postId: string): Promise<void> => {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId);

  if (error) {
    throw error;
  }
};

/**
 * Increment share count
 */
export const incrementShareCount = async (postId: string): Promise<void> => {
  const { error } = await supabase.rpc('increment_share_count', {
    post_id: postId,
  });

  if (error) {
    console.warn('Failed to increment share count:', error);
  }
};

