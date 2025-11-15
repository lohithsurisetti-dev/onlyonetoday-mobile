/**
 * Common Types
 * Shared types used across the application
 */

export type Scope = 'city' | 'state' | 'country' | 'world'

export type InputType = 'action' | 'day'

export type EmotionalTone = 'unique' | 'shared' | 'common'

export interface Location {
  city?: string | null
  state?: string | null
  country?: string | null
  timezone?: string
}

// V2: Narrative-based story system
export interface PostStory {
  narrative: string
  matchCount: number
  totalInScope: number
  emotionalTone: EmotionalTone
  celebration: string
  badge?: string
}

export interface Post {
  id: string
  content: string
  normalizedContent?: string
  inputType: InputType
  scope: Scope
  locationCity?: string | null
  locationState?: string | null
  locationCountry?: string | null
  // V2: Narrative-based fields
  narrative?: string
  matchCount?: number
  totalInScope?: number
  emotionalTone?: EmotionalTone
  celebration?: string
  badge?: string
  keywords?: string[]
  detectedLanguage?: string
  // Day summary specific
  activities?: string[]
  dayOfWeek?: string
  // Legacy fields (for backward compatibility during migration)
  peopleWhoDidThis?: number
  totalPostsInScope?: number
  createdAt: string
  updatedAt?: string
}

export interface Stats {
  totalPostsToday: number
  sharedExperiencesToday: number
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

