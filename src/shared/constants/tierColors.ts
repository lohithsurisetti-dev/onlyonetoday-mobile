/**
 * Centralized Tier Color System
 * Used consistently across all screens for tiers: elite, rare, unique, notable, popular, common
 */

export interface TierColors {
  primary: string;
  secondary: string;
  gradient: string[];
  glow: string;
  background: string;
  backgroundGradient: string;
}

export const getTierColors = (tier: string): TierColors => {
  switch (tier.toLowerCase()) {
    // ============================================================================
    // ORIGINAL COLORS (Current)
    // ============================================================================
    // case 'elite':
    //   return {
    //     primary: '#a78bfa',    // Cosmic Violet
    //     secondary: '#c4b5fd',
    //     gradient: ['#a78bfa', '#c4b5fd'],
    //     glow: '#a78bfa',
    //     background: 'rgba(167, 139, 250, 0.1)',
    //     backgroundGradient: '#2d1b4e', // Deep cosmic purple
    //   };
    // case 'rare':
    //   return {
    //     primary: '#f472b6',    // Nebula Pink
    //     secondary: '#fb7185',
    //     gradient: ['#f472b6', '#fb7185'],
    //     glow: '#f472b6',
    //     background: 'rgba(244, 114, 182, 0.1)',
    //     backgroundGradient: '#4a1942', // Deep pink space
    //   };
    // case 'unique':
    //   return {
    //     primary: '#22d3ee',    // Stellar Cyan
    //     secondary: '#67e8f9',
    //     gradient: ['#22d3ee', '#67e8f9'],
    //     glow: '#22d3ee',
    //     background: 'rgba(34, 211, 238, 0.1)',
    //     backgroundGradient: '#1e3a4e', // Deep ocean space
    //   };
    // case 'notable':
    //   return {
    //     primary: '#f97316',    // Cosmic Orange
    //     secondary: '#fb923c',
    //     gradient: ['#f97316', '#fb923c'],
    //     glow: '#f97316',
    //     background: 'rgba(249, 115, 22, 0.1)',
    //     backgroundGradient: '#3a2a1e', // Deep amber space
    //   };
    // case 'popular':
    //   return {
    //     primary: '#fbbf24',    // Solar Gold
    //     secondary: '#fcd34d',
    //     gradient: ['#fbbf24', '#fcd34d'],
    //     glow: '#fbbf24',
    //     background: 'rgba(251, 191, 36, 0.1)',
    //     backgroundGradient: '#3e3a1e', // Deep gold space
    //   };
    // case 'common':
    //   return {
    //     primary: '#9ca3af',    // Stardust Gray
    //     secondary: '#d1d5db',
    //     gradient: ['#9ca3af', '#d1d5db'],
    //     glow: '#9ca3af',
    //     background: 'rgba(156, 163, 175, 0.1)',
    //     backgroundGradient: '#2a2a3e', // Deep gray space
    //   };

    // ============================================================================
    // ALTERNATIVE COSMIC PALETTE (Exploring)
    // Deep space, auroras, celestial phenomena
    // ============================================================================
    case 'elite':
      return {
        primary: '#e879f9',    // Aurora Magenta - Northern lights inspired
        secondary: '#f0abfc',
        gradient: ['#e879f9', '#f0abfc'],
        glow: '#e879f9',
        background: 'rgba(232, 121, 249, 0.1)',
        backgroundGradient: '#3d1a4e',
      };
    case 'rare':
      return {
        primary: '#a78bfa',    // Deep Violet - Nebula core
        secondary: '#c4b5fd',
        gradient: ['#a78bfa', '#c4b5fd'],
        glow: '#a78bfa',
        background: 'rgba(167, 139, 250, 0.1)',
        backgroundGradient: '#2d1b4e',
      };
    case 'unique':
      return {
        primary: '#38bdf8',    // Comet Blue - Ice giant atmosphere
        secondary: '#7dd3fc',
        gradient: ['#38bdf8', '#7dd3fc'],
        glow: '#38bdf8',
        background: 'rgba(56, 189, 248, 0.1)',
        backgroundGradient: '#1e3a5f',
      };
    case 'notable':
      return {
        primary: '#fb7185',    // Supernova Pink - Star explosion
        secondary: '#fda4af',
        gradient: ['#fb7185', '#fda4af'],
        glow: '#fb7185',
        background: 'rgba(251, 113, 133, 0.1)',
        backgroundGradient: '#4a1f2e',
      };
    case 'popular':
      return {
        primary: '#fbbf24',    // Solar Flare Gold
        secondary: '#fcd34d',
        gradient: ['#fbbf24', '#fcd34d'],
        glow: '#fbbf24',
        background: 'rgba(251, 191, 36, 0.1)',
        backgroundGradient: '#3e3a1e',
      };
    case 'common':
      return {
        primary: '#94a3b8',    // Asteroid Gray - Space rock
        secondary: '#cbd5e1',
        gradient: ['#94a3b8', '#cbd5e1'],
        glow: '#94a3b8',
        background: 'rgba(148, 163, 184, 0.1)',
        backgroundGradient: '#2a2f3e',
      };
    default:
      return {
        primary: '#94a3b8',
        secondary: '#cbd5e1',
        gradient: ['#94a3b8', '#cbd5e1'],
        glow: '#94a3b8',
        background: 'rgba(148, 163, 184, 0.1)',
        backgroundGradient: '#2a2f3e',
      };
  }
};

