/**
 * Dreams API - Supabase Implementation
 * Handles dream post creation and fetching
 */

import { supabase } from '@/lib/supabase';

export type DreamType = 'night_dream' | 'daydream' | 'lucid_dream' | 'nightmare';
export type Scope = 'city' | 'state' | 'country' | 'world';

export interface CreateDreamRequest {
  content: string;
  dreamType: DreamType;
  symbols?: string[];
  emotions?: string[];
  clarity: number; // 1-10
  interpretation?: string;
  isAnonymous?: boolean;
  scope: Scope;
  locationCity?: string | null;
  locationState?: string | null;
  locationCountry?: string | null;
}

export interface DreamInterpretation {
  title: string;
  meaning: string;
  emotionalGuidance: string;
  comfortMessage: string;
  actionAdvice: string;
  hopeMessage: string;
  isPositive: boolean;
  confidence: number;
}

export interface DreamPost {
  id: string;
  content: string;
  dream_type: DreamType;
  symbols: string[];
  emotions: string[];
  clarity: number;
  interpretation?: DreamInterpretation; // AI-generated interpretation object
  scope: Scope;
  location_city?: string;
  location_state?: string;
  location_country?: string;
  matchCount: number;
  totalInScope: number;
  tier: string;
  percentile: number;
  created_at: string;
}

/**
 * Check if an interpretation is a *temporary placeholder* (not a real result).
 *
 * We keep this deliberately strict:
 * - Treat only the short, explicit placeholders as "default"
 * - Allow generic but full fallback interpretations to show (better than empty UI)
 */
export function isDefaultInterpretation(interpretation: DreamInterpretation | undefined): boolean {
  if (!interpretation || !interpretation.meaning) return true;

  const meaning = interpretation.meaning.trim();

  // Only these are considered true placeholders
  if (
    meaning === 'Your dream is being interpreted...' ||
    meaning === 'Your dream is unique and meaningful.'
  ) {
    return true;
  }

  // Anything else (including generic but complete fallbacks) counts as a real interpretation
  return false;
}

export interface CreateDreamResponse {
  success: boolean;
  post?: DreamPost;
  error?: string;
}

/**
 * Create a new dream post
 */
export const createDreamPost = async (
  params: CreateDreamRequest
): Promise<CreateDreamResponse> => {
  try {
    console.log('🌙 Creating dream post...', {
      content: params.content.substring(0, 50) + '...',
      dreamType: params.dreamType,
      clarity: params.clarity,
    });

    const { data, error } = await supabase.functions.invoke('create-dream-post', {
      body: {
        content: params.content,
        dreamType: params.dreamType,
        symbols: params.symbols || [],
        emotions: params.emotions || [],
        clarity: params.clarity,
        interpretation: params.interpretation,
        isAnonymous: params.isAnonymous || false,
        scope: params.scope,
        locationCity: params.locationCity || null,
        locationState: params.locationState || null,
        locationCountry: params.locationCountry || null,
      },
    });

    if (error) {
      console.error('❌ Dream creation error:', error);
      console.error('Error context:', error.context);
      
      // Try to extract error message from various sources
      let errorMessage = error.message || 'Failed to create dream';
      
      // Check error context for detailed message
      if (error.context) {
        // Check if there's a body with error details
        if (error.context.body) {
          try {
            const errorBody = typeof error.context.body === 'string' 
              ? JSON.parse(error.context.body) 
              : error.context.body;
            if (errorBody?.error) {
              errorMessage = errorBody.error;
            } else if (errorBody?.message) {
              errorMessage = errorBody.message;
            }
          } catch (e) {
            // Ignore parse errors
          }
        }
        
        // Check for status code errors
        if (error.context.status) {
          const status = error.context.status;
          if (status >= 500) {
            errorMessage = 'Server error. Please try again in a moment.';
          } else if (status === 400) {
            errorMessage = errorMessage || 'Invalid request. Please check your input.';
          } else if (status === 401 || status === 403) {
            errorMessage = 'Authentication error. Please try logging in again.';
          }
        }
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }

    // Check if data contains an error response
    if (data && data.success === false) {
      return {
        success: false,
        error: data.error || 'Failed to create dream',
      };
    }

    if (!data || !data.post) {
      return {
        success: false,
        error: 'Invalid response from server',
      };
    }

    console.log('✅ Dream created successfully:', data.post.id);
    return {
      success: true,
      post: data.post as DreamPost,
    };
  } catch (error: any) {
    console.error('❌ Dream creation exception:', error);
    return {
      success: false,
      error: error.message || 'Failed to create dream',
    };
  }
};

/**
 * Fetch a single dream by ID (for polling interpretation updates)
 */
export const fetchDreamById = async (dreamId: string): Promise<{ success: boolean; post?: DreamPost; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('dream_posts')
      .select('*')
      .eq('id', dreamId)
      .single();

    if (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch dream',
      };
    }

    // Parse interpretation if it exists
    let interpretation: DreamInterpretation | undefined;
    if (data.interpretation) {
      try {
        // Try to parse as JSON first (structured format)
        if (typeof data.interpretation === 'string') {
          // Check if it's JSON format
          if (data.interpretation.trim().startsWith('{')) {
            const parsed = JSON.parse(data.interpretation);
            // Only use if it's a real interpretation (not default placeholder)
            if (parsed.meaning && !isDefaultInterpretation(parsed) && parsed.meaning.length > 50) {
              interpretation = parsed;
            } else {
              // Default placeholder - skip it
              interpretation = undefined;
            }
          } else {
            // Legacy formatted text - skip it, will be replaced by background generation
            interpretation = undefined;
          }
        } else {
          // Already an object - check if it's real (not default placeholder)
          if (data.interpretation.meaning && !isDefaultInterpretation(data.interpretation) && data.interpretation.meaning.length > 50) {
            interpretation = data.interpretation;
          } else {
            interpretation = undefined;
          }
        }
      } catch {
        // If parsing fails, don't show a default - wait for real interpretation
        interpretation = undefined;
      }
    }

    return {
      success: true,
      post: {
        id: data.id,
        content: data.content || '',
        dream_type: data.dream_type,
        symbols: [], // Will be fetched separately if needed
        emotions: [], // Will be fetched separately if needed
        clarity: data.clarity || 0,
        interpretation,
        scope: data.scope,
        location_city: data.location_city || undefined,
        location_state: data.location_state || undefined,
        location_country: data.location_country || undefined,
        // Map database fields to TypeScript interface
        matchCount: data.match_count || 0,
        totalInScope: data.total_in_scope || 0,
        tier: data.tier || '',
        percentile: data.percentile || 0,
        created_at: data.created_at || new Date().toISOString(),
      } as DreamPost,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch dream',
    };
  }
};

/**
 * Fetch dreams with filters
 */
export const fetchDreams = async (filters: {
  dreamType?: DreamType;
  scope?: Scope;
  limit?: number;
  offset?: number;
} = {}): Promise<{ success: boolean; posts?: DreamPost[]; error?: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-dreams', {
      body: filters,
    });

    if (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch dreams',
      };
    }

    if (data && data.success === false) {
      return {
        success: false,
        error: data.error || 'Failed to fetch dreams',
      };
    }

    return {
      success: true,
      posts: data?.posts || [],
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch dreams',
    };
  }
};

