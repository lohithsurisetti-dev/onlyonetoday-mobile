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
export const createDayPost = async (content: string, dayOfWeek: DayOfWeek): Promise<{ success: boolean; post?: DayPost; error?: string }> => {
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
        dayOfWeek
      }
    });

    console.log('📊 Create response - data:', data, 'error:', error);

    // Check if data contains an error response (even if error object exists)
    if (data && !data.success && data.error) {
      console.log('🚫 Backend error:', data.error);
      return {
        success: false,
        error: data.error
      };
    }

    if (error) {
      console.error('❌ Error creating day post:', error);
      return {
        success: false,
        error: error.message || 'Failed to create day post'
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

    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
    const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH';
    
    // Get session token for debugging
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      console.log(`🔑 Auth token for fetch: ${session.access_token.substring(0, 50)}...`);
      console.log(`📋 Full token: ${session.access_token}`);
    } else {
      console.log(`⚠️ No auth token found`);
    }
    
    const params = new URLSearchParams({
      dayOfWeek,
      todayOnly: todayOnly.toString(),
      limit: '10'
    });

    const response = await fetch(`${supabaseUrl}/functions/v1/fetch-day-posts?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'x-application-name': 'onlyone-mobile',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      return {
        success: false,
        posts: [],
        error: data.error || 'Failed to fetch day posts'
      };
    }

    console.log(`✅ Fetched ${data.posts.length} day posts`);
    return {
      success: true,
      posts: data.posts
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

    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
    const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH';

    const response = await fetch(`${supabaseUrl}/functions/v1/get-day-stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'x-application-name': 'onlyone-mobile',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      return {
        success: false,
        error: data.error || 'Failed to fetch day stats'
      };
    }

    console.log('✅ Day stats fetched successfully');
    return {
      success: true,
      stats: data.stats
    };
  } catch (error) {
    console.error('❌ Fetch day stats error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
};

