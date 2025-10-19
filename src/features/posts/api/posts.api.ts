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
    console.log('🚀 Mobile app: Starting post creation...');
    console.log('📝 Mobile app: Request data:', {
      content: data.content,
      inputType: data.inputType || 'action',
      scope: data.scope || 'world',
      isAnonymous: false,
      locationCity: data.locationCity,
      locationState: data.locationState,
      locationCountry: data.locationCountry,
    });

    // Call Supabase Edge Function (with vector embeddings!)
    const { data: result, error } = await supabase.functions.invoke('create-post', {
      body: {
        content: data.content,
        inputType: data.inputType || 'action',
        scope: data.scope || 'world',
        isAnonymous: false,
        locationCity: data.locationCity,
        locationState: data.locationState,
        locationCountry: data.locationCountry,
      },
    });

    console.log('📡 Mobile app: API response received');
    console.log('✅ Mobile app: Result:', result);
    console.log('❌ Mobile app: Error:', error);

    if (error) {
      console.error('❌ Mobile app: API error:', error);
      console.error('❌ Mobile app: Error details:', {
        name: error.name,
        message: error.message,
        context: error.context,
        details: error.details
      });
      
      // Try to extract the actual error message from the server response
      let actualErrorMessage = '';
      if (error.context && error.context.body) {
        try {
          const errorBody = JSON.parse(error.context.body);
          actualErrorMessage = errorBody.error || '';
        } catch (e) {
          console.log('Could not parse error body');
        }
      }
      
      // Use the actual error message from the server if available
      if (actualErrorMessage) {
        throw new Error(actualErrorMessage);
      }
      
      throw new Error(error.message || 'Failed to create post');
    }

    if (!result || !result.success) {
      console.error('❌ Mobile app: Result error:', result);
      
      // Check if this is a moderation rejection from the result - use the actual funny message
      if (result.error && result.error.includes('Content rejected')) {
        throw new Error(result.error || 'Your content was rejected by our moderation system. Please try different content.');
      }
      
      throw new Error(result.error || 'Post creation failed');
    }

    // Transform to match expected response format
    return {
      success: true,
      post: {
        id: result.post.id,
        content: result.post.content,
        normalizedContent: result.post.content, // Use same content for now
        inputType: result.post.inputType,
        scope: result.post.scope,
        locationCity: data.locationCity,
        locationState: data.locationState,
        locationCountry: data.locationCountry,
        peopleWhoDidThis: result.post.matchCount,
        totalPostsInScope: result.post.matchCount + 1, // Approximate
        percentile: {
          tier: result.temporal?.allTime?.tier || result.post.tier,
          value: result.temporal?.allTime?.percentile || result.post.percentile,
          message: result.post.message,
          color: '#8b5cf6', // Default color
          emoji: result.post.badge,
        },
        createdAt: result.post.created_at,
        updatedAt: result.post.created_at,
      },
      matchCount: result.post.matchCount,
      uniquenessScore: result.post.percentile,
      percentile: {
        percentile: result.post.percentile, // Use main post percentile for consistency
        tier: result.post.tier, // Use main post tier for consistency
        displayText: result.post.displayText, // Always use the main post displayText
        badge: result.post.badge,
        message: result.post.message,
        comparison: result.post.comparison,
      },
      activities: result.post.activities,
      activityCount: result.post.activityCount,
      isDaySummary: data.inputType === 'day',
      temporal: result.temporal,
    };
  } catch (error: any) {
    console.error('❌ Mobile app: Create post error:', error);
    console.error('❌ Mobile app: Error type:', typeof error);
    console.error('❌ Mobile app: Error message:', error.message);
    console.error('❌ Mobile app: Error stack:', error.stack);
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

