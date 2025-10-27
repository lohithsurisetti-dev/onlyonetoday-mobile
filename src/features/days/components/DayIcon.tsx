/**
 * Day Icon Component
 * Premium SVG icons for each themed day
 */

import React from 'react';
import Svg, { Path, Circle, Rect, Polygon } from 'react-native-svg';

interface DayIconProps {
  icon: 'mask' | 'star' | 'dice' | 'heart' | 'calendar' | 'brush' | 'power';
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

    case 'calendar':
      // Calendar for Friday (Weekend Plans)
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect
            x="3"
            y="4"
            width="18"
            height="18"
            rx="2"
            stroke={color}
            strokeWidth={2}
          />
          <Path
            d="M3 10h18M8 2v4M16 2v4"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
          />
          <Circle cx="8" cy="14" r="1" fill={color} />
          <Circle cx="12" cy="14" r="1" fill={color} />
          <Circle cx="16" cy="14" r="1" fill={color} />
          <Circle cx="8" cy="18" r="1" fill={color} />
          <Circle cx="12" cy="18" r="1" fill={color} />
        </Svg>
      );

    case 'brush':
      // Paint brush for Saturday (Creative)
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M9.06 11.9l8.07-8.06a1.5 1.5 0 012.12 0l.71.71a1.5 1.5 0 010 2.12l-8.06 8.06"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M9.06 11.9l-5.66 5.66c-.39.39-.39 1.02 0 1.41l2.83 2.83c.39.39 1.02.39 1.41 0l5.66-5.66"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={`${color}20`}
          />
        </Svg>
      );

    case 'power':
      // Sun icon for Sunday (Rest/Offline)
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          {/* Sun rays */}
          <Path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" 
            stroke={color} 
            strokeWidth={2} 
            strokeLinecap="round" 
          />
          {/* Sun circle */}
          <Circle 
            cx="12" 
            cy="12" 
            r="5" 
            stroke={color} 
            strokeWidth={2}
            fill={`${color}30`}
          />
        </Svg>
      );

    default:
      return null;
  }
}

