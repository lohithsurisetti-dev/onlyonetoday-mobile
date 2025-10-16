/**
 * Design System Configuration
 * Centralized theme tokens matching web design
 */

export const colors = {
  // Brand Colors
  primary: '#8242f0',
  primaryLight: '#9a5ef7',
  primaryDark: '#6a35d0',

  // Background
  backgroundLight: '#f7f6f8',
  backgroundDark: '#0A0A2A',
  surfaceLight: '#ffffff',
  surfaceDark: '#1a1a3a',

  // Accent Colors
  accentBlue: '#00BFFF',
  accentGreen: '#39FF14',
  accentGold: '#FFD700',
  accentPurple: '#8242f0',

  // Text Colors
  textPrimary: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textTertiary: 'rgba(255, 255, 255, 0.5)',
  textDark: '#0A0A2A',

  // Semantic Colors
  success: '#39FF14',
  warning: '#FFD700',
  error: '#FF3B30',
  info: '#00BFFF',

  // Glass Effect
  glassLight: 'rgba(255, 255, 255, 0.1)',
  glassDark: 'rgba(0, 0, 0, 0.3)',
} as const

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const

export const typography = {
  fontFamily: {
    display: 'SplineSans',
    serif: 'Lora',
    mono: 'Courier',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    white: {
      shadowColor: '#ffffff',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 15,
      elevation: 10,
    },
    gold: {
      shadowColor: '#FFD700',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 15,
      elevation: 10,
    },
    blue: {
      shadowColor: '#00BFFF',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 15,
      elevation: 10,
    },
  },
} as const

export const animations = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  easing: {
    linear: 'linear',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
} as const

export const theme = {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
  animations,
} as const

export type Theme = typeof theme

