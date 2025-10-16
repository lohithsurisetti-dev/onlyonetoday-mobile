/**
 * React Query Configuration
 * Centralized query client with default options
 */

import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache configuration
      staleTime: 30_000, // Data is fresh for 30 seconds
      gcTime: 5 * 60_000, // Keep unused data in cache for 5 minutes (formerly cacheTime)
      
      // Retry configuration
      retry: 2, // Retry failed requests 2 times
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetch configuration
      refetchOnWindowFocus: false, // Don't refetch when app comes to foreground (we'll handle this manually)
      refetchOnReconnect: true, // Refetch when internet reconnects
      refetchOnMount: 'always', // Always check for fresh data on mount
      
      // Error handling
      throwOnError: false, // Don't throw errors, handle in UI
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
      retryDelay: 1000,
    },
  },
})

/**
 * Query Keys Factory
 * Centralized query keys for easy invalidation
 */
export const queryKeys = {
  // Posts
  posts: {
    all: ['posts'] as const,
    lists: () => [...queryKeys.posts.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.posts.lists(), filters] as const,
    details: () => [...queryKeys.posts.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.posts.details(), id] as const,
  },
  
  // Stats
  stats: {
    all: ['stats'] as const,
    today: () => [...queryKeys.stats.all, 'today'] as const,
    rankings: (scope: string) => [...queryKeys.stats.all, 'rankings', scope] as const,
  },
  
  // Feed
  feed: {
    all: ['feed'] as const,
    lists: () => [...queryKeys.feed.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.feed.lists(), filters] as const,
  },
  
  // Auth
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
  },
} as const

