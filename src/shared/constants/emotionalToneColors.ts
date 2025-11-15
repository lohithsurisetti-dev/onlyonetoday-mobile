/**
 * V2: Emotional Tone Color System - Cosmic Theme
 * Colors based on emotional tone (unique, shared, common) with cosmic palette
 */

export interface EmotionalToneColors {
  primary: string;
  secondary: string;
  gradient: string[];
  glow: string;
  background: string;
  backgroundGradient: string;
}

export const getEmotionalToneColors = (tone?: 'unique' | 'shared' | 'common'): EmotionalToneColors => {
  switch (tone) {
    case 'unique':
      // Trailblazer - Stellar Cyan (cosmic, pioneering)
      return {
        primary: '#06b6d4',    // Cyan-500 - vibrant stellar cyan
        secondary: '#22d3ee',  // Cyan-400 - lighter cyan
        gradient: ['#06b6d4', '#22d3ee'],
        glow: '#06b6d4',       // Stellar Cyan glow
        background: 'rgba(6, 182, 212, 0.08)',
        backgroundGradient: '#0c1e2a', // Deep cyan space
      };
    case 'shared':
      // Connection - Cosmic Teal (warm, connecting, community) - NOT purple
      return {
        primary: '#14b8a6',    // Teal-500 - cosmic teal (not purple!)
        secondary: '#2dd4bf',  // Teal-400
        gradient: ['#14b8a6', '#2dd4bf'],
        glow: '#14b8a6',       // Cosmic Teal glow
        background: 'rgba(20, 184, 166, 0.08)',
        backgroundGradient: '#0f2e2a', // Deep teal space
      };
    case 'common':
      // Humanity - Solar Gold (warm, universal, beloved) - NOT pink
      return {
        primary: '#f59e0b',    // Amber-500 - solar gold
        secondary: '#fbbf24',  // Amber-400
        gradient: ['#f59e0b', '#fbbf24'],
        glow: '#f59e0b',       // Solar Gold glow
        background: 'rgba(245, 158, 11, 0.08)',
        backgroundGradient: '#2a1f0f', // Deep amber space
      };
    default:
      // Default - Cosmic Cyan (neutral cosmic, not purple)
      return {
        primary: '#06b6d4',    // Cyan-500
        secondary: '#22d3ee',
        gradient: ['#06b6d4', '#22d3ee'],
        glow: '#06b6d4',
        background: 'rgba(6, 182, 212, 0.08)',
        backgroundGradient: '#0c1e2a',
      };
  }
};

