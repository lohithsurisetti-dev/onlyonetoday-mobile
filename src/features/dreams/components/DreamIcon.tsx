/**
 * Dream Icon Component
 * Premium SVG icons for dream types
 */

import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface DreamIconProps {
  type: 'night_dream' | 'daydream' | 'lucid_dream' | 'nightmare';
  size: number;
  color: string;
}

export default function DreamIcon({ type, size, color }: DreamIconProps) {
  switch (type) {
    case 'night_dream':
      // Moon icon for night dreams
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={`${color}20`}
          />
        </Svg>
      );

    case 'daydream':
      // Cloud icon for daydreams
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={`${color}20`}
          />
        </Svg>
      );

    case 'lucid_dream':
      // Sparkle/star icon for lucid dreams
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 2L13.09 8.26L19 9L13.09 9.74L12 16L10.91 9.74L5 9L10.91 8.26L12 2Z"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={color}
            opacity={0.3}
          />
          <Circle cx="12" cy="12" r="2" fill={color} />
          <Path
            d="M5 5L7 7M17 5L15 7M5 19L7 17M17 19L15 17"
            stroke={color}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'nightmare':
      // Shield/protection icon for nightmares (supportive, not scary)
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={`${color}15`}
          />
          <Path
            d="M9 12l2 2 4-4"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    default:
      return null;
  }
}

