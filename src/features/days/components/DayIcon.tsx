/**
 * Day Icon Component
 * Premium SVG icons for each themed day
 */

import React from 'react';
import Svg, { Path, Circle, Rect, Polygon } from 'react-native-svg';

interface DayIconProps {
  icon: 'mask' | 'star' | 'dice' | 'heart' | 'party' | 'sparkle' | 'wave';
  size: number;
  color: string;
}

export default function DayIcon({ icon, size, color }: DayIconProps) {
  switch (icon) {
    case 'mask':
      // Theater mask for Monday (Unpopular Opinions)
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Circle cx="9" cy="10" r="1.5" fill={color} />
          <Circle cx="15" cy="10" r="1.5" fill={color} />
          <Path
            d="M8 16c1 1 2.5 1.5 4 1.5s3-.5 4-1.5"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'star':
      // Star for Tuesday (Tiny Wins)
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={`${color}30`}
          />
        </Svg>
      );

    case 'dice':
      // Dice for Wednesday (Wildcard)
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="4"
            stroke={color}
            strokeWidth={2}
          />
          <Circle cx="8" cy="8" r="1.5" fill={color} />
          <Circle cx="16" cy="8" r="1.5" fill={color} />
          <Circle cx="12" cy="12" r="1.5" fill={color} />
          <Circle cx="8" cy="16" r="1.5" fill={color} />
          <Circle cx="16" cy="16" r="1.5" fill={color} />
        </Svg>
      );

    case 'heart':
      // Heart for Thursday (Thankful)
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={`${color}20`}
          />
        </Svg>
      );

    case 'party':
      // Party popper for Friday (Free Spirit)
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M5.8 11.3L2 22l10.7-3.8"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M4 3h.01M22 8h.01M15 2h.01M18 5h.01M12 8h.01M16 11h.01M20 14h.01M17 17h.01M14 20h.01"
            stroke={color}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
          <Path
            d="M12 8l-9.7 9.7a2.41 2.41 0 000 3.41v0a2.41 2.41 0 003.41 0L15.3 11.3"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case 'sparkle':
      // Sparkle for Saturday (Soul Actions)
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
          />
          <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={2} fill={`${color}30`} />
        </Svg>
      );

    case 'wave':
      // Wave for Sunday (Silent/Peaceful)
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M2 12c0-2.21 3.13-4 7-4s7 1.79 7 4m-7 4c-3.87 0-7-1.79-7-4s3.13-4 7-4 7 1.79 7 4"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M2 16c0 2.21 3.13 4 7 4s7-1.79 7-4m7-4c0-2.21-3.13-4-7-4s-7 1.79-7 4"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.6}
          />
        </Svg>
      );

    default:
      return null;
  }
}

