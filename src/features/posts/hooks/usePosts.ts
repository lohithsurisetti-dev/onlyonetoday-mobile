/**
 * Posts Hooks
 * React Query hooks for posts feature
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@lib/queryClient'
import * as postsApi from '../api/posts.api'
import type { CreatePostRequest, GetPostsRequest } from '../types/post.types'

/**
 * Fetch posts list
 */
export function usePosts(params: GetPostsRequest = {}) {
  const queryKey = queryKeys.posts.list(JSON.stringify(params))

  return useQuery({
    queryKey,
    queryFn: () => postsApi.getPosts(params),
    staleTime: 30_000, // Cache for 30 seconds
  })
}

/**
 * Fetch single post
 */
export function usePost(id: string) {
  return useQuery({
    queryKey: queryKeys.posts.detail(id),
    queryFn: () => postsApi.getPostById(id),
    enabled: !!id, // Only fetch if ID exists
  })
}

/**
 * Create new post
 */
export function useCreatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePostRequest) => postsApi.createPost(data),
    onSuccess: (response) => {
      // Invalidate posts list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all })

      // Optionally add the new post to cache
      if (response.post) {
        queryClient.setQueryData(queryKeys.posts.detail(response.post.id), {
          post: response.post,
        })
      }

      console.log('✅ Post created successfully')
    },
    onError: (error) => {
      console.error('❌ Failed to create post:', error)
    },
  })
}

/**
 * Fetch feed
 */
export function useFeed(params: GetPostsRequest = {}) {
  const queryKey = queryKeys.feed.list(JSON.stringify(params))

  return useQuery({
    queryKey,
    queryFn: () => postsApi.getFeed(params),
    staleTime: 30_000, // Cache for 30 seconds
  })
}

