/**
 * Themed Days API
 * API calls for themed day posts
 */

import { supabase } from '../supabase';
import type { DayPost } from '@/features/days/types';

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

/**
 * Create a themed day post
 */
export const createDayPost = async (
  content: string, 
  dayOfWeek: DayOfWeek,
  scope: 'city' | 'state' | 'country' | 'world' = 'world',
  locationCity?: string | null,
  locationState?: string | null,
  locationCountry?: string | null
): Promise<{ success: boolean; post?: DayPost; error?: string }> => {
  try {
    console.log(`🎭 Creating day post for ${dayOfWeek}`);
    
    // Get session token for debugging
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      console.log(`🔑 Auth token: ${session.access_token.substring(0, 50)}...`);
      console.log(`📋 Full token: ${session.access_token}`);
    } else {
      console.log(`⚠️ No auth token found`);
    }
    
    const { data, error } = await supabase.functions.invoke('create-day-post', {
      body: {
        content,
        dayOfWeek,
        scope,
        locationCity: locationCity || null,
        locationState: locationState || null,
        locationCountry: locationCountry || null
      }
    });

    console.log('📊 Create response - data:', JSON.stringify(data, null, 2));
    console.log('📊 Create response - error:', error);

    // If there's an error object, try to extract the message
    if (error) {
      console.error('❌ Error creating day post:', error);
      
      // Try to extract error message from error object
      let errorMessage = error.message || 'Failed to create day post';
      
      // If error has context, try to get the actual backend error
      if (error.context && error.context.body) {
        try {
          const errorBody = typeof error.context.body === 'string' 
            ? JSON.parse(error.context.body) 
            : error.context.body;
          if (errorBody?.error) {
            errorMessage = errorBody.error;
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }

    // Check if data contains an error response (even if error object exists)
    if (data && !data.success) {
      console.log('🚫 Backend error in data:', data.error || data.message);
      return {
        success: false,
        error: data.error || data.message || 'Failed to create day post'
      };
    }

    if (!data || !data.success) {
      return {
        success: false,
        error: data?.error || 'Failed to create day post'
      };
    }

    console.log('✅ Day post created successfully');
    return {
      success: true,
      post: data.post
    };
  } catch (error) {
    console.error('❌ Create day post error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
};

/**
 * Fetch themed day posts
 */
export const fetchDayPosts = async (
  dayOfWeek: DayOfWeek,
  todayOnly: boolean = true
): Promise<{ success: boolean; posts: DayPost[]; error?: string }> => {
  try {
    console.log(`📚 Fetching day posts for ${dayOfWeek}, todayOnly: ${todayOnly}`);

    // Use Supabase function invoke (handles auth automatically)
    const { data, error } = await supabase.functions.invoke('fetch-day-posts', {
      body: {
      dayOfWeek,
        todayOnly,
        limit: 10
      }
    });

    if (error) {
      console.error('❌ Fetch day posts error:', error);
      return {
        success: false,
        posts: [],
        error: error.message || 'Failed to fetch day posts'
      };
    }

    // Handle both direct function response and nested response
    const result = data?.data || data;

    if (!result || !result.success) {
      return {
        success: false,
        posts: [],
        error: result?.error || 'Failed to fetch day posts'
      };
    }

    console.log(`✅ Fetched ${result.posts?.length || 0} day posts`);
    return {
      success: true,
      posts: result.posts || []
    };
  } catch (error) {
    console.error('❌ Fetch day posts error:', error);
    return {
      success: false,
      posts: [],
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
};

/**
 * React to a day post (add reaction)
 */
export const reactToDayPost = async (
  postId: string,
  reactionType: 'first' | 'second' | 'third'
): Promise<{ success: boolean; error?: string }> => {
  try {
    // For now, we'll update via direct database call
    // In the future, create a dedicated edge function for this
    const { error } = await supabase.rpc('increment_day_post_reaction', {
      post_id: postId,
      reaction_type: reactionType
    });

    if (error) {
      console.error('❌ Error reacting to day post:', error);
      return {
        success: false,
        error: error.message
      };
    }

    return { success: true };
  } catch (error) {
    console.error('❌ React to day post error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
};

/**
 * Get day statistics (participant counts per day)
 */
export const getDayStats = async (): Promise<{
  success: boolean;
  stats?: {
    dayCounts: Record<DayOfWeek, number>;
    totalToday: number;
    date: string;
  };
  error?: string;
}> => {
  try {
    console.log('📊 Fetching day stats...');

    // Use Supabase function invoke (handles auth automatically)
    const { data, error } = await supabase.functions.invoke('get-day-stats', {});

    if (error) {
      console.error('❌ Fetch day stats error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch day stats'
      };
    }

    // Handle both direct function response and nested response
    const result = data?.data || data;

    if (!result || !result.success) {
      return {
        success: false,
        error: result?.error || 'Failed to fetch day stats'
      };
    }

    console.log('✅ Day stats fetched successfully');
    return {
      success: true,
      stats: result.stats
    };
  } catch (error) {
    console.error('❌ Fetch day stats error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
};

