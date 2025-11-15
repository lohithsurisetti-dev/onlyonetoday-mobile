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

    // Check if the response indicates a business logic error (moderation failure)
    if (data && data.success === false) {
      throw new Error(data.error || 'Post creation failed');
    }

    return data as CreatePostResponse;
  } catch (error) {
    console.error('Create post error:', error);
    throw error;
  }
};

/**
 * Get feed posts with real-time calculations (via Edge Function)
 */
export const getFeedPosts = async ({
  scope = 'world',
  tier,
  inputType = 'all',
  limit = 10,
  page = 1,
  reactionFilter = 'all',
  sortBy = 'newest',
  location,
}: {
  scope?: ScopeType;
  tier?: TierType;
  inputType?: PostType | 'all';
  limit?: number;
  page?: number;
  reactionFilter?: 'all' | 'funny' | 'creative' | 'must_try';
  sortBy?: 'newest' | 'tier';
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
} = {}): Promise<{
  success: boolean;
  posts: FeedPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
  error?: string;
}> => {
  try {
    // Use Supabase functions.invoke (handles auth automatically)
    const { data, error } = await supabase.functions.invoke('fetch-posts', {
      body: {
        page,
        limit,
      inputType,
      scope,
        tier,
        reactionFilter,
      sortBy,
        location: location ? {
          city: location.city,
          state: location.state,
          country: location.country,
        } : undefined,
      },
    });

    if (error) {
      throw new Error(error.message || 'Failed to fetch posts');
    }

    if (!data || !data.success) {
      throw new Error(data?.error || 'Failed to fetch posts');
    }

    return data;
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

