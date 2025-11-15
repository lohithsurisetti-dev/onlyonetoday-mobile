/**
 * Stats Hooks
 * React Query hooks for fetching platform statistics
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { queryKeys } from '@lib/queryClient';

interface Stats {
  totalPostsToday: number;
  dreamsToday: number;
  totalPosts: number;
  moderationStats?: {
    totalChecked: number;
    flagged: number;
    approved: number;
    flagRate: number;
  };
}

/**
 * Fetch platform stats
 */
export function usePlatformStats(timezone?: string) {
  const queryKey = queryKeys.stats.today();

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data: result, error } = await supabase.functions.invoke('get-stats');
      
      if (error) {
        console.error('❌ Stats API error:', error);
        throw new Error('Failed to fetch stats');
      }
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch stats');
      }
      
      return result.stats as Stats;
    },
    staleTime: 60_000, // Cache for 1 minute
  });

  return {
    stats: data,
    isLoading,
    error,
    userTimezone: timezone,
  };
}

