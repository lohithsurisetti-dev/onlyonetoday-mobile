/**
 * Analytics API Service
 */

import { supabase } from '../supabase';

/**
 * Get global stats
 */
export const getGlobalStats = async () => {
  try {
    const { data, error } = await supabase.rpc('get_global_stats');

    if (error) {
      throw error;
    }

    return data?.[0] || {
      total_posts_today: 0,
      unique_actions_today: 0,
      total_users: 0,
      active_users_today: 0,
    };
  } catch (error) {
    console.error('Get global stats error:', error);
    return {
      total_posts_today: 0,
      unique_actions_today: 0,
      total_users: 0,
      active_users_today: 0,
    };
  }
};

/**
 * Track an event (for analytics)
 */
export const trackEvent = async (
  eventType: string,
  eventData?: Record<string, any>
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    await supabase.from('events').insert({
      user_id: user?.id,
      event_type: eventType,
      event_data: eventData,
      platform: 'mobile',
    });
  } catch (error) {
    // Silently fail - analytics shouldn't break the app
    console.warn('Track event error:', error);
  }
};

