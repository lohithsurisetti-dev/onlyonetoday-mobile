/**
 * Post Feature Types
 * Type definitions for posts feature with Zod validation
 */

import { z } from 'zod'
import type { Post, Scope, InputType } from '@shared/types/common.types'

/**
 * Zod Schemas for Runtime Validation
 */

// Create Post Schema
export const CreatePostSchema = z.object({
  content: z
    .string()
    .min(3, 'Content must be at least 3 characters')
    .max(500, 'Content must be less than 500 characters')
    .trim(),
  inputType: z.enum(['action', 'day'], {
    errorMap: () => ({ message: 'Input type must be action or day' }),
  }),
  scope: z.enum(['city', 'state', 'country', 'world'], {
    errorMap: () => ({ message: 'Invalid scope' }),
  }),
  locationCity: z.string().optional().nullable(),
  locationState: z.string().optional().nullable(),
  locationCountry: z.string().optional().nullable(),
})

// Post Response Schema (from API)
export const PostResponseSchema = z.object({
  id: z.string().uuid(),
  content: z.string(),
  normalizedContent: z.string(),
  inputType: z.enum(['action', 'day']),
  scope: z.enum(['city', 'state', 'country', 'world']),
  locationCity: z.string().nullable().optional(),
  locationState: z.string().nullable().optional(),
  locationCountry: z.string().nullable().optional(),
  peopleWhoDidThis: z.number().int().positive(),
  totalPostsInScope: z.number().int().nonnegative(),
  percentile: z
    .object({
      tier: z.enum(['elite', 'rare', 'unique', 'notable', 'beloved', 'popular']),
      value: z.number().min(0).max(100),
      message: z.string(),
      color: z.string(),
      emoji: z.string(),
    })
    .optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

/**
 * TypeScript Types (inferred from schemas)
 */
export type CreatePostDto = z.infer<typeof CreatePostSchema>
export type PostResponse = z.infer<typeof PostResponseSchema>

/**
 * API Request/Response Types
 */
export interface CreatePostRequest extends CreatePostDto {}

export interface CreatePostResponse {
  post: Post
  similarPosts?: Post[]
  matchCount: number
  uniquenessScore: number
  percentile?: {
    percentile: number
    tier: 'elite' | 'rare' | 'unique' | 'notable' | 'beloved' | 'popular'
    displayText: string
    badge: string
    message: string
    comparison: string
  }
  totalPosts?: number
  activities?: string[]
  activityCount?: number
  isDaySummary?: boolean
  temporal?: {
    week: {
      matches: number;
      total: number;
      comparison: string;
    };
    month: {
      matches: number;
      total: number;
      comparison: string;
    };
    year: {
      matches: number;
      total: number;
      comparison: string;
    };
    allTime: {
      matches: number;
      total: number;
      comparison: string;
    };
    insight: string;
  };
}

export interface GetPostsRequest {
  scope?: Scope
  inputType?: InputType
  limit?: number
  offset?: number
}

export interface GetPostsResponse {
  posts: Post[]
  total: number
  hasMore: boolean
}

export interface GetPostDetailResponse {
  post: Post
}

/**
 * Form Types
 */
export interface PostFormData {
  content: string
  inputType: InputType
  scope: Scope
}

/**
 * Validation Error Type
 */
export interface ValidationError {
  field: string
  message: string
}

