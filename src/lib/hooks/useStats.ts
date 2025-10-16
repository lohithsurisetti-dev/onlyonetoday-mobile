/**
 * Stats Hooks
 * React Query hooks for fetching platform statistics
 */

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@services/api/client';
import { queryKeys } from '@lib/queryClient';

interface Stats {
  totalPostsToday: number;
  uniqueActionsToday: number;
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
      const params = timezone ? { timezone } : {};
      const response = await apiClient.get('/stats', { params });
      return response as Stats;
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

