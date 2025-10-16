/**
 * Posts API
 * API calls for posts feature
 */

import { apiClient } from '@services/api/client'
import { endpoints } from '@config/api.config'
import type {
  CreatePostRequest,
  CreatePostResponse,
  GetPostsRequest,
  GetPostsResponse,
  GetPostDetailResponse,
} from '../types/post.types'

/**
 * Create a new post
 */
export async function createPost(data: CreatePostRequest): Promise<CreatePostResponse> {
  return apiClient.post(endpoints.posts.create, data)
}

/**
 * Get list of posts
 */
export async function getPosts(params: GetPostsRequest = {}): Promise<GetPostsResponse> {
  return apiClient.get(endpoints.posts.list, { params })
}

/**
 * Get post by ID
 */
export async function getPostById(id: string): Promise<GetPostDetailResponse> {
  return apiClient.get(endpoints.posts.detail(id))
}

/**
 * Get feed (global posts)
 */
export async function getFeed(params: GetPostsRequest = {}): Promise<GetPostsResponse> {
  return apiClient.get(endpoints.feed.list, { params })
}

