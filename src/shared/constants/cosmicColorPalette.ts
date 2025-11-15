/**
 * Cosmic Color Palette
 * Varied, cohesive color system for cosmic-themed UI
 * Uses theme color as accent, not dominant
 */

export interface CosmicColors {
  // Theme accent (from emotional tone)
  theme: {
    primary: string;
    secondary: string;
    glow: string;
    backgroundGradient?: string;
  };
  
  // Neutral cosmic colors
  neutral: {
    background: string;
    surface: string;
    border: string;
    text: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
  };
  
  // Accent colors for variety
  accents: {
    cyan: string;      // For highlights, links
    teal: string;      // For secondary elements
    gold: string;      // For special moments
    pink: string;      // For warmth
  };
}

export function getCosmicColors(themeColor: {
  primary: string;
  secondary: string;
  glow: string;
  backgroundGradient?: string;
}): CosmicColors {
  return {
    theme: themeColor,
    
    // Neutral cosmic space colors
    neutral: {
      background: '#0a0a1a',           // Deep space black
      surface: 'rgba(255, 255, 255, 0.03)',  // Subtle surface
      border: 'rgba(255, 255, 255, 0.08)',   // Subtle borders
      text: {
        primary: '#ffffff',            // Pure white for main text
        secondary: 'rgba(255, 255, 255, 0.75)',  // 75% white
        tertiary: 'rgba(255, 255, 255, 0.5)',    // 50% white
      },
    },
    
    // Accent colors for variety (complementary to cosmic theme)
    accents: {
      cyan: '#06b6d4',      // Stellar cyan
      teal: '#14b8a6',      // Cosmic teal
      gold: '#f59e0b',       // Solar gold
      pink: '#ec4899',       // Nebula pink
    },
  };
}

/**
 * Get color for specific UI elements
 */
export function getElementColor(
  element: 'narrative' | 'content' | 'badge' | 'border' | 'background' | 'text' | 'accent',
  cosmicColors: CosmicColors
): string {
  switch (element) {
    case 'narrative':
      // Narrative uses theme color (emotional connection)
      return cosmicColors.theme.primary;
    case 'content':
      // Content uses neutral text
      return cosmicColors.neutral.text.secondary;
    case 'badge':
      // Badges use theme color for connection
      return cosmicColors.theme.primary;
    case 'border':
      // Borders use subtle neutral
      return cosmicColors.neutral.border;
    case 'background':
      // Backgrounds use neutral surface
      return cosmicColors.neutral.surface;
    case 'text':
      // Main text uses white
      return cosmicColors.neutral.text.primary;
    case 'accent':
      // Accents use complementary colors
      return cosmicColors.accents.cyan;
    default:
      return cosmicColors.neutral.text.primary;
  }
}

