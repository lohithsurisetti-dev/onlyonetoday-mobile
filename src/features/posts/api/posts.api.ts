/**
 * Posts API - Supabase Implementation
 * Real backend integration with vector embeddings
 */

import { supabase } from '@/lib/supabase';
import type {
  CreatePostRequest,
  CreatePostResponse,
  GetPostsRequest,
  GetPostsResponse,
  GetPostDetailResponse,
} from '../types/post.types';

/**
 * Create a new post with real uniqueness matching
 */
export async function createPost(data: CreatePostRequest): Promise<CreatePostResponse> {
  try {
    // Call Supabase Edge Function (with vector embeddings!)
    const { data: result, error } = await supabase.functions.invoke('create-post', {
      body: {
        content: data.content,
        inputType: data.inputType || 'action',
        scope: data.scope || 'world',
        location: data.location,
      },
    });

    if (error) {
      throw new Error(error.message || 'Failed to create post');
    }

    if (!result || !result.success) {
      throw new Error('Post creation failed');
    }

    // Transform to match expected response format
    return {
      success: true,
      post: {
        id: result.post.id,
        content: result.post.content,
        tier: result.post.tier,
        percentile: result.post.percentile,
        scope: data.scope || 'world',
        created_at: result.post.createdAt,
      },
      percentile: result.post.percentile,
      matchCount: result.post.matchCount,
      displayText: result.post.displayText,
      analytics: result.analytics,
    };
  } catch (error: any) {
    console.error('Create post error:', error);
    throw error;
  }
}

/**
 * Get list of posts
 */
export async function getPosts(params: GetPostsRequest = {}): Promise<GetPostsResponse> {
  try {
    let query = supabase
      .from('posts')
      .select(`
        *,
        profiles:user_id (username, avatar_url),
        post_reaction_counts (funny_count, creative_count, must_try_count)
      `)
      .order('created_at', { ascending: false })
      .limit(params.limit || 20);

    if (params.scope) {
      query = query.eq('scope', params.scope);
    }
    if (params.tier) {
      query = query.eq('tier', params.tier);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return {
      posts: data || [],
      total: data?.length || 0,
      page: 1,
      limit: params.limit || 20,
    };
  } catch (error) {
    console.error('Get posts error:', error);
    throw error;
  }
}

/**
 * Get post by ID
 */
export async function getPostById(id: string): Promise<GetPostDetailResponse> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles:user_id (username, avatar_url),
        post_reaction_counts (funny_count, creative_count, must_try_count)
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return { post: data };
  } catch (error) {
    console.error('Get post by ID error:', error);
    throw error;
  }
}

/**
 * Get feed (global posts)
 */
export async function getFeed(params: GetPostsRequest = {}): Promise<GetPostsResponse> {
  return getPosts(params);
}

