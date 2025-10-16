/**
 * Common Types
 * Shared types used across the application
 */

export type Scope = 'city' | 'state' | 'country' | 'world'

export type InputType = 'action' | 'day'

export type PercentileTier = 'elite' | 'rare' | 'unique' | 'notable' | 'common' | 'popular'

export interface Location {
  city?: string | null
  state?: string | null
  country?: string | null
  timezone?: string
}

export interface Percentile {
  tier: PercentileTier
  value: number
  message: string
  color: string
  emoji: string
}

export interface Post {
  id: string
  content: string
  normalizedContent: string
  inputType: InputType
  scope: Scope
  locationCity?: string | null
  locationState?: string | null
  locationCountry?: string | null
  peopleWhoDidThis: number
  totalPostsInScope: number
  percentile?: Percentile
  createdAt: string
  updatedAt: string
}

export interface Stats {
  totalPostsToday: number
  uniqueActionsToday: number
  totalPosts: number
  moderationStats?: {
    totalChecked: number
    flagged: number
    approved: number
    flagRate: number
  }
}

export interface Reaction {
  postId: string
  type: 'like' | 'love' | 'wow' | 'fire'
  count: number
  hasReacted: boolean
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  hasMore: boolean
}

