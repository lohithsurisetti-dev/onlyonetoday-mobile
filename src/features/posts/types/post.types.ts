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

// Post Response Schema (from API) - V2
export const PostResponseSchema = z.object({
  id: z.string().uuid(),
  content: z.string(),
  normalizedContent: z.string().optional(),
  inputType: z.enum(['action', 'day']),
  scope: z.enum(['city', 'state', 'country', 'world']),
  locationCity: z.string().nullable().optional(),
  locationState: z.string().nullable().optional(),
  locationCountry: z.string().nullable().optional(),
  // V2: Narrative-based fields
  narrative: z.string().optional(),
  matchCount: z.number().int().nonnegative().optional(),
  totalInScope: z.number().int().nonnegative().optional(),
  emotionalTone: z.enum(['unique', 'shared', 'common']).optional(),
  celebration: z.string().optional(),
  badge: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  detectedLanguage: z.string().optional(),
  // Day summary specific
  activities: z.array(z.string()).optional(),
  dayOfWeek: z.string().optional(),
  // Legacy fields (for backward compatibility)
  peopleWhoDidThis: z.number().int().positive().optional(),
  totalPostsInScope: z.number().int().nonnegative().optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
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

// V2: Narrative-based response
export interface CreatePostResponse {
  success: boolean
  post?: {
    id: string
    content: string
    inputType: string
    scope: string
    narrative: string
  matchCount: number
    totalInScope: number
    emotionalTone: 'unique' | 'shared' | 'common'
    celebration: string
    badge?: string
    keywords?: string[]
    detectedLanguage?: string
  activities?: string[]
    dayOfWeek?: string
    created_at: string
  }
  error?: string
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

